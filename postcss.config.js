module.exports = (ctx) => ({
    map: false,
    plugins: [
        require('autoprefixer')(),
        require('cssnano')({ preset: 'default' }),
    ]
})