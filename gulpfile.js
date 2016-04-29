var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

gulp.task('scripts', function() {
    return gulp.src('source_js/*.js')
        .pipe(uglify())
        .pipe(concat('source.min.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('watch', function(){
    gulp.watch('source_js/*.js',['scripts']);
});