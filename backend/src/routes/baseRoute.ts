import { Router } from "express";
import type { RequestHandler } from "express";



import { authMiddleware } from "../middleware/authMiddleware";

type RouteName =
  | "create"
  | "update"
  | "delete"
  | "getAll"
  | "getById"
  | "getBy"
  | "search";

type Controller = {
  getAll?: RequestHandler;
  getById?: RequestHandler;
  getByField?: RequestHandler;
  search?: RequestHandler;
  create?: RequestHandler;
  update?: RequestHandler;
  delete?: RequestHandler;
};

type Options = {
  protectedRoutes?: RouteName[];
  disabledRoutes?: RouteName[];
  upload?: RequestHandler;
  customRoutes?: (router: Router) => void;
  publicAccess?: boolean;
};

const passThrough: RequestHandler = (_req, _res, next) => next();

export const createCrudRoutes = <T extends { id: number }>(
  controller: Controller,
  options: Options = {}
): Router => {
  const router = Router();

  const {
    protectedRoutes = [],
    disabledRoutes = [],
    upload = passThrough,
    customRoutes,
    publicAccess = false,
  } = options;

  const isEnabled = (route: RouteName) =>
    !disabledRoutes.includes(route);

  const guard = (route: RouteName): RequestHandler => {
    if (protectedRoutes.includes(route)) {
      return authMiddleware;
    }

    // Si l'accès public n'est pas autorisé, exiger l'authentification.
    return publicAccess ? passThrough : authMiddleware;
  };

  // Routes spécifiques avant les routes génériques telles que /:id.
  customRoutes?.(router);

  if (isEnabled("search") && controller.search) {
    router.get("/search", guard("search"), controller.search);
  }

  if (isEnabled("getBy") && controller.getByField) {
    router.get("/by", guard("getBy"), controller.getByField);
  }

  if (isEnabled("getAll") && controller.getAll) {
    router.get("/", guard("getAll"), controller.getAll);
  }

  if (isEnabled("getById") && controller.getById) {
    router.get("/:id", guard("getById"), controller.getById);
  }

  if (isEnabled("create") && controller.create) {
    router.post("/", guard("create"), upload, controller.create);
  }

  if (isEnabled("update") && controller.update) {
    router.put("/:id", guard("update"), upload, controller.update);
  }

  if (isEnabled("delete") && controller.delete) {
    router.delete("/:id", guard("delete"), controller.delete);
  }

  return router;
};
