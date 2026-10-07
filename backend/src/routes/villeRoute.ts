import { createCrudRoutes } from "./baseRoute";
import { villeController } from "../controllers/villeController";


export default createCrudRoutes( villeController, {
    protectedRoutes: ['create', 'update', 'delete']
})