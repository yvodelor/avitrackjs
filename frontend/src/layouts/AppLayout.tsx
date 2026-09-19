import type { ReactNode } from "react"


type LayoutProps = {
  children: ReactNode
}


export default function DashLayout({ children }: LayoutProps) {
 
    return (
        <div>
            <header>
                <nav>pp</nav>
            </header>

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
    );  
}