const gulp    = require('gulp');
const rename  = require('gulp-rename');
const webpack = require('webpack-stream');

async function build() 
{
    return gulp.src('./src/main.js')

    .pipe(webpack({
        mode: 'production',
    }))

    .pipe(rename('main.js'))

    .pipe(gulp.dest('./dist/'));
}

exports.build = build;
exports.default = build;
