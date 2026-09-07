const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

let cloudinary;
try {
  cloudinary = require('cloudinary').v2;
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    cloudinary.config({ 
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
      api_key: process.env.CLOUDINARY_API_KEY, 
      api_secret: process.env.CLOUDINARY_API_SECRET 
    });
    console.log('✅ Cloudinary configured:', process.env.CLOUDINARY_CLOUD_NAME);
  }
} catch(e) {
  console.warn('Cloudinary not available:', e.message);
}

/**
 * Uploads a base64 string or file path to Cloudinary.
 * @param {string} file - The base64 string or URL.
 * @param {string} folder - Optional folder name.
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 */
const uploadToCloudinary = async (file, folder = 'katariya') => {
  if (!file) return null;
  
  // Already a hosted URL — return as-is
  if (file.startsWith('http://') || file.startsWith('https://')) {
    return file;
  }

  // Upload base64 or file path to Cloudinary
  if (cloudinary && process.env.CLOUDINARY_API_KEY) {
    try {
      const result = await cloudinary.uploader.upload(file, { 
        folder,
        resource_type: 'auto',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }]
      });
      return result.secure_url;
    } catch (err) {
      console.error('Cloudinary upload failed:', err.message);
    }
  }

  // Fallback — return the raw value (base64 or local path)
  return file;
};

module.exports = { cloudinary, uploadToCloudinary };
