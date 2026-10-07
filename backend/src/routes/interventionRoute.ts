import { createCrudRoutes } from "./baseRoute";
import { interventionController } from "../controllers/interventionController";


export default createCrudRoutes( interventionController, {
    protectedRoutes: ['create', 'update', 'delete']
})