
import { useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import Header from "../components/header/Header";
import { ThemeProvider } from "../context/ThemeContext";
import { useAuth } from "../context/authContext";

import {
  LayoutDashboard,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
  BarChart3,
} from "lucide-react";

type MenuItem = {
  title: string;
  icon: typeof LayoutDashboard;
  link?: string;
  adminOnly?: boolean;
  submenu?: {
    title: string;
    link: string;
    icon?: typeof LayoutDashboard;
  }[];
};

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    link: "/dashboard",
  },
  {
    title: "Fermes",
    icon: LayoutDashboard,
    link: "/farms",
  },
  {
    title: "Bâtiments",
    icon: LayoutDashboard,
    link: "/buildings",
  },
  {
    title: "Vaccinations",
    icon: Users,
    link: "/vaccinations",
  },
  {
    title: "Supports",
    icon: BarChart3,
    link: "/supports",
  },
  {
    title: "Admin",
    icon: Users,
    adminOnly: true,
    submenu: [
      {
        title: "Admin Page",
        
        link: "/admin/",
      },
      {
        title: "Device",
        icon: BarChart3,
        link: "/admin/devices",
      },
      {
        title: "Alert",
        link: "/admin/alerts",
      },
      {
        title: "Vaccin",
        link: "/admin/vaccins",
      },
      {
        title: "Pays",
        link: "/admin/pays",
      },
      {
        title: "Ville",
        link: "/admin/ville",
      },
      {
        title: "Souche",
        link: "/admin/souche",
      },
    ],
  },
  {
    title: "Paramètres",
    icon: Settings,
    link: "/settings",
  },
];

type LayoutProps = {
  children: ReactNode;
};

export default function DashLayout({
  children,
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [openMenus, setOpenMenus] = useState<
    Record<string, boolean>
  >({});

  const { role, actif, loading } = useAuth();

  // Le rôle doit être "admin" et le compte actif.
  const isAdmin = role === "admin" && actif === true;

  // Masquer les menus réservés aux administrateurs.
  const visibleMenuItems = menuItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden bg-gray-100">
        {/* Overlay mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed top-0 left-0 z-50 h-full w-72
            bg-gray-900 text-white
            transform transition-transform duration-300
            lg:static lg:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-gray-800 px-6">
            <div className="text-center text-lg font-bold">
              <Link to="/">Avitrack</Link>
            </div>

            {/* Fermer le menu mobile */}
            <button
              type="button"
              aria-label="Fermer le menu"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="h-[calc(100%-64px)] space-y-2 overflow-y-auto p-4">
            {loading ? (
              <p className="px-4 py-2 text-sm text-gray-400">
                Chargement des accès...
              </p>
            ) : (
              visibleMenuItems.map((item) => {
                const Icon = item.icon;
                const isOpen = !!openMenus[item.title];

                return (
                  <div key={item.title}>
                    {/* Menu principal */}
                    {item.submenu ? (
                      <button
                        type="button"
                        onClick={() => toggleMenu(item.title)}
                        aria-expanded={isOpen}
                        className="
                          flex w-full items-center justify-between
                          rounded-lg px-4 py-2
                          transition hover:bg-gray-800
                        "
                      >
                        <span className="flex items-center gap-3">
                          <Icon size={20} />
                          <span>{item.title}</span>
                        </span>

                        {isOpen ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </button>
                    ) : (
                      <Link
                        to={item.link ?? "/dashboard"}
                        onClick={() => setSidebarOpen(false)}
                        className="
                          flex w-full items-center gap-3
                          rounded-lg px-4 py-2
                          transition hover:bg-gray-800
                        "
                      >
                        <Icon size={20} />
                        <span>{item.title}</span>
                      </Link>
                    )}

                    {/* Sous-menu */}
                    {item.submenu && isOpen && (
                      <div className="mt-2 ml-10 space-y-1">
                        {item.submenu.map((subItem) => {
                          const SubIcon = subItem.icon;

                          return (
                            <Link
                              key={subItem.link}
                              to={subItem.link}
                              onClick={() => {
                                setSidebarOpen(false);
                              }}
                              className="
                                flex items-center gap-2
                                rounded-md px-3 py-2
                                text-sm text-gray-300
                                transition hover:bg-gray-800
                                hover:text-white
                              "
                            >
                              {SubIcon && <SubIcon size={16} />}
                              <span>{subItem.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </nav>
        </aside>

        {/* Contenu principal */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header
            onToggle={() => {
              setSidebarOpen((prev) => !prev);
            }}
          />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>

          {/* Footer */}
          <footer
            className="
              flex h-14 items-center justify-center
              border-t bg-white text-sm text-gray-500
            "
          >
            © 2026 Avitrack Solutions
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
}
