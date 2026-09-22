import { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {type  Farm, farmApi } from "@/api/farm.api";
import {type  Building, buildingApi } from "@/api/building.api";
import {type  Souche, soucheApi } from "@/api/souche.api";

import DashLayout from "@/layouts/DashLayout";

import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import ComponentCard from "@/components/common/ComponentCard";

import Label from "@/components/form/Label";
import Inputfield from "@/components/form/input/InputField";
import Select from "@/components/form/Select"

import axios from "axios";

export default function BuildingCreate() {
  const { id } = useParams()

  const [loading, setLoading] = useState(false);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [souches, setSouches] = useState<Souche[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});


  const isEdit =!!id;

  const[form, setForm] = useState<Omit<Building, 'id'>>({
    name: '',
    farm_id: '',
    souche_id: '',
    date_initial: '',
    capacity: '',
    type: ''   
    
  });

  const navigate = useNavigate();

  const handleSelectFarm = (value: string) => {
    console.log("Selected value:", value);
    setForm((prev) => ({
      ...prev,
      farm_id: value
    }));   
  };

  // Farm
  useEffect(() => {
    farmApi.getAll().then(data => {
      console.log(data)
      if(data !== null) setFarms( data)
    })  
  }, []);
  const optionFarm = farms.map(a => ({ value: a.id, label: a.name }));


  //Souche 
  const handleSelectSouche = (value: string) => {
    console.log("Selected value:", value);
    setForm((prev) => ({
      ...prev,
      souche_id: value
    }));   
  };

  //
  useEffect(() => {
    soucheApi.getAll().then(data => {
      console.log(data)
      if(data !== null) setSouches( data)
    })  
  }, []);
  const optionSouche = souches.map(a => ({ value: a.id, label: a.name }));


  // Building
  useEffect(() => {
    if(isEdit){
        buildingApi.getById(id).then(data => {
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

    if (!form.date_initial.trim()) {
      errors.date_initial = "La date de de départ";
    }
    
    if (!String(form.souche_id).trim()) {
      errors.souche_id = "Le type de souche obligatoire";
    }

    if (!form.farm_id.trim()) {
      errors.farm_id = "Veuillez sélectionner une ferme";
    }
    if (Number(form.capacity) <= 0) {
      errors.capacity = "Veuillez sélectionner la capacité";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    setFieldErrors({});
    
    try {
      if(isEdit){
        await buildingApi.update((id), form)
      } else {
        await buildingApi.create(form)
      }

      navigate('/buildings')
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
    <DashLayout>
      <PageMeta
        title={isEdit ? "Modifier un batiment " : " Ajouter un batiment"} 
       
        description="Batiment"
      />
      <PageBreadcrumb pageTitle="Bâtiment" />

      <ComponentCard  
        title= "Batiment"
        desc = {isEdit ? "Modifier" : "Ajouter un Bâtiment"}
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
            
            <div className="col-span-6 md:col-span-6">
              <Label htmlFor="name">Nom *</Label>
              <Inputfield
                name="name"
                placeholder="Nom du Bâtiment"
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
              <Label htmlFor="farm_id"> Ferme *  </Label>
              <Select
                name="farm_id"
                
                options = {optionFarm}
                placeholder = "Select une ferme"
                onChange={handleSelectFarm}
                defaultValue= { isEdit ? String(form.farm_id)  : ""}
              />
              {fieldErrors.farm_id && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.farm_id}
                </small>
              )}
            </div>

            <div className="col-span-12 md:col-span-4">
              <Label htmlFor="souche_id_id"> Souche *  </Label>
              <Select
                name="souche_id"
                options = {optionSouche}
                placeholder = "Select une Souche"
                onChange={handleSelectSouche}
                defaultValue= { isEdit ? String(form.souche_id)  : ""}
              />
              {fieldErrors.souche_id && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.souche_id}
                </small>
              )}
            </div>

            <div className="col-span-12 md:col-span-4">
              <Label htmlFor="date_initial">Date initial*</Label>
              <Inputfield
                type = "date"
                name="date_initial"
                placeholder="22/08/2026"
                value={form.date_initial}
                onChange={(e) => setForm({ ...form, date_initial: e.target.value })}
              />
              {fieldErrors.date_initial && (
                <p className="mt-1 text-sm text-red-500">
                  {fieldErrors.date_initial}
                </p>
              )}
            </div>
            
            <div className="col-span-12 md:col-span-4">
              <Label htmlFor="name">Capacité (m2) *</Label>
              <Inputfield
                name="capacity"
                placeholder="La superficie"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              />
              {fieldErrors.capacity && (
                <p className="mt-1 text-sm text-red-500">
                  {fieldErrors.capacity}
                </p>
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
     
 

