const gulp = require("gulp");
const run = require("gulp-run-command").default;

gulp.task("install-deps", run("npm run install-deps"));

gulp.task("start-local", run("npm run start"));
gulp.task("debug-local", run("npm run debug"));
gulp.task("monitor-local", run("npm run monitor"));

gulp.task("deploy", run("npm run deploy"));

gulp.task("build", run("npm run build"));

gulp.task("watch-changes", () => {
  gulp.watch([
    "src/**/*.ts",
    "functions/src/**/*.ts"
  ], ["build"]);
});

gulp.task("default", ["build", "watch-changes"]);