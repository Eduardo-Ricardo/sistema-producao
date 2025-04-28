const fs = require("fs");
const { get } = require("http");
const path = require("path");
const csv = require("csv-parser");

// Caminho da pasta "data" e arquivos
const pastaDados = path.join(__dirname, "../data");
const machineMapPath = path.join(pastaDados, "machineMap.json");
const lotesRemessasPath = path.join(pastaDados, "lotesRemessas.json");

// Garante que a pasta "data" exista
function garantirPastaDados() {
    if (!fs.existsSync(pastaDados)) {
        console.log("[LOG] Pasta 'data' não encontrada. Criando...");
        fs.mkdirSync(pastaDados, { recursive: true });
    } else{
        return true; // Retorna true para indicar que a pasta já existe
    }
}

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

// Função para adicionar um registro de produção
function adicionarProducao(req, res) {
    garantirPastaDados();

    const { employeeName, employeeRole, startTime, endTime, productionCount, productionDate, tipoEntrada, lotes } = req.body;

    console.log("[LOG] Dados recebidos para registro:", req.body);

    if (!employeeName || !employeeRole || !productionCount || !productionDate) {
        return res.status(400).json({ error: "Preencha os campos obrigatórios!" });
    }

    let linha;
    if (tipoEntrada === "lote") {
        // Se for entrada por lotes, registra os códigos dos lotes na linha
        const lotesCodigos = lotes.map(lote => `${lote.tamanho}${lote.numero}`).join("+");
        linha = `${employeeName},${employeeRole},${startTime},${endTime},${lotesCodigos},${productionDate}\n`;
    } else {
        // Se for entrada por quantidade, registra normalmente
        linha = `${employeeName},${employeeRole},${startTime},${endTime},${productionCount},${productionDate}\n`;
    }

    const nomeArquivo = `${new Date().getFullYear()}.csv`;
    const caminhoArquivo = path.join(pastaDados, nomeArquivo);

    try {
        fs.appendFileSync(caminhoArquivo, linha);
        console.log("[LOG] Produção registrada com sucesso.");
        
        // Se foi registrado por lotes, atualiza as quantidades nos lotes
        if (tipoEntrada === "lote" && lotes) {
            atualizarQuantidadesLotes(lotes);
        }

        res.json({ message: "Produção registrada com sucesso!" });
    } catch (error) {
        console.error("[ERRO] Falha ao salvar os dados no arquivo:", error);
        res.status(500).json({ error: "Erro ao salvar os dados!" });
    }
}

// Função auxiliar para atualizar as quantidades dos lotes após uso
function atualizarQuantidadesLotes(lotesUsados) {
    console.log("[LOG] Atualizando quantidades dos lotes após uso...");

    try {
        const lotesRemessas = JSON.parse(fs.readFileSync(lotesRemessasPath, "utf8"));
        let atualizou = false;

        lotesRemessas.remessas.forEach(remessa => {
            if (remessa.lotes) {
                remessa.lotes.forEach(lote => {
                    const loteUsado = lotesUsados.find(l => 
                        l.tamanho === lote.tamanho && 
                        l.numero === lote.numero
                    );
                    
                    if (loteUsado) {
                        lote.quantidade = Math.max(0, lote.quantidade - loteUsado.quantidade);
                        atualizou = true;
                    }
                });
            }
        });

        if (atualizou) {
            fs.writeFileSync(lotesRemessasPath, JSON.stringify(lotesRemessas, null, 2));
            console.log("[LOG] Quantidades dos lotes atualizadas com sucesso.");
        }
    } catch (error) {
        console.error("[ERRO] Falha ao atualizar quantidades dos lotes:", error);
    }
}

// Função para carregar o último registro de um funcionário
function carregarUltimoRegistro(req, res) {
    const { employeeName } = req.query;

    if (!employeeName) {
        return res.status(400).json({ error: "O nome do funcionário é obrigatório!" });
    }

    const nomeArquivo = `${new Date().getFullYear()}.csv`;
    const caminhoArquivo = path.join(pastaDados, nomeArquivo);

    if (!fs.existsSync(caminhoArquivo)) {
        return res.status(404).json({ error: "Nenhum registro encontrado!" });
    }

    try {
        const dados = fs.readFileSync(caminhoArquivo, "utf-8");
        const linhas = dados.split("\n").filter(linha => linha.trim() !== "");
        const registros = linhas.map(linha => {
            const [employeeName, employeeRole, startTime, endTime, productionCount, productionDate] = linha.split(",");
            return { employeeName, employeeRole, startTime, endTime, productionCount, productionDate };
        }).filter(registro => registro.employeeName === employeeName);

        if (registros.length === 0) {
            return res.status(404).json({ error: "Nenhum registro encontrado para o funcionário!" });
        }

        res.json(registros[registros.length - 1]);
    } catch (error) {
        console.error("[ERRO] Falha ao ler o arquivo:", error);
        res.status(500).json({ error: "Erro ao ler o arquivo de produção!" });
    }
}

// Função para salvar o machineMap
function setMachineMap(req, res) {
    console.log("[LOG] Iniciando salvamento do machineMap...");

    garantirPastaDados();

    const machineMap = req.body;
    console.log("[LOG] Dados recebidos para o machineMap:", machineMap);

    // Validar a estrutura do machineMap
    const estruturaBasica = [
        "1_Frente",
        "2_Traseira",
        "3_Montagem",
        "4_Bolso_Lateral",
        "5_Costura_Interna",
        "6_Barras",
        "7_Cos_Elastico",
        "8_Acabamento"
    ];

    // Garantir que todas as seções básicas existam
    const machineMapValidado = { ...machineMap };
    estruturaBasica.forEach(secao => {
        if (!machineMapValidado[secao]) {
            machineMapValidado[secao] = {};
        }
    });

    try {
        fs.writeFileSync(machineMapPath, JSON.stringify(machineMapValidado, null, 2));
        console.log("[LOG] Machine map salvo com sucesso!");
        res.json({ message: "Machine map salvo com sucesso!" });
    } catch (error) {
        console.error("[ERRO] Falha ao salvar o machineMap:", error);
        res.status(500).json({ error: "Erro ao salvar o machineMap!" });
    }
}

// Função para carregar o machineMap
function getMachineMap(req, res) {
    console.log("[LOG] Iniciando carregamento do machineMap...");

    garantirPastaDados();

    console.log("[LOG] Caminho do arquivo machineMap.json:", machineMapPath);

    // Estrutura básica do machineMap
    const estruturaBasica = {
        "1_Frente": {},
        "2_Traseira": {},
        "3_Montagem": {},
        "4_Bolso_Lateral": {},
        "5_Costura_Interna": {},
        "6_Barras": {},
        "7_Cos_Elastico": {},
        "8_Acabamento": {}
    };

    try {
        let machineMap = estruturaBasica;
        
        if (fs.existsSync(machineMapPath)) {
            const dadosArquivo = JSON.parse(fs.readFileSync(machineMapPath, "utf8"));
            
            // Se o arquivo existe mas não está no formato novo, converte
            if (Object.keys(dadosArquivo).length > 0 && !dadosArquivo["1_Frente"]) {
                // Converte o formato antigo para o novo
                Object.entries(dadosArquivo).forEach(([funcao, maquina]) => {
                    // Tenta identificar a seção baseada na função
                    let secaoEncontrada = "1_Frente"; // Default para funções não identificadas
                    
                    const funcaoLower = funcao.toLowerCase();
                    if (funcaoLower.includes("traseira") || funcaoLower.includes("pala traseira")) {
                        secaoEncontrada = "2_Traseira";
                    } else if (funcaoLower.includes("lateral")) {
                        secaoEncontrada = "3_Montagem";
                    } else if (funcaoLower.includes("bolso")) {
                        secaoEncontrada = "4_Bolso_Lateral";
                    } else if (funcaoLower.includes("entreperna")) {
                        secaoEncontrada = "5_Costura_Interna";
                    } else if (funcaoLower.includes("barra")) {
                        secaoEncontrada = "6_Barras";
                    } else if (funcaoLower.includes("cós") || funcaoLower.includes("elastico")) {
                        secaoEncontrada = "7_Cos_Elastico";
                    }
                    
                    machineMap[secaoEncontrada][funcao] = maquina;
                });
                
                // Salva o novo formato
                fs.writeFileSync(machineMapPath, JSON.stringify(machineMap, null, 2));
            } else {
                machineMap = { ...estruturaBasica, ...dadosArquivo };
            }
        } else {
            // Se o arquivo não existe, cria com a estrutura básica
            fs.writeFileSync(machineMapPath, JSON.stringify(estruturaBasica, null, 2));
        }

        console.log("[LOG] Machine map carregado com sucesso:", machineMap);
        res.json(machineMap);
    } catch (error) {
        console.error("[ERRO] Falha ao carregar o machineMap:", error);
        res.status(500).json({ error: "Erro ao carregar o machineMap!" });
    }
}

// Função para listar dados de um funcionário específico
async function listarDadosFuncionario(req, res) {
    console.log("[LOG] Iniciando listagem dos dados do funcionário...");

    const funcionario = req.query.funcionario;
    console.log("[LOG] Nome do funcionário recebido:", funcionario);

    const pastaDados = path.join(__dirname, "../data");
    const nomeArquivo = `${new Date().getFullYear()}.csv`;
    const caminhoArquivo = path.join(pastaDados, nomeArquivo);

    console.log("[LOG] Caminho do arquivo CSV:", caminhoArquivo);

    try {
        const registros = await lerArquivoCSV(caminhoArquivo, { headers: false });
        console.log(`[LOG] Total de registros carregados do arquivo CSV: ${registros.length}`);

        // Função auxiliar para calcular a duração em horas
        function calcularDuracaoEmHoras(inicio, fim) {
            // Se ambos os horários forem 00:00, consideramos como um registro especial
            if (inicio === '00:00' && fim === '00:00') {
                return 1; // Retorna 1 hora como padrão para cálculo de média
            }

            if (!inicio || !fim || inicio === 'N/A' || fim === 'N/A') return 0;
            
            const [horaInicio, minInicio] = inicio.split(':').map(Number);
            const [horaFim, minFim] = fim.split(':').map(Number);
            
            let duracaoEmMinutos = (horaFim * 60 + minFim) - (horaInicio * 60 + minInicio);
            // Se a duração for negativa, assume que passou da meia-noite
            if (duracaoEmMinutos < 0) {
                duracaoEmMinutos += 24 * 60;
            }
            
            return duracaoEmMinutos / 60; // Converte para horas
        }

        // Filtra registros do funcionário e mapeia para o formato desejado
        const registrosMapeados = registros
            .filter((registro) => registro[0] === funcionario)
            .map((registro) => {
                const duracao = calcularDuracaoEmHoras(registro[2], registro[3]);
                return {
                    Data: registro[5] || "N/A",
                    Funcao: registro[1] || "N/A",
                    Inicio: registro[2] || "N/A",
                    Fim: registro[3] || "N/A",
                    Quantidade: parseInt(registro[4], 10) || 0,
                    DuracaoHoras: duracao,
                    RegistroEspecial: registro[2] === '00:00' && registro[3] === '00:00'
                };
            });

        // Extrai as funções únicas
        const funcoesUnicas = [...new Set(registrosMapeados.map(r => r.Funcao))];
        console.log("[LOG] Funções únicas:", funcoesUnicas);

        // Calcula totais e médias por função
        const totaisPorFuncao = funcoesUnicas.map(funcao => {
            const registrosDaFuncao = registrosMapeados.filter(r => r.Funcao === funcao);
            
            // Calcula produção por hora para cada registro, excluindo registros especiais da média
            const producoesHora = registrosDaFuncao
                .filter(r => !r.RegistroEspecial)
                .map(r => ({
                    producaoHora: r.Quantidade / r.DuracaoHoras,
                    quantidade: r.Quantidade,
                    duracao: r.DuracaoHoras
                }));

            const total = registrosDaFuncao.reduce((acc, r) => acc + r.Quantidade, 0);
            const totalHoras = registrosDaFuncao
                .filter(r => !r.RegistroEspecial)
                .reduce((acc, r) => acc + r.DuracaoHoras, 0);
            
            // Média das produções por hora (apenas para registros não especiais)
            const mediaProducaoHora = producoesHora.length > 0 
                ? Math.round(producoesHora.reduce((acc, p) => acc + p.producaoHora, 0) / producoesHora.length)
                : 0;

            return {
                funcao,
                total,
                quantidade_registros: registrosDaFuncao.length,
                registros_sem_tempo: registrosDaFuncao.filter(r => r.RegistroEspecial).length,
                total_horas: Number(totalHoras.toFixed(2)),
                media_por_hora: mediaProducaoHora
            };
        });

        // Agrupa os registros por data
        const registrosAgrupados = {};
        registrosMapeados.forEach((registro) => {
            if (!registrosAgrupados[registro.Data]) {
                registrosAgrupados[registro.Data] = [];
            }
            registrosAgrupados[registro.Data].push(registro);
        });

        // Converte o objeto agrupado em um array e ordena por data
        const registrosFinal = Object.entries(registrosAgrupados).map(([data, registros]) => ({
            data,
            registros: registros.sort((a, b) => a.Inicio.localeCompare(b.Inicio))
        }));

        registrosFinal.sort((a, b) => {
            const [diaA, mesA] = a.data.split('/').map(Number);
            const [diaB, mesB] = b.data.split('/').map(Number);
            return mesA !== mesB ? mesA - mesB : diaA - diaB;
        });

        // Retorna os dados com as funções únicas incluídas
        res.json({
            registros: registrosFinal,
            funcoes: totaisPorFuncao
        });
    } catch (error) {
        console.error("[ERRO] Falha ao listar os dados do funcionário:", error);
        res.status(500).json({ error: "Erro ao listar os dados do funcionário!" });
    }
}

// Função para listar os nomes dos funcionários
async function listarNomesFuncionarios(req, res) {
    console.log("[LOG] Iniciando listagem dos nomes dos funcionários...");

    const pastaDados = path.join(__dirname, "../data");
    const nomeArquivo = `${new Date().getFullYear()}.csv`;
    const caminhoArquivo = path.join(pastaDados, nomeArquivo);

    console.log("[LOG] Caminho do arquivo CSV:", caminhoArquivo);

    try {
        // Lê o arquivo CSV e extrai os registros
        const registros = await lerArquivoCSV(caminhoArquivo, { headers: false }); // Sem cabeçalhos
        console.log(`[LOG] Total de registros carregados do arquivo CSV: ${registros.length}`);

        // Log do primeiro registro para depuração
        if (registros.length > 0) {
            console.log("[LOG] Exemplo de registro carregado:", registros[0]);
        }

        // Extrai os nomes dos funcionários da primeira coluna (índice 0)
        const nomes = [...new Set(registros.map((registro) => registro[0]).filter(nome => nome && nome.trim()))];
        console.log("[LOG] Nomes dos funcionários extraídos e filtrados:", nomes);

        res.json(nomes);
    } catch (error) {
        console.error("[ERRO] Falha ao listar os nomes dos funcionários:", error);
        res.status(500).json({ error: "Erro ao listar os nomes dos funcionários!" });
    }
}

// Função para listar registros de produção
function listarProducao(req, res) {
    garantirPastaDados(); // Garante que a pasta exista antes de acessar o arquivo

    const nomeArquivo = `${new Date().getFullYear()}.csv`;
    const caminhoArquivo = path.join(pastaDados, nomeArquivo);

    console.log("[LOG] Tentando ler o arquivo:", caminhoArquivo);

    if (!fs.existsSync(caminhoArquivo)) {
        return res.status(404).json({ error: "Arquivo não encontrado!" });
    }

    try {
        const dados = fs.readFileSync(caminhoArquivo, "utf-8");
        const linhas = dados.split("\n").filter(linha => linha.trim() !== "");
        const registros = linhas.map(linha => {
            const [employeeName, employeeRole, startTime, endTime, productionCount, productionDate] = linha.split(",");
            return { employeeName, employeeRole, startTime, endTime, productionCount, productionDate };
        });

        res.json(registros);
    } catch (error) {
        console.error("[ERRO] Falha ao ler o arquivo:", error);
        res.status(500).json({ error: "Erro ao ler o arquivo de produção!" });
    }
}

// Função para carregar o arquivo de remessas e lotes
function getLotesRemessas(req, res) {
    console.log("[LOG] Iniciando carregamento das remessas e lotes...");
    garantirPastaDados();

    if (!fs.existsSync(lotesRemessasPath)) {
        console.warn("[AVISO] Arquivo lotesRemessas.json não encontrado. Criando arquivo vazio...");
        fs.writeFileSync(lotesRemessasPath, JSON.stringify({ remessas: [] }));
    }

    try {
        const lotesRemessas = JSON.parse(fs.readFileSync(lotesRemessasPath, "utf8"));
        console.log("[LOG] Remessas e lotes carregados com sucesso");
        res.json(lotesRemessas);
    } catch (error) {
        console.error("[ERRO] Falha ao carregar remessas e lotes:", error);
        res.status(500).json({ error: "Erro ao carregar remessas e lotes!" });
    }
}

// Função para adicionar uma nova remessa
function addRemessa(req, res) {
    console.log("[LOG] Iniciando adição de nova remessa...");
    garantirPastaDados();

    const novaRemessa = req.body;
    console.log("[LOG] Dados da nova remessa:", novaRemessa);

    try {
        let lotesRemessas = { remessas: [] };
        if (fs.existsSync(lotesRemessasPath)) {
            lotesRemessas = JSON.parse(fs.readFileSync(lotesRemessasPath, "utf8"));
        }

        // Adiciona a nova remessa com um ID único
        novaRemessa.id = Date.now().toString();
        novaRemessa.dataRegistro = new Date().toISOString();
        lotesRemessas.remessas.push(novaRemessa);

        fs.writeFileSync(lotesRemessasPath, JSON.stringify(lotesRemessas, null, 2));
        console.log("[LOG] Remessa adicionada com sucesso!");
        res.json({ message: "Remessa adicionada com sucesso!", remessaId: novaRemessa.id });
    } catch (error) {
        console.error("[ERRO] Falha ao adicionar remessa:", error);
        res.status(500).json({ error: "Erro ao adicionar remessa!" });
    }
}

// Função para adicionar um lote a uma remessa existente
function addLote(req, res) {
    console.log("[LOG] Iniciando adição de novo lote...");
    const { remessaId } = req.params;
    const novoLote = req.body;
    
    try {
        const lotesRemessas = JSON.parse(fs.readFileSync(lotesRemessasPath, "utf8"));
        const remessaIndex = lotesRemessas.remessas.findIndex(r => r.id === remessaId);
        
        if (remessaIndex === -1) {
            return res.status(404).json({ error: "Remessa não encontrada!" });
        }

        // Se a remessa não tiver um array de lotes, cria um
        if (!lotesRemessas.remessas[remessaIndex].lotes) {
            lotesRemessas.remessas[remessaIndex].lotes = [];
        }

        // Encontra o maior número atual para o tamanho do lote
        const lotesDoMesmoTamanho = lotesRemessas.remessas[remessaIndex].lotes
            .filter(l => l.tamanho === novoLote.tamanho);
        const maiorNumero = lotesDoMesmoTamanho.reduce((max, lote) => {
            const num = parseInt(lote.numero) || 0;
            return num > max ? num : max;
        }, 0);

        // Adiciona o novo lote com o próximo número da sequência
        novoLote.id = Date.now().toString();
        novoLote.numero = (maiorNumero + 1).toString();
        lotesRemessas.remessas[remessaIndex].lotes.push(novoLote);

        fs.writeFileSync(lotesRemessasPath, JSON.stringify(lotesRemessas, null, 2));
        console.log("[LOG] Lote adicionado com sucesso!");
        res.json({ message: "Lote adicionado com sucesso!", loteId: novoLote.id });
    } catch (error) {
        console.error("[ERRO] Falha ao adicionar lote:", error);
        res.status(500).json({ error: "Erro ao adicionar lote!" });
    }
}

module.exports = {
    lerArquivoCSV,
    listarProducao,
    adicionarProducao,
    carregarUltimoRegistro,
    setMachineMap,
    getMachineMap,
    listarDadosFuncionario,
    listarNomesFuncionarios,
    getLotesRemessas,
    addRemessa,
    addLote
};