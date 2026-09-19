import { createCrudRoutes } from "./baseRoute";
import { farmController } from "../controllers/farmController";


export default createCrudRoutes( farmController, {
    protectedRoutes: ['create', 'update', 'delete']
})
