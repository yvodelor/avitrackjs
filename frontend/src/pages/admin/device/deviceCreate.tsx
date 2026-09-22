import { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";


import {type  Farm, farmApi } from "@/api/farm.api";
import {type  Building, buildingApi } from "@/api/building.api";
import {type  Device, deviceApi } from "@/api/device.api";

import DashLayout from "@/layouts/DashLayout";

import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import ComponentCard from "@/components/common/ComponentCard";

import Label from "@/components/form/Label";
import Inputfield from "@/components/form/input/InputField";
import Select from "@/components/form/Select"

import axios from "axios"

export default function deviceCreate() {
  const { id } = useParams()

  const [loading, setLoading] = useState(false);
  const [farms, setFarms] = useState<Farm[]>([]);

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});


  const isEdit = !!id;

  const[form, setForm] = useState<Omit<Device, 'id'>>({
    building_id: '',
    code: '',
    status: '',
    module_id: ''
 
  });

  const navigate = useNavigate();






  // Farm
  const handleSelectFarm = (value: string) => {
    console.log("Selected value:", value); 
  };

  useEffect(() => {
    farmApi.getAll().then(data => {
      console.log(data)
      if(data !== null) setFarms( data)
    })  
  }, []);
  const optionFarm = farms.map(a => ({ value: a.id, label: a.name }));




  //Building
  const handleSelectBuilding = (value: string) => {
    console.log("Selected value:", value);
    setForm((prev) => ({
      ...prev,
      building_id: value
    }));   
  };

  useEffect(() => {
    buildingApi.getAll().then(data => {
      console.log(data)
      if(data !== null) setBuildings( data)
    })  
  }, []);
  const optionBuildings = buildings.map(a => ({ value: a.id, label: a.name }));





  // Device
  useEffect(() => {
    if(isEdit){
        deviceApi.getById(id).then(data => {
          console.log(data)
          if(data !== null) setForm( data)
        })
    }
  }, [id, isEdit]);



 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true);
    const errors: Record<string, string> = {};
    if (!form.code.trim()) {
      errors.code = "Le nom de la ferme est obligatoire";
    }
    if (!form.building_id.trim()) {
      errors.building = "Veuillez sélectionner une ferme";
    }


    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    setFieldErrors({});
    
    try {
      if(isEdit){
        await deviceApi.update((id), form)
      } else {
        await deviceApi.create(form)
      }

      navigate('/device')
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
      <PageBreadcrumb pageTitle="Add Device" />



      <div className="my-2">
        <ComponentCard  
          title= "Device"
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

              <div className="col-span-6 md:col-span-6">
                <Label > Fermier  </Label>
                <Select
                  name="user_id"               
                  options = {optionFarm}
                  placeholder = "Select un pays"
                  onChange={handleSelectFarm}
                  defaultValue= { isEdit ? ''  : ""}
                />
              </div>

              <div className="col-span-6 md:col-span-6">
                <Label > Ferme  </Label>
                <Select
                  name="ferme_id"               
                  options = {optionFarm}
                  placeholder = "Select un pays"
                  onChange={handleSelectFarm}
                  defaultValue= { isEdit ? ''  : ""}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <Label htmlFor="farm_id"> Batiment *  </Label>
                <Select
                  name="building_id"               
                  options = {optionBuildings}
                  placeholder = "Select un batiment"
                  onChange={handleSelectBuilding}
                  defaultValue= { isEdit ? String(form.building_id)  : ""}
                />
                {fieldErrors.farm_id && (
                  <small className="mt-1 text-sm text-red-500">
                    {fieldErrors.building_id}
                  </small>
                )}
              </div>
             
              <div className="col-span-12 md:col-span-6">
                <Label htmlFor="name">Code du Matériel *</Label>
                <Inputfield
                  name="code"
                  placeholder="F4UHY574GTF4"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                />
                {fieldErrors.code && (
                  <small className="mt-1 text-sm text-red-500">
                    {fieldErrors.code}
                  </small>
                )}
              </div>

              {/* 
              <div className="col-span-12 md:col-span-4">
                <Label htmlFor="module_id"> Type module </Label>
                <Select
                  name="module_id"
                  options = {optionModule}
                  placeholder = "Select le type de module"
                  onChange={handleSelectModule}
                  defaultValue= { isEdit ? String(form.module_id)  : ""}
                />
                {fieldErrors.module_id && (
                  <small className="mt-1 text-sm text-red-500">
                    {fieldErrors.module_id}
                  </small>
                )}
              </div>
              */}


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
      </div>
    </DashLayout>
  );
}
     
 

