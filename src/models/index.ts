import mongoose from "mongoose";
const { Schema } = mongoose;

const ddds = [
    11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68,
    69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95,
    96, 97, 98, 99,
  ];

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
                validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && /@eb|@marinha|@fab\.mil\.br$/.test(email),
                message: "Email Inválido! Use um email militar válido.",
            },
        },
        fone: {
    type: String,
    required: true,
    validate: {
      validator: (fone: string) => {
        if (!/^[0-9]{10,11}$/.test(fone)) return false;

        const ddd = parseInt(fone.substring(0, 2),10);

        return ddds.includes(ddd);
      },
      message: "Telefone inválido. Deve conter um DDD válido e entre 10 a 11 dígitos.",
    },
},
        patente: { type: mongoose.Schema.Types.ObjectId, ref: 'Patente', required: true },
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
        altura: { 
            type: Number, min: 1.62, 
            required: true,
            validate: {
                validator: (altura: number) => altura >= 1.62 ,
                message: "Altura inválida. Deve ser entre 1.62 ",
            },
         },
        militar: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Militar",
            required: true,
            validate: {
                validator: async (militarId: mongoose.Types.ObjectId) => {
                    
                    const militarExiste = await Militar.exists({ _id: militarId });
                    return militarExiste !== null;
                  },
                  message: "Militar inválido. O ID fornecido não pertence a nenhum militar cadastrado.",
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
