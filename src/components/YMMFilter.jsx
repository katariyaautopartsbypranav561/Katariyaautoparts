import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function YMMFilter({ onFilterChange }) {
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const navigate = useNavigate();

  // Pre-configured common Indian models mapping
  const ymmData = {
    'HERO': ['Splendor Plus', 'Passion Pro', 'HF Deluxe', 'Glamour', 'Xtreme 160R', 'Destini 125', 'Maestro Edge'],
    'BAJAJ': ['Pulsar 150', 'Pulsar 220F', 'Pulsar NS200', 'Dominar 400', 'Platina 100', 'CT 100', 'Avenger Cruise 220'],
    'HONDA': ['Activa 6G', 'Shine', 'SP 125', 'Unicorn', 'Dio', 'Hornet 2.0', 'CBR 150R', 'Hness CB350'],
    'TVS': ['Apache RTR 160', 'Apache RTR 200', 'Jupiter', 'Ntorq 125', 'Raider 125', 'XL100', 'Sport'],
    'YAMAHA': ['R15 V4', 'MT-15', 'FZ-S FI', 'Fascino 125', 'RayZR', 'Aerox 155'],
    'ROYAL ENFIELD': ['Classic 350', 'Meteor 350', 'Bullet 350', 'Himalayan', 'Interceptor 650', 'Continental GT 650'],
    'KTM': ['Duke 200', 'Duke 390', 'RC 200', 'RC 390', 'Adventure 390', 'Duke 250'],
    'SUZUKI': ['Access 125', 'Gixxer SF', 'Burgman Street', 'V-Strom SX', 'Hayabusa', 'Avenis'],
    'MAHINDRA': ['Thar', 'XUV700', 'Scorpio', 'Bolero', 'XUV300', 'Mojo'],
  };

  const makes = Object.keys(ymmData);
  const models = selectedMake ? ymmData[selectedMake] : [];
  
  // Generate years from 2000 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => currentYear - i);

  const handleApplyFilter = () => {
    if (onFilterChange) {
      onFilterChange({
        make: selectedMake,
        model: selectedModel,
        year: selectedYear
      });
    } else {
      // If used as a standalone widget (e.g. homepage), navigate to category page with state
      navigate('/category', { 
        state: { 
          ymm: { make: selectedMake, model: selectedModel, year: selectedYear }
        } 
      });
    }
  };

  const handleReset = () => {
    setSelectedMake('');
    setSelectedModel('');
    setSelectedYear('');
    if (onFilterChange) {
      onFilterChange({ make: '', model: '', year: '' });
    }
  };

  return (
    <div className="bg-gradient-to-r from-red-900 to-neutral-900 rounded-xl p-4 md:p-6 shadow-lg border border-red-800 mb-6 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
        <div className="text-white w-full md:w-auto md:min-w-[150px]">
          <h3 className="font-bold text-lg leading-tight uppercase tracking-wide">Find Parts For</h3>
          <p className="text-red-200 text-xs font-medium">Your exact vehicle</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 w-full">
          <select 
            value={selectedMake} 
            onChange={(e) => {
              setSelectedMake(e.target.value);
              setSelectedModel('');
              setSelectedYear('');
            }}
            className="w-full bg-white text-neutral-800 text-sm font-semibold rounded-lg px-3 py-2.5 outline-none border-2 border-transparent focus:border-red-400"
          >
            <option value="">1. Select Make</option>
            {makes.map(make => <option key={make} value={make}>{make}</option>)}
          </select>

          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedMake}
            className="w-full bg-white text-neutral-800 text-sm font-semibold rounded-lg px-3 py-2.5 outline-none border-2 border-transparent focus:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">2. Select Model</option>
            {models.map(model => <option key={model} value={model}>{model}</option>)}
          </select>

          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={!selectedModel}
            className="w-full bg-white text-neutral-800 text-sm font-semibold rounded-lg px-3 py-2.5 outline-none border-2 border-transparent focus:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">3. Select Year (Optional)</option>
            {years.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>

        <div className="w-full md:w-auto flex gap-2">
          <button 
            onClick={handleApplyFilter}
            disabled={!selectedMake}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Search size={16} />
            Find
          </button>
          
          {(selectedMake || selectedModel || selectedYear) && (
            <button 
              onClick={handleReset}
              className="px-3 py-2.5 text-xs text-red-200 hover:text-white font-bold bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
