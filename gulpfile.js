const gulp = require('gulp');
const pug = require('gulp-pug');
const uglify = require('gulp-uglify');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const insert = require('gulp-insert');
const browserify2 = require('browserify');
const source = require('vinyl-source-stream');
const glob = require('glob');
const es = require('event-stream');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');


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

gulp.task('javascript', (done) => {
  glob('app/js/UI/*.js', (err, files) => {
    if (err) done(err);

    const tasks = files.map((entry) => {
      return browserify2({ entries: [entry] })
        .transform(babelify)
        .bundle()
        .pipe(source(entry))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('public/js'));
    });
    es.merge(tasks).on('end', done);
  });
});

gulp.task('javascript-dev', (done) => {
  glob('app/js/UI/*.js', (err, files) => {
    if (err) done(err);

    const tasks = files.map((entry) => {
      return browserify2({ entries: [entry] })
        .transform(babelify)
        .bundle()
        .pipe(source(entry))
        .pipe(gulp.dest('public/js'));
    });
    es.merge(tasks).on('end', done);
  });
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
