import { createCrudRoutes } from "./baseRoute";
import { vaccinController } from "../controllers/vaccinController";


export default createCrudRoutes( vaccinController, {
    protectedRoutes: ['create', 'update', 'delete']
})