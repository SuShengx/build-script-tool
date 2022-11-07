

module.exports = async ({ onGetWebpackConfig }) => {
    onGetWebpackConfig((webpackConfig) => {
        if (!webpackConfig.module) webpackConfig.module = {};
        if (!webpackConfig.module.rules) webpackConfig.module.rules = [];
        const xmlRule = {
            test: /^\.xml$/i,
            use: 'xml-loader',
        };
        const tsIndex = webpackConfig.module.rules.findIndex(rule => String(rule.test) === '/\\.ts?$/');
        if (tsIndex > 0) {
            webpackConfig.module.rules.splice(tsIndex - 1, 0, xmlRule);
        } else {
            webpackConfig.module.rules.push(xmlRule);
        }
    })
}