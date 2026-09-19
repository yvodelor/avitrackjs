import { createCrudRoutes } from "./baseRoute";
import { deviceController } from "../controllers/deviceController";


export default createCrudRoutes( deviceController, {
    protectedRoutes: ['create', 'update', 'delete']
})