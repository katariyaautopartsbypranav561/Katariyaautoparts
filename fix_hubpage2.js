
const fs = require('fs');
let code = fs.readFileSync('src/pages/HubPage.test.jsx', 'utf8');
code = code.replace('Expert Support', 'OEM Certification');
fs.writeFileSync('src/pages/HubPage.test.jsx', code);

