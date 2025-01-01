const { src, dest, parallel, series, watch } = require('gulp');
const fileInclude = require('gulp-file-include');
const imagemin = require('gulp-imagemin')
const browserSync = require('browser-sync').create()


function htmlInclude() {
	return src('src/*.html')
		.pipe(
			fileInclude({
				prefix: '@@',
				basepath: '@file',
				context: {
					scheme: 'light',
					link: {
						appStore: "https://apps.apple.com/ru/app/vmire/id1616533678"
					}
				}
			})
		)
		.pipe(dest('./dist'))
	//.pipe(browserSync.stream())
}

function assets() {
	return src(['src/assets/**/*.*'], { encoding: false })
		.pipe(
			imagemin(
				[
					imagemin.gifsicle({
						interlaced: true,
					}),
					imagemin.mozjpeg({
						quality: 90,
						progressive: true,
					}),
					imagemin.optipng({
						optimizationLevel: 5,
					}),
					imagemin.svgo({
						plugins: [
							{
								removeViewBox: true,
							},
							{
								cleanupIDs: false,
							},
						],
					}),
				]
			)
		)
		.pipe(dest('dist/assets'))
}

function favicon() {
	return src('src/*.ico')
		.pipe(dest('dist'))
}

function build() {
	return src(['!src/html/*.html', 'src/fonts/*.woff', 'src/fonts/*.woff2'], {
		base: 'src',
	}).pipe(dest('dist'))
}

function cleanDist() {
	return del('dist/*')
}

function watching() {
	// watch(['src/**/*.html']).on('change', browserSync.reload)
	watch(['src/assets/**/*.*'], assets)
	watch(['src/**/*.html'], htmlInclude)
	watch(['src/*.html'], htmlInclude)
}

exports.watching = watching
exports.assets = assets
exports.cleanDist = cleanDist
exports.htmlInclude = htmlInclude
// exports.browsersync = browsersync

exports.build = series(
	cleanDist,
	htmlInclude,
	assets,
	build
)


exports.default = parallel(
	htmlInclude,
	assets,
	//browsersync,
	watching
)

// exports.default = function () {
//     return src(['src/**/*.html', 'src/**/*.svg'])
//         .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
//         .pipe(dest('dist'));
// }

// watch(['src/**/*.html'], this.default);