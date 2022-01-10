module.exports = function(eleventyConfig) {

    // Allows rendering code in HTML code blocks.
    eleventyConfig.addPassthroughCopy({
        '_includes/webComponents/js': 'webcomponents/js',
    });

    // Return your Object options:
    return {
        dir: {
            output: "docs"
        }
    }
};