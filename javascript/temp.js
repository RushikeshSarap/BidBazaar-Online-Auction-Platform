const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.get('/run-script', (req, res) => {
    exec('node HomePageScript.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(error.message);
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.send(stdout);
    });
});