'use strict';

const { exec } = require('child_process');
let fs = require("fs");

const errorMessage = "Testing failed. Try again later.";

function newLineToBreak(str) {
    return str.replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;")
         .replace(/\n/g, "<br>")
}

function JavaTester() {
    return {
        runProcess: function(code, callback) {
            let testCallback = (err, stdout, stderr) => {
                if (err) {
                    console.log(`exec error: ${err}`);
                    callback(errorMessage);
                    return;
                }

                console.log(`bash STDOUT: ${stdout}`);
                console.log(`bash STDOUT: ${stdout}`);
                callback(newLineToBreak(stdout));
            };

            let makeFileCallback = () => {
                exec('bash ChallengeTest.sh HelloWorld', testCallback);
            };

            // Create sandbox folder where everything is run
            if (fs.existsSync('sandbox')) {
                console.log("Sandbox folder already exists! Oops.");
                callback(errorMessage);
                return;
            } else {
                fs.mkdirSync('sandbox');
            }

            // Make the java folder to execute in
            fs.writeFile('sandbox/Test.java', code, function(err) {
                if (err) {
                    console.log("Error creating file");
                    callback(errorMessage);
                    return;
                }
                // This will run ChallengeTest.sh
                makeFileCallback();
            });
        }
    };
}

module.exports = JavaTester;