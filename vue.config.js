const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const SentryWebpackPlugin = require('@sentry/webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = {
    devServer: {
        open: true,
        port: '8006',
        https: false,
        hotOnly: false,
        disableHostCheck: true,
        proxy: {
            '/api': {
                // target: 'https://test1-mcc.cdcerp.cn/',
                // target: 'https://test-ess.cdcerp.cn/',
                // target: 'https://dev-ess-inner.cdcerp.cn/api', // 原开发服务地址
                // target: 'http://192.168.1.101:8110/api', // 现在 开发环境 地址
                // target: 'http://192.168.5.44:8110/api', // wzl
                target: 'http://hf-ess-inner.cdcerp.cn/api', // 现在 测试环境 地址
                // target: 'https://sh-ess-inner.cdcerp.cn/api',
                logLevel: "debug", // cmd 控制台可以看到具体的代理地址
                changOrigin: true,
                pathRewrite : {
                    '/api' : ''
                }
            }
        }
    },
    transpileDependencies: ['@dtop'],
    pages: {
        index: {
            // page 的入口
            entry: 'src/main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'MCC冷链监控'
        },
        mobile: {
            // page 的入口
            entry: 'src/mobile/main.js',
            // 模板来源
            template: 'public/mobile.html',
            // 在 dist/index.html 的输出
            filename: 'mobile.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'MCC冷链监控'
        }
    },
    configureWebpack: {
        // plugins: [
        //     new SentryWebpackPlugin({
        //         include: './dist/static/map',
        //         ignoreFile: '.sentrycliignore',
        //         ignore: ['node_modules'],
        //         configFile: 'sentry.properties'
        //     }),
        //     new CopyWebpackPlugin([
        //         {
        //             from: path.resolve(__dirname, 'static'),
        //             to: 'static',
        //             ignore: ['.*']
        //         }
        //     ])
        // ]
    }
};
