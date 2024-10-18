import { register } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import fs from 'fs';
import path from 'path';

// Define breakpoints for devices
const BREAKPOINTS = {
  desktop: '1200px',
  tablet: '768px',
  mobile: null,  // Mobile first approach - no breakpoint for mobile
};

// Register the transform from tokens-studio
register(StyleDictionary);

// Function to retrieve all JSON files from specified directories (core, device, mode)
function getAllFiles(dirPaths) {
  return dirPaths.flatMap((dirPath) =>
    fs
      .readdirSync(dirPath)
      .filter((file) => path.extname(file) === '.json') // Only JSON files
      .map((file) => ({
        dir: dirPath,
        filePath: path.join(dirPath, file),
        fileName: path.basename(file, '.json'),  // Use file name without extension
      }))
  );
}

// Function to filter tokens based on the file path
function filterTokensByPath(dictionary, filePath) {
  const jsonName = path.basename(filePath);
  return dictionary.allTokens.filter(
    (token) => token.filePath && token.filePath.split('/')[2] === jsonName
  );
}

// Custom transformation for referencing CSS variables
StyleDictionary.registerTransform({
  name: 'custom/referenceToCSSVar',
  type: 'value',
  transitive: true,
  filter: (token) =>
    token.original &&
    token.original.value &&
    token.original.value.startsWith('{') &&
    token.original.value.endsWith('}'),
  transform: (token) => {
    const ref = token.original.value.slice(1, -1).replace(/\./g, '-');
    return `var(--${ref})`;  // Use var() to reference another CSS variable
  },
});

// Custom format for generating CSS files based on directory type (core, mode, device)
StyleDictionary.registerFormat({
  name: 'custom/theme-css',
  format: function ({ dictionary, options }) {
    let cssVariables = '';

    // Handle mode directory with data-theme-name attribute
    if (options.isMode) {
      cssVariables += `*[data-theme-name="${options.theme}"] {\n`;
    }
    // Handle device directory with media queries based on breakpoints
    else if (options.isDevice) {
      const deviceBreakpoint = BREAKPOINTS[options.theme];
      if (deviceBreakpoint) {
        cssVariables += `@media (min-width: ${deviceBreakpoint}) {\n:root {\n`;
      } else {
        cssVariables += `:root {\n`;  // Mobile-first, no media query
      }
    }
    // Handle core directory with standard :root structure
    else {
      cssVariables += `:root {\n`;
    }

    // Filter tokens specific to the file being processed
    const filteredTokens = filterTokensByPath(dictionary, options.filePath);

    if (filteredTokens.length === 0) {
      console.warn(`No tokens found for ${options.theme}`);
    }

    // Generate CSS variables, removing any unnecessary prefixes
    filteredTokens.forEach((token) => {
      let tokenName = token.name;
      if (options.isMode) {
        tokenName = tokenName.replace(`mode-${options.theme}-`, '');
      } else if (options.isDevice) {
        tokenName = tokenName.replace(`device-${options.theme}-`, '');
      } else {
        tokenName = tokenName.replace(`core-${options.theme}-`, '');
      }

      // Add the CSS variable declaration
      if (typeof token.value === 'object') {
        Object.keys(token.value).forEach((subKey) => {
          cssVariables += `  --${tokenName}-${subKey}: ${token.value[subKey]};\n`;
        });
      } else {
        cssVariables += `  --${tokenName}: ${token.value};\n`;
      }
    });

    // Close CSS block
    cssVariables += `}\n`;

    // Close media query for devices except mobile
    if (options.isDevice && options.theme !== 'mobile') {
      cssVariables += `}\n`;
    }

    return cssVariables;
  },
});

// Retrieve all JSON files from core, device, and mode directories
const directories = ['tokens/core', 'tokens/device', 'tokens/mode'];
const files = getAllFiles(directories);

// Configure StyleDictionary
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
            return JSON.parse(`{ "${relativePath}": ${contents} }`);
          }
          return JSON.parse(contents);
        },
      },
    },
  },
  parsers: ['json-parser'],
  source: files.map((file) => file.filePath),
  platforms: files.reduce((acc, file) => {
    const isMode = file.dir.includes('mode');
    const isDevice = file.dir.includes('device');

    acc[file.fileName] = {
      transformGroup: 'tokens-studio',
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
      buildPath: `build/`,
      files: [
        {
          destination: `tokens/_${file.fileName}.scss`,
          format: 'custom/theme-css',
          options: {
            theme: file.fileName,
            isMode: isMode,
            isDevice: isDevice,
            deviceMinWidth: BREAKPOINTS[file.fileName] || BREAKPOINTS.mobile,
            filePath: file.filePath,
          },
        },
      ],
    };
    return acc;
  }, {}),
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
