/**
 * Gulp file to automate the various tasks
 */

const autoprefixer = require('gulp-autoprefixer')
const browserSync = require('browser-sync').create()
const cleanCss = require('gulp-clean-css')
const del = require('del')
const gulp = require('gulp')
const postcss = require('gulp-postcss')
const sass = require('gulp-sass')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const wait = require('gulp-wait')

// Define paths

const paths = {
  dist: {
    base: 'dist',
    img: 'dist/assets/img',
    libs: 'dist/assets/vendor'
  },
  base: {
    base: './',
    node: 'node_modules'
  },
  src: {
    base: './',
    css: 'assets/css',
    html: '**/*.html',
    img: 'assets/img/**/*.+(png|jpg|gif|svg)',
    js: 'assets/js/**/*.js',
    scss: 'assets/scss/**/*.scss'
  }
}

// Compile SCSS

gulp.task('scss', () => {
  return gulp
    .src(paths.src.scss)
    .pipe(wait(500))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([require('postcss-flexbugs-fixes')]))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.src.css))
    .pipe(
      browserSync.reload({
        stream: true
      })
    )
})

// Minify CSS

gulp.task('minify:css', () => {
  return gulp
    .src([paths.src.css + '/argon.css'])
    .pipe(cleanCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dist.base + '/css'))
})

// Minify JS

gulp.task('minify:js', () => {
  return gulp
    .src([paths.src.base + 'assets/js/argon.js'])
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dist.base + '/js'))
})

// Live reload

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: [paths.src.base, paths.base.base]
    }
  })
})

// Watch for changes

gulp.task('watch', () => {
  gulp.watch(paths.src.scss, gulp.series('scss'))
  gulp.watch(paths.src.js).on('change', () => browserSync.reload())
  gulp.watch(paths.src.html).on('change', () => browserSync.reload())
})

// Clean

gulp.task('clean:dist', () => {
  return del(paths.dist.base)
})

// Copy CSS

gulp.task('copy:css', () => {
  return gulp
    .src([paths.src.base + 'assets/css/argon.css'])
    .pipe(gulp.dest(paths.dist.base + '/css'))
})

// Copy JS

gulp.task('copy:js', () => {
  return gulp
    .src([paths.src.base + 'assets/js/argon.js'])
    .pipe(gulp.dest(paths.dist.base + '/js'))
})

// Build

gulp.task(
  'build',
  gulp.series(
    'clean:dist',
    'scss',
    'copy:css',
    'copy:js',
    'minify:js',
    'minify:css'
  )
)

// Default

gulp.task('default', gulp.parallel('scss', 'browserSync', 'watch'))
