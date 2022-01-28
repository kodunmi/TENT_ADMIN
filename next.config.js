const path = require('path')
const withImages = require('next-images');
const withSass = require('@zeit/next-sass');


module.exports = withImages();
module.exports = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
}