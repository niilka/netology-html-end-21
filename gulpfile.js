var
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	del = require('del'),
	notify = require("gulp-notify"),
	pug = require("gulp-pug"),
	rimraf = require('rimraf'),
	spritesmith = require('gulp.spritesmith'),
	svgstore = require('gulp-svgstore'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio');
gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
	});
});

gulp.task('sprites', function () {
	var spriteData = gulp.src('app/img/icons/png/*.png').pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: '_sprite.scss',
		algorithm: 'left-right',
		padding: 80
	}));
	return spriteData.pipe(gulp.dest('app/img/icons/png/png-sprite'));
});

gulp.task('svg-sprites', function () {
	return gulp
		.src('app/img/icons/svg/*.svg')
		.pipe(svgstore())
		.pipe(rename({
			basename: 'sprite'
		}))

		.pipe(gulp.dest('app/img/icons/svg/sprite'))
});
gulp.task('imagemin', function () {
	return gulp.src('app/img/**/*')
		.pipe(cache(imagemin()))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('removedist', function () {
	return del.sync('dist');
});

gulp.task('clearcache', function () {
	return cache.clearAll();
});

gulp.task('build', ['removedist', 'imagemin', 'pug', 'sass', 'js'], function () {

	var buildFiles = gulp.src([
		'app/*.html',
		'app/.htaccess',
	]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/main.min.css',
	]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js',
	]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*',
	]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('js', function () {
	return gulp.src([
			'app/libs/svg4everybody.min.js',
			'app/js/common.js',
		])
		.pipe(concat('scripts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('sass', function () {
	return gulp.src('app/sass/**/*.scss')
		.pipe(sass({
			outputStyle: 'expand'
		}).on("error", notify.onError()))
		.pipe(rename({
			suffix: '.min',
			prefix: ''
		}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('pug', function () {
	return gulp.src('app/*.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('app'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('watch', ['pug', 'sass', 'js', 'browser-sync'], function () {
	gulp.watch('app/sass/**/*.scss', ['sass']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
	gulp.watch('app/*.pug', ['pug'], browserSync.reload);
});

gulp.task('default', ['watch']);