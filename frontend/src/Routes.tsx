
import { lazy } from "react";
import type { ReactElement } from "react";

// Liens utiles
const HomePage = lazy(() => import("./pages/Home"));
const Cgu = lazy(() => import("./pages/Cgu"));
const DeleteData = lazy(() => import("./pages/DeleteData"));
const PolicyPrivacy = lazy(() => import("./pages/PolicyPrivacy"));

/* Auth */
const Login = lazy(() => import("./pages/auth/Login"));
const Logout = lazy(() => import("./pages/auth/Logout"));
const Profile = lazy(() => import("./pages/auth/Profile"));
const Register = lazy(() => import("./pages/auth/Register"));
const PasswordForgot = lazy(() => import("./pages/auth/Password-forgot"));

/* Tableau de bord */
const Dashboard = lazy(() => import("./pages/dash/Dashboard"));

/* Farm */
const FarmPage = lazy(() => import("./pages/dash/farm/"));
const FarmCreate = lazy(() => import("./pages/dash/farm/FarmCreate"));

/* Building */
const BuildingPage = lazy(() => import("./pages/dash/building/"));
const BuildingCreate = lazy(() => import("./pages/dash/building/buildingCreate"));

/* Vaccination */
const VaccinationPage = lazy(() => import("./pages/dash/vaccination/"));
const VaccinationCreate = lazy(() =>
  import("./pages/dash/vaccination/vaccinationCreate")
);

/* Support */
const SupportPage = lazy(() => import("./pages/dash/support/"));
const SupportCreate = lazy(() => import("./pages/dash/support/supportCreate") );



/* AdminBoard */
const AdminBoard = lazy(() => import("./pages/admin/AdminBoard"));

/* Device */
const DevicePage = lazy(() => import("./pages/admin/device/"));
const DeviceCreate = lazy(() => import("./pages/admin/device/deviceCreate"));

/* Alert */
const AlertPage = lazy(() => import("./pages/admin/alert/"));
const AlertCreate = lazy(() => import("./pages/admin/alert/alertCreate"));



/* Vaccin */
const VaccinPage = lazy(() => import("./pages/admin/vaccin/"));
const VaccinCreate = lazy(() => import("./pages/admin/vaccin/VaccinCreate")
);

/* Pays */
const PaysPage = lazy(() => import("./pages/admin/pays/"));
const PaysCreate = lazy(() => import("./pages/admin/pays/")
);

/* Ville */
const VillePage = lazy(() => import("./pages/admin/ville/"));
const VilleCreate = lazy(() => import("./pages/admin/ville/villeCreate")
);




/* VeteBoard */
const VeteBoard = lazy(() => import("./pages/vete/VeteBoard"));

/* Intervention */
const InterventionPage = lazy(() => import("./pages/vete/intervention/"));
const InterventionCreate = lazy(() => import("./pages/vete/intervention/interventionCreate"));


export type AppRoute = {
  path: string;
  element: ReactElement;
  protected?: boolean;
};

const appRoutes: AppRoute[] = [
  // =========================
  // Liens utiles
  // =========================
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/cgu",
    element: <Cgu />,
  },
  {
    path: "/deleteData",
    element: <DeleteData />,
  },
  {
    path: "/PolicyPrivacy",
    element: <PolicyPrivacy />,
  },

  // =========================
  // Auth
  // =========================
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/password-forgot",
    element: <PasswordForgot />,
  },

  // =========================
  // Profil
  // =========================
  {
    path: "/profile",
    element: <Profile />,
    protected: true,
  },

  // =========================
  // Dashboard
  // =========================
  {
    path: "/dashboard",
    element: <Dashboard />,
    protected: true,
  },

  // =========================
  // Farm
  // =========================
  {
    path: "/farms",
    element: <FarmPage />,
    protected: true,
  },
  {
    path: "/farm",
    element: <FarmCreate />,
    protected: true,
  },
  {
    path: "/farm/:id",
    element: <FarmCreate />,
    protected: true,
  },


  // =========================
  // Support
  // =========================
  {
    path: "/supports",
    element: <SupportPage />,
    protected: true,
  },
  {
    path: "/support",
    element: <SupportCreate />,
    protected: true,
  },
  {
    path: "/support/:id",
    element: <SupportCreate />,
    protected: true,
  },


  // =========================
  // Building
  // =========================
  {
    path: "/buildings",
    element: <BuildingPage />,
    protected: true,
  },
  {
    path: "/building",
    element: <BuildingCreate />,
    protected: true,
  },
  {
    path: "/building/:id",
    element: <BuildingCreate />,
    protected: true,
  },

  // =========================
  // Vaccination
  // =========================
  {
    path: "/vaccinations",
    element: <VaccinationPage />,
    protected: true,
  },
  {
    path: "/vaccination",
    element: <VaccinationCreate />,
    protected: true,
  },
  {
    path: "/vaccination/:id",
    element: <VaccinationCreate />,
    protected: true,
  },

  // =========================
  // Dashboard Admin
  // =========================
  {
    path: "/admin/",
    element: <AdminBoard />,
    protected: true,
  },

  // =========================
  // Fermes Admin
  // =========================
  {
    path: "/admin/farms",
    element: <FarmPage />,
    protected: true,
  },

  // =========================
  // Device
  // =========================
  {
    path: "/admin/devices",
    element: <DevicePage />,
    protected: true,
  },
  {
    path: "/admin/device",
    element: <DeviceCreate />,
    protected: true,
  },
  {
    path: "/admin/device/:id",
    element: <DeviceCreate />,
    protected: true,
  },

  // =========================
  // Alert
  // =========================
  {
    path: "/admin/alerts",
    element: <AlertPage />,
    protected: true,
  },
  {
    path: "/admin/alert",
    element: <AlertCreate />,
    protected: true,
  },
  {
    path: "/admin/alert/:id",
    element: <AlertCreate />,
    protected: true,
  },

  // =========================
  // Vaccin
  // =========================
 {
    path: "/admin/vaccins",
    element: <VaccinPage />,
    protected: true,
  },
  {
    path: "/admin/vaccin",
    element: <VaccinCreate />,
    protected: true,
  },
  {
    path: "/admin/vaccin/:id",
    element: <VaccinCreate />,
    protected: true,
  },

  // =========================
  //  Pays
  // =========================
  {
    path: "/admin/payss",
    element: <PaysPage />,
    protected: true,
  },

  {
    path: "/admin/pays",
    element: <PaysCreate />,
    protected: true,
  },
  {
    path: "/admin/pays/:id",
    element: <PaysCreate />,
    protected: true,
  },

  // =========================
  // ville
  // =========================
  {
    path: "/admin/villes",
    element: <VillePage />,
    protected: true,
  },

  {
    path: "/admin/ville",
    element: <VilleCreate />,
    protected: true,
  },
  {
    path: "/admin/ville/:id",
    element: <VilleCreate />,
    protected: true,
  },







  // =========================
  // Farm
  // =========================
  {
    path: "/admin/farms",
    element: <FarmPage />,
    protected: true,
  },
  {
    path: "/admin/farm",
    element: <FarmCreate />,
    protected: true,
  },
  {
    path: "/admin/farm/:id",
    element: <FarmCreate />,
    protected: true,
  },


  // =========================
  // Support
  // =========================
  {
    path: "/admin/supports",
    element: <SupportPage />,
    protected: true,
  },
  {
    path: "/admin/support",
    element: <SupportCreate />,
    protected: true,
  },
  {
    path: "/admin/support/:id",
    element: <SupportCreate />,
    protected: true,
  },


  // =========================
  // Building
  // =========================
  {
    path: "/admin/buildings",
    element: <BuildingPage />,
    protected: true,
  },
  {
    path: "/admin/building",
    element: <BuildingCreate />,
    protected: true,
  },
  {
    path: "/admin/building/:id",
    element: <BuildingCreate />,
    protected: true,
  },

  // =========================
  // Vaccination
  // =========================
  {
    path: "/admin/vaccinations",
    element: <VaccinationPage />,
    protected: true,
  },
  {
    path: "/admin/vaccination",
    element: <VaccinationCreate />,
    protected: true,
  },
  {
    path: "/admin/vaccination/:id",
    element: <VaccinationCreate />,
    protected: true,
  },













  // =========================
  // VeteBoard
  // =========================
  {
    path: "/veterinaire/dashboard",
    element: <VeteBoard />,
    protected: true,
  },
  
  // =========================
  // Intervention
  // =========================
  {
    path: "/interventions",
    element: <InterventionPage />,
    protected: true,
  },
  {
    path: "/intervention",
    element: <InterventionCreate />,
    protected: true,
  },
  {
    path: "/intervention/:id",
    element: <InterventionCreate />,
    protected: true,
  }
];

export default appRoutes;
