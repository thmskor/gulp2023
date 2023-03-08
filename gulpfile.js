const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');


function scripts() {
  return src([
    'node_modules/swiper/swiper-bundle.js',
    'src/js/app.js',

    /* Get All JS FIles except app.min.js

    'src/js/*.js',
    '!app/js/app.min.js'

    */
  ])
  .pipe(concat('app.min.js'))
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

function cleanDist(){
  return src('dist')
  .pipe(clean())
}

function building() {
  return src([
    'src/css/app.min.css',
    'src/js/app.min.js',
    'src/**/*.html'
  ], { base : 'src' })
  .pipe(dest('dist'))
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;

exports.build = series(cleanDist, building);
exports.default = parallel(styles, scripts, browsersync, watching);