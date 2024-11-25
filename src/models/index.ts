import mongoose from "mongoose";
const { Schema } = mongoose;

// Esquema para Militar
const MilitarSchema = new Schema(
    {
        nome: { type: String, maxlength: 50, required: true },
        idade: { type: Number, min: 18, required: true },
        email: {
            type: String,
            maxlength: 60,
            unique: true,
            required: true,
            validate: {
                validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: (props: any) => `${props.value} não é um formato de e-mail válido!`,
            },
        },
        fone: { type: String, required: true },
        patente: { type: Number, required: true },
    },
    { timestamps: true }
);

// Esquema para Patente
const PatenteSchema = new Schema(
    {
        codigo: { type: Number, min: 1, max: 20, required: true },
        descricao: { type: String, maxlength: 100, required: true },
    },
    { timestamps: true }
);

// Esquema para Soldado
const SoldadoSchema = new Schema(
    {
        cim: { type: String, unique: true, required: true },
        altura: { type: Number, min: 1.62, required: true },
        militar: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Militar",
            required: true,
            validate: {
                validator: async (id: string) => {
                    const militar = await Militar.findById(id);
                    return !!militar;
                },
                message: "O Militar fornecido não existe!",
            },
        },
    },
    { timestamps: true }
);

// Esquema para SoldadoMilitar (associação entre Soldado e Militar)
const SoldadoMilitarSchema = new Schema(
    {
        soldado: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Soldado",
            required: true,
            validate: {
                validator: async (id: string) => {
                    const soldado = await Soldado.findById(id);
                    return !!soldado;
                },
                message: "O Soldado fornecido não existe!",
            },
        },
        militar: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Militar",
            required: true,
            validate: {
                validator: async (id: string) => {
                    const militar = await Militar.findById(id);
                    return !!militar;
                },
                message: "O Militar fornecido não existe!",
            },
        },
    },
    { timestamps: true }
);

// Criação dos modelos
const Militar = mongoose.model("Militar", MilitarSchema);
const Soldado = mongoose.model("Soldado", SoldadoSchema);
const Patente = mongoose.model("Patente", PatenteSchema);
const SoldadoMilitar = mongoose.model("SoldadoMilitar", SoldadoMilitarSchema);

export { Militar, Soldado, Patente, SoldadoMilitar };
