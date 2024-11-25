import { Request, Response } from "express";
import { Soldado }  from "../models";

class SoldadoController {
    // create
    public async create(req: Request, res: Response): Promise<any> {
        const { cim, altura, militar } = req.body;
        try {
            const document = new Soldado({ cim, altura, militar });
            const resp = await document.save();
            return res.json(resp);
        } catch (error: any) {
            if (error.code === 11000 || error.code === 11001) {
                return res.json({ message: "Este CIM já está em uso!" });
            } else if (error && error.errors["cim"]) {
                return res.json({ message: error.errors["cim"].message });
            } else if (error && error.errors["altura"]) {
                return res.json({ message: error.errors["altura"].message });
            } else if (error && error.errors["militar"]) {
                return res.json({ message: error.errors["militar"].message });
            }
            return res.json({ message: error.message });
        }
    }

    // list
    public async list(_: Request, res: Response): Promise<any> {
        try {
            const objects = await Soldado.find()
                .populate("militar", "nome email fone idade") // Popula os dados do militar associado
                .sort({ cim: "asc" }); // Ordena por CIM
            return res.json(objects);
        } catch (error: any) {
            return res.json({ message: error.message });
        }
    }

    // delete
    public async delete(req: Request, res: Response): Promise<any> {
        const { id: _id } = req.body;
        try {
            const object = await Soldado.findByIdAndDelete(_id);
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
        const { id, cim, altura, militar } = req.body;
        try {
            const document = await Soldado.findById(id);
            if (!document) {
                return res.json({ message: "Soldado inexistente!" });
            }
            document.cim = cim;
            document.altura = altura;
            document.militar = militar;
            const resp = await document.save();
            return res.json(resp);
        } catch (error: any) {
            if (error.code === 11000 || error.code === 11001) {
                return res.json({ message: "Este CIM já está em uso!" });
            } else if (error && error.errors["cim"]) {
                return res.json({ message: error.errors["cim"].message });
            } else if (error && error.errors["altura"]) {
                return res.json({ message: error.errors["altura"].message });
            } else if (error && error.errors["militar"]) {
                return res.json({ message: error.errors["militar"].message });
            }
            return res.json({ message: error.message });
        }
    }
}

export default new SoldadoController();
