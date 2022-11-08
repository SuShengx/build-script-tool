# 项目介绍
 本项目主要功能是可配置的打包脚手架,统一配置公司所有项目的打包脚手架， 比如在公司有很多项目 可能项目和项目之间的依赖不一样，比如a项目需要xml-loader b项目需要ts-loader

# 环境依赖
```
node > v16.16.0
npm  > v8.1.0
```

# 项目目录结构
```
├── READ.md
├── bin                   执行文件
│   └── build-scripts.js
├── demo                  build.json为用户配置文件 build-plugin-base基础配置插件 build-plugin-csv单独的配置插件
│   ├── build-plugin-base
│   │   └── index.js
│   ├── build-plugin-csv
│   │   └── index.js
│   ├── build-plugin-xml
│   │   └── index.js
│   └── build.json
├── index.js
├── package-lock.json
├── package.json
├── src
│   ├── commands              build配置构建入口文件
│   │   └── build.js
│   ├── core                  配置文件整合
│   │   └── configManager.js
│   ├── index.js
│   └── util
│       ├── index.less
│       ├── index.ts
│       ├── index.xml
│       └── test.csv
└── tsconfig.json
```

# 使用说明

1.首先在项目的根目录下面创建 build.json文件
 ```
    {
      "entry": "***",
      "plugins": [
         "***",
         "***",
         "***"
       ],
       ....
    }
 ```
 2.项目根目录下面添加基础配置插件 
     比如在项目目录下面创建  build-plugin-base/index.js
```

const path = require('path');
const rootDir = process.cwd();
//导出一个函数
// setConfig 设置配置文件 registerUserConfig 注册用户的自定义配置 onGetWebpackConfig 获取webpackConfig
// setConfig registerUserConfig参数的案列
module.exports = async ({ setConfig, registerUserConfig, onGetWebpackConfig }) => {
    //基础配置文件
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
    //调用脚手架提供的setConfig函数 设置接触配置
    setConfig(config)
    //注册用户的自定义配置 比如属性，值的校验函数，合并值的函数
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

//onGetWebpackConfig参数的案列
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
```

3.以上配置结束后 修改项目的package.json 
 ```
  "scripts": {
    "build": "build-script build",
  },
 ```

 # 脚手架的执行流程(项目中有执行流程图)
   * 1.执行构建命令
   * 2.初始化配置管理类 configManager
   * 3.获取项目用户配置build.json
   * 4.依次执行用户配置插件
   * 5.校验用户配置合法性
   * 6.合并用户配置和默认配置
   * 7.依次执行插件webpack配置调用回调函数 修改配置
   * 8.获取最终webpack配置
   * 9.执行webpack 
