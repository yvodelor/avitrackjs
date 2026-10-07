import { createCrudRoutes } from "./baseRoute";
import { paysController } from "../controllers/paysController";


export default createCrudRoutes( paysController, {
    protectedRoutes: ['create', 'update', 'delete']
})