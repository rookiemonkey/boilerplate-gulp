const fs = require('fs');
const minify = require('minify');
const compress_images = require("compress-images")

/**
 * !PATHS ARE RELATIVE TO THIS FILE UNLESS
 * !RECOMMENDED TO PUT THIS FILE ON ROOT DIR
 */



// ===========================================================================
// VARIABLES
// ===========================================================================

/**
 *  @STEP1
 *  DEFINE OUTPUT DESTINATION PATH
 *  !NOTE: take note of the naming pattern
 */

// TARGET DESTINATION
const outputDir_main = './dist';
const outputDir_sub = '/assets'; // ! eg: ./dist/assets
const outputDir_html = `${outputDir_main}`;
const outputDir_css = `${outputDir_main}${outputDir_sub}/css`;
const outputDir_js = `${outputDir_main}${outputDir_sub}/js`;
const outputDir_image = `${outputDir_main}${outputDir_sub}/images`;







/**
 *  @STEP2
 *  DEFINE DEST PATH FOR OUTPUT FILE
 *  !NOTE: take note of the naming pattern
 */

/**
 * !JAVASCRIPT CSS HTML
 * TARGET FILES (RELATIVE PATH) TO MINIFY (ARRAY)
 *  *1st - file to minify (js, html, css)
 *  *2nd - filename of the output file
 *  *3rd - extenstion of the output file
 * 
 *  * const assets = [
 *  *    [`./index.html`,           '/index',   'html'],
 *  *    [`./assets/css/style.css`, '/style',   'css'],
 *  *    [`./assets/js/app.js`,     '/app',     'js'],
 *  *    [`./assets/js/lib.js`,     '/lib',     'js']
 *  *]
 */
const assets = [
    [`./index.html`, '/index', 'html'],
    [`./assets/css/style.css`, '/style', 'css'],
    [`./assets/js/app.js`, '/app', 'js'],
    [`./assets/js/lib.js`, '/lib', 'js']
]

































// ===========================================================================
// MINIFICATION PROCESS
// NOTE:    Do not touch the code below unless you want to change something
//          on the minification process
// ===========================================================================


/**
 * !CREATE ROOT & SUB DIR FOR ASSETS ONLY IF NOT EXISTING
 */
fs.access(outputDir_main, function (err) {
    if (err && err.code === 'ENOENT') {
        fs.mkdir(outputDir_main, function () {
            console.log(`✓ OUTPUT Root Destination: '${outputDir_main}' not existing, created instead`)
        });
    }
});

fs.access(`${outputDir_main}${outputDir_sub}`, function (err) {
    if (err && err.code === 'ENOENT') {
        fs.mkdir(`${outputDir_main}${outputDir_sub}`, function () {
            console.log(`✓ OUTPUT Sub Destination: '${outputDir_main}${outputDir_sub}' not existing, created instead`)
        });
    }
});





/**
 * !JS/CSS MINIFICATION OPTIONS
 */
const options = {
    html: {
        removeAttributeQuotes: false,
        removeComments: true,
        removeCDATASectionsFromCDATA: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeEmptyElements: false,
        removeOptionalTags: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true,
    },
    css: { compatibility: '*' },
    js: { ecma: 5 },
}


/**
 * !JS/CSS MINIFICATION PROCESS
 */
assets.forEach(asset => {

    const [filePath, fileOutputName, extenstion] = asset;

    if (!fs.existsSync(filePath)) {
        return new Error(`[ERROR: File Not Existing]: ${filePath}`)
    }

    minify(filePath, options)

        .then(minifiedBuffer => {
            let destination;

            switch (extenstion) {
                case 'html': destination = outputDir_html; break;
                case 'css': destination = outputDir_css; break;
                case 'js': destination = outputDir_js; break;
                default: destination = false; break;
            }

            if (!destination) {
                console.log(`[ERROR: File Not Supported/Not Minified]: ${filePath}`)
            }

            const outputFile = `${destination}${fileOutputName}.${extenstion}`;

            fs.access(destination, function (error) {

                // create directory if not existing
                if (error && error.code === 'ENOENT') {
                    fs.mkdir(destination, function () {
                        console.log(`✓ Target Destination: '${destination}' not existing, created instead`)

                        console.log(`✓ Succesfully Minified : '${destination}${fileOutputName}.${extenstion}'`)

                        fs.writeFileSync(outputFile, minifiedBuffer);
                    });
                }

                else {
                    console.log(`✓ Succesfully Minified : '${destination}${fileOutputName}.${extenstion}'`)

                    fs.writeFileSync(outputFile, minifiedBuffer);
                }
            });
        })

        .catch(error => console.log(error));
})






/**
 * !IMAGE MINIFICATION PROCESS
 * !WARNING: not working properly
 */
// compress_images(
//     images,

//     dist_image,

//     {
//         compress_force: true,
//         statistic: true,
//         autoupdate: true
//     },

//     false,

//     {
//         jpg: {
//             engine: "mozjpeg",
//             command: ["-quality", "60", '--ext=".min.jpg"']
//         }
//     },
//     {
//         png: {
//             engine: "pngquant",
//             command: ["--quality=20-50", "-o", '--ext=".min.png"']
//         }
//     },
//     {
//         svg: {
//             engine: "svgo",
//             command: "--multipass"
//         }
//     },
//     {
//         gif: {
//             engine: "gifsicle",
//             command: ["--colors", "64", "--use-col=web", '--ext=".min.gif"']
//         }
//     },

//     function (error, completed, statistic) {
//         console.log("-------------");
//         console.log(error);
//         console.log(completed);
//         console.log(statistic);
//         console.log("-------------");
//     }
// );