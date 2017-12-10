const gulp = require('gulp')
const run = require('gulp-run-command').default

gulp.task('moveLangs', function() {
    return gulp.src(['src/app/langs/**/*'])
        .pipe(gulp.dest('out/app/langs'))
})

gulp.task('build', ['moveLangs'], run('./node_modules/.bin/tsc', {
    env: { NODE_ENV: 'production' },
    ignoreErrors: true
}))

gulp.task('standardize', run('./node_modules/.bin/standardts --fix', {
    env: { NODE_ENV: 'production' }
}))

gulp.task('dev', ['build', 'standardize'])