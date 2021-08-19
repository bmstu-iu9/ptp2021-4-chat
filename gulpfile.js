const gulp = require('gulp')
const fs = require('fs')
const path = require('path')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const clean = require('gulp-clean')
const browserify = require('browserify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')


function getFilesPaths(folderPath, extension) {
  const files = []

  fs.readdirSync(folderPath).forEach(file => {
    if (path.extname(file) === `.${extension}`) {
      files.push(path.join(folderPath, file))
    }
  })

  return files
}

const paths = {
  sources: {
    allFiles: 'src/**/*.*',
    root: 'src/',
    assets: 'src/assets/**/*.*',
    html: 'src/*.html',
    styles: 'src/styles/**/*.css',
    js: getFilesPaths('src/js', 'js')
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

console.log(paths.sources.js)

function buildStyles() {
  return gulp.src(paths.sources.styles)
  .pipe(autoprefixer())
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(concat('bundle.css'))
  .pipe(gulp.dest(paths.destinations.styles))
}

function buildJs(done) {
  paths.sources.js.forEach(file => {
    browserify(file)
    .transform(babelify, {
      presets: ['@babel/env']
    })
    .bundle()
    .pipe(source(path.basename(file)))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(paths.destinations.js))
  })

  done()
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