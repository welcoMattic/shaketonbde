'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var gettext = require('gulp-angular-gettext');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('pot', function () {
  return gulp.src(['www/**/*.html', 'www/js/**/*.js'])
    .pipe(gettext.extract('template.pot', {
      // options to pass to angular-gettext-tools...
    }))
    .pipe(gulp.dest('www/po/'));
});

gulp.task('translations', function () {
  return gulp.src('www/po/**/*.po')
    .pipe(gettext.compile({
      module: 'i18n',
      format: 'javascript'
    }))
    .pipe(gulp.dest('www/js'));
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('default', ['sass']);
