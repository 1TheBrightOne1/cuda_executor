const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const modes = require("./cuda_modes");
const fetch = require("node-fetch");
const prompt = require("prompt-sync")();

const server = require("./client_server");
const cuda_modes = require("./cuda_modes");

function getFiles(directory, extensions = []) {
    const formData = new FormData();
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    console.log(entries);
    for (let entry of entries) {
        if (!entry.isFile()) {
            continue;
        }

        let extension = entry.name.split(".");
        extension = extension[extension.length - 1];

        if (!extensions.length || extensions.includes(extension)) {
            formData.append(entry.name, fs.readFileSync(path.join(directory, entry.name)));
        }
    }

    console.log(formData);
    return formData;
}

let user = prompt("Username: ");
let password = prompt("Password: ");
let formData = getFiles("./input_files");

server.startServer(()=>fetch("http://localhost:8080/api/cuda_executor", { method: "POST", headers: { "authorization": "basic " + Buffer.from(`${user}:${password}`).toString("base64") }, body: formData }));