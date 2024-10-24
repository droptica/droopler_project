/**
 * @file
 * Generates SCSS files from design tokens using Style Dictionary.
 * This script handles dynamic token loading, custom transformations, and formatting.
 */

import { register } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import path from 'path';
import { directories } from './config/directories.js'; // Import directories dynamically
import { BREAKPOINTS } from './config/breakpoints.js'; // Import breakpoints for responsive design
import { referenceToCSSVarTransform } from './transforms/referenceToCSSVar.js'; // Import custom transformation
import { themeCSSFormat } from './transforms/themeCSSFormat.js'; // Import custom CSS format
import { getAllTokenFiles } from './tokens/getAllTokenFiles.js'; // Import function to retrieve all token files

// Register the transformations and formats in Style Dictionary
register(StyleDictionary);
StyleDictionary.registerTransform(referenceToCSSVarTransform); // Register custom CSS variable transformation
StyleDictionary.registerFormat(themeCSSFormat); // Register custom SCSS format

// Retrieve all JSON files from core, device, and mode directories
const files = getAllTokenFiles(directories);

// Configure Style Dictionary
const sd = new StyleDictionary({
  hooks: {
    parsers: {
      'json-parser': {
        pattern: /\.json$/,
        parser: ({ filePath, contents }) => {
          const relativePath = path
            .relative('tokens', filePath)
            .replace('.json', '')
            .replace(/\//g, '/');
          if (!relativePath.includes('core')) {
            // Wrap content for mode and device tokens
            return JSON.parse(`{ "${relativePath}": ${contents} }`);
          }
          return JSON.parse(contents); // Return core tokens as-is
        },
      },
    },
  },
  parsers: ['json-parser'], // Use the custom JSON parser
  source: files.map((file) => file.filePath), // Map all token files to the source array
  platforms: files.reduce((acc, file) => {
    const isMode = file.dir.includes('mode');
    const isDevice = file.dir.includes('device');

    acc[file.fileName] = {
      transformGroup: 'tokens-studio', // Transform group used by the platform
      transforms: [
        'ts/descriptionToComment',
        'ts/size/px',
        'ts/opacity',
        'ts/size/lineheight',
        'ts/typography/fontWeight',
        'ts/resolveMath',
        'ts/size/css/letterspacing',
        'ts/color/css/hexrgba',
        'ts/color/modifiers',
        'name/kebab',
        'custom/referenceToCSSVar',
      ],
      buildPath: `build/`, // Destination folder for the build output
      files: [
        {
          destination: `tokens/_${file.fileName}.scss`, // Generate individual SCSS files
          format: 'custom/theme-css', // Use the custom CSS format
          options: {
            theme: file.fileName, // Pass the file name as the theme option
            isMode: isMode, // Detect if the file belongs to mode
            isDevice: isDevice, // Detect if the file belongs to device
            deviceMinWidth: BREAKPOINTS[file.fileName] || BREAKPOINTS.mobile, // Set responsive breakpoints
            filePath: file.filePath, // File path for filtering tokens
          },
        },
      ],
    };
    return acc;
  }, {}),
});

// Clean up previous builds and generate new SCSS files
await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
