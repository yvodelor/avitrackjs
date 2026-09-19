import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/form/input/InputField";
import Checkbox from "../../components/form/input/Checkbox";
import { loginApi } from "../../api/auth.api";
import {  LoaderCircle} from "lucide-react";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
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
          Connexion
        </h1>
        
        {loading &&
          <div className="flex items-center justify-center m-3">
            <LoaderCircle className="animate-spin text-white-600" size={18} />
          </div>
        }
        
        {erreur &&(
          <div  className="flex items-center justify-center m-3" > 
            <span  className=" bg-success-50 text-red-600" > 
              Emal/mot de passe est incorect
            </span>
          </div>
        )}
       
    
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <Input
            name="password"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center justify-between gap-2">
            <div>
            {/* Checkbox */}
            <Checkbox 
              name = "remember"
              label="Se souvenir de moi"
              checked={remember}
              onChange={setRemember}

            />
            </div>
            <div>
              <Link to ={`/password-forgot`} className={"text-blue-600 , hover:underline"}>
              Mot de plasse oublié </Link>
            </div>

          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-semibold"
          >
            Se connecter 
          </button>

        </form>

        <div className="mt-3 text-center">
          <p className="">
            <Link to ={`/register`}  className={"hover:text-blue-600 , underline"}>
              Vous n'aviez pas encore un compte? S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}