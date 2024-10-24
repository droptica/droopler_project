/**
 * @file
 * Updates token references in mode files based on core tokens.
 * If a reference in a mode file is not found in core tokens, it is updated to a local reference.
 */

import fs from 'fs';
import path from 'path';
import { traverseTokens } from '../tokens/traverseTokens.js';

/**
 * Updates references in a mode-specific token file.
 * If a token's reference is not found in the core tokens, the reference is updated to be local to the mode.
 *
 * @param {string} modeFilePath - The path to the mode token file (e.g., 'tokens/mode/dark.json').
 * @param {Object} coreTokens - An object containing all core tokens for reference checking.
 */
export function updateModeReferences(modeFilePath, coreTokens) {
  // Read the mode token file and parse it as JSON
  const modeTokens = JSON.parse(fs.readFileSync(modeFilePath, 'utf-8'));

  // Traverse through all tokens in the mode file
  traverseTokens(modeTokens, (key, token) => {
    // Check if the token contains a reference (starting and ending with curly braces)
    if (token.value && token.value.startsWith('{') && token.value.endsWith('}')) {
      const referenceKey = token.value.slice(1, -1); // Extract the reference key from {reference}

      // If the reference is not found in core tokens, update it to a local reference in the mode file
      if (!coreTokens[referenceKey]) {
        const newKey = `mode/${path.basename(modeFilePath, '.json')}.${referenceKey}`;
        token.value = `{${newKey}}`; // Update the reference to a local one
      }
    }
  });

  // Write the updated tokens back to the mode token file
  fs.writeFileSync(modeFilePath, JSON.stringify(modeTokens, null, 2));
}
