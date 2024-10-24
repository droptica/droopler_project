/**
 * @file
 * Defines a custom Style Dictionary transform to convert token references to CSS variables.
 * The transform specifically removes any "mode/*-" prefix from token references and formats them as CSS variables.
 */

export const referenceToCSSVarTransform = {
  name: 'custom/referenceToCSSVar',
  type: 'value',
  transitive: true,
  /**
   * Filters tokens to identify those that contain references in the form "{...}".
   * Only tokens with such references will be transformed.
   *
   * @param {Object} token - The token to be filtered.
   * @returns {boolean} - Returns true if the token contains a reference to another token.
   */
  filter: (token) =>
    token.original &&
    token.original.value &&
    token.original.value.startsWith('{') &&
    token.original.value.endsWith('}'),

  /**
   * Transforms a token reference into a CSS variable by removing the "mode/*-" prefix (e.g., "mode/dark-").
   * This ensures that the CSS variables are not tied to a specific mode and are properly formatted.
   *
   * @param {Object} token - The token object to transform.
   * @returns {string} - The transformed CSS variable string, formatted as "var(--...)".
   */
  transform: (token) => {
    const ref = token.original.value.slice(1, -1).replace(/\./g, '-');

    // Remove any "mode/*-" prefix from the token reference (e.g., "mode/dark-" becomes "")
    return `var(--${ref.replace(/mode\/[^-]+-/g, '')})`;
  },
};
