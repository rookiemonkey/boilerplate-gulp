/**
 * gulp -f filename.js - can be used incase of running single gulp tasks
 */

const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const replace = require('gulp-replace');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');

const paths = {
    html: {
        src: './index.html',
        dest: './build'
    },
    styles: {
        src: './assets/css/*.css',
        dest: './build/assets/css',
        output: 'main' // w/o extension name
    },
    scripts: {
        src: './assets/js/*.js',
        dest: './build/assets/js',
        output: 'main.js'
    },
    images: {
        src: './assets/images/*',
        dest: './build/assets/images'
    },
    fonts: {
        src: '../assets/fonts/*',
        dest: '../build/assets/fonts'
    },
};

const clean = () => del(['./build']);

// Copies all html files
const html = () =>
    gulp
        .src(paths.html.src)
        .pipe(plumber())
        .pipe(htmlmin({ collapseWhitespace: false }))
        .pipe(gulp.dest(paths.html.dest));

// Convert scss to css, auto-prefix and rename into styles.min.css
const styles = () =>
    gulp
        .src(paths.styles.src)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(rename({ basename: paths.styles.output }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());

// Minify all javascript files and concat them into a single app.min.js
const scripts = () =>
    gulp
        .src(paths.scripts.src)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(
            babel({
                presets: ['@babel/preset-env']
            })
        )
        .pipe(terser())
        .pipe(concat(paths.scripts.output))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.scripts.dest));

// Copy and minify images
const images = () =>
    gulp
        .src(paths.images.src)
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dest));

// Copy the whole folder
const fonts = () =>
    gulp
        .src(paths.fonts.src)
        .pipe(plumber())
        .pipe(gulp.dest(paths.fonts.dest));


const build = gulp.series(
    clean,
    gulp.parallel(html, styles, scripts, images, fonts)
);

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.build = build;
exports.default = build;