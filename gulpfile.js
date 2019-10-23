const gulp = require("gulp");
const run = require("gulp-run-command").default;

gulp.task("install", run("npm run install-libs"));
gulp.task("build", run("npm run build"));

gulp.task("deploy-all", run("npm run deploy-all"));
gulp.task("deploy-development", run("npm run deploy-development"));
gulp.task("deploy-production", run("npm run deploy-production"));

gulp.task("run-test", run("npm run run-test"));
gulp.task("debug-test", run("npm run run-test-debug"));

gulp.task("run-test-continuous", run("npm run run-test-continuous"));
gulp.task("debug-test-continuous", run("npm run debug-test-continuous"));

// build once everytime the sources has been changed
gulp.task("build-continuous", () => {
  gulp.watch([
    "src/**/*.ts",
    "functions/src/**/*.ts"
  ], ["build"]);
});

// build once, after sources was changed and execute after sources was transpiled
gulp.task("build-and-run-continuous", ["build", "build-continuous", "run-test-continuous"]);
gulp.task("build-and-debug-continuous", ["build", "build-continuous", "debug-test-continuous"]);

gulp.task("default", ["build-and-run-continuous"]);