
module.exports = async ({ onGetWebpackConfig }) => {
    onGetWebpackConfig((webpackConfig) => {
        if (!webpackConfig.module) webpackConfig.module = {};
        if (!webpackConfig.module.rules) webpackConfig.module.rules = [];
        const xmlRule = {
            test: /\.(csv|tsv)$/,
            use: 'csv-loader'
        };
        webpackConfig.module.rules.push(xmlRule);

    })
}