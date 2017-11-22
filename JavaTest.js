const { exec } = require('child_process');

function JavaTester() {
    return {
        runProcess: function(callback) {
            exec('javac *.java', (err, stdout, stderr) => {
                if (err) {
                    console.error(`exec error: ${err}`);
                    return;
                }

                console.log(`javac STDOUT: ${stdout}`);

                exec('java Test', (err, stdout, stderr) => {
                    if (err) {
                        console.error(`exec error: ${err}`);
                        return;
                    }

                    console.log(`java STDOUT: ${stdout}`);
                    callback(stdout);
                });
            });
        }
    };
}

module.exports = JavaTester;