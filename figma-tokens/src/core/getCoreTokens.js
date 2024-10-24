/**
 * @file
 * Retrieves all tokens from core files to identify which tokens should remain unchanged.
 * This ensures that core tokens are preserved during transformations in mode-specific files.
 */

import fs from 'fs';
import { traverseTokens } from '../tokens/traverseTokens.js';

/**
 * getCoreTokens
 * Iterates over a list of core token files and extracts all token definitions.
 * Uses the `traverseTokens` utility to recursively gather tokens.
 *
 * @param {string[]} coreFiles - An array of file paths to core token JSON files.
 * @returns {Object} coreTokens - A dictionary of all tokens from the core files,
 * where each key is the token path and the value is the token object.
 */
export function getCoreTokens(coreFiles) {
  let coreTokens = {};

  coreFiles.forEach((filePath) => {
    const tokens = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    traverseTokens(tokens, (key, value) => {
      if (typeof value === 'object' && value.value) {
        coreTokens[key] = value;
      }
    });
  });

  return coreTokens;
}