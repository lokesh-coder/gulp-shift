# gulp-move-snippet [![Build Status](https://travis-ci.org/lokesh-coder/gulp-move.svg?branch=master)](https://travis-ci.org/lokesh-coder/gulp-move)

> My luminous gulp plugin


## Install

```
$ npm install --save-dev gulp-move
```


## Usage

```js
var gulp = require('gulp');
var moveSnippet = require('gulp-move');

gulp.task('default', function () {
	return gulp.src('src/file.ext')
		.pipe(moveSnippet())
		.pipe(gulp.dest('dist'));
});
```
//##shift:hoo test.js

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius vel iste ipsa fugit dolores nihil error eveniet possimus animi sapiente aperiam perferendis expedita tempora reprehenderit dicta doloribus, 
voluptate, itaque eaque.

//##endshift

### moveSnippet(options)

#### options

##### foo

Type: `boolean`  
Default: `false`

Lorem ipsum.

//##shift:secret test.js
------------------
## License
## more on
----------------------
//##endshift

MIT © [](https://github.com/lokesh-coder)
