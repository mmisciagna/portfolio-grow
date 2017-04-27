const $ = require('gulp-load-plugins')();
const babelify = require('babelify');
const browserify = require('browserify');
const bs = require('browser-sync').create();
const buffer = require('vinyl-buffer');
const del = require('del');
const gulp = require('gulp');
const path = require('path');
const source = require('vinyl-source-stream');
const watchify = require('watchify');
const config = {
  sassSrcDir: 'src/scss/',
  sassDestDir: 'dist/css/',
  jsSrcDir: 'src/js/',
  jsDestDir: 'dist/js/',
};
const jsSrc = config.jsSrcDir + 'main.js';
const b = browserify({
  entries: [jsSrc],
  cache: {},
  packageCache: {},
}).transform(babelify, {presets: ['es2015']});
gulp.task('clean', () => {
  del.sync(config.sassDestDir);
  del.sync(config.jsDestDir);
});
gulp.task('serve', ['build'], () => {
  bs.init({
    open: false,
    proxy: 'http://localhost:8080',
  });
});
gulp.task('js', () => {
  return bundleJs(b);
});
/**
 * A wrapper to the js task to reload browsersync after compilation.
 */
gulp.task('js-reload', ['js'], (done) => {
  bs.reload();
  done();
});
gulp.task('sass', () => {
  gulp.src(config.sassSrcDir + 'main.scss')
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe($.sass({
        includePaths: [path.join(__dirname, 'node_modules')],
        outputStyle: 'compressed'
      }))
      .pipe($.rename('main.min.css'))
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(config.sassDestDir))
      .pipe($.filter(['**/*.css']))
      .pipe(bs.stream());
});
gulp.task('watch', () => {
  gulp.watch(config.sassSrcDir + '**', ['sass']);
  gulp.watch(['**/*.yaml', '**/*.html', '**/*.scss']).on('change', bs.reload);
  const jsWatcher = gulp.watch(config.jsSrcDir + '**', () => {
    const watchifyBundle = watchify(b);
    $.util.log('JS update triggered');
    bundleJs(watchifyBundle).on('end', () => {
      bs.reload();
    });
    watchifyBundle.on('update', () => {
      $.util.log('JS update triggered');
      bundleJs(watchifyBundle).on('end', () => {
        bs.reload();
      });
    });
    // Un-register the gulp watcher since watchify will take over.
    jsWatcher.end();
  });
});
const bundleJs = (b) => {
  return b.bundle()
      .on('error', function(err) {
        $.util.log(err.message);
        b.emit('end');
      })
      .pipe(source('./main.js'))
      .pipe(buffer())
      .pipe($.sourcemaps.init({loadMaps: true}))
      .pipe($.uglify())
      .pipe($.rename('main.min.js'))
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(config.jsDestDir));
};
gulp.task('build', ['clean', 'js', 'sass']);
gulp.task('default', ['build', 'serve', 'watch']);
