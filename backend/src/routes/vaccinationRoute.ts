import { createCrudRoutes } from "./baseRoute";
import { vaccinationController } from "../controllers/vaccinationController";


export default createCrudRoutes( vaccinationController, {
    protectedRoutes: ['create', 'update', 'delete']
})