/*
 * grunt-gcloud-deploy
 * 
 *
 * Copyright (c) 2019 Adam Lapworth
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Imports.
    const spawnSync = require('child_process').spawnSync;

    // Constants.
    const COMMAND_RUN = 'dev_appserver.py {path}';
    const COMMAND_DEPLOY = 'gcloud app deploy -q --project {app} {version} {path}/app.yaml';

    /**
     * Runs GAE command.
     * @param command
     * @param options
     */
    function run(command, options) {
        const hasVersion = (options.hasOwnProperty('version') && options.version != '')

        command = command.replace(/{app}/g, options.application);
        command = command.replace(/{path}/g, options.path);
        command = command.replace(/{version}/g, hasVersion ? '--version ' + options.version : '')

        grunt.log.writeln(command);

        // Run the command.
        const childProcess = spawnSync(command, {
            stdio: 'inherit',
            encoding : 'utf8',
            shell: true
        });

        // Process exit.
        if (childProcess.status === 0) {
            grunt.log.ok('Action executed successfully.');
        } else {
            grunt.log.error('Error executing the action.');
        }

        return childProcess.status;
    }

    /**
     * Grunt task.
     */
    grunt.registerMultiTask('gcloud_deploy', 'Google App Engine GCloud SDK deployment plugin for Grunt.', function () {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
                application: '',
                version: '',
                path: '.',
                asyncOutput: false,
                args: {},
                flags: [],
                stdout: true,
                stdin: true,
                stderr: true
            }),
            done = this.async();

        // Handle the action specified
        switch(this.data.action) {
            case 'run':
                // Run application using gcloud SDK
                run(COMMAND_RUN, options);
                return done();

            case 'deploy':
                // Deploy application using gcloud SDK
                run(COMMAND_DEPLOY, options);
                return done();

            default:
                // No action specified
                grunt.log.writeln('No grunt action specified.');
                return done();
        }
    });
};
