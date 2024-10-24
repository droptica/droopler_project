/**
 * @file
 * Defines a custom Style Dictionary format to generate CSS files for different directory types (core, mode, device).
 * This format handles theme-based generation of CSS variables for each token, supporting both mode and device-specific outputs.
 */

import { filterTokensByPath } from '../tokens/filterTokens.js';
import { BREAKPOINTS } from '../config/breakpoints.js';

/**
 * Custom format for generating CSS files based on the directory type.
 * It handles core, mode, and device-specific token outputs, generating valid CSS with variables.
 * For mode directories, it wraps variables in a `[data-theme-name=""]` selector.
 * For device directories, it applies media queries based on the breakpoints.
 */
const themeCSSFormat = {
  name: 'custom/theme-css',

  /**
   * Main format function that processes the tokens and generates corresponding CSS variables.
   *
   * @param {Object} dictionary - The dictionary object containing all tokens.
   * @param {Object} options - Additional options, such as the theme and file path.
   * @returns {string} - Generated CSS as a string.
   */
  format: function ({ dictionary, options }) {
    let cssVariables = '';

    // If the theme is mode-based, use the data-theme-name selector
    if (options.isMode) {
      cssVariables += `*[data-theme-name="${options.theme}"] {\n`;
    }
    // If device-based, apply media queries based on breakpoints
    else if (options.isDevice) {
      const deviceBreakpoint = BREAKPOINTS[options.theme];
      if (deviceBreakpoint) {
        cssVariables += `@media (min-width: ${deviceBreakpoint}) {\n:root {\n`;
      }
      else {
        // Mobile-first approach with no media query for mobile
        cssVariables += `:root {\n`;
      }
    }
    // Default core tokens wrapped in :root selector
    else {
      cssVariables += `:root {\n`;
    }

    // Filter tokens specific to the file being processed
    const filteredTokens = filterTokensByPath(dictionary, options.filePath);

    // Generate CSS variables by removing any unnecessary prefixes
    filteredTokens.forEach((token) => {
      let tokenName = token.name
        .replace(`mode-${options.theme}-`, '')
        .replace(`device-${options.theme}-`, '');

      // Add the CSS variable declaration
      if (typeof token.value === 'object') {
        Object.keys(token.value).forEach((subKey) => {
          cssVariables += `  --${tokenName}-${subKey}: ${token.value[subKey]};\n`;
        });
      } else {
        cssVariables += `  --${tokenName}: ${token.value};\n`;
      }
    });

    // Close the CSS block
    cssVariables += `}\n`;

    // Close media query for device-specific outputs (if not mobile)
    if (options.isDevice && options.theme !== 'mobile') {
      cssVariables += `}\n`;
    }

    return cssVariables;
  },
};

export { themeCSSFormat };
