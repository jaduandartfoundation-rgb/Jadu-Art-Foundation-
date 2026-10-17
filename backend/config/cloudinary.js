const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Generate a signed upload signature for direct client-side upload to Cloudinary.
 * Keeps CLOUDINARY_API_SECRET strictly on backend.
 *
 * @param {string} folder  - Cloudinary destination folder
 * @param {string} resourceType - 'image' or 'video' (default: 'image')
 */
const generateSignature = (folder = 'jadu-art', resourceType = 'image') => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = {
    timestamp,
    folder,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET || 'simulation_secret'
  );

  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder,
    resourceType,
  };
};

module.exports = {
  cloudinary,
  generateSignature,
};
