import express from "express";
import routes from "./routes";
import dotenv from "dotenv";
import connect from "./models/connection";
import { Militar, Soldado, Patente } from "./models";

dotenv.config();

// Será usada a porta 3000 se a variável de ambiente não estiver definida
const PORT = process.env.PORT || 3000;
const app = express(); // Cria o servidor e coloca na variável app

// Suportar parâmetros JSON no body da requisição
app.use(express.json());

// Conecta ao MongoDB no início da aplicação
connect();

// Inicializa o servidor na porta especificada
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Define a rota para o pacote /routes
app.use(routes);

// Função de máscara para telefone
function phoneMask(v: string | undefined) {
    if (v == undefined) {
        return;
    }
    let r = v.replace(/\D/g, "");
    r = r.replace(/^0/, "");
    if (r.length >= 11) {
        r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (r.length > 7) {
        r = r.replace(/^(\d\d)(\d{5})(\d{0,5}).*/, "($1) $2-$3");
    } else if (r.length > 2) {
        r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
    } else if (v.trim() !== "") {
        r = r.replace(/^(\d*)/, "($1");
    }
    return r;
}

// Persistência de dados usando API Fetch
async function persistirDados() {
    const militares = [
        { nome: "Marcos da Silva", idade: 21, email: "marcos.silva@fab.mil.br", telefone: "12912343567" },
        { nome: "Ana Maria Brega", idade: 25, email: "ana.brega@fab.mil.br", telefone: "12999979999" },
        { nome: "Paulo França", idade: 18, email: "paulo.fraca@fab.mil.br", telefone: "12999967999" },
        { nome: "Edson Arantes", idade: 30, email: "edson.arantes@gmail.sp.gov.br", telefone: "12999957999" },
    ];

    const soldados = [
        { cim: 1234567891, altura: 1.73, militar: "Marcos da Silva" },
        { cim: 1212121212, altura: 1.69, militar: "Ana Maria Brega" },
        { cim: 2121212121, altura: 1.8, militar: "Paulo França" },
    ];

    const patentes = [
        { descricao: "Marechal do Ar", nivel: 1 },
        { descricao: "Brigadeiro", nivel: 2 },
        { descricao: "Coronel", nivel: 3 },
        { descricao: "Major", nivel: 4 },
        { descricao: "Capitão", nivel: 5 },
    ];

    // Persistir militares
    for (const militar of militares) {
        await fetch("http://localhost:3001/militar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(militar),
        });
    }

    // Persistir soldados
    for (const soldado of soldados) {
        await fetch("http://localhost:3001/soldado", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(soldado),
        });
    }

    // Persistir patentes
    for (const patente of patentes) {
        await fetch("http://localhost:3001/patente", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patente),
        });
    }

    console.log("Dados persistidos com sucesso!");
}

// Rotina para listar soldados com relacionamentos
async function listarSoldadosComRelacionamentos() {
    const soldados = await Soldado.find().populate("militar").exec();

    for (const soldado of soldados) {
        const militar = await Militar.findById(soldado.militar);
        if (militar) {
            console.log("<< Soldado >>");
            console.log(`CIM: ${soldado.cim}`);
            console.log(`Nome: ${militar.nome}`);
            console.log(`Idade: ${militar.idade}`);
            console.log(`Altura: ${soldado.altura.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} m`);
            console.log(`e-Mail: ${militar.email}`);
            console.log(`Telefone: ${phoneMask(militar.fone)}`);
            console.log("");
        }
    }
}

// Executar as funcionalidades
(async function main() {
    await persistirDados();
    await listarSoldadosComRelacionamentos();
})();
