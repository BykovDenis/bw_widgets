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

// Основные
/*
gulp.task('css', function () {
gulp.src('./assets/css/*.css')
.pipe(concatCss('style.min.css'))
.pipe(minifyCss({compatibility: 'ie8'}))
.pipe(autoprefixer({
browsers: ['last 10 versions'],
cascade: false
}))
.pipe(gulp.dest('./public/css/'));



gulp.src('./assets/css/fight/*.css')
.pipe(concatCss('fight.min.css'))
.pipe(minifyCss({compatibility: 'ie8'}))
.pipe(autoprefixer({
browsers: ['last 10 versions'],
cascade: false
}))
.pipe(gulp.dest('./public/css/'))
.pipe(connect.reload());
});

*/

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
  .pipe(gulp.dest("./public/css"))
  .pipe(minify())
  .pipe(rename("style.min.css"))
  .pipe(gulp.dest("./public/css"))
  .pipe(server.reload({stream: true}));

});

gulp.task("serve", ["sass"], function(){
  server.init({
    server: "./public/"
  });
});



gulp.task('html',function(){
gulp.src('./assets/*.html')
.pipe(gulp.dest('./public/'))
.pipe(connect.reload());
});

gulp.task('fonts',function(){
gulp.src('./assets/font/**/*')
.pipe(gulp.dest('./public/font/'))
.pipe(connect.reload());
});

gulp.task('js',function(){
gulp.src('./assets/js/*.js')
.pipe(uglify())
.pipe(gulp.dest('./public/js/'))
.pipe(connect.reload());
});
gulp.task('jslibs',function(){
gulp.src('./assets/js/libs/*.js')
.pipe(uglify())
.pipe(gulp.dest('./public/js/libs/'))
.pipe(connect.reload());
});
gulp.task('jsmods',function(){
gulp.src('./assets/js/modules/**/*.js')
.pipe(uglify())
.pipe(gulp.dest('./public/js/modules/'))
.pipe(connect.reload());
});

gulp.task('img',function(){
gulp.src('./assets/img/*')
.pipe(imagemin({
progressive: true,
svgoPlugins: [{removeViewBox: false}],
use: [pngquant()]
}))
.pipe(gulp.dest('./public/img/'))
.pipe(connect.reload());
});

// jade
gulp.task('jade', function() {
  var YOUR_LOCALS = {};

  gulp.src('./assets/jade/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest('./public/'))
});

// Connect
gulp.task('connect', function() {
connect.server({
root: 'public',
livereload: true
});
});



// Watch
gulp.task('watch',function(){
gulp.watch("./assets/sass/**/*.scss", ['sass']);
gulp.watch("./assets/jade/*.jade", ['jade']);
gulp.watch("./assets/*.html", ['html']);
gulp.watch("./assets/js/*.js", ['js']);
gulp.watch("./assets/js/libs/*.js", ['jslibs']);
gulp.watch("./assets/js/modules/**/*.js", ['jsmods']);
gulp.watch("./public/*.html").on("change", server.reload );
gulp.watch("./public/css/*.css").on("change", server.reload );
});

// Default
//gulp.task('default', ['jade', 'html', 'css', 'sass', 'js','jslibs', 'jsmods', 'connect', 'watch']);
gulp.task('default', ['jade', 'html', 'sass', 'js','jslibs', 'jsmods', 'connect', 'serve', 'watch']);
