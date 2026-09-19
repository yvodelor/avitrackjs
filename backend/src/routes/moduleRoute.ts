import { createCrudRoutes } from "./baseRoute";
import { moduleController } from "../controllers/moduleController";


export default createCrudRoutes( moduleController, {
    protectedRoutes: ['create', 'update', 'delete']
})