const gulp = require('gulp')
const run = require('gulp-run-command').default
const clean = require('gulp-clean')
const wait = require('gulp-wait')

gulp.task('clean', function() {
    return gulp.src('out', { read: false })
        .pipe(clean())
});

gulp.task('moveLangs', function() {
    return gulp.src(['src/app/langs/**/*'])
        .pipe(wait(500)) // We wait because when clean task is done, an error "file not found" is thrown
        .pipe(gulp.dest('out/app/langs'))
})

gulp.task('build', ['clean', 'moveLangs'], run('./node_modules/.bin/tsc', {
    env: { NODE_ENV: 'production' },
    ignoreErrors: true
}))

gulp.task('standardize', run('./node_modules/.bin/standardts --fix', {
    env: { NODE_ENV: 'production' }
}))

gulp.task('dev', ['build', 'standardize'])