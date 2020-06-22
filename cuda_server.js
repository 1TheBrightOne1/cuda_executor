const fs = require("fs");
const express = require("express");
const multer = require('multer');
const upload = multer();
const child_process = require("child_process");
const cors = require("cors");
const crypto = require("crypto");
const { default: fetch } = require("node-fetch");

const app = express();

let port = 8080

if (process.argv[2] !== undefined) {
    port = Number.parseInt(port);
}

let authorization = function(req, res, next) {
    let authHeader = Buffer.from(req.headers["authorization"].split(" ")[1], "base64").toString();
    const hash = crypto.createHash("sha512");

    hash.update(authHeader);
    output = hash.digest("hex");
    let expected = fs.readFileSync("./.hash");
    if (expected.toString() === output) {
        console.log("authorized");
        next();
        return;
    }
    console.log("rejected");
    res.status(403).send("Unauthorized");
}

app.use(cors());
app.use(authorization);

app.get("/test", (_,res)=>res.send("success"));

app.post("/api/cuda_executor", upload.any(), (req, res) => {
    console.log(req.files);
    for (let file of req.files) {
        fs.writeFile(`./received_files/${file.originalname}`, file.buffer, err=>console.log(err));
    }
    res.send("hello");
    //fetch("http://localhost/api/cuda_response", {method: "POST", body: "thank you"});
});

app.listen(port, () => console.log(`Listening on: ${port}`));