const gulp = require("gulp");
const run = require("gulp-run-command").default;

gulp.task("install", run("npm run install-libs"));
gulp.task("build", run("npm run build"));
gulp.task("deploy", run("npm run deploy"));

gulp.task("run-test", run("npm run run-test"));
gulp.task("run-test-debug", run("npm run run-test-debug"));
gulp.task("run-test-continuous", run("npm run run-test-continuous"));

// build once everytime the sources has been changed
gulp.task("build-continuous", () => {
  gulp.watch([
    "src/**/*.ts",
    "functions/src/**/*.ts"
  ], ["build"]);
});

// build once, after sources was changed and execute after sources was transpiled
gulp.task("build-and-run-continuous", ["build", "build-continuous", "run-test-continuous"]);

gulp.task("default", ["build-and-run-continuous"]);