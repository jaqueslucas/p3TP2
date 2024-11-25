import { Request, Response } from "express";
import { SoldadoMilitar } from "../models"; // Certifique-se de que está importando o modelo corretamente

class SoldadoMilitarController {

    // create
    public async create(req: Request, res: Response): Promise<Response> {
        const { soldadoId, militarId } = req.body;
        try {

            const document = new SoldadoMilitar({ soldado: soldadoId, militar: militarId });
            const response = await document.save();
            return res.json(response);
        } catch (error: any) {
            if (error && error.errors["soldado"]) {
                return res.json({ message: error.errors["soldado"].message });
            } else if (error && error.errors["militar"]) {
                return res.json({ message: error.errors["militar"].message });
            }
            return res.json({ message: error.message });
        }
    }

    // list
    public async list(_: Request, res: Response): Promise<Response> {
        try {
            const objects = await SoldadoMilitar.find()
                .populate("soldado", "cim altura") // Inclui dados do Soldado
                .populate("militar", "nome fone idade email") // Inclui dados do Militar
                .sort({ "soldado.cim": "asc" }); // Ordena pela CIM do Soldado
            return res.json(objects);
        } catch (error: any) {
            return res.json({ message: error.message });
        }
    }

    // delete
    public async delete(req: Request, res: Response): Promise<Response> {
        const { id: _id } = req.body;
        try {
            const object = await SoldadoMilitar.findByIdAndDelete(_id);
            if (object) {
                return res.json({ message: "Associação excluída com sucesso!" });
            } else {
                return res.json({ message: "Associação inexistente!" });
            }
        } catch (error: any) {
            return res.json({ message: error.message });
        }
    }

    // update
    public async update(req: Request, res: Response): Promise<Response> {
        const { id, soldadoId, militarId } = req.body;
        try {
            const document = await SoldadoMilitar.findById(id);
            if (!document) {
                return res.json({ message: "Associação inexistente!" });
            }

            // Atualiza os campos
            document.soldado = soldadoId;
            document.militar = militarId;

            const response = await document.save();
            return res.json(response);
        } catch (error: any) {
            if (error && error.errors["soldado"]) {
                return res.json({ message: error.errors["soldado"].message });
            } else if (error && error.errors["militar"]) {
                return res.json({ message: error.errors["militar"].message });
            }
            return res.json({ message: error.message });
        }
    }
}

export default new SoldadoMilitarController();
