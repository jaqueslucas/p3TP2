import { Router } from "express";
import MilitarController from "../controllers/MilitarController";

const routes = Router();

routes.post("/", MilitarController.create);
routes.get("/", MilitarController.list);
routes.delete("/", MilitarController.delete);
routes.put("/", MilitarController.update);

export default routes;
