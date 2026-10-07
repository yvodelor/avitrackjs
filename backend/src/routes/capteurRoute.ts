import { createCrudRoutes } from "./baseRoute";
import { capteurController } from "../controllers/capteurController";


export default createCrudRoutes( capteurController, {
    protectedRoutes: ['create', 'update', 'delete']
})