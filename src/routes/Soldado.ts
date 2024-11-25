import { Router } from "express";
import SoldadoController from "../controllers/SoldadoController";

const routes = Router();

routes.post("/", SoldadoController.create);
routes.get("/", SoldadoController.list);
routes.delete("/", SoldadoController.delete);
routes.put("/", SoldadoController.update);

export default routes;
