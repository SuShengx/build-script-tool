const path = require('path');
const rootDir = process.cwd();

module.exports = async ({ setConfig, registerUserConfig }) => {
    const config = {
        entry: path.resolve(rootDir, './src/index.js'),
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        output: {
            filename: 'index.js',
            path: path.resolve(rootDir, './dist')
        }
    };
    setConfig(config)
    registerUserConfig([
        {
            name: 'entry',
            validation: async (value) => {
                return typeof value === 'string';
            },
            configWebpack: async (defaultConfig, value) => {
                defaultConfig.entry = path.resolve(rootDir, value);
            }
        },
        {
            name: 'outputDir',
            validation: async (value) => {
                return typeof value === 'string';
            },
            configWebpack: async (defaultConfig, value) => {
                defaultConfig.output.path = path.resolve(rootDir, value);
            }
        }
    ]);
}