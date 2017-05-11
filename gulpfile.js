const gulp = require('gulp');
const pug = require('gulp-pug');
const browserify = require('gulp-browserify');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const insert = require('gulp-insert');

gulp.task('pug', () => {
  return gulp.src('app/templates/pages/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('public/'));
});

gulp.task('pugClient', () => {
  execSync('pug -c --name-after-file --no-debug app/templates/client -o public/js/templates');

  gulp.src('app/templates/**/*.js')
    .pipe(insert.transform((contents) => {
      const exportString = '\nmodule.exports = template';

      return contents + exportString;
    }))
    .pipe(gulp.dest('app/js/templates/'));
});

// Compile client side templates and expose the template function
// so they can be required.
gulp.task('pugComponents', () => {
  return gulp.src('app/templates/client/components/**/*.pug')
    .pipe(pug({
      client: true,
      compileDebug: false,
    }))
    .pipe(insert.transform((contents) => {
      const exportString = '\nmodule.exports = template';

      return contents + exportString;
    }))
    .pipe(gulp.dest('app/js/templates/'));
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

// Applies browserify and babel.
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
  gulp.watch('app/templates/client/components/**/*.pug', ['pugComponents']);
  // Start the firebase server.
  exec('firebase serve');
});

gulp.task('deploy', ['javascript', 'pug', 'pugClient', 'pugComponents', 'bootstrap-material'], () => {
  exec('firebase deploy');
});
