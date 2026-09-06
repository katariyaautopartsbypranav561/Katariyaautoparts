
const fs = require('fs');
let code = fs.readFileSync('src/pages/HubPage.test.jsx', 'utf8');
code = code.replace(/Fortune Wellness Hub/i, 'Katariya Auto Parts Hub');
code = code.replace('How to Test 100% Pure Kashmiri Mongra Saffron at Home', 'How to Maintain Your Motorcycle Chain for Longer Life');
code = code.replace('Top 7 Health Benefits of Eating Soaked California Almonds Daily', 'Top 7 Benefits of Using Synthetic Engine Oil in Superbikes');
code = code.replace('Purity Certification', 'Expert Support');
fs.writeFileSync('src/pages/HubPage.test.jsx', code);

