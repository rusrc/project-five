const { src, dest,parallel, series, watch } = require('gulp');
const fileInclude = require('gulp-file-include');
const browserSync = require('browser-sync').create()


function htmlInclude() {
	return src('src/*.html')
		.pipe(
			fileInclude({
				prefix: '@@',
				basepath: '@file',
				context: {
					link: {
						appStore: "https://apps.apple.com/ru/app/vmire/id1616533678"
					}
				}
			})
		)
		.pipe(dest('./dist'))
		//.pipe(browserSync.stream())
}

function build() {
	return src(['!app/html/*.html', 'app/fonts/*.woff', 'app/fonts/*.woff2'], {
		base: 'app',
	}).pipe(dest('dist'))
}

function cleanDist() {
	return del('dist/*')
}

function watching() {
	// watch(['src/**/*.html']).on('change', browserSync.reload)
	watch(['src/html/*.html'], htmlInclude)
	watch(['src/*.html'], htmlInclude)
}

exports.watching = watching
exports.cleanDist = cleanDist
exports.htmlInclude = htmlInclude
// exports.browsersync = browsersync

exports.build = series(
	cleanDist,
	htmlInclude,
	build
)


exports.default = parallel(
	htmlInclude,
	//browsersync,
	watching
)

// exports.default = function () {
//     return src(['src/**/*.html', 'src/**/*.svg'])
//         .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
//         .pipe(dest('dist'));
// }

// watch(['src/**/*.html'], this.default);