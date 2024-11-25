import express from "express";
import routes from "./routes";
import dotenv from "dotenv";
import connect from "./models/connection";
import MilitarModel from "./models/MilitarModel";
import SoldadoModel from "./models/SoldadoModel";
import PatenteModel from "./models/PatenteModel";
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

// Exibir dados de exemplo relacionados
(async () => {
    const docs = await Soldado.find().exec(); // Busca todos os soldados
    if (docs != null) {
        console.log("<< Soldados Cadastrados >>");
        for (const doc of docs) {
            const militar = await Militar.findById(doc.militar); // Busca o Militar associado ao Soldado
            if (militar != null) {
                const patente = await Patente.findOne({ codigo: militar.patente }); // Exemplo de associação com patente
                console.log(
                    "Soldado:",
                    doc.cim,
                    "- Altura:",
                    doc.altura,
                    "- Militar:",
                    militar.nome,
                    "- Patente:",
                    patente?.descricao || "Não atribuída"
                );
            }
        }
    }
})();
