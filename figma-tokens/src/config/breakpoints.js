/**
 * @file
 * Defines the media query breakpoints for responsive design.
 * Each breakpoint corresponds to a specific device type.
 * "desktop" and "tablet" have defined pixel widths, while "mobile" follows a mobile-first approach
 * with no explicit breakpoint.
 */

export const BREAKPOINTS = {
  // Defines the minimum width for desktop screens.
  desktop: '1200px',

  // Defines the minimum width for tablet screens.
  tablet: '768px',

  // Mobile uses a mobile-first approach, hence no breakpoint is needed (null).
  mobile: null
};