import { cp, mkdir, rm, access } from 'node:fs/promises';

const requiredFiles = [
  'public/index.html',
  'public/styles.css',
  'public/app.js',
  'public/timer.js',
  'public/storage.js',
  'public/ui.js',
];

for (const filePath of requiredFiles) {
  try {
    await access(filePath);
  } catch {
    console.error(`Brak wymaganego pliku: ${filePath}`);
    process.exit(1);
  }
}

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });

console.log('Build OK');