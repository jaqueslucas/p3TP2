import express from "express";
import routes from "./routes";
import dotenv from "dotenv";
import connect from "./models/connection";
import SoldadoModel from "./models/SoldadoModel";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
connect();

app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}`);
});

app.use(routes);

// Adicionar Soldados
const soldados: Array<SoldadoModel> = [];
let soldado = new SoldadoModel("12345", 1.75, ""); // Relacionar com o Militar depois
soldados.push(soldado);
soldado = new SoldadoModel("67890", 1.82, "");
soldados.push(soldado);

let x = 0;
soldados.forEach((soldado) => {
    (async () => {
        soldado.id = await fetch("http://localhost:3000/soldado", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cim: soldado.cim,
                altura: soldado.altura,
                militarId: "militarIdPlaceholder", // Substituir pelo ID real do militar
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                soldados[x].id = data._id;
                x++;
                return data._id;
            })
            .catch((error) => console.error("Erro ao cadastrar soldado:", error));
    })();
});
