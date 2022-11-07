const _ = require('lodash');
const path = require('path');
const assert = require('assert');
const fs = require('fs');

class ConfigManager {
    constructor() {
        this.config = {};
        this.userConfig = {};
        this._userConfigRegistration = {};
        this._modifyConfigFns = [];
    }
    /**
     * 设置 webpack 配置
     */
    setConfig(config) {
        this.config = config;
    }
    /**
     * 注册 webpack 配置修改函数
     */
    onGetWebPackConfig(fn) {

        this._modifyConfigFns.push(fn);
    }
    /**
     * 注册用户配置
     * @param {*} userConfig 
     */
    registerUserConfig(userConfig) {
        userConfig.forEach(config => {
            const configName = config.name;

            //判断是否已经注册
            if (this._userConfigRegistration[configName]) {
                throw new Error(`[config file]:${configName} already registered in userConfigRegistration`)
            }
            //添加配置的注册信息
            this._userConfigRegistration[configName] = config;
            //如果当前项目的用户配置中不存在该配置项则使用该配置注册时的默认值
            if (_.isUndefined(this._userConfigRegistration[configName]) && Object.prototype.hasOwnProperty.call(config, 'defalutValue')) {
                this.userConfig[configName] = config.defaultValue;
            }

        });

    }
    /**
     * 获取用户配置
     * @returns 
     */
    getUserConfig() {
        const rootDir = process.cwd();
        try {
            let exitsUserConfig = fs.existsSync(path.resolve(rootDir, './build.json'));
            if (exitsUserConfig) {
                this.userConfig = require(path.resolve(rootDir, './build.json'));
                console.log(this.userConfig, '----userConfig')
            } else {
                console.log('Config error: build.json is not exist');
            }
        } catch (error) {
            console.log('Config error: build.json is not exist');
            return;
        }
    }
    /**
     * 执行注册用户配置
     */
    async runUserConfig() {
        for (const configInfoKey in this.userConfig) {
            if (configInfoKey === 'plugins') continue;
            const configInfo = this._userConfigRegistration[configInfoKey];
            if (!configInfo) {
                throw new Error(`[Config file]: Config key ${configInfoKey} is not supported`);
            }
            const { name, validation } = configInfo;
            const configValue = this.userConfig[name];
            if (validation) {
                const validationResult = await validation(configValue);
                assert(validationResult, `${name} did not pass validtion, result:${validationResult}`)
            };
            //配置更新到默认webpack 配置
            if (configInfo.configWebpack) {
                await configInfo.configWebpack(this.config, configValue);
            }
        }
    }
    /**
     * 执行插件
     */
    async runPlugins() {

        for (const plugin of this.userConfig.plugins) {
            const pluginPath = require.resolve(path.resolve(process.cwd(), plugin));
            const pluginFn = require(pluginPath);
            await pluginFn({
                setConfig: this.setConfig.bind(this),
                registerUserConfig: this.registerUserConfig.bind(this),
                onGetWebpackConfig: this.onGetWebPackConfig.bind(this),
            })
        }
    }
    /**
     * 执行webpack 配置修改函数
     */
    async runWebpackModifyFns() {
        this._modifyConfigFns.forEach(fn => fn(this.config));
    }

    /**
     * webpack 配置初始化
     */
    async setup() {
        this.getUserConfig();

        await this.runPlugins();
        await this.runUserConfig();
        await this.runWebpackModifyFns();
    }
}

module.exports = {
    ConfigManager
}