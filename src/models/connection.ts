import mongoose from "mongoose";

// Defina a URI do MongoDB, apontando para o banco de dados `p3tp2militar`
const uri = "mongodb://127.0.0.1:27017/p3tp2militar";

export default function connect() {
    // Configura os manipuladores de eventos para estados de conexão
    mongoose.connection.on("connected", () => console.log("Mongoose conectado ao MongoDB"));
    mongoose.connection.on("open", () => console.log("Conexão com o MongoDB aberta"));
    mongoose.connection.on("disconnected", () => console.log("Mongoose desconectado do MongoDB"));
    mongoose.connection.on("reconnected", () => console.log("Mongoose reconectado ao MongoDB"));
    mongoose.connection.on("disconnecting", () => console.log("Mongoose desconectando do MongoDB"));
    mongoose.connection.on("close", () => console.log("Conexão com o MongoDB encerrada"));

    // Conecta ao MongoDB com configurações adicionais
    mongoose
        .connect(uri, {
            serverSelectionTimeoutMS: 5000, // Tempo limite para selecionar o servidor
            maxPoolSize: 10, // Número máximo de conexões simultâneas no pool
        })
        .then(() => console.log("Conectado ao MongoDB com sucesso!"))
        .catch((error) => {
            console.error("Erro ao conectar ao MongoDB:", error.message);
        });

    // Captura o sinal SIGINT para fechar a conexão de forma segura ao encerrar a aplicação
    process.on("SIGINT", async () => {
        try {
            console.log("Finalizando conexão com o MongoDB...");
            await mongoose.connection.close();
            console.log("Conexão encerrada. Aplicação finalizada.");
            process.exit(0);
        } catch (error) {
            console.error("Erro ao encerrar a conexão com o MongoDB:", error);
            process.exit(1);
        }
    });
}
