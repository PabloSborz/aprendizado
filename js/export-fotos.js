"use strict";

const fs = require("fs");
const path = require("path");

const caminhoArquivo = process.argv[2];
const extensoesPorTipo = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp"
};

function encerrarComErro(mensagem) {
    console.error(`\n❌ ${mensagem}\n`);
    process.exitCode = 1;
}

function nomeSeguro(nome) {
    return path.basename(nome).replace(/[\\/:*?"<>|]/g, "-");
}

if (!caminhoArquivo) {
    encerrarComErro("Use: node js/export-fotos.js album-entra21-XXXX.json");
} else {
    try {
        const caminhoResolvido = path.resolve(caminhoArquivo);
        const dados = JSON.parse(fs.readFileSync(caminhoResolvido, "utf8"));

        if (!Array.isArray(dados.fotos)) {
            throw new Error("O arquivo não contém uma lista de fotos válida.");
        }

        const pastaDestino = path.resolve(__dirname, "..", "img");
        fs.mkdirSync(pastaDestino, { recursive: true });

        dados.fotos.forEach((foto, indice) => {
            const resultado = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/s.exec(foto.data_url || "");
            if (!resultado) {
                throw new Error(`A foto ${indice + 1} possui dados inválidos.`);
            }

            const tipo = resultado[1];
            const extensao = extensoesPorTipo[tipo];
            const nomeBase = foto.nome ? path.parse(nomeSeguro(foto.nome)).name : `foto-${indice + 1}`;
            const nomeArquivo = `${nomeBase}.${extensao}`;
            const destino = path.join(pastaDestino, nomeArquivo);

            fs.writeFileSync(destino, Buffer.from(resultado[2], "base64"));
            console.log(`✓ ${nomeArquivo}`);
        });

        console.log(`\n✅ ${dados.fotos.length} foto(s) exportada(s) para: ${pastaDestino}\n`);
    } catch (erro) {
        encerrarComErro(erro.message);
    }
}
