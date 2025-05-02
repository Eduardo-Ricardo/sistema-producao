const fs = require("fs");
const csv = require("csv-parser");

// Função genérica para ler e processar arquivos CSV
function lerArquivoCSV(caminhoArquivo, opcoesOuCallback) {
    if (!fs.existsSync(caminhoArquivo)) {
        throw new Error("Arquivo não encontrado!");
    }

    const resultados = [];
    const opcoes = typeof opcoesOuCallback === "function" ? {} : opcoesOuCallback || {};
    const callback = typeof opcoesOuCallback === "function" ? opcoesOuCallback : null;

    return new Promise((resolve, reject) => {
        fs.createReadStream(caminhoArquivo)
            .pipe(csv(opcoes))
            .on("data", (data) => {
                if (callback) {
                    if (callback(data)) resultados.push(data);
                } else {
                    resultados.push(data);
                }
            })
            .on("end", () => resolve(resultados))
            .on("error", (err) => reject(err));
    });
}

module.exports = {
    lerArquivoCSV
};