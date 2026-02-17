import { readFile } from 'node:fs/promises';

const filesToScan = [
  'public/app.js',
  'public/timer.js',
  'public/storage.js',
  'public/ui.js',
  'tests/timer.test.js',
  'tests/storage.test.js',
];

const forbiddenPatterns = [
  { regex: /innerHTML\s*=/, message: 'Zakazane użycie innerHTML.' },
  { regex: /eval\s*\(/, message: 'Zakazane użycie eval().' },
  { regex: /new Function\s*\(/, message: 'Zakazane dynamiczne tworzenie funkcji.' },
];

const errors = [];

for (const filePath of filesToScan) {
  const content = await readFile(filePath, 'utf8');
  for (const rule of forbiddenPatterns) {
    if (rule.regex.test(content)) {
      errors.push(`${filePath}: ${rule.message}`);
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error);
  }
  process.exit(1);
}

console.log('Lint OK');