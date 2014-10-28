var gulp = require('gulp')
  , webpack = require('webpack')
  , gulpWebpack = require('gulp-webpack')
  , path = require('path')

gulp.task('webpack', function() {
  return gulp.src('source/javascripts/index.entry.js')
    .pipe(gulpWebpack({
      output: { filename: 'index.js' }
    , resolve: {
        root: [path.join(__dirname, "bower_components")]
      }
    , plugins: [
        new webpack.ResolverPlugin(
          new webpack.ResolverPlugin
            .DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
      ]
    }))
    .pipe(gulp.dest('source/javascripts/dist/'))
});