const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  hindiRole: { type: String },
  photo: { type: String },
  bio: { type: String },
  socialLinks: {
    whatsapp: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    linkedin: { type: String }
  },
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
