/**
 * @file
 * Filters tokens from a given dictionary based on their originating file path.
 * Ensures that only tokens from the specified file are returned.
 */

import path from 'path';

/**
 * Filters tokens that originate from a specific JSON file within the token dictionary.
 *
 * @param {Object} dictionary - The dictionary containing all tokens.
 * @param {string} filePath - The path to the file whose tokens should be filtered.
 * @returns {Array} - An array of tokens that come from the specified file.
 */
export function filterTokensByPath(dictionary, filePath) {
  // Get the base name of the file (e.g., 'color.json' from 'tokens/core/color.json')
  const jsonName = path.basename(filePath);

  // Filter the tokens based on the filePath property and match the file name
  return dictionary.allTokens.filter(
    (token) => token.filePath && token.filePath.split('/')[2] === jsonName
  );
}
