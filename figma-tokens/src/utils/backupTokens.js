/**
 * @file
 * Creates a backup of the 'tokens' directory by recursively copying all files and subdirectories
 * to a 'tokens_backup' directory.
 */

import fs from 'fs';
import path from 'path';

/**
 * Recursively copies the contents of the source directory to the destination directory.
 *
 * @param {string} src - The source directory path.
 * @param {string} dest - The destination directory path.
 */
function copyDirectorySync(src, dest) {
  // Ensure the destination directory exists, create it if necessary
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Iterate over each file and directory in the source directory
  fs.readdirSync(src).forEach((item) => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    // Recursively copy directories, or directly copy files
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyDirectorySync(srcPath, destPath);  // Recursively copy directories
    } else {
      fs.copyFileSync(srcPath, destPath);  // Copy files
    }
  });
}

const srcDir = 'tokens';  // The directory to be backed up
const backupDir = 'tokens_backup';  // The destination for the backup

// Perform the backup by copying the 'tokens' directory to 'tokens_backup'
copyDirectorySync(srcDir, backupDir);

console.log('Backup created successfully.');
