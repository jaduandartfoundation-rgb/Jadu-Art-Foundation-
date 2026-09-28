const AuditLog = require('../models/AuditLog');

const logAudit = async (req, action, moduleName, recordId = null, details = '') => {
  try {
    const adminEmail = req.user ? req.user.email : 'system';
    const adminName = req.user ? req.user.name : 'System';

    await AuditLog.create({
      adminEmail,
      adminName,
      action,
      module: moduleName,
      recordId: recordId ? recordId.toString() : null,
      details
    });
  } catch (error) {
    console.error('Audit logging error:', error);
  }
};

module.exports = { logAudit };
