import { useState, useEffect} from "react";

import { useNavigate, useParams } from "react-router-dom";

import {type  Farm, farmApi } from "@/api/farm.api";
import {type  Pays, paysApi } from "@/api/pays.api";
import {type  Ville, villeApi } from "@/api/ville.api";

import DashLayout from "@/layouts/DashLayout";

import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import ComponentCard from "@/components/common/ComponentCard";

import Label from "@/components/form/Label";
import Inputfield from "@/components/form/input/InputField";
import Select from "@/components/form/Select"
import TextArea from "@/components/form/input/TextArea";

import axios from "axios";

export default function FarmCreate() {
  const { id } = useParams()

  const [loading, setLoading] = useState(false);
  //const [elts, setElts] = useState(false);
  const [pays, setPays] = useState<Pays[]>([]);
  const [villes, setVilles] = useState<Ville[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});


  const isEdit =!!id;

  const[form, setForm] = useState<Omit<Farm, 'id'>>({
    name: '',
    pays_id: '',
    ville_id: '',
    adresse: ''   
  });

  const navigate = useNavigate();


  const handleSelectPays = (value: string) => {
    console.log("Selected value:", value);

    villeApi.getByField('pays_id', value).then(data => {
      console.log('ville', data)
      setVilles( data)
    }) 

    setForm((prev) => ({
      ...prev,
      pays_id: value
    }));   
  };


  const handleSelectVille = (value: string) => {
    console.log("Selected value:", value);
    setForm((prev) => ({
      ...prev,
      ville_id: value
    }));   
  };


  // Pays
  useEffect(() => {
    paysApi.getAll().then(data => {
      console.log(data)
      if(data !== null) setPays( data)
    })  
  }, []);
  const optionPays = pays.map(a => ({ value: a.id, label: a.nom }));


  // Pays
  useEffect(() => {
    villeApi.getByField('pays_id', form.pays_id).then(data => {
      console.log(data)
      if(data !== null) setVilles( data)
    })  
  }, [form.pays_id]);
  const optionVilles = villes.map(a => ({ value: a.id, label: a.nom }));


  // farm
  useEffect(() => {
    if(isEdit){
        farmApi.getById(id).then(data => {
          console.log(data)
          if(data !== null) setForm( data)
        })
    }
  }, [id, isEdit]);



 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true);
    const errors: Record<string, string> = {};
    if (!form.name.trim()) {
      errors.name = "Le nom de la ferme est obligatoire";
    }
    if (!form.pays_id.trim()) {
      errors.pays_id = "Veuillez sélectionner un pays";
    }
    if (!form.ville_id.trim()) {
      errors.ville_id = "Veuillez sélectionner une ville";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    
    setFieldErrors({});
    
    try {
      if(isEdit){
        await farmApi.update((id), form)
      } else {
        await farmApi.create(form)
      }

      navigate('/farms')
    } catch(err){
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
    <DashLayout>
      <PageMeta
        title={isEdit ? "Modifier ue ferme " : " Ajouter une ferme"} 
       
        description="Votre ferme"
      />
      <PageBreadcrumb pageTitle="Fermes" />

      <ComponentCard  
        title= "Ferme"
        desc = {isEdit ? "Modifier" : "Ajouter"}
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
              <Label htmlFor="name">Nom *</Label>
              <Inputfield
                name="name"
                placeholder="Nom de la ferme"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {fieldErrors.name && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.name}
                </small>
              )}
            </div>

            <div className="col-span-12 md:col-span-6">
              <Label htmlFor="pays_id">
                Pays *
              </Label>
              <Select
                name="pays_id"
                
                options = {optionPays}
                placeholder = "Select votre pays"
                onChange={handleSelectPays}
                defaultValue= { isEdit ? String(form.pays_id)  : ""}
              />
              {fieldErrors.pays_id && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.pays_id}
                </small>
              )}
            </div>
            
            
            <div className="col-span-12 md:col-span-6">
              <Label>Ville *</Label>
              <Select
                name="ville"
                options = {optionVilles}
                placeholder = "Select une ville"
                onChange={handleSelectVille}
                defaultValue= { isEdit ? String(form.ville_id)  : ""}
              />
              {fieldErrors.ville_id && (
                <p className="mt-1 text-sm text-red-500">
                  {fieldErrors.ville_id}
                </p>
              )}
            </div>

            <div className=" col-span-12">
              <Label>Adresse</Label>
              <TextArea
                name="adresse"
                value={form.adresse}
                onChange={(value) => setForm({ ...form, adresse: value })}
                rows={3}
              />
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
      
    </DashLayout>
  );
}
     
 

