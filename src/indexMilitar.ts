import express from "express";
import routes from "./routes";
import dotenv from "dotenv";
import connect from "./models/connection";
import MilitarModel from "./models/MilitarModel";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
connect();

app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}`);
});

app.use(routes);

// Adicionar Militares
const militares: Array<MilitarModel> = [];
let militar = new MilitarModel("João Silva", 35, "joao.silva@militar.com", "11999999999");
militares.push(militar);
militar = new MilitarModel("Maria Oliveira", 28, "maria.oliveira@militar.com", "11988888888");
militares.push(militar);

let x = 0;
militares.forEach((militar) => {
    (async () => {
        militar.id = await fetch("http://localhost:3001/militar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome: militar.nome,
                idade: militar.idade,
                email: militar.email,
                fone: militar.fone,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                militares[x].id = data._id;
                x++;
                return data._id;
            })
            .catch((error) => console.error("Erro ao cadastrar militar:", error));
    })();
});
