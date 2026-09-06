import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Video, X, Loader2, Info } from 'lucide-react';
import { handleImageUpload } from '../utils/imageUpload';

export default function UploadField({ 
  label, 
  value, 
  onChange, 
  onUploadStart, 
  onUploadEnd,
  recommendedSize = '1920×700px',
  maxSize = '3MB',
  formats = 'JPG, PNG, WEBP',
  isVideo = false
}) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const processFile = async (file) => {
    if (!file) return;

    // Optional client-side size check (convert maxSize string to bytes roughly)
    const maxBytes = maxSize.includes('MB') 
      ? parseFloat(maxSize) * 1024 * 1024 
      : parseFloat(maxSize) * 1024;

    if (file.size > maxBytes) {
      alert(`File size exceeds maximum limit of ${maxSize}`);
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      if (onUploadStart) onUploadStart();
      
      const url = await handleImageUpload(file, setUploadProgress);
      onChange(url);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (onUploadEnd) onUploadEnd();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-[#171717] mb-1.5">{label}</label>}
      
      <div className="mb-3 flex items-start gap-2 bg-red-50 p-2.5 rounded-lg border border-red-200">
        <Info size={16} className="text-red-600 mt-0.5 shrink-0" />
        <div className="text-xs text-red-800 break-words w-full overflow-hidden">
          <p className="truncate"><span className="font-semibold">Size:</span> {recommendedSize}</p>
          <p className="truncate"><span className="font-semibold">Max:</span> {maxSize} | <span className="font-semibold">Formats:</span> {formats}</p>
        </div>
      </div>

      <div 
        className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-colors ${
          dragActive ? 'border-[#ef4444] bg-[#ef4444]/5' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={isVideo ? "video/mp4,video/webm" : "image/jpeg,image/png,image/webp"}
          onChange={handleFileChange}
        />

        {isUploading ? (
          <div className="h-40 flex flex-col items-center justify-center text-gray-700 bg-gray-50">
            <Loader2 size={32} className="animate-spin mb-3 text-[#ef4444]" />
            <p className="text-sm font-bold mb-2">Uploading media... {uploadProgress}%</p>
            <div className="w-3/4 max-w-[200px] h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#ef4444] to-red-300 transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : value ? (
          <div className="group relative w-full h-40 bg-gray-100 flex items-center justify-center">
            {isVideo ? (
              <video src={value} className="max-w-full max-h-full object-contain" controls />
            ) : (
              <img src={value} alt="Preview" className="max-w-full max-h-full object-contain" />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-gray-100"
              >
                Replace
              </button>
              <button 
                type="button"
                onClick={handleRemove}
                className="bg-red-500 text-white p-2 rounded-lg shadow-lg hover:bg-red-600"
                title="Remove media"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-40 flex flex-col items-center justify-center text-gray-500 hover:text-gray-700"
          >
            {isVideo ? (
              <Video size={40} className="mb-3 text-gray-400" />
            ) : (
              <ImageIcon size={40} className="mb-3 text-gray-400" />
            )}
            <p className="font-semibold mb-1">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400">
              {isVideo ? 'MP4, WEBM' : 'JPG, PNG, WEBP'} up to {maxSize}
            </p>
          </button>
        )}
      </div>
    </div>
  );
}
