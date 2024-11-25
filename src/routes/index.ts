import { Router } from "express";
import militarRoutes from "./Militar";
import soldadoRoutes from "./Soldado";
import patenteRoutes from "./Patente";

const routes = Router();

routes.use("/militar", militarRoutes);
routes.use("/soldado", soldadoRoutes);
routes.use("/patente", patenteRoutes);

export default routes;
