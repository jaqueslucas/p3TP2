import express from "express";
import routes from "./routes";
import dotenv from "dotenv";
import connect from "./models/connection";
import PatenteModel from "./models/PatenteModel";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
connect();

app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}`);
});

app.use(routes);

// Adicionar Patentes
const patentes: Array<PatenteModel> = [];
let patente = new PatenteModel(1, "General");
patentes.push(patente);
patente = new PatenteModel(2, "Coronel");
patentes.push(patente);

let x = 0;
patentes.forEach((patente) => {
    (async () => {
        patente.id = await fetch("http://localhost:3000/patente", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                codigo: patente.codigo,
                descricao: patente.descricao,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                patentes[x].id = data._id;
                x++;
                return data._id;
            })
            .catch((error) => console.error("Erro ao cadastrar patente:", error));
    })();
});
