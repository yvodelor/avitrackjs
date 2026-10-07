import { createCrudRoutes } from "./baseRoute";
import { alertController } from "../controllers/alertController";


export default createCrudRoutes( alertController, {
    protectedRoutes: ['create', 'update', 'delete']
})