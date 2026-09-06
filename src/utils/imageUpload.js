import axios from 'axios';

/**
 * Compresses an image file before upload
 */
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      // If it's a video or other type, just read it directly
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (e) => reject(e);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1200; // max width/height

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 0.8 quality
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = (e) => reject('Failed to load image for compression');
    };
    reader.onerror = (e) => reject('Failed to read file');
  });
};

/**
 * Uploads a media file (image or video) to the backend server
 */
export const handleImageUpload = (file, onProgress) => {
  return new Promise(async (resolve, reject) => {
    if (!file) {
      reject('No file provided');
      return;
    }

    try {
      // Compress the image before uploading to avoid Vercel 4.5MB payload limit
      const base64File = await compressImage(file);
      
      const response = await axios.post('/api/upload', { file: base64File }, {
        headers: {
          'Content-Type': 'application/json',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted === 100 ? 99 : percentCompleted);
          }
        }
      });

      if (response.data && response.data.url) {
        if (onProgress) onProgress(100);
        resolve(response.data.url);
      } else {
        reject('Upload failed, no URL returned');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      reject(error.response?.data?.error || error.message || 'Failed to upload media');
    }
  });
};
