# gulp-tfs-commander

> Perform tfs commands on files through gulp. Credit to [heatmonkey](https://github.com/heatmonkey/gulp-tfs) for the original plugin.

## Information

<table>
<tr> 
<td>Package</td><td>gulp-tfs-commander</td>
</tr>
<tr>
<td>Description</td>
<td>Set Edit or Lock for TFS files that are accessed from gulp (gulpjs.com)</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.10</td>
</tr>
<tr>
<td>Gulp Version</td>
<td>3.x</td>
</tr>
</table>

## Usage

If you need to mark your files as edited or locked in TFS when gulp does something to them, this is your plugin.

#### Install

```bash
$ npm install gulp-tfs-commander --save
```

## Example

```js
var gulp = require('gulp');
var gulpTfs = require('gulp-tfs-commander');

gulp.task('foo', function () {

	return gulp.src(['./package.json'])
		.pipe(gulpTfs({ command: 'edit', params: { lock: 'none' } }))
		.pipe(gulp.dest('./'));
});


```


## LICENSE

(MIT License)

Copyright (c) 2014 James O'Donnell<heatmonkey@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
