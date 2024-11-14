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

// Function to copy necessary files to the dist directory
const copyFiles = () => {
  const filesToCopy = ['package.json', 'README.md', 'LICENSE'];
  filesToCopy.forEach((file) => {
    const srcPath = path.resolve(file);
    const destPath = path.resolve('dist', file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file} to dist directory.`);
    } else {
      console.warn(`Warning: ${file} not found.`);
    }
  });
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
    copyFiles(); // Copy additional files to dist after build is complete
  })
  .catch((error) => {
    console.error('Build failed:', error);
    process.exit(1);
  });
