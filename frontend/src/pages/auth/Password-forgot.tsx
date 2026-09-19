import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate} from "react-router-dom";
import Input from "../../components/form/input/InputField";

import { loginApi } from "../../api/auth.api";
import {  LoaderCircle} from "lucide-react";


export default function PasswordForgot() {
  const [email, setEmail] = useState("");
  const [password, ] = useState("");
  const [remember,] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState(false);


  const navigate = useNavigate();



  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setErreur(false);

    try {
      const response = await loginApi({
        email,
        password,
        remember,
      });

      const data = response.data;
      
      // 👉 action après succès
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

      //Enregistrement du Token
      localStorage.setItem("token", data.token)
      
    } catch (error) {
      console.error("Erreur login :", error);
      setErreur(true);

    }finally {
        setLoading(false);
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-2">
      
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        
        <h1 className="text-2xl font-bold text-center mb-6">
          Mot de passe oublié
        </h1>
        
        {loading &&
          <div className="flex items-center justify-center m-3">
            <LoaderCircle className="animate-spin text-white-600" size={18} />
          </div>
        }
        
        {erreur &&(
          <div  className="flex items-center justify-center m-3" > 
            <span  className=" bg-success-50 text-red-600" > 
              Cet email est invalide ou n'exite pas dans notre base de donnée
            </span>
          </div>
        )}
       
    
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <label>Entrer votre Email</label>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-semibold"
          >
            Envoyer
          </button>

        </form>

        
      </div>
    </div>
  );
}