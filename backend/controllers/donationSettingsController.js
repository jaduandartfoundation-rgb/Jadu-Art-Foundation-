const DonationSettings = require('../models/DonationSettings');
const { logAudit } = require('../utils/auditLogger');

// Helper to initialize or get settings
const getOrCreateSettings = async () => {
  let settings = await DonationSettings.findOne();
  if (!settings) {
    settings = await DonationSettings.create({
      bankDetails: {
        accountHolder: 'Jadu and Art Foundation',
        bankName: 'Punjab National Bank',
        accountNumber: '1896102100000714',
        ifsc: 'PUNB0189610',
        branch: 'Janjgir (Janjgir - Champa)',
        verificationStatus: 'Awaiting Verification',
        verificationNotes: 'Supplied initial values from foundation records; awaiting formal administrative verification.'
      },
      upiDetails: {
        upiId: '79875 57650m3@pnb', // Contains space as supplied, unverified
        recipientName: 'JADU AND ART FOUNDATION',
        verificationStatus: 'Awaiting Verification',
        verificationNotes: 'Supplied text contains space. Awaiting admin verification of exact UPI handle.'
      },
      qrDetails: {
        qrImageUrl: 'https://res.cloudinary.com/urnn2fkr/image/upload/v1792096134/jadu-art/donations/iyiqks043w9he0q6exse.jpg',
        localFallbackUrl: '/official-pnb-qr.jpg',
        verificationStatus: 'Verified',
        verificationNotes: 'Official Punjab National Bank merchant QR image matches foundation merchant records.'
      },
      supportContact: {
        phone: '95896 21753',
        whatsapp: '95896 21753',
        email: 'jaduandartfoundation@gmail.com'
      },
      methodsEnabled: {
        upi: true,
        bankTransfer: true,
        razorpay: false,
        razorpayStatus: 'pending_activation'
      }
    });
  }
  return settings;
};

// @route   GET /api/donations/public-config
// @desc    Public endpoint for donation page (exposes ONLY verified & published details)
const getPublicDonationConfig = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    const isBankPublished = settings.bankDetails?.verificationStatus === 'Published';
    const isUpiPublished = settings.upiDetails?.verificationStatus === 'Published';
    const isQrPublished = ['Verified', 'Published'].includes(settings.qrDetails?.verificationStatus);

    // Clean check for UPI link usability
    const upiIdRaw = settings.upiDetails?.upiId || '';
    const hasSpaceInUpi = upiIdRaw.includes(' ');
    const isUpiClickable = isUpiPublished && !hasSpaceInUpi && upiIdRaw.includes('@');

    const publicConfig = {
      headingEnglish: settings.headingEnglish,
      headingHindi: settings.headingHindi,
      description: settings.description,
      transparencyMessage: settings.transparencyMessage,
      supportContact: {
        phone: settings.supportContact?.phone || '95896 21753',
        whatsapp: settings.supportContact?.whatsapp || '95896 21753',
        email: settings.supportContact?.email || 'jaduandartfoundation@gmail.com'
      },
      methodsEnabled: {
        upi: settings.methodsEnabled?.upi !== false,
        bankTransfer: settings.methodsEnabled?.bankTransfer !== false,
        razorpay: false, // Never claim active if not verified/activated
        razorpayStatus: settings.methodsEnabled?.razorpayStatus || 'pending_activation'
      },
      bankTransfer: {
        isPublished: isBankPublished,
        accountHolder: isBankPublished ? settings.bankDetails.accountHolder : null,
        bankName: isBankPublished ? settings.bankDetails.bankName : null,
        accountNumber: isBankPublished ? settings.bankDetails.accountNumber : null,
        ifsc: isBankPublished ? settings.bankDetails.ifsc : null,
        branch: isBankPublished ? settings.bankDetails.branch : null,
        statusMessage: isBankPublished 
          ? 'Official Verified Account' 
          : 'Bank transfer details are currently awaiting administrative verification against bank records.'
      },
      upi: {
        isPublished: isUpiPublished,
        upiId: isUpiPublished ? settings.upiDetails.upiId : null,
        recipientName: settings.upiDetails?.recipientName || 'JADU AND ART FOUNDATION',
        isClickable: isUpiClickable,
        statusMessage: isUpiPublished 
          ? 'Verified Official UPI ID' 
          : 'UPI ID is awaiting administrative verification. Please scan the official QR code to donate.'
      },
      qr: {
        isPublished: isQrPublished,
        qrImageUrl: isQrPublished 
          ? (settings.qrDetails?.qrImageUrl || settings.qrDetails?.localFallbackUrl || '/official-pnb-qr.jpg') 
          : null,
        localFallbackUrl: '/official-pnb-qr.jpg',
        recipientName: settings.upiDetails?.recipientName || 'JADU AND ART FOUNDATION',
        statusMessage: isQrPublished ? 'Official Verified QR' : 'QR code is undergoing administrative verification.'
      }
    };

    res.json({ success: true, data: publicConfig });
  } catch (error) {
    console.error('getPublicDonationConfig error:', error);
    res.status(500).json({ success: false, message: 'Failed to load donation configuration' });
  }
};

// @route   GET /api/settings/donation-settings
// @desc    Admin endpoint - returns complete donation configuration with verification gates & audit history
const getAdminDonationSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('getAdminDonationSettings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @route   PUT /api/settings/donation-settings
// @desc    Admin endpoint - update donation details.
//          CRITICAL RULE: Any change to verified account number, IFSC, UPI ID, or QR image
//          MUST invalidate previous verification and reset status to 'Awaiting Verification'.
const updateDonationSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    const adminUser = req.user;
    const body = req.body || {};

    const invalidations = [];
    const historyEntries = [];

    // 1. Bank Details Check
    const newBank = body.bankDetails || {};
    const bankChanged = 
      (newBank.accountNumber && newBank.accountNumber !== settings.bankDetails?.accountNumber) ||
      (newBank.ifsc && newBank.ifsc !== settings.bankDetails?.ifsc) ||
      (newBank.accountHolder && newBank.accountHolder !== settings.bankDetails?.accountHolder) ||
      (newBank.bankName && newBank.bankName !== settings.bankDetails?.bankName);

    if (bankChanged) {
      if (['Verified', 'Published'].includes(settings.bankDetails?.verificationStatus)) {
        settings.bankDetails.verificationStatus = 'Awaiting Verification';
        settings.bankDetails.verifiedAt = null;
        settings.bankDetails.verifiedBy = null;
        invalidations.push('Bank account details were modified. Previous verification has been invalidated and reset to Awaiting Verification.');
      }
      if (newBank.accountHolder) settings.bankDetails.accountHolder = newBank.accountHolder.trim();
      if (newBank.bankName) settings.bankDetails.bankName = newBank.bankName.trim();
      if (newBank.accountNumber) settings.bankDetails.accountNumber = newBank.accountNumber.trim();
      if (newBank.ifsc) settings.bankDetails.ifsc = newBank.ifsc.trim().toUpperCase();
      if (newBank.branch) settings.bankDetails.branch = newBank.branch.trim();
    } else if (newBank.branch) {
      settings.bankDetails.branch = newBank.branch.trim();
    }

    // 2. UPI Details Check
    const newUpi = body.upiDetails || {};
    const upiChanged = newUpi.upiId && newUpi.upiId !== settings.upiDetails?.upiId;

    if (upiChanged) {
      if (['Verified', 'Published'].includes(settings.upiDetails?.verificationStatus)) {
        settings.upiDetails.verificationStatus = 'Awaiting Verification';
        settings.upiDetails.verifiedAt = null;
        settings.upiDetails.verifiedBy = null;
        invalidations.push('UPI ID was modified. Previous verification has been invalidated and reset to Awaiting Verification.');
      }
      settings.upiDetails.upiId = newUpi.upiId.trim();
    }
    if (newUpi.recipientName) {
      settings.upiDetails.recipientName = newUpi.recipientName.trim();
    }

    // 3. QR Details Check
    const newQr = body.qrDetails || {};
    const qrChanged = newQr.qrImageUrl && newQr.qrImageUrl !== settings.qrDetails?.qrImageUrl;

    if (qrChanged) {
      if (['Verified', 'Published'].includes(settings.qrDetails?.verificationStatus)) {
        settings.qrDetails.verificationStatus = 'Awaiting Verification';
        settings.qrDetails.verifiedAt = null;
        settings.qrDetails.verifiedBy = null;
        invalidations.push('QR Image was replaced. Previous verification has been invalidated and reset to Awaiting Verification.');
      }
      settings.qrDetails.qrImageUrl = newQr.qrImageUrl.trim();
    }

    // 4. Support Contact
    if (body.supportContact) {
      if (body.supportContact.phone) settings.supportContact.phone = body.supportContact.phone.trim();
      if (body.supportContact.whatsapp) settings.supportContact.whatsapp = body.supportContact.whatsapp.trim();
      if (body.supportContact.email) settings.supportContact.email = body.supportContact.email.trim();
    }

    // 5. Methods & Statuses
    if (body.methodsEnabled) {
      if (typeof body.methodsEnabled.upi === 'boolean') settings.methodsEnabled.upi = body.methodsEnabled.upi;
      if (typeof body.methodsEnabled.bankTransfer === 'boolean') settings.methodsEnabled.bankTransfer = body.methodsEnabled.bankTransfer;
      if (typeof body.methodsEnabled.razorpay === 'boolean') settings.methodsEnabled.razorpay = body.methodsEnabled.razorpay;
      if (body.methodsEnabled.razorpayStatus) settings.methodsEnabled.razorpayStatus = body.methodsEnabled.razorpayStatus;
      if (body.methodsEnabled.razorpayKeyId !== undefined) settings.methodsEnabled.razorpayKeyId = body.methodsEnabled.razorpayKeyId;
    }

    // 6. Text & Transparency
    if (body.headingEnglish) settings.headingEnglish = body.headingEnglish.trim();
    if (body.headingHindi) settings.headingHindi = body.headingHindi.trim();
    if (body.description) settings.description = body.description.trim();
    if (body.transparencyMessage) settings.transparencyMessage = body.transparencyMessage.trim();
    if (body.acknowledgementTemplate) settings.acknowledgementTemplate = body.acknowledgementTemplate.trim();

    // Log history
    const historyNote = invalidations.length > 0 
      ? invalidations.join(' | ') 
      : 'Updated donation settings configuration';

    settings.history.unshift({
      changedAt: new Date(),
      changedBy: `${adminUser?.name || 'Admin'} (${adminUser?.email || ''})`,
      action: invalidations.length > 0 ? 'UPDATED_WITH_INVALIDATION' : 'UPDATED_SETTINGS',
      details: historyNote
    });

    // Keep history at max 50 entries
    if (settings.history.length > 50) {
      settings.history = settings.history.slice(0, 50);
    }

    await settings.save();
    await logAudit(req, 'UPDATED_DONATION_SETTINGS', 'DonationSettings', settings._id, historyNote);

    res.json({
      success: true,
      message: invalidations.length > 0 ? invalidations.join(' ') : 'Donation settings updated successfully',
      data: settings,
      invalidations
    });
  } catch (error) {
    console.error('updateDonationSettings error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to update settings' });
  }
};

// @route   PATCH /api/settings/donation-settings/verify-gate
// @desc    Admin explicitly sets verification status for Bank, UPI, or QR
//          Admin confirms the details have been checked against official bank records.
const verifyDonationGate = async (req, res) => {
  try {
    const target = req.body.target || req.body.section;
    const { status, notes } = req.body;
    const adminUser = req.user;

    if (!['bank', 'upi', 'qr'].includes(target)) {
      return res.status(400).json({ success: false, message: 'Invalid verification target (bank, upi, qr)' });
    }

    if (!['Draft', 'Awaiting Verification', 'Verified', 'Published'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status' });
    }

    const settings = await getOrCreateSettings();

    const adminIdentity = {
      adminId: adminUser._id,
      name: adminUser.name,
      email: adminUser.email
    };

    let targetName = '';

    if (target === 'bank') {
      targetName = 'Bank Details';
      settings.bankDetails.verificationStatus = status;
      settings.bankDetails.verificationNotes = notes || settings.bankDetails.verificationNotes;
      if (['Verified', 'Published'].includes(status)) {
        settings.bankDetails.verifiedBy = adminIdentity;
        settings.bankDetails.verifiedAt = new Date();
      } else {
        settings.bankDetails.verifiedBy = null;
        settings.bankDetails.verifiedAt = null;
      }
    } else if (target === 'upi') {
      targetName = 'UPI Details';
      settings.upiDetails.verificationStatus = status;
      settings.upiDetails.verificationNotes = notes || settings.upiDetails.verificationNotes;
      if (['Verified', 'Published'].includes(status)) {
        settings.upiDetails.verifiedBy = adminIdentity;
        settings.upiDetails.verifiedAt = new Date();
      } else {
        settings.upiDetails.verifiedBy = null;
        settings.upiDetails.verifiedAt = null;
      }
    } else if (target === 'qr') {
      targetName = 'QR Code';
      settings.qrDetails.verificationStatus = status;
      settings.qrDetails.verificationNotes = notes || settings.qrDetails.verificationNotes;
      if (['Verified', 'Published'].includes(status)) {
        settings.qrDetails.verifiedBy = adminIdentity;
        settings.qrDetails.verifiedAt = new Date();
      } else {
        settings.qrDetails.verifiedBy = null;
        settings.qrDetails.verifiedAt = null;
      }
    }

    const actionText = `Admin ${adminUser.name} marked ${targetName} as ${status}. Checked against official bank records.`;
    settings.history.unshift({
      changedAt: new Date(),
      changedBy: `${adminUser.name} (${adminUser.email})`,
      action: `VERIFICATION_GATE_${status.toUpperCase()}`,
      details: notes ? `${actionText} Note: ${notes}` : actionText
    });

    await settings.save();
    await logAudit(req, `VERIFY_${target.toUpperCase()}_GATE`, 'DonationSettings', settings._id, actionText);

    res.json({
      success: true,
      message: `${targetName} status updated to "${status}" successfully.`,
      data: settings
    });
  } catch (error) {
    console.error('verifyDonationGate error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route   GET /api/donations/download-qr
// @desc    Download official UPI QR image as attachment
const downloadQrImage = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    const qrUrl = settings.qrDetails?.qrImageUrl || 'https://res.cloudinary.com/urnn2fkr/image/upload/v1792096134/jadu-art/donations/iyiqks043w9he0q6exse.jpg';

    // 1. If hosted on Cloudinary, redirect to direct attachment download
    if (qrUrl.includes('res.cloudinary.com') && qrUrl.includes('/upload/')) {
      const attachUrl = qrUrl.includes('fl_attachment')
        ? qrUrl
        : qrUrl.replace('/upload/', '/upload/fl_attachment:jadu-and-art-foundation-official-upi-qr/');
      return res.redirect(attachUrl);
    }

    // 2. Fallback fetch and stream with Content-Disposition: attachment
    const response = await fetch(qrUrl);
    if (!response.ok) throw new Error('Failed to fetch image source');
    res.setHeader('Content-Disposition', 'attachment; filename="jadu-and-art-foundation-official-upi-qr.jpg"');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    const arrayBuffer = await response.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error('downloadQrImage error:', error);
    return res.redirect('/official-pnb-qr.jpg');
  }
};

module.exports = {
  getPublicDonationConfig,
  getAdminDonationSettings,
  updateDonationSettings,
  verifyDonationGate,
  downloadQrImage
};
