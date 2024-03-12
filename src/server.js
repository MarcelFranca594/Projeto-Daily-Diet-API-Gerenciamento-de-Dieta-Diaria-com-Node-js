"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var process_1 = require("process");
app_1.app
    .listen({
    port: process_1.env.PORT, // Usa a porta definida na variável de ambiente PORT
})
    .then(function () {
    console.log('HTTP Server Running!');
});
