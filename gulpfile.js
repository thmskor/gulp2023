const { src, dest, watch, parallel } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');


function scripts() {
  return src('src/js/app.js')
  .pipe(concat('app.main.js'))
  .pipe(uglify())
  .pipe(dest('src/js'))
  .pipe(browserSync.stream())
}

function styles() {
  return src('src/scss/app.scss')
  .pipe(autoprefixer({ overrideBrowserslist: ['last 4 versions'] }))
  .pipe(concat('app.min.css'))
  .pipe(scss({ outputStyle: 'compressed' }))
  .pipe(dest('src/css'))
  .pipe(browserSync.stream())
}

function watching() {
  watch(['src/scss/app.scss'], styles)
  watch(['src/js/app.js'], scripts)
  watch(['src/*.html']).on('change', browserSync.reload)
}

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "src/"
    }
  });
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;

exports.default = parallel(styles, scripts, browsersync, watching);