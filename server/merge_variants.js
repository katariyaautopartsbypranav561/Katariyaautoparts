const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function main() {
  const { rows } = await client.execute('SELECT * FROM Product');
  const groups = {};
  
  rows.forEach(p => {
    let name = p.name.trim();
    let size = '';
    
    // Look for common size suffixes: 100g, 200g, 250g, 350g, 400g, 500g, 1kg, 2kg, 5kg, 10g, 20g, 50g, 1L, 500ml, 200ml, Jumbo, Medium, Reg, Regular, Mix
    const match = name.match(/^(.*?)\s+(100g|200g|250g|350g|400g|500g|1kg|2kg|5kg|10g|20g|50g|1L|500ml|200ml|Jumbo|Medium|Reg|Regular|Mix)$/i);
    if (match) {
        name = match[1].trim();
        size = match[2].trim();
    } else {
        size = '';
    }
    
    if (!groups[name.toLowerCase()]) {
        groups[name.toLowerCase()] = {
            baseName: name,
            products: []
        };
    }
    groups[name.toLowerCase()].products.push({ ...p, extractedSize: size });
  });

  let mergedCount = 0;
  
  for (const key of Object.keys(groups)) {
      const group = groups[key];
      if (group.products.length > 1) {
          console.log(`Merging group: ${group.baseName} (${group.products.length} items)`);
          
          group.products.sort((a, b) => a.name.length - b.name.length);
          
          const baseProduct = group.products[0];
          const variants = [];
          
          group.products.forEach(p => {
              let label = p.extractedSize;
              if (!label) {
                  label = "Standard";
              }
              variants.push({
                  label: label,
                  price: p.price,
                  mrp: p.mrp || p.price * 1.3
              });
          });
          
          const variantsJson = JSON.stringify(variants);
          await client.execute({
              sql: 'UPDATE Product SET name = ?, variants = ?, price = ?, mrp = ? WHERE id = ?',
              args: [group.baseName, variantsJson, variants[0].price, variants[0].mrp, baseProduct.id]
          });
          
          for (let i = 1; i < group.products.length; i++) {
              await client.execute({
                  sql: 'DELETE FROM Product WHERE id = ?',
                  args: [group.products[i].id]
              });
          }
          
          mergedCount++;
      }
  }
  
  console.log(`Merged ${mergedCount} product groups.`);
}

main().catch(console.error);
