https://github.com/semiromid/compress-images/blob/master/example/Manual.txt


﻿You need do few steps:


[1] Open console and to run command:
git clone git@github.com:semiromid/compress-images.git


[2] Go to in folder "compress-images" and delete all folders and files except "example"


[3] Go to in folder "example".


[4] Open console in folder "example" and run the command in the console: 
npm install compress-images --save


[5] "npm install pngquant-bin --save" (It does not work properly on some OS). If you get error, you need edit './compress_images.js' and replace 'pngquant' on other PNG engine, as example on "pngcrush".
{png: {engine: 'pngcrush', command: false}},


[6] "npm install gifsicle --save" (It does not work properly on some OS). If you get error, you need edit './compress_images.js' and replace 'gifsicle' on other GIF engine, as example "gif2webp"
{gif: {engine: 'gif2webp', command: false}}


[7] 
	a) You can open console and to input command and press enter "node compress_images.js" 
  	or 
	b) double-click on the file "minify_Img.bat".