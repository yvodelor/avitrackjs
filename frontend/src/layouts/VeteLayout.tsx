import type { ReactNode } from "react"

import  Header  from "../components/header/Header";
import { ThemeProvider } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import  { useState } from "react";

import {
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
 
  X,

  BarChart3, 
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    link: "/dashboard",
  },

  {
    title: "Interventions",
    icon: BarChart3,
    submenu: [
      { title: "Listes", link: "/interventions" },
      { title: "Ajouter", link: "/intervention" },
    ],
  },


];



type LayoutProps = {
  children: ReactNode
}

export default function DashLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})
  

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
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">

          <div className="text-lg text-center font-bold">
            <a  href= "/">Mon Admin</a>
          </div>

          {/* Close mobile */}
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>

        </div>

        {/* Navigation */}
        <nav className="h-[calc(100%-64px)] overflow-y-auto p-4 space-y-2">

          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={index}>

                {/* Main menu */}
                <a
                  onClick={() =>
                    item.submenu
                      ? toggleMenu(item.title)
                      : setSidebarOpen(false)
                  }
                  href={item.link}
                  className="
                    w-full flex items-center justify-between
                    px-4 py-1 rounded-lg
                    hover:bg-gray-800
                    transition
                  "
                >

                  <div className="flex items-center gap-3">

                    <Icon size={20} />

                    <span>{item.title}</span>

                  </div>

                  {/* Arrow */}
                  {item.submenu && (
                    openMenus[item.title] ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )
                  )}

                </a>

                {/* Submenu */}
                {item.submenu && openMenus[item.title] && (

                  <div className="mt-2 ml-10">

                    {item.submenu.map((subItem, subIndex) => (

                      <Link
                        key={subIndex}
                        to={subItem.link}
                        className="
                          block px-3 py-1 rounded-md
                          text-sm text-gray-300
                          hover:bg-gray-800
                          hover:text-white
                          transition
                        "
                      >
                        {subItem.title}
                      </Link>

                    ))}

                  </div>

                )}

              </div>
            );
          })}

        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
       
        {/* Header */}
        <Header onToggle={() => setSidebarOpen(prev => !prev)} />
        {/*
        <header className="
          h-16 bg-white shadow-sm
          flex items-center justify-between
          px-4 lg:px-6
        ">

          <div className="flex items-center gap-4">
            
            {/* Mobile menu button *}
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={26} />
            </button>

            <h2 className="text-lg font-semibold text-gray-700">
              Tableau de bord
            </h2>

          </div>
          {/* Notifications *}
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
            <Bell size={22} className="text-gray-600" />

            {/* Badge *}
            <span
              className="
                absolute -top-1 -right-1
                bg-red-500 text-white
                text-[10px] font-bold
                w-5 h-5 rounded-full
                flex items-center justify-center
              "
            >
              3
            </span>
          </button>
        

          {/* Divider *}
          <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

          {/* Profile *}
          <div className="flex items-center gap-3">

            <img
              src="../assets/avatar.jpg"
              alt="Profil"
              className="w-10 h-10 rounded-full"
            />
            {/* Dropdown icon *}
            <ChevronDown size={18} className="text-gray-500 hidden sm:block" />

            <div className="hidden sm:block">

              <p className="text-sm font-medium text-gray-800">
                Admin
              </p>

              <p className="text-xs text-gray-500">
                Administrateur
              </p>
              

            </div>
              <div className="flex items-center gap-3">
                
              </div>
          </div>

        </header>
        */}


        {/* Main */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">

          {children}
          
        </main>

        {/* Footer */}
        <footer className="
          h-14 bg-white border-t
          flex items-center justify-center
          text-sm text-gray-500
        ">
          © 2026 Mon App
        </footer>

      </div>
    </div>
    </ThemeProvider>
  );
}