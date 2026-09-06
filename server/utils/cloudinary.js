let cloudinary;
try {
  cloudinary = require('cloudinary').v2;
  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });
} catch(e) {
  console.warn("Cloudinary not available");
}

/**
 * Uploads a base64 string or file path to Cloudinary.
 * @param {string} file - The base64 string or path.
 * @param {string} folder - Optional folder name.
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 */
const uploadToCloudinary = async (file, folder = 'katariya') => {
  if (!file) return null;
  if (file.startsWith('http://') || file.startsWith('https://')) {
    return file;
  }
  
  // Return the base64 string directly for local dev
  // Or return a placeholder if you want
  console.log("Mocking Cloudinary upload for local dev");
  return file;
};

module.exports = { cloudinary, uploadToCloudinary };
