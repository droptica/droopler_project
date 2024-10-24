/**
 * @file
 * Restores the 'tokens' directory by removing the current 'tokens' directory
 * and renaming the 'tokens_backup' directory back to 'tokens'.
 */

import fs from 'fs';

const srcDir = 'tokens';  // The current 'tokens' directory
const backupDir = 'tokens_backup';  // The backup directory to be restored

// Remove the current `tokens` directory, if it exists
if (fs.existsSync(srcDir)) {
  fs.rmSync(srcDir, { recursive: true, force: true });
}

/**
 * Rename the `tokens_backup` directory to `tokens` to restore the backup.
 */
fs.renameSync(backupDir, srcDir);

console.log('Tokens directory restored successfully.');
