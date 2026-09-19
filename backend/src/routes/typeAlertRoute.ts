import { createCrudRoutes } from "./baseRoute";
import { typeAlertController } from "../controllers/typeAlertController";


export default createCrudRoutes( typeAlertController, {
    protectedRoutes: ['create', 'update', 'delete']
})