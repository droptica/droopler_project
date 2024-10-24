/**
 * @file
 * Retrieves all JSON token files from the specified directories.
 * Scans each directory for JSON files and returns their paths and names.
 */

import fs from 'fs';
import path from 'path';

/**
 * Retrieves all JSON files from the specified directories.
 *
 * @param {Array<string>} dirPaths - Array of directory paths to scan for JSON files.
 * @returns {Array<Object>} - An array of objects containing directory, file path, and file name for each JSON token file.
 */
export function getAllTokenFiles(dirPaths) {
  return dirPaths.flatMap((dirPath) =>
    // Read the contents of each directory
    fs
      .readdirSync(dirPath)
      // Filter only JSON files
      .filter((file) => path.extname(file) === '.json')
      // Return an object with directory, full file path, and file name (without extension)
      .map((file) => ({
        dir: dirPath,
        filePath: path.join(dirPath, file),
        fileName: path.basename(file, '.json'),
      }))
  );
}
