
import Cookies from "js-cookie";

const COOKIE_NAME = "avitrack_dashboard_selection";

export interface DashboardSelection {
  farmId: string;
  buildingId: string;
  deviceCode: string;
}

export const dashboardCookie = {
  save(selection: DashboardSelection) {
    Cookies.set(COOKIE_NAME, JSON.stringify(selection), {
      expires: 30,
      sameSite: "Lax",
      secure: window.location.protocol === "https:",
      path: "/",
    });
  },

  get(): DashboardSelection | null {
    const value = Cookies.get(COOKIE_NAME);

    if (!value) return null;

    try {
      const selection = JSON.parse(value);

      if (
        typeof selection.farmId !== "string" ||
        typeof selection.buildingId !== "string" ||
        typeof selection.deviceCode !== "string"
      ) {
        return null;
      }

      return selection;
    } catch {
      return null;
    }
  },

  clear() {
    Cookies.remove(COOKIE_NAME, { path: "/" });
  },
};
