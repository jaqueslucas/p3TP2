import { Router } from "express";
import PatenteController from "../controllers/PatenteController";

const routes = Router();

routes.post("/", PatenteController.create);
routes.get("/", PatenteController.list);
routes.delete("/", PatenteController.delete);
routes.put("/", PatenteController.update);

export default routes;
