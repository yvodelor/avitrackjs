import { createCrudRoutes } from "./baseRoute";
import { supportController } from "../controllers/supportContoller";


export default createCrudRoutes( supportController, {
    protectedRoutes: ['create', 'update', 'delete']
})