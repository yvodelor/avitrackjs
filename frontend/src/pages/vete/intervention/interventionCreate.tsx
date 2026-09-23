import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {type  Intervention, interventionApi } from "@/api/intervention.api";



import VeteLayout from "@/layouts/VeteLayout";

import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import ComponentCard from "@/components/common/ComponentCard";

import Label from "@/components/form/Label";
import Inputfield from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import axios from "axios";

export default function BuildingCreate() {
  const { id } = useParams()

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});


  const isEdit =!!id;

  const[form, setForm] = useState<Omit<Intervention, 'id'>>({
    date_visite: '',
    symptomes: '',
    diagnostic: '',
    traitement: '',
    observation: '',
    

  });

  const navigate = useNavigate();


  // Intervention
  useEffect(() => {
    if(isEdit){
        interventionApi.getById(id).then(data => {
          console.log(data)
          if(data !== null) setForm( data)
        })
    }
  }, [id, isEdit]);
  
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); 
    const errors: Record<string, string> = {};
    if (!form.date_visite.trim()) {
      errors.name = "La date";
    }

    if (!form.diagnostic.trim()) {
      errors.diagnostic = "Le diagnostic";
    }
    
    if (!String(form.traitement).trim()) {
      errors.traitement = "Le traitemente";
    }

    if (!form.symptomes.trim()) {
      errors.symptomes = "Les symptômes";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    setFieldErrors({});
    
    try {
      if(isEdit){
        await interventionApi.update((id), form)
      } else {
        await interventionApi.create(form)
      }

      navigate('/interventions')
    } 
    catch (err) {
      console.error("Erreur :", err);

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
    <VeteLayout>
      <PageMeta
        title={isEdit ? "Modifier une Intervention " : " Ajouter une intervention"} 
        description="Intervention"
      />
      <PageBreadcrumb pageTitle="Intervention" />

      <ComponentCard  
        title= "Intervention"
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

             <div className="col-span-12 md:col-span-12">
              <Label htmlFor="date_visite">Date_visite *</Label>
              <Inputfield
                name="name"
                type="date"
                placeholder="Nom de la ferme"
                value={form.date_visite}
                onChange={(e) => setForm({ ...form, date_visite: e.target.value })}
              />
              {fieldErrors.date_visite && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.date_visite}
                </small>
              )}
            </div>

            <div className="col-span-12 md:col-span-12">
              <Label htmlFor="msg">Symptômes </Label>
              <TextArea
                name="symptomes"
                placeholder = "Symptomes"
                value={form.symptomes}
                onChange={(value) => setForm({ ...form, symptomes: value })}
                rows={4}
              />
              {fieldErrors.symptomes && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.symptomes}
                </small>
              )}
            </div>

            
            <div className="col-span-12 md:col-span-12">
              <Label htmlFor="msg">Diagnostics </Label>
              <TextArea
                name="diagnostic"
                placeholder = "Diagnostic"
                value={form.diagnostic}
                onChange={(value) => setForm({ ...form, diagnostic: value })}
                rows={4}
              />
              {fieldErrors.diagnostic && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.diagnostic}
                </small>
              )}
            </div>

            
            <div className="col-span-12 md:col-span-12">
              <Label htmlFor="msg">Traitements </Label>
              <TextArea
                name="traitement"
                placeholder = "Traitement"
                value={form.traitement}
                onChange={(value) => setForm({ ...form, traitement: value })}
                rows={4}
              />
              {fieldErrors.traitement && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.traitement}
                </small>
              )}
            </div>

            <div className="col-span-12 md:col-span-12">
              <Label htmlFor="msg">Observations </Label>
              <TextArea
                name="observation"
                placeholder = "Observations"
                value={form.observation}
                onChange={(value) => setForm({ ...form, observation: value })}
                rows={4}
              />
              {fieldErrors.observation && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.observation}
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
      
    </VeteLayout>
  );
}
     
 

