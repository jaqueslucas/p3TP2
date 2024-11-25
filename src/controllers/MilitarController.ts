import { Request, Response } from "express";
import { Militar } from "../models";

class MilitarController {
    // create
    public async create(req: Request, res: Response): Promise<any> {
        const { nome, idade, email, fone } = req.body;
        try {
            const document = new Militar({ nome, idade, email, fone });
            const resp = await document.save();
            return res.json(resp);
        } catch (error: any) {
            if (error.code === 11000 || error.code === 11001) {
                return res.json({ message: "Este e-mail já está em uso!" });
            } else if (error && error.errors["nome"]) {
                return res.json({ message: error.errors["nome"].message });
            } else if (error && error.errors["idade"]) {
                return res.json({ message: error.errors["idade"].message });
            } else if (error && error.errors["email"]) {
                return res.json({ message: error.errors["email"].message });
            } else if (error && error.errors["fone"]) {
                return res.json({ message: error.errors["fone"].message });
            }
            return res.json({ message: error.message });
        }
    }

    // list
    public async list(_: Request, res: Response): Promise<any> {
        try {
            const objects = await Militar.find().sort({ nome: "asc" });
            return res.json(objects);
        } catch (error: any) {
            return res.json({ message: error.message });
        }
    }

    // delete
    public async delete(req: Request, res: Response): Promise<any> {
        const { id: _id } = req.body;
        try {
            const object = await Militar.findByIdAndDelete(_id);
            if (object) {
                return res.json({ message: "Registro excluído com sucesso!" });
            } else {
                return res.json({ message: "Registro inexistente!" });
            }
        } catch (error: any) {
            return res.json({ message: error.message });
        }
    }

    // update
    public async update(req: Request, res: Response): Promise<any> {
        const { id, nome, idade, email, fone } = req.body;
        try {
            const document = await Militar.findById(id);
            if (!document) {
                return res.json({ message: "Militar inexistente!" });
            }
            document.nome = nome;
            document.idade = idade;
            document.email = email;
            document.fone = fone;
            const resp = await document.save();
            return res.json(resp);
        } catch (error: any) {
            if (error.code === 11000 || error.code === 11001) {
                return res.json({ message: "Este e-mail já está em uso!" });
            } else if (error && error.errors["nome"]) {
                return res.json({ message: error.errors["nome"].message });
            } else if (error && error.errors["idade"]) {
                return res.json({ message: error.errors["idade"].message });
            } else if (error && error.errors["email"]) {
                return res.json({ message: error.errors["email"].message });
            } else if (error && error.errors["fone"]) {
                return res.json({ message: error.errors["fone"].message });
            }
            return res.json({ message: error.message });
        }
    }
}

export default new MilitarController();
