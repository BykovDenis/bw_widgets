var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('autoprefixer');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var jade = require('gulp-jade');
var plumber = require('gulp-plumber');
var postcss = require("gulp-postcss");
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var clean = require('gulp-clean');
var pngquant = require('imagemin-pngquant');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

// browser-sync

var server = require("browser-sync");

gulp.task("sass", function() {
  gulp.src("./assets/sass/style.scss")
  .pipe(plumber())
  .pipe(sass())
  .pipe(postcss([
    autoprefixer({browsers: ['last 10 versions']}),
    mqpacker({ sort: true })
  ]))
  .pipe(gulp.dest("./build/css"))
  .pipe(minify())
  .pipe(rename("style.min.css"))
  .pipe(gulp.dest("./build/css"))
  .pipe(server.reload({stream: true}));

});

gulp.task("serve", ["sass"], function(){
  server.init({
    server: "./build/"
  });
});

/* оЧищаем папку product */

gulp.task('clean', function () {
	return gulp.src('./build/*', {force: true})
		.pipe(clean());
});

gulp.task('html',function(){
gulp.src('./assets/*.html')
.pipe(gulp.dest('./build/'))
.pipe(connect.reload());
});

gulp.task('fonts',function(){
gulp.src('./assets/font/**/*')
.pipe(gulp.dest('./build/font/'))
.pipe(connect.reload());
});

gulp.task('js',function(){
gulp.src('./assets/js/*.js')
.pipe(uglify())
.pipe(gulp.dest('./build/js/'))
.pipe(connect.reload());
});
gulp.task('jslibs',function(){
gulp.src('./assets/js/libs/*.js')
.pipe(uglify())
.pipe(gulp.dest('./build/js/libs/'))
.pipe(connect.reload());
});
gulp.task('jsmods',function(){
gulp.src('./assets/js/modules/**/*.js')
.pipe(uglify())
.pipe(gulp.dest('./build/js/modules/'))
.pipe(connect.reload());
});

gulp.task('img',function(){
gulp.src('./assets/img/*')
.pipe(imagemin({
progressive: true,
svgoPlugins: [{removeViewBox: false}],
use: [pngquant()]
}))
.pipe(gulp.dest('./build/img/'))
.pipe(connect.reload());
});

// Build React
gulp.task('build_js', function () {
  return browserify({entries: ['./assets/js/script.js'], extensions: ['.jsx', '.js'], debug: true})
      .transform('babelify', {presets: ['es2015']})
      .bundle()
      .pipe(source('weather-widget.js'))
      .pipe(gulp.dest('build/js'));
});

// jade
gulp.task('jade', function() {
  var YOUR_LOCALS = {};

  gulp.src('./assets/jade/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest('./build/'))
});

// Connect
gulp.task('connect', function() {
connect.server({
root: 'build',
livereload: true
});
});


gulp.task('copyFiles', function() {
  // copy any html files in source/ to build/
  gulp.src('./assets/fonts/*').pipe(gulp.dest('./build/fonts'));
});


// Watch
gulp.task('watch',function(){
gulp.watch("./assets/sass/**/*.scss", ['sass']);
gulp.watch("./assets/jade/*.jade", ['jade']);
gulp.watch("./assets/*.html", ['html']);
gulp.watch("./assets/js/*.js", ['js']);
gulp.watch("./assets/js/libs/*.js", ['jslibs']);
gulp.watch("./assets/js/modules/**/*.js", ['jsmods']);
gulp.watch("./assets/*",['copyFiles']);
gulp.watch("./build/*.html").on("change", server.reload );
gulp.watch("./build/css/*.css").on("change", server.reload );

});

// Default
//gulp.task('default', ['jade', 'html', 'css', 'sass', 'js','jslibs', 'jsmods', 'connect', 'watch']);
gulp.task('default', ['clean','jade', 'sass', 'js','jslibs', 'jsmods', 'build_js', 'connect', 'serve', 'copyFiles','img','watch']);
