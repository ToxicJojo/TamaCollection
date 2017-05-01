var gulp = require('gulp');
var gutil = require('gulp-util');
var pug = require('gulp-pug');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var exec = require('child_process').exec;

gulp.task('pug', () => {
  return gulp.src('app/templates/pages/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('public/'));
});

gulp.task('pugClient', () => {
  exec('pug -c --name-after-file --no-debug app/templates/client -o public/js/templates');
});

// Applies browserify, babel and uglifies the results.
// The resulting files are written to public/js.
gulp.task('javascript', () => {
  return gulp.src('app/js/UI/*.js')
    .pipe(browserify())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});


gulp.task('develop', () => {
  gulp.watch('app/templates/**/*.pug', ['pug']);
  gulp.watch('app/templates/client/**/*.pug', ['pugClient'])
  gulp.watch('app/js/**/*.js', ['javascript']);
  // Start the firebase server.
  exec('firebase serve');
});
