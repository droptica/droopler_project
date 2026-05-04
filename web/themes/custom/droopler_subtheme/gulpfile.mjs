/**
 * @file
 * Gulp pipeline for Droopler subtheme (ES modules for Gulp 5 / ESM plugins).
 *
 * Commands:
 * - watch / watchFiles — watches SCSS & JS (Ctrl+C to exit)
 * - debug — verify paths
 * - clean — delete generated CSS & min JS
 * - compile — dev CSS & JS with sourcemaps
 * - dist — prod CSS & min JS
 */

'use strict';

import fs from 'node:fs';

import { deleteAsync } from 'del';
import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import dartSass from 'gulp-dart-sass';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import pump from 'pump';

const scss_pattern = '**/*.scss';
const js_pattern = '*.js';

/** @type {string} */
const theme_dir = '.';

/** @type {string} */
const scss_dir = `${theme_dir}/scss`;
/** @type {string} */
const css_dir = `${theme_dir}/css`;
/** @type {string} */
const js_dir = `${theme_dir}/js`;
/** @type {string} */
const jsmin_dir = `${theme_dir}/js/min`;

/** @type {string} */
const scss_input = `${scss_dir}/${scss_pattern}`;
/** @type {string} */
const js_input = `${js_dir}/${js_pattern}`;

/**
 * Shared Dart Sass options until the theme stack migrates to @use / module API.
 *
 * @see https://sass-lang.com/documentation/js-api/interfaces/Options/
 */
const sassSharedOptions = {
  quietDeps: true,
  silenceDeprecations: [
    'legacy-js-api',
    'import',
    'global-builtin',
    'color-functions',
    'if-function',
    'abs-percent',
  ],
};

const sassOptionsDev = {
  ...sassSharedOptions,
  outputStyle: 'expanded',
};

const sassOptionsProd = {
  ...sassSharedOptions,
  outputStyle: 'compressed',
};

const autoprefixerOptions = {
  overrideBrowserslist: ['last 2 versions', '> 5%', 'Firefox ESR'],
};

/** SCSS compile (expanded + sourcemaps + autoprefix). */
function sassCompile() {
  return gulp
    .src(scss_input)
    .pipe(sourcemaps.init())
    .pipe(dartSass.sync(sassOptionsDev).on('error', dartSass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(css_dir))
    .resume();
}

/** Prod SCSS (compressed + autoprefix, no maps). */
function sassDist() {
  return gulp
    .src(scss_input)
    .pipe(dartSass.sync(sassOptionsProd))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(css_dir));
}

function jsCompile(cb) {
  pump(
    [
      gulp.src(js_input),
      sourcemaps.init(),
      uglify(),
      rename({ suffix: '.min' }),
      sourcemaps.write('.'),
      gulp.dest(jsmin_dir),
    ],
    cb,
  );
}

function watchFiles() {
  gulp.watch(scss_input, gulp.series(sassCompile));
  gulp.watch(js_input, gulp.series(jsCompile));
}

function debug(cb) {
  console.log(`[OK] Working directory set: ${theme_dir}`);

  if (fs.existsSync(theme_dir)) {
    console.log('[OK] Working directory exists.');
  }
  else {
    console.log('[ERROR] Working directory does not exist (Docker mount / path).');
  }

  if (fs.existsSync(scss_dir)) {
    console.log('[OK] SCSS directory exists.');
  }
  else {
    console.log('[ERROR] SCSS directory does not exist.');
  }

  if (fs.existsSync(css_dir)) {
    console.log('[OK] CSS directory exists.');
  }
  else {
    console.log('[WARNING] CSS directory does not exist (create it before compile).');
  }

  if (fs.existsSync(js_dir)) {
    console.log('[OK] JS directory exists.');
  }
  else {
    console.log('[ERROR] JS directory does not exist.');
  }

  if (fs.existsSync(jsmin_dir)) {
    console.log('[OK] .min.js directory exists.');
  }
  else {
    console.log('[WARNING] .min.js directory does not exist (create it before compile).');
  }

  cb();
}

function clean() {
  return deleteAsync([`${css_dir}/*`, `${jsmin_dir}/*`], { force: true });
}

const compile = gulp.parallel(sassCompile, jsCompile);
const dist = gulp.parallel(sassDist, jsCompile);

export {
  clean,
  compile,
  debug,
  dist,
  jsCompile,
  sassCompile,
  sassDist,
  watchFiles,
  watchFiles as watch,
};

export default watchFiles;

process.on('SIGINT', () => {
  console.log('Caught Ctrl+C...');
  process.exit();
});
process.on('SIGTERM', () => {
  console.log('Caught kill...');
  process.exit();
});
