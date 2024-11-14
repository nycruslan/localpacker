import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import log from './logger.js';

// Parse CLI arguments
const [, , consumingAppPath, flag] = process.argv;

// Paths and constants
const PACKAGE_JSON = 'package.json';
const packageJsonPath = path.resolve(PACKAGE_JSON);
const consumingAppPackageJsonPath = path.resolve(
  consumingAppPath,
  PACKAGE_JSON
);

// Utility Functions
const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const writeJson = (filePath, data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// Function: Clean
const clean = () => {
  log.info('Running clean process...');
  const packageJson = readJson(packageJsonPath);

  // Reset version
  const originalVersion = packageJson.version.split('-pack.')[0];
  packageJson.version = originalVersion;
  writeJson(packageJsonPath, packageJson);
  log.success(`Reverted version to ${originalVersion}`);

  // Reset dependency
  const appPackageJson = readJson(consumingAppPackageJsonPath);
  if (appPackageJson.dependencies[packageJson.name]) {
    appPackageJson.dependencies[packageJson.name] = originalVersion;
    writeJson(consumingAppPackageJsonPath, appPackageJson);
    log.success(
      `Reset ${packageJson.name} to version ${originalVersion} in consuming app`
    );
  }

  // Delete .tgz files
  deleteTgzFiles();
  log.info('Clean process complete.');
};

// Function: Update Version
const updateVersion = () => {
  const packageJson = readJson(packageJsonPath);
  const [baseVersion, suffix] = packageJson.version.split('-pack.');
  packageJson.version = `${baseVersion}-pack.${
    suffix ? parseInt(suffix) + 1 : 0
  }`;
  writeJson(packageJsonPath, packageJson);
  log.success(`Updated version to ${packageJson.version}`);
  return packageJson.version;
};

// Function: Delete .tgz Files
const deleteTgzFiles = () => {
  fs.readdirSync(process.cwd())
    .filter((file) => file.endsWith('.tgz'))
    .forEach((file) => {
      fs.unlinkSync(path.resolve(file));
      log.info(`Deleted package file: ${file}`);
    });
};

// Function: Build Package
const buildPackage = () => {
  log.info('Running build command...');
  execSync('npm run build', { stdio: 'inherit' });
  log.success('Build complete.');
};

// Function: Create .tgz Package
const createPackage = () => {
  log.info('Packing new version...');
  execSync('npm pack', { stdio: 'inherit' });
  const tgzFile = fs
    .readdirSync(process.cwd())
    .find((file) => file.endsWith('.tgz'));
  if (!tgzFile) throw new Error('Error: No .tgz file created.');
  log.success(`Created package: ${tgzFile}`);
  return tgzFile;
};

// Function: Update Consuming App
const updateConsumingApp = (tgzFile) => {
  const appPackageJson = readJson(consumingAppPackageJsonPath);
  const packageJson = readJson(packageJsonPath);
  appPackageJson.dependencies[packageJson.name] = `file:${path.resolve(
    tgzFile
  )}`;
  writeJson(consumingAppPackageJsonPath, appPackageJson);
  log.success(
    `Updated consuming app to use local package path: file:${path.resolve(
      tgzFile
    )}`
  );
};

// Function: Install Package in Consuming App
const installPackage = () => {
  log.info('Installing updated package in the consuming app...');
  execSync('npm install', { cwd: consumingAppPath, stdio: 'inherit' });
  log.success('Installation complete.');
};

// Execution Flow
const main = () => {
  if (!consumingAppPath) {
    log.error('Error: Please provide the full path to the consuming app.');
    process.exit(1);
  }

  try {
    if (flag === '--clean') {
      clean();
    } else {
      const newVersion = updateVersion();
      deleteTgzFiles();
      buildPackage();
      const tgzFile = createPackage();
      updateConsumingApp(tgzFile);
      installPackage();
      log.success(
        `Successfully packed and installed version ${newVersion} in ${consumingAppPath}`
      );
    }
  } catch (error) {
    log.error(`An error occurred: ${error.message}`);
    process.exit(1);
  }
};

main();
