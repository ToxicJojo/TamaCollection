const gulp = require('gulp');
const pug = require('gulp-pug');
const browserify = require('gulp-browserify');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const exec = require('child_process').exec;

gulp.task('pug', () => {
  return gulp.src('app/templates/pages/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('public/'));
});

gulp.task('pugClient', () => {
  exec('pug -c --name-after-file --no-debug app/templates/client -o public/js/templates');
});

gulp.task('bootstrap-material', () => {
  gulp.src('node_modules/bootstrap-material-design/dist/js/*.min.js')
    .pipe(gulp.dest('public/js/vendor/'));

  gulp.src('node_modules/bootstrap-material-design/dist/css/*.min.css')
    .pipe(gulp.dest('public/css/vendor/'));
});

// Applies browserify, babel and uglifies the results.
// The resulting files are written to public/js.
gulp.task('javascript', () => {
  return gulp.src('app/js/UI/*.js')
    .pipe(browserify())
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});

// Applies browserify, babel and uglifies the results.
// The resulting files are written to public/js.
gulp.task('javascript-dev', () => {
  return gulp.src('app/js/UI/*.js')
    .pipe(browserify())
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(gulp.dest('public/js'));
});


gulp.task('develop', () => {
  gulp.watch('app/templates/**/*.pug', ['pug']);
  gulp.watch('app/templates/client/**/*.pug', ['pugClient']);
  gulp.watch('app/js/**/*.js', ['javascript-dev']);
  // Start the firebase server.
  exec('firebase serve');
});

gulp.task('deploy', ['javascript', 'pug', 'pugClient', 'bootstrap-material'], () => {
  exec('firebase deploy');
});
