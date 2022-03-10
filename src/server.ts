import { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';

const Express = require('express')

const app    = Express();
const http   = require("http");
const server = http.createServer(app);
const io     = new Server(server);
const fs     = require('fs');

function pegarDataAtual() {
    var dataAtual = new Date();
    var dia       = (dataAtual.getDate()<10 ? '0' : '') + dataAtual.getDate();
    var mes       = ((dataAtual.getMonth() + 1)<10 ? '0' : '') + (dataAtual.getMonth() + 1);
    var ano       = dataAtual.getFullYear();
    var hora      = (dataAtual.getHours()<10 ? '0' : '') + dataAtual.getHours();
    var minuto    = (dataAtual.getMinutes()<10 ? '0' : '') + dataAtual.getMinutes();
    var segundo   = (dataAtual.getSeconds()<10 ? '0' : '') + dataAtual.getSeconds();

    var dataFormatada = dia + "/" + mes + "/" + ano + " " + hora + ":" + minuto + ":" + segundo;
    return dataFormatada;
}

app.get('/', (req, res) => {
    var arquivo = "";

    if (req.url == "/") {
        arquivo = __dirname + '/public/index.html';
    } else {
        arquivo = __dirname + req.url;
    }

    fs.readFile(arquivo,
        function (err, data) {
            if (err) {
                res.writeHead(404);
                return res.end('Página ou arquivo não encontrados');
            }

            res.writeHead(200);
            res.end(data);
        }
    );
});

io.on("connection", function(socket) {
    socket.on("enviar mensagem", function(mensagem_enviada, callback) {
        mensagem_enviada = "[ " + pegarDataAtual() + " ]: " + mensagem_enviada;

        io.sockets.emit("atualizar mensagens", mensagem_enviada);
        callback();
    });
});

server.listen(3000, () => {
    console.log("Server is running");
});