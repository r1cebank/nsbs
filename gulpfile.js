/**
 * gulpfile.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
require('babel-core/register');

const gulp         = require('gulp');
const gutil        = require('gulp-util');

const del          = require('del');
const babel        = require('gulp-babel');
const mocha        = require('gulp-mocha');
const eslint       = require('gulp-eslint');
const notify       = require('gulp-notify');
const isparta      = require('isparta');
const changed      = require('gulp-changed');
const istanbul     = require('gulp-istanbul');
const jsinspect    = require('gulp-jsinspect');
const sourcemaps   = require('gulp-sourcemaps');
const codeclimate  = require('gulp-codeclimate-reporter');

/*!
 * Load plugin configuration files.
 */
const pkg          = require('./package.json');
const eslintrc     = pkg.eslintConfig;
const babelrc      = pkg.babel;
const jsirc        = pkg.jsInspectConfig;

/*!
 * Default build target.
 */
gulp.task('default', [ 'test' ]);


/*!
 * Delete previous builds.
 */
gulp.task('clean', function() {
    return del([ 'lib/**' ]);
});


/*!
 * Incremental build (use with watch).
 */
const build = function() {

    return gulp.src(['src/**/*.js'], { base: 'src' })
        .pipe(changed('lib'))
        .pipe(sourcemaps.init())
        .pipe(babel(babelrc))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('lib'))
        .pipe(notify({ message: 'Build Successful', onLast: true }));

};
gulp.task('build', ['lint'], build);
gulp.task('rebuild', [ 'relint' ], build);


/*!
 * Lint all source files.
 */
const lint = function() {

    return gulp.src(['src/**/*.js'])
        .pipe(changed('lib'))
        .pipe(eslint(eslintrc))
        .pipe(eslint.format())
        .pipe(jsinspect(jsirc))
        .pipe(eslint.failAfterError());

};
gulp.task('lint', lint);
gulp.task('relint', ['clean'], lint);


/*!
 * Run the test suit.
 */
gulp.task('test', ['build'], function(done) {

    gulp.src([ 'test/index.spec.js' ], { read: false })
        .pipe(mocha({ reporter: 'spec' }))
        .once('end', done);

});


/*!
 * Test coverage.
 */
gulp.task('coverage', ['build'], function(done) {

    gulp.src(['src/**/*.js'])
        .pipe(istanbul({
            instrumenter: isparta.Instrumenter,
            includeUntested: true
        }))
        .pipe(istanbul.hookRequire())
        .on('finish', function() {
            gulp.src(['test/index.spec.js'])
                .pipe(mocha())
                .pipe(istanbul.writeReports({
                    dir: 'coverage',
                    reportOpts: { dir: 'coverage' },
                    reporters: ['text-summary', 'html', 'lcov']
                }))
                .once('end', done);
        });

});


/*!
 * Report test coverage to CodeClimate.
 */
gulp.task('coverage:report', [ 'coverage' ], function() {

    const token = process.env.CODECLIMATE_REPO_TOKEN;
    if (!token) {
        gutil.log('Skipping CodeClimate coverage reporting.');
        return null;
    }

    return gulp
        .src([ 'coverage/lcov.info' ], { read: false })
        .pipe(codeclimate({ token: token }));

});


/*!
 * Automatically rebuild on save.
 */
gulp.task('watch', ['rebuild'], function() {
    gulp.watch('src/**/*.js', ['build']);
});