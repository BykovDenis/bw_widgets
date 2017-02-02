
var gulp = require('gulp');
var autoprefixer = require('autoprefixer');
var uglify = require('gulp-uglify');

var uglifyjs = require('uglify-js'); // can be a git checkout
                                     // or another module (such as `uglify-js-harmony` for ES6 support)

var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var mqpacker = require('css-mqpacker');
var minify = require('gulp-csso');
var clean = require('gulp-clean');
var pngquant = require('imagemin-pngquant');
var minifyJS = require('gulp-minifier');


/* Работа с SVG файлами */
var svgSprite = require('gulp-svg-sprite'); //  создание спрайта
var svgmin = require('gulp-svgmin'), // минификация SVG
  cheerio = require('gulp-cheerio'), // удаление лишних атрибутов из svg
  replace = require('gulp-replace'); // фиксинг некоторых багов

var jslint = require('gulp-jslint');

/* Локальный web-сервер */
var connect = require('gulp-connect');

/* Препроцессор SASS Для CSS */
var sass = require('gulp-sass');

/* Шаблонизатор HTML */
var jade = require('gulp-jade');

/*  Переменные для работы с react и препроцессором JS Babel  */
var browserify = require('browserify');
var source = require('vinyl-source-stream');
/*  ----------------------------  */

/* Устанавливаем линтер для jade */
 var puglint = require('gulp-pug-lint');

 gulp.task('lint-jade', function () {
   return gulp
     .src('assets/jade/index.jade')
     .pipe(puglint());
 });


// browser-sync

var server = require('browser-sync');

gulp.task('sass', function() {
  gulp.src('./assets/sass/style.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(postcss([
    autoprefixer({browsers: ['last 10 versions']}),
    mqpacker({ sort: true })
  ]))
  .pipe(gulp.dest('./build/themes/openweathermap/assets/vendor/owm/css'))
  .pipe(minify())
  .pipe(rename('weather-widgets-constructor.min.css'))
  .pipe(gulp.dest('./build/themes/openweathermap/assets/vendor/owm/css'))
  .pipe(server.reload({stream: true}));

});

gulp.task('serve', ['sass'], function() {
  server.init({
    server: './build/'
  });
});

/* оЧищаем папку product */

gulp.task('clean', function() {
  return gulp.src('./build/*', {force: true})
  .pipe(clean());
});

gulp.task('html', function() {
  gulp.src('./assets/*.html')
  .pipe(gulp.dest('./build/'))
  .pipe(connect.reload());
});

gulp.task('fonts', function() {
  gulp.src('./assets/fonts/**/*')
  .pipe(gulp.dest('./build/themes/openweathermap/assets/vendor/owm/fonts/'))
  .pipe(connect.reload());
});


// the same options as described above
var optionsUglify = {
  preserveComments: 'license'
};

gulp.task('js', function() {
  gulp.src('./build/themes/openweathermap/assets/vendor/owm/js/*.js')
  .pipe(uglify(optionsUglify, uglifyjs))
  .pipe(gulp.dest('./build/themes/openweathermap/assets/vendor/owm/js/'))
  .pipe(connect.reload());
});

gulp.task('jslibs', function() {
  gulp.src('./assets/js/libs/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('./build/themes/openweathermap/assets/vendor/owm/js/'))
  .pipe(connect.reload());
});

gulp.task('jsmods', function() {
  gulp.src('./assets/js/modules/**/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('./build/themes/openweathermap/assets/vendor/owm/js/modules/'))
  .pipe(connect.reload());
});


gulp.task('img', function() {
  gulp.src('./assets/img/*')
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  }))
  .pipe(gulp.dest('./build/themes/openweathermap/assets/vendor/owm/img/widgets/'))
  .pipe(connect.reload());
});

// jade
gulp.task('jade', function() {
  var YOUR_LOCALS = {};
  gulp.src('./assets/jade/**/*.jade')
  .pipe(jade({
    locals: YOUR_LOCALS,
    pretty: true
  }))
  .pipe(gulp.dest('./build/'));
});

// Connect Запуск виртуального web-сервера
gulp.task('connect', function() {
  connect.server({
    root: 'build',
    livereload: true
  });
});

gulp.task('copyFiles', function() {
  // copy any html files in source/ to build/
  gulp.src('./assets/asserts/*').pipe(gulp.dest('./build/asserts'));
  gulp.src('./assets/fonts/*').pipe(gulp.dest('../build/themes/openweathermap/assets/vendor/owm/fonts'));
  gulp.src('./assets/data/*').pipe(gulp.dest('../build/themes/openweathermap/assets/vendor/owm/data'));
  gulp.src('./assets/sprites/sprite.svg/sprite.svg').pipe(gulp.dest('../build/themes/openweathermap/assets/vendor/owm/img/sprite.svg'));
});

// Задачи по созданию svg спрайтов

gulp.task('svgSpriteBuild', function() {
  return gulp.src('./assets/img/*.svg')
 // minify svg
  .pipe(svgmin({
    js2svg: {
      pretty: true
    }
  }))
// remove all fill, style and stroke declarations in out shapes
  .pipe(cheerio({
    run: function($) {
      $('[fill]').removeAttr('fill');
      $('[stroke]').removeAttr('stroke');
      $('[style]').removeAttr('style');
    },
    parserOptions: {xmlMode: true}
  }))
// cheerio plugin create unnecessary string '&gt;', so replace it.
  .pipe(replace('&gt;', '>'))
// build svg sprite
  .pipe(svgSprite({
    mode: {
      symbol: {
        sprite: './../sprite.svg',
        render: {
          scss: {
            dest: './assets/sass/_sprite.scss',
            template: './assets/sass/templates/_sprite_template.scss'
          }
        }
      }
    }
  }))
  .pipe(gulp.dest('./assets/sprites/sprite.svg'));
});

// Build React
gulp.task('build_js', function() {
  return browserify({entries: ['./assets/js/script.js'], extensions: ['.jsx', '.js'], debug: true})
  .transform('babelify', {presets: ['es2015']})
  .bundle()
  .pipe(source('weather-widgets-constructor.js'))
  .pipe(gulp.dest('./build/themes/openweathermap/assets/vendor/owm/js'));
});

// Локальный сервер
gulp.task('serve1', ['asserts_js'], function() {
  server.init({
    server: './build/asserts'
  });
});

gulp.task('jslint', function() {
  return gulp.src(['./js/script.js'])
  .pipe(jslint())
  .pipe(jslint.reporter('default', errorsOnly))
  .pipe(jslint.reporter('stylish', options));
});

//Минификация файлов
gulp.task('minifyFiles', function() {
  return gulp.src('./build/themes/openweathermap/**/*').pipe(minifyJS({
    minify: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyJS: true,
    minifyCSS: true,
    getKeptComment: function (content, filePath) {
      var m = content.match(/\/\*![\s\S]*?\*\//img);
      return m && m.join('\n') + '\n' || '';
    }
  })).pipe(gulp.dest('./build/themes/openweathermap/'));
});

// Watch
gulp.task('watch', function() {
  gulp.watch('./assets/sass/**/*.scss', ['sass']);
  gulp.watch('./assets/jade/*.jade', ['jade']);
  gulp.watch('./assets/*.html', ['html']);
  gulp.watch('./assets/js/*.js', ['build_js']);
  gulp.watch('./assets/js/generator/*.js', ['build_js_gen']);
  gulp.watch('./assets/js/libs/*.js', ['jslibs']);
  gulp.watch('./assets/js/modules/**/*.js', ['jsmods']);
  gulp.watch('./assets/*', ['copyFiles']);
  gulp.watch('../build/themes/openweathermap/assets/vendor/owm/js/*.js').on('change', server.reload );
  gulp.watch('./build/*.html').on('change', server.reload );
  gulp.watch('../build/themes/openweathermap/assets/vendor/owm/css/*.css').on('change', server.reload );
});

// Default
gulp.task('default', ['clean', 'jade', 'sass', 'jslibs', 'jsmods', 'build_js', 'js', 'serve', 'copyFiles', 'img', 'watch']);
gulp.task('run', ['jade', 'sass', 'js', 'jslibs', 'jsmods', 'serve', 'build_js', 'copyFiles', 'watch']);
gulp.task('build', ['clean', 'svgSpriteBuild', 'img', 'copyFiles']);

// Тестирование
gulp.task('asserts', ['copyFiles', 'asserts_js', 'serve1']);

//gulp.task('default', ['clean','jade', 'sass', 'build', 'serve', 'copyFiles','img','watch']);
