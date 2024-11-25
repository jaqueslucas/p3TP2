import express from "express";
import routes from "./routes";
import dotenv from "dotenv";
import connect from "./models/connection";
import SoldadoMilitarModel from "./models/SoldadoMilitarModel";
import { Soldado, Militar } from "./models";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express(); // Cria o servidor e coloca na variável app

// Suportar parâmetros JSON no body da requisição
app.use(express.json());

// Conecta ao MongoDB no início da aplicação
connect();

// Inicializa o servidor na porta especificada
app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}`);
});

// Define a rota para o pacote /routes
app.use(routes);

// Dados de exemplo para associação entre Soldados e Militares
const soldadosMilitares: Array<SoldadoMilitarModel> = [];
let soldadoMilitar = new SoldadoMilitarModel("12345", "João Silva");
soldadosMilitares.push(soldadoMilitar);
soldadoMilitar = new SoldadoMilitarModel("67890", "Maria Oliveira");
soldadosMilitares.push(soldadoMilitar);

let w = 0;

// Associa Soldados com Militares e salva no banco
soldadosMilitares.forEach((soldadoMilitar) => {
    (async () => {
        // Busca o soldado pelo CIM
        const soldadoDoc = await Soldado.findOne({ cim: soldadoMilitar.soldadoId }).exec();
        // Busca o militar pelo nome
        const militarDoc = await Militar.findOne({ nome: soldadoMilitar.militarId }).exec();

        if (soldadoDoc != null && militarDoc != null) {
            soldadoMilitar.id = await fetch("http://localhost:3000/soldadomilitar", {
                method: "POST", // Tipo de requisição
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    soldadoId: soldadoDoc._id,
                    militarId: militarDoc._id,
                }),
            })
                .then((response) => response.json()) // Resposta do backend
                .then((data) => {
                    // console.log(data); // A rotina retorna o ID do objeto cadastrado
                    soldadosMilitares[w].id = data._id;
                    w++;
                    return data._id;
                })
                .catch((error) => {
                    console.error("Erro ao cadastrar soldado-militar:", error);
                });
        }
    })();
});
