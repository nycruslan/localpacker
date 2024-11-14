// build.js
import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

// Function to clean the dist directory
const cleanDist = () => {
  const distPath = path.resolve('dist');
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
    console.log('Cleaned dist directory.');
  }
};

// Clean dist directory
cleanDist();

// Run the esbuild bundling process
esbuild
  .build({
    entryPoints: ['src/main.js'],
    bundle: true,
    platform: 'node',
    format: 'esm', // Output as an ES module
    outfile: 'dist/local-pack.js',
    minify: true,
    external: ['chalk'], // Exclude chalk from bundling
    banner: { js: '#!/usr/bin/env node' },
  })
  .then(() => {
    fs.chmodSync('dist/local-pack.js', '755');
    console.log('Build successful and executable permissions set!');
  })
  .catch((error) => {
    console.error('Build failed:', error);
    process.exit(1);
  });
