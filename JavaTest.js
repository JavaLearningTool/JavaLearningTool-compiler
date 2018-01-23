'use strict';

const { exec } = require('child_process');
let fs = require("fs");

const errorMessage = "Testing failed. Try again later.";

function escapeNewLine(str) {
  str = str.trim();
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
            console.log(`exec error: ${err}`);
            console.log(`STDOUT: ${stdout}`);
            console.log(`STDERR: ${stderr}`);
            callback(JSON.stringify({error: stdout}));
            return;
        }

        console.log(`bash STDOUT: ${stdout}`);
        console.log(`bash STDOUT: ${stdout}`);
        callback(escapeNewLine(stdout));
    };

    let makeFileCallback = () => {
        exec('bash ChallengeTest.sh ' + challenge, testCallback);
    };

    // Create sandbox folder where everything is run
    if (fs.existsSync('sandbox')) {
        console.log("Sandbox folder already exists! Oops.");
        callback({error: errorMessage});
        return;
    } else {
        fs.mkdirSync('sandbox');
    }

    // Make the java folder to execute in
    fs.writeFile('sandbox/Test.java', code, function(err) {
        if (err) {
            console.log("Error creating file");
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
            console.log("Queue: ", queue.length);
            if (!processing) {
                runProcess();
            }
        }
    };
}

module.exports = JavaTester;