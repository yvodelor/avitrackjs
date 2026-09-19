import { createCrudRoutes } from "./baseRoute";
import { messageAlertController } from "../controllers/messageAlertController";


export default createCrudRoutes( messageAlertController, {
    protectedRoutes: ['create', 'update', 'delete']
})