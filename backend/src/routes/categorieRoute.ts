import { createCrudRoutes } from "./baseRoute";
import { categorieController } from "../controllers/categorieController";


export default createCrudRoutes( categorieController, {
    protectedRoutes: ['create', 'update', 'delete']
})