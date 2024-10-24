/**
 * @file
 * Retrieves all subdirectories within the 'tokens' folder.
 * This script dynamically generates a list of directories from the 'tokens' folder
 */

import fs from 'fs';
import path from 'path';

/**
 * An array of paths representing all subdirectories within the 'tokens' folder.
 * It reads the 'tokens' directory and filters only subdirectories, ensuring
 * they can be processed for further token transformations.
 */
export const directories = fs.readdirSync('tokens', { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => path.join('tokens', dirent.name));