var gulp = require('gulp');
var gulpshift = require('./index.js');

gulp.task('build', function() {
    return gulp.src('*.md')
        .pipe(gulpshift({foo:'gi'}))
        .pipe(gulp.dest('./'));
});