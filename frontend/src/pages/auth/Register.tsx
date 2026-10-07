import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/form/input/InputField";
import Checkbox from "../../components/form/input/Checkbox";
import { registerApi } from "../../api/auth.api";
import Radio from "@/components/form/input/Radio";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [remember, setRemember] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await registerApi({
        name,
        email,
        password,
        password2,
        role
      });

      setError(null);
      setSuccess(null);

      console.log(response.data);
 
      setSuccess(response.data.message);

     
      navigate("/login");
     
      
    } catch (error: any) {
      console.error("Erreur Register :", error);

      const message =  error.response?.data?.message || "Erreur serveur";
      console.log(message);
      setError(message);
    }
 
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-2">
      
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

               
        <h1 className="text-2xl font-bold text-center mb-6">
          Inscription
        </h1>
        
        <div className = "my-3 text-center">
          {error && <p style={{ color: "red"  }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
        </div>


        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Nom */}
          <Input
            name="name"
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={true} 
          />


          {/* Email */}
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={true} 
            
          />

          {/* Password */}
          <Input
            name="password"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={true} 
          />

          {/* Password 2 */}
          <Input
            name="password2"
            type="password"
            placeholder="Répéter le Mot de passe"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />

          {/* Role */}
          <label>Je suis</label>
          <Radio id="farmer" name="role" value="fermier" label="Fermier" checked={role === "fermier"} onChange={setRole} />
          <Radio id="veterinarian" name="role" value="veterinaire" label="Vétérinaire" checked={role === "veterinaire"} onChange={setRole} />

          {/* Checkbox */}
          <Checkbox
            name= "remember"
            label="J'accepte le condition d'utilisation"
            checked={remember}
            onChange={setRemember}
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
          >
            S'inscrire
          </button>

        </form>

        <div className="mt-2 text-center">
          <p>Vous avez déjà un compte? <a href ="/login">Se connecter</a></p>
        </div>

      </div>
    </div>
  );
}