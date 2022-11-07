#!/usr/local/bin/node
const { program } = require('commander');
const buildF = require('../src/commands/build');

(async () => {
    program.command("build").description('build project').action(buildF)
    const proc = program.runningCommand;
    if (proc) {
        proc.on("close", process.exit.bind(process));
        proc.on('error', () => {
            process.exit(1);
        })
    }
    program.parse(process.argv);
    const subCmd = program.args[0];
    if (!subCmd) {
        program.help();
    }
})();