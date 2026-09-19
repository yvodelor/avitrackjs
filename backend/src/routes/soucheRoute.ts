import { createCrudRoutes } from "./baseRoute";
import { soucheController } from "../controllers/soucheController";


export default createCrudRoutes( soucheController, {
    protectedRoutes: ['create', 'update', 'delete']
})