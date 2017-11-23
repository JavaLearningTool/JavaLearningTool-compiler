'use strict';

const { exec } = require('child_process');
let fs = require("fs");

function JavaTester() {
    return {
        runProcess: function(code, callback) {
            let runCallback = (err, stdout, stderr) => {
                if (err) {
                    console.error(`exec error: ${err}`);
                    return;
                }

                console.log(`java STDOUT: ${stdout}`);
                callback(stdout);
            };
            let compileCallback = (err, stdout, stderr) => {
                if (err) {
                    console.error(`exec error: ${err}`);
                    return;
                }

                console.log(`javac STDOUT: ${stdout}`);

                exec('java Test', runCallback);
            };
            let makeFileCallback = (err, stdout, stderr) => {
                if (err) {
                    console.error(`exec error: ${err}`);
                    return;
                }

                console.log(`dir STDOUT: ${stdout}`);

                exec('javac *.java', compileCallback);
            };

            fs.writeFile('Test.java', "public class Test { " + code + "}", function(err) {
                if (err) {
                    console.log("Error creating file");
                    return;
                }
                makeFileCallback();
            });
        }
    };
}

module.exports = JavaTester;