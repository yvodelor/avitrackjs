import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Logout() {
  const navigate = useNavigate()

  useEffect(() => {
    // 1. supprimer le token
    localStorage.removeItem("token")

    // (optionnel) supprimer d'autres infos user
    localStorage.removeItem("user")

    // 2. redirection vers login
    navigate("/login")
  }, [navigate])

  return (
    <div className="p-4">
      Déconnexion en cours...
    </div>
  )
}