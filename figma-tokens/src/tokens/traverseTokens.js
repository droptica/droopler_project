/**
 * @file
 * Recursively traverses token objects to gather token paths and applies a callback function on each token.
 */

/**
 * Recursively traverses through a token object and gathers its path.
 * For each token, it applies the provided callback function with the token path and value.
 *
 * @param {Object} obj - The token object to traverse.
 * @param {Function} callback - A function to call for each token. It receives the token path and the token value as arguments.
 * @param {Array<string>} [path=[]] - The current token path being traversed, used for building full paths.
 */
export function traverseTokens(obj, callback, path = []) {
  for (let key in obj) {
    // If the value is an object without a "value" key, continue traversing
    if (typeof obj[key] === 'object' && !obj[key].value) {
      traverseTokens(obj[key], callback, [...path, key]);
    }
    // Otherwise, construct the token path and apply the callback
    else {
      const tokenPath = path.concat(key).join('.');
      callback(tokenPath, obj[key]);
    }
  }
}
