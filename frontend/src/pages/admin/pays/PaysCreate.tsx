import { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";
import {type  Pays, paysApi } from "@/api/pays.api";


import AdminLayout from "@/layouts/AdminLayout";

import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import ComponentCard from "@/components/common/ComponentCard";

import Label from "@/components/form/Label";


import Inputfield from "@/components/form/input/InputField";

import axios from "axios"
export default function VaccinCreate() {
  const { id } = useParams()

  const [loading, setLoading] = useState(false);

 // const [souches, setSouches] = useState<Souche[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});


  const isEdit =!!id;

  const[form, setForm] = useState<Omit<Pays, 'id'>>({
    nom: '',
    code: '',

  });

  const navigate = useNavigate();




  //Vaccin
  useEffect(() => {
    if(isEdit){
        paysApi.getById(id).then(data => {
          console.log(data)
          if(data !== null) setForm( data)
        })
    }
  }, [id, isEdit]);

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true);
    const errors: Record<string, string> = {};
    if (!form.nom.trim()) {
      errors.nom = "Le nom est obligatoire";
    }
   


    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    setFieldErrors({});
    
    try {
      if(isEdit){
        await paysApi.update((id), form)
      } else {
        await paysApi.create(form)
      }

      navigate('/admin/payss')

      
    } catch(err){
      console.log(err)
     if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Une erreur est survenue.";

        setError(message);
      } else {
        setError("Une erreur inattendue est survenue.");
      }



      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }finally{
      setLoading(false)
    }
  };

  return (
    <AdminLayout>
      <PageMeta
        title={isEdit ? "Modifier un pays " : " Ajouter un pays"} 
       
        description="Pays"
      />
      <PageBreadcrumb pageTitle="Pays" />

      <ComponentCard  
        title= "Pays"
        desc = {isEdit ? "Modifier" : "Créer"}
      >  

        {error && (
          <div className="p-3 mb-4 rounded bg-red-100 border border-red-300">
            <span className="text-red-600">{error}</span>
          </div>
        )}

        {Object.keys(fieldErrors).length > 0 && (
          <div className="mb-4 rounded border border-red-300 bg-red-50 p-4">
            <h3 className="mb-2 font-semibold text-red-700">
              Veuillez corriger les erreurs suivantes :
            </h3>

            <ul className="list-disc pl-5 text-red-600">
              {Object.entries(fieldErrors).map(([field, message]) => (
                <li key={field}>{message}</li>
              ))}
            </ul>
          </div>
        )}



        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-12 gap-4">

        

           

            {/* Nom */}
            <div className="col-span-6">
              <Label htmlFor="nom">Nom *</Label>
              <Inputfield
                name="nom"
                placeholder="Nom"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
              />
              {fieldErrors.nom && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.nom}
                </small>
              )}
            </div>

            {/* Code */}
            <div className="col-span-6">
              <Label htmlFor="code">Code *</Label>
              <Inputfield
                name="code"
                placeholder="Code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
              {fieldErrors.code && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.code}
                </small>
              )}
            </div>

  
          </div>
    
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {loading ? "En cours..." : isEdit ? "Mettre à jour" : "Créer"}
          </button>
        </form>        
      </ComponentCard>
      
    </AdminLayout>
  );
}


