const {
    CopyRspackPlugin,
    ProvidePlugin,
    SwcJsMinimizerRspackPlugin
} = require('@rspack/core');
const path = require('path');

const createBaseConfig = () => ({
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devServer: {
        static: false,
        host: '0.0.0.0',
        port: process.env.PORT || 8361
    },
    devtool: 'cheap-module-source-map',
    module: {
        rules: [
            {
                include: path.resolve('src'),
                test: /\.js$/,
                loader: 'builtin:swc-loader',
                options: {
                    env: {
                        targets: ['last 3 versions', 'Safari >= 8', 'iOS >= 8']
                    }
                }
            },
            {
                test: /\.(css|frag|vert)$/,
                type: 'asset/source'
            }
        ]
    },
    optimization: {
        minimizer: [
            new SwcJsMinimizerRspackPlugin({
                test: /\.min\.js$/
            })
        ]
    }
});

module.exports = [
    {
        ...createBaseConfig(),
        target: 'web',
        entry: {
            playground: './src/playground/playground.js',
            queryPlayground: './src/playground/queryPlayground.js'
        },
        output: {
            clean: true,
            library: {
                type: 'umd'
            },
            path: path.resolve('playground'),
            filename: '[name].js'
        },
        plugins: [
            new ProvidePlugin({
                Buffer: ['buffer', 'Buffer']
            }),
            new CopyRspackPlugin({
                patterns: [
                    {
                        context: path.resolve('src', 'playground'),
                        from: '**/*.{html,css}'
                    }
                ]
            })
        ]
    },
    {
        ...createBaseConfig(),
        target: 'web',
        entry: {
            'scratch-render': './src/index.js',
            'scratch-render.min': './src/index.js'
        },
        output: {
            clean: true,
            library: {
                name: 'ScratchRender',
                type: 'umd'
            },
            path: path.resolve('dist', 'web'),
            filename: '[name].js'
        },
        plugins: [
            new ProvidePlugin({
                Buffer: ['buffer', 'Buffer']
            })
        ]
    },
    {
        ...createBaseConfig(),
        target: 'node',
        entry: {
            'scratch-render': './src/index.js'
        },
        output: {
            clean: true,
            library: {
                type: 'commonjs2'
            },
            path: path.resolve('dist', 'node'),
            filename: '[name].js'
        },
        externalsType: 'commonjs',
        externals: {
            'hull.js': 'hull.js',
            '@turbowarp/scratch-svg-renderer': '@turbowarp/scratch-svg-renderer',
            'twgl.js': 'twgl.js',
            'xml-escape': 'xml-escape'
        }
    }
];
