/**
 * @file
 * Dynamically fetches core and mode token files from the 'tokens' directory,
 * and updates references in mode-specific files based on core tokens.
 */

import fs from 'fs';
import path from 'path';
import { getCoreTokens } from './getCoreTokens.js';
import { updateModeReferences } from './updateModeReferences.js';

/**
 * Fetches all JSON files from a given directory.
 * @param {string} directoryPath - Path to the directory from which JSON files will be fetched.
 * @returns {string[]} - An array of file paths to JSON files in the specified directory.
 */
function getJsonFilesFromDirectory(directoryPath) {
  return fs.readdirSync(directoryPath)
    .filter(file => path.extname(file) === '.json')
    .map(file => path.join(directoryPath, file));
}

// Define the directories for core and mode tokens
const coreDir = 'tokens/core';
const modeDir = 'tokens/mode';

// Dynamically get core token files
const coreFiles = getJsonFilesFromDirectory(coreDir);

// Dynamically get mode token files
const modeFiles = getJsonFilesFromDirectory(modeDir);

// Get all core tokens
const coreTokens = getCoreTokens(coreFiles);

// Update references in mode files based on core tokens
modeFiles.forEach((filePath) => {
  updateModeReferences(filePath, coreTokens);
});

console.log('Mode JSON files updated successfully!');
