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
 *  DEFINE ROOT DIR FOR ASSETS
 */
const ROOT_DESTINATION = "./public";









/**
 *  @STEP2
 *  DEFINE PATH TARGET FILES TO MINIFY
 *  !NOTE: take note of the naming pattern
 */

// TARGET DESTINATION
const ouputDir_html = './';
const ouputDir_css = `${ROOT_DESTINATION}/css`;
const ouputDir_js = `${ROOT_DESTINATION}/js'`;
const ouputDir_image = `${ROOT_DESTINATION}/images`;







/**
 *  @STEP3
 *  DEFINE DEST PATH FOR OUTPUT FILE
 *  !NOTE: take note of the naming pattern
 */

/**
 * !JAVASCRIPT CSS HTML
 * TARGET FILES (RELATIVE PATH) TO MINIFY (ARRAY)
 *  *1st - file to minify (js, html, css)
 *  *2nd - filename of the output file
 *  *3rd - extenstion of the output file
 */
const assets = [
    [`${ROOT_DESTINATION}/css/style.css`, '/style.min', 'css']
]


/**
 * !IMAGES
 * TARGET FILES (RELATIVE PATH) TO MINIFY (ARRAY)
 */
const images = `${ROOT_DESTINATION}/images/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}`;

































// ===========================================================================
// MINIFICATION PROCESS
// NOTE:    Do not touch the code below unless you want to change something
//          on the minification process
// ===========================================================================


/**
 * CREATE ROOT DIR FOR ASSETS
 * ONLY IF NOT EXISTING
 */
fs.access(ROOT_DESTINATION, function (err) {
    if (err && err.code === 'ENOENT') {
        fs.mkdir(ROOT_DESTINATION);
        console.log(`✓ Root Destination: '${ROOT_DESTINATION}' not existing, created instead`)
        return null;
    }
    console.log(`✓ Root Destination: '${ROOT_DESTINATION}' existing`)
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
                case 'html': destination = ouputDir_html; break;
                case 'css': destination = ouputDir_css; break;
                case 'js': destination = ouputDir_js; break;
                default: destination = false; break;
            }

            if (!destination) {
                console.log(`[ERROR: File Not Supported/Not Minified]: ${filePath}`)
            }

            const outputFile = `${destination}${fileOutputName}.${extenstion}`;

            // create directory if not existing
            fs.access(destination, function (err) {
                if (err && err.code === 'ENOENT') {
                    fs.mkdir(destination);
                    console.log(`✓ Target Destination: '${destination}' not existing, created instead`)
                    return null;
                }
            });

            console.log(`✓ Succesfully Minified : '${destination}${fileOutputName}.${extenstion}'`)

            fs.writeFileSync(outputFile, minifiedBuffer);
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