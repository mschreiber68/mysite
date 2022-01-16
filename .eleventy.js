module.exports = function(eleventyConfig) {

    // Allows rendering code in HTML code blocks.
    eleventyConfig.addPassthroughCopy({
        '_includes/css': 'css',
        '_includes/js': 'js',
    });

    // Return your Object options:
    return {
        dir: {
            output: "docs"
        }
    }
};