import { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";
import {type  Categorie, categorieApi } from "@/api/categorie.api";
import {type  Souche, soucheApi } from "@/api/souche.api";
import {type  Vaccin, vaccinApi } from "@/api/vaccin.api";

import DashLayout from "@/layouts/DashLayout";

import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import ComponentCard from "@/components/common/ComponentCard";

import Label from "@/components/form/Label";
import Select from "@/components/form/Select"
import TextArea from "@/components/form/input/TextArea"
import Inputfield from "@/components/form/input/InputField";

import axios from "axios"
export default function VaccinCreate() {
  const { id } = useParams()

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [souches, setSouches] = useState<Souche[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});


  const isEdit =!!id;

  const[form, setForm] = useState<Omit<Vaccin, 'id'>>({
    name: '',
    categorie_id: '',
    souche_id: null,
    age_min: '',
    age_max: '', 
    remarque: '',
    optional: false
  });

  const navigate = useNavigate();

  //Categorie
  const handleSelectCategorie = (value: string) => {
    console.log("Selected value:", value);
    setForm((prev) => ({
      ...prev,
      categorie_id: value
    }));   
  };

  useEffect(() => {
    categorieApi.getAll().then(data => {
      console.log(data)
      if(data !== null) setCategories( data)
    })  
  }, []);
  const optionCategorie = categories.map(a => ({ value: a.id, label: a.name}));



  //Souche
  const handleSelectSouche = (value: string) => {
    console.log("Selected value:", value);
    setForm((prev) => ({
      ...prev,
      souche_id: value
    }));   
  };

  useEffect(() => {
    soucheApi.getAll().then(data => {
      console.log(data)
      if(data !== null) setSouches( data)
    })  
  }, []);
  const optionSouche = souches.map(a => ({ value: a.id, label: a.name}));

 
  //Vaccin
  useEffect(() => {
    if(isEdit){
        vaccinApi.getById(id).then(data => {
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
      errors.name = "Le nom est obligatoire";
    }
    if (!form.categorie_id.trim()) {
      errors.categorie_id = "Veuillez sélectionner une catégorie ";
    }

    if (!form.age_min.trim() && !form.age_max.trim()) {
      errors.age = "Entrer au moins l'age min ou max";
    }
    if (Number(form.age_min) > Number(form.age_max)) {
      errors.age = "Entrer au moins l'age mi depasse l'age max";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    setFieldErrors({});
    
    try {
      if(isEdit){
        await vaccinApi.update((id), form)
      } else {
        await vaccinApi.create(form)
      }

      navigate('/admin/vaccins')
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
    <DashLayout>
      <PageMeta
        title={isEdit ? "Modifier un batiment " : " Ajouter un batiment"} 
       
        description="Votre ferme"
      />
      <PageBreadcrumb pageTitle="Batinment" />

      <ComponentCard  
        title= "Batiment"
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

            <div className="col-span-12 md:col-span-6">
              <Label htmlFor="categorie_id"> Catégorie * </Label>
              <Select
                name="categorie_id"
                
                options = {optionCategorie}
                placeholder = "Select une categorie"
                onChange={handleSelectCategorie}
                defaultValue= { isEdit ? String(form.categorie_id)  : ""}
              />
              {fieldErrors.categorie_id && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.categorie_id}
                </small>
              )}
            </div>


            <div className="col-span-12 md:col-span-6">
              <Label htmlFor="souche_id"> Souche * </Label>
              <Select
                name="souche_id"
                
                options = {optionSouche}
                placeholder = "Select un alert"
                onChange={handleSelectSouche}
                defaultValue= { isEdit ? String(form.souche_id)  : ""}
              />
              {fieldErrors.souche_id && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.souche_id}
                </small>
              )}
            </div>

            {/* Age_min */}
            <div className="col-span-6">
              <Label htmlFor="age_min">Age min *</Label>
              <Inputfield
                name="age_min"
                placeholder="Age minimum"
                value={form.age_min}
                onChange={(e) => setForm({ ...form, age_min: e.target.value })}
              />
              {fieldErrors.age_min && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.age_min}
                </small>
              )}
            </div>

            {/* Age_max */}
            <div className="col-span-6">
              <Label htmlFor="age_max">Age max *</Label>
              <Inputfield
                name="age_max"
                placeholder="Age maximum"
                value={form.age_max}
                onChange={(e) => setForm({ ...form, age_max: e.target.value })}
              />
              {fieldErrors.age_max && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.Age_max}
                </small>
              )}
            </div>

            <div className="col-span-12 md:col-span-12">
              <Label htmlFor="msg"> Vaccins à administrer</Label>
              <TextArea
                name="name"
                placeholder = "Citez les Vaccins"
                value={form.name}
                onChange={(value) => setForm({ ...form, name: value })}
                rows={6}
              />
              {fieldErrors.name && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.name}
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
      
    </DashLayout>
  );
}


