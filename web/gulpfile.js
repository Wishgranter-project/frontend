const gulp    = require('gulp');
const rename  = require('gulp-rename');
const webpack = require('webpack-stream');
const sass    = require('gulp-sass')(require('sass'));

async function buildJs() 
{
    return gulp.src('./src/main.js')

    .pipe(webpack({
        mode: 'production',
    }))

    .pipe(rename('main.js'))

    .pipe(gulp.dest('./dist/'));
}

async function buildCss() 
{
    return gulp.src('./scss/styles.scss')
    
    .pipe(sass().on('error', sass.logError))
    
    .pipe(gulp.dest('./dist/'));
}

exports.buildJs  = buildJs;
exports.buildCss = buildCss;
exports.default  = gulp.series(buildJs, buildCss);
