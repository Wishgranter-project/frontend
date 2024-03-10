const gulp         = require('gulp');
const rename       = require('gulp-rename');
const webpack      = require('webpack-stream');
const sass         = require('gulp-sass')(require('sass'));
const TerserPlugin = require('terser-webpack-plugin');


async function buildJs() 
{
    return gulp.src('./src/main.js')

    .pipe(webpack({
        mode: 'production',
        optimization: {
            minimize: true,
            minimizer: [
              new TerserPlugin({
                parallel: true,
                terserOptions: {
                    compress: true,
                    keep_fnames: true,
                    keep_classnames: true,
                    mangle: false
                },
              }),
            ],
        }
    }))

    .pipe(rename('main.js'))

    .pipe(gulp.dest('./web/dist/'));
}

async function buildCss() 
{
    return gulp.src('./scss/styles.scss')
    
    .pipe(sass().on('error', sass.logError))
    
    .pipe(gulp.dest('./web/dist/'));
}

exports.buildJs  = buildJs;
exports.buildCss = buildCss;
exports.default  = gulp.series(buildJs, buildCss);
