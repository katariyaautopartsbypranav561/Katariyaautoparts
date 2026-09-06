const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['src', 'public', 'server', 'scripts'];
const ROOT_FILES = ['index.html', 'package.json', 'README.md', 'vercel.json', 'check.json', 'response.json', 'test-purity.js', 'test-suite.js'];
const EXTENSIONS = ['.jsx', '.js', '.html', '.css', '.json', '.md'];
const EXCLUDE_DIRS = ['node_modules', '.git', '.vercel', 'dist', 'prisma'];
const EXCLUDE_FILES = ['package-lock.json', 'seed_data.json', 'dev.db', 'test.db'];

const REPLACEMENTS = [
  { regex: /Fortune Foodz/g, replace: 'Katariya Auto Parts' },
  { regex: /Fortune Food/g, replace: 'Katariya Auto Parts' },
  { regex: /fortune foodz/gi, replace: 'katariya auto parts' },
  { regex: /fortune-foodz/gi, replace: 'katariya-auto-parts' },
  { regex: /Fortune Special/gi, replace: 'Katariya Special' }
];

function processDirectory(directory) {
  if (!fs.existsSync(directory)) return;
  const items = fs.readdirSync(directory);

  items.forEach(item => {
    const fullPath = path.join(directory, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(item)) {
        processDirectory(fullPath);
      }
    } else {
      if (EXTENSIONS.includes(path.extname(fullPath)) && !EXCLUDE_FILES.includes(item)) {
        processFile(fullPath);
      }
    }
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  REPLACEMENTS.forEach(({ regex, replace }) => {
    content = content.replace(regex, replace);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

DIRECTORIES.forEach(processDirectory);
ROOT_FILES.forEach(processFile);
console.log('Rebranding text complete.');
