const fs = require('fs');
const path = 'f:\\deskstop\\fortune food website\\src\\pages\\admin\\AdminProducts.jsx';
let content = fs.readFileSync(path, 'utf8');

const targetBlock = `                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Highlight Tag</label>`;

const newBlock = `                    </div>
                  </div>
                  
                  {/* Variants UI */}
                  <div className="md:col-span-2 mt-4 p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-bold text-gray-700">Pack Sizes & Rates (Variants)</label>
                      <button type="button" onClick={() => setEditing({...editing, variants: [...(editing.variants || []), {label: '', price: 0, mrp: 0}]})} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold hover:bg-orange-200 transition-colors">+ Add Size</button>
                    </div>
                    {(!editing.variants || editing.variants.length === 0) && <p className="text-xs text-gray-500 italic">No pack sizes defined. Product will be sold as a single unit using Base Price.</p>}
                    <div className="space-y-2">
                      {(editing.variants || []).map((v, i) => (
                        <div key={i} className="flex gap-2 items-center bg-white p-2 border rounded-lg">
                          <input type="text" placeholder="Size (e.g. 1L, 500g)" value={v.label} onChange={e => { const newV = [...editing.variants]; newV[i].label = e.target.value; setEditing({...editing, variants: newV}); }} className="flex-1 p-1.5 border rounded text-sm focus:ring-1 focus:ring-orange-500 outline-none" required />
                          <div className="relative w-24">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                            <input type="number" placeholder="Price" value={v.price === 0 ? '' : v.price} onChange={e => { const newV = [...editing.variants]; newV[i].price = Number(e.target.value); setEditing({...editing, variants: newV}); }} className="w-full pl-6 p-1.5 border rounded text-sm focus:ring-1 focus:ring-orange-500 outline-none" required />
                          </div>
                          <div className="relative w-24">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                            <input type="number" placeholder="MRP" value={v.mrp === 0 ? '' : v.mrp} onChange={e => { const newV = [...editing.variants]; newV[i].mrp = Number(e.target.value); setEditing({...editing, variants: newV}); }} className="w-full pl-6 p-1.5 border rounded text-sm focus:ring-1 focus:ring-orange-500 outline-none" required />
                          </div>
                          <button type="button" onClick={() => setEditing({...editing, variants: editing.variants.filter((_, idx) => idx !== i)})} className="text-red-500 hover:text-red-700 p-1 bg-red-50 hover:bg-red-100 rounded"><X size={16}/></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Highlight Tag</label>`;

if (content.includes(targetBlock)) {
  content = content.replace(targetBlock, newBlock);
  fs.writeFileSync(path, content, 'utf8');
  console.log("Success");
} else {
  console.log("Target block not found");
}
