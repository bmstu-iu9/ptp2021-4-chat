const gulp = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const minify = require('gulp-minify-css')
const concat = require('gulp-concat')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const clean = require('gulp-clean')


const paths = {
  sources: {
    allFiles: 'src/**/*.*',
    root: 'src/',
    assets: 'src/assets/**/*.*',
    html: 'src/*.html',
    styles: 'src/styles/**/*.css',
    js: 'src/js/**/*.js'
  },
  destinations: {
    allFiles: 'public/**/*.*',
    root: 'public/',
    assets: 'public/assets/',
    html: 'public/',
    styles: 'public/styles/',
    js: 'public/js'
  }
}

function buildStyles() {
  return gulp.src(paths.sources.styles)
    .pipe(autoprefixer())
    .pipe(minify())
    .pipe(concat('bundle.min.css'))
    .pipe(gulp.dest(paths.destinations.styles))
}

function buildJs() {
  return gulp.src(paths.sources.js)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.destinations.js))
}

function buildHtml() {
  return gulp.src(paths.sources.html)
    .pipe(gulp.dest(paths.destinations.html))
}

function buildAssets() {
  return gulp.src(paths.sources.assets)
    .pipe(gulp.dest(paths.destinations.assets))
}

function cleanup() {
  return gulp.src(paths.destinations.allFiles)
    .pipe(clean())
}

gulp.task('watch', () => {
  gulp.watch(paths.sources.allFiles, gulp.series('build'))
})


gulp.task('build', gulp.series(cleanup, buildHtml, buildStyles, buildJs, buildAssets))
gulp.task('default', gulp.series('build', 'watch'))