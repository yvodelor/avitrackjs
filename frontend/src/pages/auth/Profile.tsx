import { useEffect, useState } from "react"

type User = {
  userId: string
  email: string
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch("http://localhost:3000/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) {
          throw new Error("Erreur lors du chargement du profil")
        }

        const data = await res.json()

        setUser(data.user)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return <div className="p-4">Chargement...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  if (!user) {
    return <div className="p-4">Aucun utilisateur trouvé</div>
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Profil utilisateur</h1>

      <div className="space-y-2">
        <p>
          <span className="font-semibold">User ID :</span> {user.userId}
        </p>

        <p>
          <span className="font-semibold">Email :</span> {user.email}
        </p>
      </div>
    </div>
  )
}