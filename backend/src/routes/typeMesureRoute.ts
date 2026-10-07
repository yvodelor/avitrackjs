import { createCrudRoutes } from "./baseRoute";
import { typeMesureController } from "../controllers/typeMesureController";


export default createCrudRoutes( typeMesureController, {
    protectedRoutes: ['create', 'update', 'delete']
})