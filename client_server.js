const express = require("express");
const fs = require("fs");
const multer = require("multer");
const upload = multer();
const cors = require("cors");
const fetch = require("node-fetch");
const FormData = require("form-data");

module.exports = {
    startServer: function (callback) {

        const app = express();
        const port = 9090;

        app.post("/api/cuda_response", upload.array(), (req, res) => {
            console.log(req.body.stdOut);
            console.log(req.body.stdErr);

            res.send("thank you");
            process.exit(0);
        });

        app.listen(port, () => { console.log("Waiting for response"); callback(); });
    }
}