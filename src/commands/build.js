const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const cManager = require('../core/configManager');

module.exports = async (async, cmd) => {
    const manager = new cManager.ConfigManager();
    await manager.setup();
    const compiler = webpack(manager.config);
    compiler.run((err, stats) => {
        if (!err) {
            compiler.close((closeErr, stats) => {
                console.log(closeErr, '---err---');
            })
        }
    })
}



