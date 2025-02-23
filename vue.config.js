const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

const target = {
    essWebapi: 'http://192.168.1.101:8110', // 现在 开发环境 地址
    yj: 'http://192.168.5.23:8080',
    ldm: 'http://192.168.1.12:8080',
}

module.exports = {
    devServer: {
        open: true,
        host: '0.0.0.0',
        port: '8006',
        https: false,
        hotOnly: false,
        disableHostCheck: true,
        proxy: {
            '/api': {
                // target: 'https://test1-mcc.cdcerp.cn/',
                // target: 'https://test-ess.cdcerp.cn/',
                // target: 'https://dev-ess-inner.cdcerp.cn/api', // 原开发服务地址
                target: target.ldm, // 现在 开发环境 地址
                // target: 'https://sh-ess-inner.cdcerp.cn/api',
                logLevel: "debug", // cmd 控制台可以看到具体的代理地址
                changOrigin: true,
                // pathRewrite : {
                //     '/api' : ''
                // }
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
