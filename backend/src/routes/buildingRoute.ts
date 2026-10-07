import { createCrudRoutes } from "./baseRoute";
import { buildingController } from "../controllers/buildingController";

export default createCrudRoutes( buildingController, {
    protectedRoutes: [ 'delete']
})