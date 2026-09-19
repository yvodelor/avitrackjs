
import { Navigate } from 'react-router-dom'
//import { API } from '../routes'

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children}: Props) =>{
    const token = localStorage.getItem("token");

    if(!token) {
        return <Navigate to="/login" replace />

    }
    
    /*
    useEffect(() => {
        fetch(API.auth.me, { credentials: 'include'})
            .then(res => setAuthed(res.ok))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div>Chargement...</div>
    if(!authed) return <Navigate to="/login" replace />
    */
   
    return <>{children}</>

};

export default ProtectedRoute;