import { Request, Response } from "express";
import {Patente} from "../models";

class PatenteController {
    // Método para criar uma nova patente
    public async create(req: Request, res: Response): Promise<any> {
        const { codigo, descricao } = req.body;
        try {
            const document = new Patente({ codigo, descricao });
            const response = await document.save();
            return res.json(response);
        } catch (error: any) {
            if (error && error.errors["codigo"]) {
                return res.json({ message: error.errors["codigo"].message });
            } else if (error && error.errors["descricao"]) {
                return res.json({ message: error.errors["descricao"].message });
            }
            return res.json({ message: error.message });
        }
    }

    // Método para listar todas as patentes
    public async list(_: Request, res: Response): Promise<any> {
        try {
            const objects = await Patente.find().sort({ descricao: "asc" }); // Ordena pela descrição
            return res.json(objects);
        } catch (error: any) {
            return res.json({ message: error.message });
        }
    }

    // Método para deletar uma patente por ID
    public async delete(req: Request, res: Response): Promise<any> {
        const { id: _id } = req.body;
        try {
            const object = await Patente.findByIdAndDelete(_id);
            if (object) {
                return res.json({ message: "Patente excluída com sucesso!" });
            } else {
                return res.json({ message: "Patente inexistente!" });
            }
        } catch (error: any) {
            return res.json({ message: error.message });
        }
    }

    // Método para atualizar uma patente
    public async update(req: Request, res: Response): Promise<any> {
        const { id, codigo, descricao } = req.body;
        try {
            const document = await Patente.findById(id);
            if (!document) {
                return res.json({ message: "Patente inexistente!" });
            }

            document.codigo = codigo;
            document.descricao = descricao;

            const response = await document.save();
            return res.json(response);
        } catch (error: any) {
            if (error && error.errors["codigo"]) {
                return res.json({ message: error.errors["codigo"].message });
            } else if (error && error.errors["descricao"]) {
                return res.json({ message: error.errors["descricao"].message });
            }
            return res.json({ message: error.message });
        }
    }
}

export default new PatenteController();
