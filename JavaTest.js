'use strict';

const { exec } = require('child_process');
const fs = require("fs");

const logger = require('./logger');

const errorMessage = "Testing failed. Try again later.";

function escapeForJson(str) {
  str = str.trim();
  str = str.replace(/\t/g, "\\t");
  str = str.replace(/\f/g, "\\f");
  str = str.replace(/\r/g, "\\r");
  return str.replace(/\n/g, "\\n");
}

function newLineToBreak(str) {
    str = str.trim();
    return str.replace(/\n/g, "<br>");
}

function runProcess() {

    processing = true;
    let temp = queue.splice(0, 1)[0];

    let code = temp.code;
    let challenge = temp.challenge;
    let finalCallback = temp.callback;

    let callback = function(obj) {
        processing = false;
        finalCallback(obj);
        if (queue.length > 0) {
            runProcess();
        }
    };

    let testCallback = (err, stdout, stderr) => {
        if (err) {
            logger.error(`exec error: ${err}`);
            logger.error(`STDOUT: ${stdout}`);
            logger.error(`STDERR: ${stderr}`);
            callback(JSON.stringify({error: stdout}));
            return;
        }

        logger.info(`bash STDOUT: ${stdout}`);
        callback(escapeForJson(stdout));
    };

    let makeFileCallback = () => {
        exec('bash ChallengeTest.sh ' + challenge, testCallback);
    };

    // Delete sandbox if it still exists
    if (fs.existsSync('sandbox')) {
        fs.unlinkSync('sandbox');
    }

    // Create sandbox folder where everything is run
    fs.mkdirSync('sandbox');

    // Make the java folder to execute in
    fs.writeFile('sandbox/Test.java', code, function(err) {
        if (err) {
            logger.error("Error creating Test.java.");
            callback({error: errorMessage});
            return;
        }
        // This will run ChallengeTest.sh
        makeFileCallback();
    });
}

let queue = [];
let processing = false;

function JavaTester() {
    return {
        addProcess(code, challenge, callback) {
            queue.push({ code, challenge, callback });
            logger.debug("Queue: ", queue.length);
            if (!processing) {
                runProcess();
            }
        }
    };
}

module.exports = JavaTester;