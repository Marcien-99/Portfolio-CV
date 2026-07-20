const fs = require('fs');
let data = fs.readFileSync('lib/data/seed.ts', 'utf8');

data = data.replace(/"s([1-9])/g, '"5$1');
data = data.replace(/"p([1-9])/g, '"f$1');

fs.writeFileSync('lib/data/seed.ts', data);
console.log('UUIDs fixed in seed.ts');
