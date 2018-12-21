'use strict';

import gulp from 'gulp';
import compass from 'gulp-compass';
import plumber from 'gulp-plumber';
import minifycss from 'gulp-minify-css';
import rename from 'gulp-rename';
import notify from 'gulp-notify';
import path from 'path';
import autoprefixer from 'gulp-autoprefixer';
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

// Notifiers
// --------------------------------------------------------
const notifyInfo = {
  title: 'Gulp',
  icon: path.join(__dirname, 'gulp.png')
};

const plumberErrorHandler = { errorHandler: notify.onError({
      title: notifyInfo.title,
      icon: notifyInfo.icon,
      message: "Error: <%= error.message %>"
  })
};

// Directories
// --------------------------------------------------------
const dir = {
  app: 'dev',
  prod: 'prod'
}

// Files
// --------------------------------------------------------
const files = {
  input: [`${dir.prod}/**/*.*`, `!${dir.publc}/assets/css/*.css}`],
  app: [`${dir.app}/*.*`],
  public: `${dir.prod}/`
}

const style = {
  input: `${dir.app}/assets/sass/**/*.scss`,
  sass_path: `${dir.app}/assets/sass`,
  css_path: `${dir.prod}/assets/css`,
}

// Tasks
// --------------------------------------------------------

gulp.task('files', () => {
  gulp.src(files.app)
  .pipe(gulp.dest(files.public))
});

gulp.task('sass', () => {
  gulp.src(style.input)
  .pipe(plumber(plumberErrorHandler))
  .pipe(compass({
      css: style.css_path,
      sass: style.sass_path
  }))
  .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
      grid: true
  }))
  .pipe(rename({ suffix: '.min' }))
  .pipe(minifycss())
  .pipe(gulp.dest(style.css_path))
  .pipe(browserSync.stream());
});

// Watchers
// --------------------------------------------------------

gulp.task('sass-watch', ['sass'], function (done) {
  browserSync.reload();
  done();
});

gulp.task('files-watch', ['files'], function(done) {
  browserSync.reload();
  done();
});


gulp.task('watch', function () {
  browserSync.init({
    server: {
        baseDir: "./prod/"
    }
});

  gulp.watch(style.input, ['sass']);
  gulp.watch(files.app, ['files-watch']);
  gulp.watch(files.input).on("change", reload);
});
