const path = require('path');

const config = {
    devServer: {
        host: 'localhost'
    },

    publicPath: '',

    chainWebpack:  config => {
        config
            .plugin('html')
            .tap(args => {
                var options = args[0];

                options.inject = false;

                return args;
            });

        // Disable splitting the file into multiple chunks
        config.optimization.delete('splitChunks');

        for (const key of ['vue-modules', 'vue', 'normal-modules', 'normal']) {
            config.module.rule('scss').oneOf(key)
                .use('resolve-url-loader')
                .after('css-loader')
                    .loader('resolve-url-loader')
                    .end()
                .end()
        }
    },
    

    configureWebpack: {
        output: {
            // Rename the generated javascript file and move it from dist/js to dist
            filename: 'scripts.js'
        }
    },

    css: {
        sourceMap: true,
    },

};

module.exports = config;