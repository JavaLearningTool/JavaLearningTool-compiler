const { exec } = require('child_process');

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

            exec('echo public class Test {' + code + ' } > Test.java', makeFileCallback);
        }
    };
}

module.exports = JavaTester;