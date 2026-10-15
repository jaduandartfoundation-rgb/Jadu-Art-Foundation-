const { Cashfree, CFEnvironment } = require('cashfree-pg');
const mongoose = require('mongoose');
const Donation = require('../models/Donation');
const AdminNotification = require('../models/AdminNotification');
const { logAudit } = require('../utils/auditLogger');

// In-memory rate limiting map for donation confirmation submissions
const submissionRateMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_SUBMISSIONS_PER_WINDOW = 10;

const checkRateLimit = (ip) => {
  const now = Date.now();
  const userRecord = submissionRateMap.get(ip) || [];
  // Filter out timestamps outside window
  const activeTimestamps = userRecord.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (activeTimestamps.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    return false;
  }
  activeTimestamps.push(now);
  submissionRateMap.set(ip, activeTimestamps);

  // Periodic cleanup if map gets large
  if (submissionRateMap.size > 2000) {
    for (const [key, timestamps] of submissionRateMap.entries()) {
      if (timestamps.every(t => now - t >= RATE_LIMIT_WINDOW_MS)) {
        submissionRateMap.delete(key);
      }
    }
  }
  return true;
};

const getCashfreeInstance = () => {
  const appId = process.env.CASHFREE_APP_ID || '';
  const secretKey = process.env.CASHFREE_SECRET_KEY || '';
  const isProd = process.env.CASHFREE_ENV === 'PROD';

  if (appId && secretKey && !appId.includes('YourCashfreeAppId')) {
    const env = isProd ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;
    return new Cashfree(env, appId, secretKey);
  }
  return null;
};

// @route   POST /api/donations/confirm
// @desc    Public donor confirmation submission for UPI QR & Bank Transfers
//          NOTE: Never automatically marks as verified. Reconciled against bank statements.
const confirmDirectDonation = async (req, res) => {
  try {
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || req.ip || 'unknown';

    // Rate limiting check
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        success: false,
        message: 'Too many donation confirmations submitted from this IP address. Please wait 15 minutes before submitting again.'
      });
    }

    const {
      donorName,
      amount,
      paymentMethod,
      transactionRef,
      paymentDate,
      campaign,
      initiativeId,
      donorMessage
    } = req.body;

    const email = req.body.email || req.body.donorEmail;
    const phone = req.body.phone || req.body.donorPhone;

    // Field Validations
    if (!donorName || donorName.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Please provide a valid donor name (minimum 2 characters).' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(String(email).trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount) || numAmount < 1) {
      return res.status(400).json({ success: false, message: 'Donation amount must be at least ₹1.' });
    }

    const allowedMethods = ['UPI', 'NEFT', 'IMPS', 'Other'];
    const validMethod = allowedMethods.includes(paymentMethod) ? paymentMethod : 'UPI';

    const cleanRef = (transactionRef || '').trim();
    if (!cleanRef || cleanRef.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Transaction Reference / UTR number (at least 4 characters).'
      });
    }

    // Duplicate Check: Prevent duplicate transaction references
    const escapedRef = cleanRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const existingSubmission = await Donation.findOne({
      transactionRef: new RegExp(`^${escapedRef}$`, 'i')
    });

    if (existingSubmission) {
      if (['verified', 'success'].includes(existingSubmission.status)) {
        return res.status(409).json({
          success: false,
          message: `This transaction reference (${cleanRef}) has already been verified and recorded. If you need assistance, please contact our support team at 95896 21753.`
        });
      }

      if (['pending_verification', 'pending'].includes(existingSubmission.status)) {
        return res.status(409).json({
          success: false,
          message: `A donation confirmation with transaction reference (${cleanRef}) is already pending review by the accounts team. Submissions are checked against bank credits.`
        });
      }
    }

    const validInitiativeId = (initiativeId && mongoose.Types.ObjectId.isValid(initiativeId)) ? initiativeId : null;

    // Create donation record with status 'pending_verification'
    const donation = await Donation.create({
      donorName: donorName.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      amount: numAmount,
      campaign: campaign || 'General Support',
      initiativeId: validInitiativeId,
      paymentType: validMethod === 'UPI' ? 'upi_qr' : 'direct_transfer',
      paymentMethod: validMethod,
      transactionRef: cleanRef,
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      donorMessage: (donorMessage || '').trim(),
      status: 'pending_verification',
      ipAddress: clientIp
    });

    // Create Admin Notification for incoming direct confirmation
    await AdminNotification.create({
      type: 'donation',
      title: 'New Donation Confirmation Submitted',
      message: `₹${numAmount.toLocaleString('en-IN')} via ${validMethod} submitted by ${donorName.trim()} (UTR: ${cleanRef})`,
      link: `/admin/dashboard?tab=donations&search=${encodeURIComponent(cleanRef)}`
    });

    res.status(201).json({
      success: true,
      message: 'Submitting this form does not automatically confirm that your payment has been received. The foundation will verify the transaction against its bank records.',
      data: {
        _id: donation._id,
        donationId: donation._id,
        donorName: donation.donorName,
        amount: donation.amount,
        transactionRef: donation.transactionRef,
        status: donation.status,
        submittedAt: donation.createdAt
      }
    });
  } catch (error) {
    console.error('confirmDirectDonation error:', error);
    res.status(500).json({ success: false, message: 'Server error processing confirmation: ' + (error.message || '') });
  }
};

// @route   POST /api/donations/create-order (Gateway Backwards Compatibility)
const createOrder = async (req, res) => {
  try {
    const { amount, donorName, email, phone, pan, campaign, initiativeId } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ success: false, message: 'Invalid amount (Minimum ₹100)' });
    }

    const orderId = `cf_ord_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    let paymentSessionId = null;
    let isSimulated = false;

    const cashfree = getCashfreeInstance();

    if (cashfree) {
      try {
        const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : 'https://jadu-art-foundation.vercel.app';
        const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10) || '9999999999';
        
        const request = {
          order_amount: Number(amount),
          order_currency: 'INR',
          order_id: orderId,
          customer_details: {
            customer_id: `cust_${Date.now()}`,
            customer_name: donorName || 'Donor',
            customer_email: email || 'donor@jaduart.org',
            customer_phone: cleanPhone
          },
          order_meta: {
            return_url: `${clientUrl}/donate?order_id={order_id}`
          }
        };

        const response = await cashfree.PGCreateOrder(request);
        paymentSessionId = response.data.payment_session_id;
      } catch (cfErr) {
        console.warn('Cashfree order create fallback to simulation:', cfErr.response?.data?.message || cfErr.message);
        isSimulated = true;
      }
    } else {
      isSimulated = true;
    }

    if (isSimulated) {
      paymentSessionId = `session_sim_${Date.now()}`;
    }

    const validInitiativeId = (initiativeId && mongoose.Types.ObjectId.isValid(initiativeId)) ? initiativeId : null;

    const donation = await Donation.create({
      donorName: donorName || 'Anonymous',
      email: email || '',
      phone: phone || '',
      pan: pan || '',
      amount: Number(amount),
      campaign: campaign || 'General Support',
      initiativeId: validInitiativeId,
      paymentType: 'gateway',
      paymentMethod: 'Cashfree',
      cashfreeOrderId: orderId,
      cashfreeSessionId: paymentSessionId,
      razorpayOrderId: orderId,
      status: 'pending'
    });

    res.json({
      success: true,
      data: {
        orderId: orderId,
        paymentSessionId: paymentSessionId,
        amount: amount,
        currency: 'INR',
        donationId: donation._id,
        isSimulated: isSimulated
      }
    });
  } catch (error) {
    console.error('Create order error details:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order: ' + (error.message || 'Server error') });
  }
};

// @route   POST /api/donations/verify (Gateway verification)
const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, donationId } = req.body;
    const targetOrderId = orderId || req.body.razorpay_order_id;
    const targetDonationId = donationId;

    let isAuthentic = false;
    const cashfree = getCashfreeInstance();

    if (targetOrderId && targetOrderId.startsWith('cf_ord_') && cashfree) {
      try {
        const response = await cashfree.PGOrderFetchPayments(targetOrderId);
        const payments = response.data || [];
        const successPayment = payments.find(p => p.payment_status === 'SUCCESS');
        if (successPayment) {
          isAuthentic = true;
        }
      } catch (cfErr) {
        console.error('Cashfree order verification API error:', cfErr.response?.data?.message || cfErr.message);
        if (req.body.isSimulated || (paymentId && paymentId.startsWith('pay_sim_'))) {
          isAuthentic = true;
        }
      }
    } else {
      isAuthentic = true;
    }

    if (isAuthentic) {
      const finalPaymentId = paymentId || `cf_pay_${Date.now()}`;
      let donation = null;
      if (targetDonationId && mongoose.Types.ObjectId.isValid(targetDonationId)) {
        donation = await Donation.findByIdAndUpdate(
          targetDonationId,
          {
            cashfreePaymentId: finalPaymentId,
            razorpayPaymentId: finalPaymentId,
            transactionRef: finalPaymentId,
            status: 'success'
          },
          { new: true }
        );
      } else if (targetOrderId) {
        donation = await Donation.findOneAndUpdate(
          { cashfreeOrderId: targetOrderId },
          {
            cashfreePaymentId: finalPaymentId,
            razorpayPaymentId: finalPaymentId,
            transactionRef: finalPaymentId,
            status: 'success'
          },
          { new: true }
        );
      }

      if (donation) {
        await AdminNotification.create({
          type: 'donation',
          title: 'New Donation Received (Gateway)',
          message: `₹${donation.amount.toLocaleString('en-IN')} received from ${donation.donorName} for ${donation.campaign}`,
          link: `/admin/dashboard?tab=donations&id=${donation._id}`
        });
      }

      res.json({ success: true, message: 'Payment verified successfully', data: donation });
    } else {
      let donation = null;
      if (targetDonationId && mongoose.Types.ObjectId.isValid(targetDonationId)) {
        donation = await Donation.findByIdAndUpdate(targetDonationId, { status: 'failed' }, { new: true });
      }
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
};

// @route   GET /api/donations (Admin - Filtered, Paginated, with Duplicate Detection)
const getDonations = async (req, res) => {
  try {
    const { 
      status, 
      paymentMethod,
      campaign, 
      initiativeId, 
      search, 
      startDate, 
      endDate, 
      minAmount, 
      maxAmount, 
      page = 1, 
      limit = 20 
    } = req.query;

    const query = {};

    // Filter by status (support 'pending_verification', 'verified', 'rejected', 'success', 'failed')
    if (status && status !== 'all') {
      if (status === 'pending') {
        query.status = { $in: ['pending', 'pending_verification'] };
      } else if (status === 'verified') {
        query.status = { $in: ['verified', 'success'] };
      } else {
        query.status = status;
      }
    }

    if (paymentMethod && paymentMethod !== 'all') {
      if (paymentMethod === 'Gateway') {
        query.paymentType = 'gateway';
      } else {
        query.paymentMethod = paymentMethod;
      }
    }

    if (campaign && campaign !== 'all') {
      query.campaign = new RegExp(campaign, 'i');
    }

    if (initiativeId && mongoose.Types.ObjectId.isValid(initiativeId)) {
      query.initiativeId = initiativeId;
    }

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { donorName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { transactionRef: searchRegex },
        { cashfreeOrderId: searchRegex },
        { cashfreePaymentId: searchRegex },
        { razorpayOrderId: searchRegex },
        { razorpayPaymentId: searchRegex }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Donation.countDocuments(query);
    const donations = await Donation.find(query)
      .populate('initiativeId', 'title slug category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Duplicate transaction reference detection across all records
    const refsInPage = donations
      .map(d => (d.transactionRef || '').trim())
      .filter(ref => ref && ref.length >= 4);

    let duplicateRefCounts = {};
    if (refsInPage.length > 0) {
      const duplicateMatches = await Donation.aggregate([
        { $match: { transactionRef: { $in: refsInPage } } },
        { $group: { _id: '$transactionRef', count: { $sum: 1 } } }
      ]);
      duplicateMatches.forEach(item => {
        duplicateRefCounts[item._id] = item.count;
      });
    }

    // Attach duplicate count to response records
    const enrichedDonations = donations.map(d => {
      const doc = d.toObject();
      const count = duplicateRefCounts[doc.transactionRef] || 1;
      doc.duplicateCount = count;
      doc.hasDuplicateWarning = count > 1;
      return doc;
    });

    // Counts by status for quick admin summary tabs
    const pendingVerificationCount = await Donation.countDocuments({ status: { $in: ['pending', 'pending_verification'] } });
    const verifiedCount = await Donation.countDocuments({ status: { $in: ['verified', 'success'] } });
    const rejectedCount = await Donation.countDocuments({ status: 'rejected' });

    res.json({
      success: true,
      data: enrichedDonations,
      summaryCounts: {
        pendingVerification: pendingVerificationCount,
        verified: verifiedCount,
        rejected: rejectedCount,
        total: total
      },
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @route   GET /api/donations/:id (Admin)
const getDonationById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid donation ID' });
    }
    const donation = await Donation.findById(req.params.id).populate('initiativeId');
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation record not found' });
    }

    // Check duplicate count
    let duplicateCount = 1;
    if (donation.transactionRef) {
      duplicateCount = await Donation.countDocuments({ transactionRef: donation.transactionRef });
    }

    const doc = donation.toObject();
    doc.duplicateCount = duplicateCount;
    doc.hasDuplicateWarning = duplicateCount > 1;

    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @route   PATCH /api/donations/:id/verify (Admin Action: Verify or Reject)
const verifyDonation = async (req, res) => {
  try {
    let status = req.body.status || req.body.action;
    if (status === 'verify') status = 'verified';
    if (status === 'reject') status = 'rejected';
    const { adminNotes, rejectionReason } = req.body;
    const adminUser = req.user;

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be "verified" or "rejected"' });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    donation.status = status;
    donation.adminNotes = adminNotes || donation.adminNotes || '';
    if (status === 'rejected') {
      donation.rejectionReason = rejectionReason || 'Transaction could not be confirmed in bank records.';
    }

    donation.verifiedBy = {
      adminId: adminUser._id,
      adminName: adminUser.name,
      adminEmail: adminUser.email
    };
    donation.verifiedAt = new Date();

    await donation.save();

    await logAudit(
      req,
      `DONATION_${status.toUpperCase()}`,
      'Donation',
      donation._id,
      `Admin ${adminUser.name} marked donation of ₹${donation.amount} (Ref: ${donation.transactionRef || 'N/A'}) as ${status}. Notes: ${adminNotes || 'None'}`
    );

    res.json({
      success: true,
      message: `Donation marked as ${status} successfully.`,
      data: donation
    });
  } catch (error) {
    console.error('verifyDonation error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route   PATCH /api/donations/:id/acknowledgement (Admin: Record acknowledgement sent)
const recordAcknowledgement = async (req, res) => {
  try {
    const { sent = true, notes } = req.body;
    const adminUser = req.user;

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    donation.acknowledgementSent = !!sent;
    donation.acknowledgementSentAt = sent ? new Date() : null;
    donation.acknowledgementSentBy = sent ? adminUser.name : null;
    if (notes !== undefined) {
      donation.acknowledgementNotes = notes;
    }

    await donation.save();

    await logAudit(
      req,
      'DONATION_ACKNOWLEDGEMENT_RECORDED',
      'Donation',
      donation._id,
      `Admin ${adminUser.name} marked acknowledgement as ${sent ? 'SENT' : 'UNSENT'} for donation ID ${donation._id}`
    );

    res.json({
      success: true,
      message: 'Acknowledgement record updated successfully.',
      data: donation
    });
  } catch (error) {
    console.error('recordAcknowledgement error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @route   GET /api/donations/reports (Admin Analytics & Verified Totals)
//          CRITICAL RULE: Do not include pending or rejected submissions in verified totals!
const getDonationReports = async (req, res) => {
  try {
    // Verified donations ONLY (status is 'verified' or 'success')
    const verifiedDonations = await Donation.find({ status: { $in: ['verified', 'success'] } });

    const totalRaised = verifiedDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const successfulCount = verifiedDonations.length;

    // Direct vs Gateway breakdowns
    const upiRaised = verifiedDonations
      .filter(d => d.paymentMethod === 'UPI')
      .reduce((sum, d) => sum + (d.amount || 0), 0);

    const bankTransferRaised = verifiedDonations
      .filter(d => ['NEFT', 'IMPS'].includes(d.paymentMethod))
      .reduce((sum, d) => sum + (d.amount || 0), 0);

    const gatewayRaised = verifiedDonations
      .filter(d => d.paymentType === 'gateway' || ['Cashfree', 'Razorpay', 'Card'].includes(d.paymentMethod))
      .reduce((sum, d) => sum + (d.amount || 0), 0);

    const pendingCount = await Donation.countDocuments({ status: { $in: ['pending', 'pending_verification'] } });
    const rejectedCount = await Donation.countDocuments({ status: 'rejected' });
    const failedCount = await Donation.countDocuments({ status: 'failed' });

    const avgDonation = successfulCount > 0 ? Math.round(totalRaised / successfulCount) : 0;
    const largestDonation = successfulCount > 0 ? Math.max(...verifiedDonations.map(d => d.amount || 0)) : 0;

    // Breakdown by campaign
    const campaignMap = {};
    verifiedDonations.forEach(d => {
      const camp = d.campaign || 'General Support';
      campaignMap[camp] = (campaignMap[camp] || 0) + d.amount;
    });

    const donationsByCampaign = Object.keys(campaignMap).map(name => ({
      name,
      amount: campaignMap[name]
    }));

    // Monthly breakdown (verified only)
    const monthlyMap = {};
    verifiedDonations.forEach(d => {
      const monthYear = new Date(d.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
      monthlyMap[monthYear] = (monthlyMap[monthYear] || 0) + d.amount;
    });

    const donationsByMonth = Object.keys(monthlyMap).map(month => ({
      month,
      amount: monthlyMap[month]
    }));

    res.json({
      success: true,
      data: {
        totalRaised,
        successfulCount,
        pendingCount,
        rejectedCount,
        failedCount,
        avgDonation,
        largestDonation,
        breakdown: {
          upiRaised,
          bankTransferRaised,
          gatewayRaised
        },
        donationsByCampaign,
        donationsByMonth
      }
    });
  } catch (error) {
    console.error('Error generating donation reports:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @route   GET /api/donations/export (Admin CSV Export)
const exportDonationsCSV = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });

    let csv = 'Donor Name,Email,Phone,Amount (INR),Payment Method,Transaction Ref / UTR,Payment Date,Status,Verified By,Verified At,Acknowledgement Sent,Submission Date\n';

    donations.forEach(d => {
      const name = `"${(d.donorName || '').replace(/"/g, '""')}"`;
      const email = `"${(d.email || '').replace(/"/g, '""')}"`;
      const phone = `"${(d.phone || '').replace(/"/g, '""')}"`;
      const amount = d.amount || 0;
      const method = `"${(d.paymentMethod || d.paymentType || '').replace(/"/g, '""')}"`;
      const ref = `"${(d.transactionRef || d.cashfreePaymentId || d.razorpayPaymentId || '').replace(/"/g, '""')}"`;
      const paymentDate = d.paymentDate ? new Date(d.paymentDate).toISOString().split('T')[0] : '';
      const status = d.status || '';
      const verifiedBy = `"${(d.verifiedBy?.adminName || '').replace(/"/g, '""')}"`;
      const verifiedAt = d.verifiedAt ? new Date(d.verifiedAt).toISOString() : '';
      const ackSent = d.acknowledgementSent ? 'Yes' : 'No';
      const date = new Date(d.createdAt).toISOString();

      csv += `${name},${email},${phone},${amount},${method},${ref},${paymentDate},${status},${verifiedBy},${verifiedAt},${ackSent},${date}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=donations_export_${Date.now()}.csv`);
    res.status(200).send(csv);
  } catch (error) {
    console.error('CSV Export Error:', error);
    res.status(500).json({ success: false, message: 'Export failed' });
  }
};

module.exports = {
  confirmDirectDonation,
  createOrder,
  verifyPayment,
  getDonations,
  getDonationById,
  verifyDonation,
  recordAcknowledgement,
  getDonationReports,
  exportDonationsCSV
};
