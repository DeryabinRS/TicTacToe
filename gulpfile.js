"use strict";

const { src, dest, parallel, watch } = require("gulp");
const server = require("browser-sync").create();
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
var sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const webp = require("gulp-webp");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const panini = require("panini");

function html() {
  panini.refresh();
  return src("src/**.html")
    .pipe(
      panini({
        root: "src/",
        layouts: "src/layouts/",
        partials: "src/partials/",
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest("dist"));
}

function styles(){
	return src('src/sass/*.scss')
		.pipe(plumber())
		.pipe(eval('sass')())
		.pipe(concat('style.min.css'))
		.pipe(autoprefixer({overrideBrowdersList:['last 10 version'], grid:true}))
		.pipe(cleancss({ level: { 1:{ specialComments:0 } }/*, format: 'beautify'*/}))
		.pipe(dest('dist/css'))
}

function serve() {
  server.init({
    server: { baseDir: "./dist" },
    notify: false,
    online: true,
  });
}

function scripts() {
  return src("src/js/**.js")
    .pipe(concat("app.min.js"))
    //.pipe(uglify())
    .pipe(dest("dist/js/"));
}

function images() {
  return src("src/images/*")
    .pipe(newer("dist/images/"))
    .pipe(imagemin())
    .pipe(webp())
    .pipe(dest("dist/images/"));
}

function startWatch() {
  watch(["src/**/*.js", "!src/**/*.min.js"], scripts).on(
    "change",
    server.reload
  );
  watch("src/**/*.scss", styles).on("change", server.reload);
  watch("src/**/*.html", html).on("change", server.reload);
}

exports.html = html;
exports.serve = serve;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.startWatch = startWatch;
exports.default = parallel(html, startWatch, serve, scripts, styles, images);
