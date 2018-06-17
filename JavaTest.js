"use strict";

const { exec } = require("child_process");
const fs = require("fs");

const logger = require("./logger");

const errorMessage = "Testing failed. Try again later.";

function escapeForJson(str) {
    str = str.trim();
    str = str.replace(/\t/g, "\\t");
    str = str.replace(/\f/g, "\\f");
    str = str.replace(/\r/g, "\\r");
    return str.replace(/\n/g, "\\n");
}

function escapeErrorMessage(msg) {
    msg = msg.trim();
    //msg = msg.replace(/\t/g, "\\t");
    msg = msg.replace(/\f/g, "");
    msg = msg.replace(/\r/g, "");
    return msg; //.replace(/\n/g, "\\n");
}

function newLineToBreak(str) {
    str = str.trim();
    return str.replace(/\n/g, "<br>");
}

function runProcess() {
    processing = true;
    // Get the next challenge to run from the queue
    let temp = queue.splice(0, 1)[0];

    let classes = temp.classes;
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
            logger.info(`exec error: ${err}`);
            logger.info(`STDOUT: ${stdout}`);
            logger.info(`STDERR: ${stderr}`);
            callback(JSON.stringify({ error: escapeErrorMessage(stdout) }));
            return;
        }

        logger.info(`bash STDOUT: ${stdout}`);
        callback(escapeForJson(stdout));
    };

    // Delete sandbox if it still exists
    if (fs.existsSync("sandbox")) {
        fs.rmdirSync("sandbox");
    }

    // Create sandbox folder where everything is run
    fs.mkdirSync("sandbox");

    // Make java files
    try {
        classes.forEach(cls => {
            fs.writeFileSync("sandbox/" + cls.name + ".java", cls.code);
        });
    } catch (err) {
        logger.error("Error creating Java files.", err);
        callback({ error: errorMessage });
        return;
    }

    // Run the shell script that handles creating and running the challenge tester
    exec("bash ./scripts/ChallengeTest.sh " + challenge, testCallback);
}

let queue = [];
let processing = false;

function JavaTester() {
    return {
        addProcess(classes, challenge, callback) {
            queue.push({ classes, challenge, callback });
            logger.debug("Queue: ", queue.length);
            if (queue.length > 2) {
                logger.warn("Compile queue is " + queue.length + " tests long.");
            }
            if (!processing) {
                runProcess();
            }
        }
    };
}

module.exports = JavaTester;
