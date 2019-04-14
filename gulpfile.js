const gulp = require("gulp");
const run = require("gulp-run-command").default;

gulp.task("install-deps", run("npm run install-deps"));

gulp.task("build", run("npm run build"));
gulp.task("start", run("npm run start"));
gulp.task("debug", run("npm run debug"));
gulp.task("watch-run", run("npm run watch"));

gulp.task("deploy", run("npm run deploy"));

gulp.task("watch-build", () => {
  gulp.watch([
    "src/**/*.ts",
    "functions/src/**/*.ts"
  ], ["build"]);
});

gulp.task("build-and-watch", ["build", "watch-build"]);

gulp.task("default", ["build-and-watch"]);