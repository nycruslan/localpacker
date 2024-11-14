const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Function to clean the dist directory
const cleanDist = () => {
  const distPath = path.resolve(__dirname, 'dist');
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
    entryPoints: ['src/main.js'], // The entry file containing your CLI logic
    bundle: true, // Bundle dependencies into a single file
    platform: 'node', // Targeting Node.js environment
    outfile: 'dist/local-pack.js', // Output file for the bundled code
    minify: true, // Minify the output for a smaller file size
    banner: { js: '#!/usr/bin/env node' }, // Add shebang for CLI execution
  })
  .then(() => {
    console.log('Build successful!');
  })
  .catch((error) => {
    console.error('Build failed:', error);
    process.exit(1);
  });
