import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {type  Alert, alertApi } from "@/api/alert.api";
import {type  Categorie, categorieApi } from "@/api/categorie.api";
import {type  Souche, soucheApi } from "@/api/souche.api";

import {type  TypeMesure, typeMesureApi } from "@/api/typeMesure.api";

import DashLayout from "@/layouts/DashLayout";

import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import ComponentCard from "@/components/common/ComponentCard";

import Label from "@/components/form/Label";
import Inputfield from "@/components/form/input/InputField";
import Select from "@/components/form/Select"
import TextArea from "@/components/form/input/TextArea"
import axios from "axios"

export default function AlertCreate() {
  const { id } = useParams()

  const [loading, setLoading] = useState(false);
  //const [elts, setElts] = useState(false);

  const [categories, setCategories] = useState<Categorie[]>([]);
  const [souches, setSouches] = useState<Souche[]>([]);

  const [typeMesures, setTypeMesures] = useState<TypeMesure[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});


  const isEdit =!!id;

  const[form, setForm] = useState<Omit<Alert, 'id'>>({

  categorie_id: '',
  type_mesure_id: '',
 
  age_min: '',
  age_max: '',
  val_min: '',
  val_max: '',
  val_limit: '',
  message: '',
  message_warning: '',
  message_danger: ''
  
    
  });

  const navigate = useNavigate();

  // Categorie
  const handleSelectCategorie = (value: string) => {
    console.log("Selected value:", value);
    setForm((prev) => ({
      ...prev,
      categorie_id: value
    }));   

    soucheApi.getAll().then(data => {
      console.log(data)
      if(data !== null ) setSouches(data)
    })
  };

  useEffect(() => {
    categorieApi.getAll().then(data => {
      console.log(data)
      if(data !== null) setCategories(data)
    })  
  }, []);

  const optionCategorie = categories.map(a => ({ value: a.id, label: a.name }));


  // Souche
  
  const handleSelectSouche = (value: string) => {
    console.log("Selected value:", value);
    setForm((prev) => ({
      ...prev,
      souche_id: null
    }));   
  };

  useEffect(() => {
    soucheApi.getAll().then(data => {
      console.log(data)
      if(data !== null ) setSouches(data)
    })
  
  }, []);

  
  const optionSouc = souches.map(a => ({ value: a.id, label: a.name }));

  const optionSouche = [
    { value: 'null', label: 'Null' },
    ...optionSouc
  ]


  // TypeMesure
  const handleSelectMesure = (value: string) => {
    console.log("Selected value:", value);
    setForm((prev) => ({
      ...prev,
      type_mesure_id: value
    }));   
  };

  useEffect(() => {
    typeMesureApi.getAll().then(data => {
      console.log(data)
      if(data !== null) setTypeMesures(data)
    })  
  }, []);
  const optionTypeMesure = typeMesures.map(a => ({ value: a.id, label: a.name }));




  // Alert
  useEffect(() => {
    if(isEdit){
        alertApi.getById(id).then(data => {
          console.log(data)
          if(data !== null) setForm( data)
        })
    }
  }, [id, isEdit]);



 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true);
    const errors: Record<string, string> = {};

    if (!String(form.categorie_id).trim()) {
      errors.categorie_id = "Veuillez sélectionner une categorie";
    }
   

    if (form.categorie_id === null || form.categorie_id === undefined) {
      errors.type_mesure_id = "Veuillez sélectionner le type de mesure";
    }

    if (!String(form.age_min).trim() && !form.age_max.trim()) {
      errors.age = "Entrer au moins l'age min ou max";
    }
    if (Number(form.age_min) > Number(form.age_max)) {
      errors.age = "Confusion au niveau des âges";
    }

    if (!String(form.val_min).trim() && !String(form.val_max).trim()) {
      errors.val = "Entrer au moins une valeur min ou max";
    }

    if (Number(form.val_min) > Number(form.val_max)) {
      errors.age = "Confusion au niveau des valeurs";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    setFieldErrors({});
    
    try {
      if(isEdit){
        await alertApi.update((id), form)
      } else {
        await alertApi.create(form)
      }

      navigate('/admin/alerts')
    }catch (err) {
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


            {/* Categorie id */}
            <div className="col-span-12 md:col-span-4">
              <Label htmlFor="categorie_id"> Categorie * </Label>
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
   
            { /*Souche id */}
            <div className="col-span-12 md:col-span-4">
              <Label htmlFor="souche_id"> Souche  </Label>
              <Select
                name="souche_id"
                options = {optionSouche}
                placeholder = "Select une souche"
                onChange={handleSelectSouche}
                defaultValue= { isEdit ? String(form.souche_id)  : ""}
              />
           
            </div>
            
     
   
            {/* Type Mesure id */}
            <div className="col-span-12 md:col-span-4">
              <Label htmlFor="typeMesure_id"> TypeMesure * </Label>
              <Select
                name="type_mesure_id"
                options = {optionTypeMesure}
                placeholder = "Select un type de Mesure"
                onChange={handleSelectMesure}
                defaultValue= { isEdit ? String(form.type_mesure_id)  : ""}
              />
              {fieldErrors.type_mesure_id && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.type_mesure_id}
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

            {/* Val min */}
            <div className="col-span-5">
              <Label htmlFor="val_min">Val min *</Label>
              <Inputfield
                name="val_min"
                placeholder="Valeur minimum"
                value={form.val_min}
                onChange={(e) => setForm({ ...form, val_min: e.target.value })}
              />
              {fieldErrors.val_min && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.val_min}
                </small>
              )}
            </div>

            {/* Val max */}
            <div className="col-span-5">
              <Label htmlFor="val_max">Val max *</Label>
              <Inputfield
                name="val_max"
                placeholder="Valeur maximun"
                value={form.val_max}
                onChange={(e) => setForm({ ...form, val_max: e.target.value })}
              />
              {fieldErrors.val_max && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.val_max}
                </small>
              )}
            </div>

             {/* +/- */}
            <div className="col-span-2">
              <Label htmlFor="val_max">Plus ou moins</Label>
              <Inputfield
                name="val_limit"
                placeholder="valeur limite"
                value={form.val_limit}
                onChange={(e) => setForm({ ...form, val_limit: e.target.value })}
              />
              {fieldErrors.val_limit && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.val_limit}
                </small>
              )}
            </div>

            <div className="col-span-12 md:col-span-12">
              <Label htmlFor="msg"> Message ok </Label>
              <TextArea
                name="message"
                placeholder = "Citez les Vaccins"
                value={form.message}
                onChange={(value) => setForm({ ...form, message: value })}
                rows={6}
              /> 
            </div>

            <div className="col-span-12 md:col-span-12">
              <Label htmlFor="message_warning"> Message Warning * </Label>
              <TextArea
                name="message_warning"
                placeholder = "Citez les Vaccins"
                value={form.message_warning}
                onChange={(value) => setForm({ ...form, message_warning: value })}
                rows={6}
              /> 
            </div>

            <div className="col-span-12 md:col-span-12">
              <Label htmlFor="msg"> Message Dager * </Label>
              <TextArea
                name="message_danger"
                placeholder = "Citez les Vaccins"
                value={form.message_danger}
                onChange={(value) => setForm({ ...form, message_danger: value })}
                rows={6}
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
     
 

