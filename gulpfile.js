var gulp = 		require('gulp'),
	gutil = 	require('gulp-util'),
	uglify=		require('gulp-uglify'),
	imagemin=	require('gulp-imagemin'),
	autoprefixer = 	require('gulp-autoprefixer');

function errorLog(error){
	console.error.bind(error);
	this.emit('end');
};
// Scripts Task
// Uglifies
gulp.task('image', function(){
	gulp.src('pano/*.jpg')
		.pipe(imagemin())
		.pipe(gulp.dest('photos'))
		.on("error", error);
	gulp.src('photos/*.jpg')
		.pipe(imagemin())
		.pipe(gulp.dest('photos'))
		.on("error", errorLog);
});

gulp.task('styles', () =>
    gulp.src('*.css')
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(''))
);
// Watches Files

gulp.task('watch', function(){
	gulp.watch('js/*.js', ['scripts']);
});

gulp.task('default', function(){
	
});