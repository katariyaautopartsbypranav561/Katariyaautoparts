import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { Settings, Loader2, Save, ExternalLink } from 'lucide-react';
import UploadField from '../../components/UploadField';

export default function AdminSiteEditor() {
  const { frontendSettings, refreshData } = useData();
  const { showToast } = useCart();
  const [isSaving, setIsSaving] = useState(false);

  // Local state for editing
  const [localSettings, setLocalSettings] = useState(frontendSettings || {});
  
  useEffect(() => {
    setLocalSettings(frontendSettings || {});
  }, [frontendSettings]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await axios.put('/api/settings', localSettings);
      await refreshData();
      showToast('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      showToast('Error saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-cinzel font-bold text-[#171717]">Site Branding</h1>
        <p className="text-gray-500 mt-2">Manage global branding and settings</p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold font-cinzel text-[#171717]">Global Branding</h2>
          <button onClick={handleSaveSettings} disabled={isSaving} className="w-full sm:w-auto bg-[#171717] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#ef4444] transition-colors disabled:opacity-50">
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Settings
          </button>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-6 bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
            <UploadField 
              label="Site Logo"
              value={localSettings.logoBase64}
              onChange={(url) => setLocalSettings(prev => ({...prev, logoBase64: url}))}
              recommendedSize="200×200px"
              maxSize="500KB"
              formats="PNG (transparent)"
            />
          </div>
          
          <div className="bg-gray-100 rounded-2xl p-4 overflow-hidden h-fit sticky top-24">
            <h3 className="font-bold text-gray-500 mb-4 flex items-center gap-2"><ExternalLink size={16}/> Live Preview</h3>
            <div className="w-full bg-white p-3 sm:p-4 shadow-lg flex items-center gap-3 sm:gap-4 overflow-hidden rounded-xl">
               {localSettings.logoBase64 ? (
                 <img src={localSettings.logoBase64} className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-full shrink-0" alt="Logo" />
               ) : (
                 <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-full shrink-0" />
               )}
               <div className="font-cinzel font-bold text-base sm:text-xl text-[#171717] truncate">katariya auto parts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
