import { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";


import {type  Vaccination, vaccinationApi } from "@/api/vaccination.api";
import {type  Building, buildingApi } from "@/api/building.api";
import {type  Farm, farmApi } from "@/api/farm.api";
import DashLayout from "@/layouts/DashLayout";

import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import ComponentCard from "@/components/common/ComponentCard";

import Label from "@/components/form/Label";
import Select from "@/components/form/Select"
import TextArea from "@/components/form/input/TextArea"
import Inputfield from "@/components/form/input/InputField";

import axios from "axios"




export default function VaccinationCreate() {
  const { id } = useParams()

  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});


  const isEdit =!!id;

  const[form, setForm] = useState<Omit<Vaccination, 'id'>>({
    building_id: '',
    date: '',
    vaccins: '',
    remarque: '',
  });

  const navigate = useNavigate();


  //Farm
  const handleSelectFarm = (value: string) => {
    console.log("Selected value:", value);

    buildingApi.getByField('farm_id', value).then(data => {
      console.log('building', data)
      if(data !== null) setBuildings( data)
    }) 
    
  };

  useEffect(() => {
    farmApi.getAll().then(data => {
      console.log(data)
      if(data !== null) setFarms( data)
    })

  }, []);
  const optionFarm = farms.map(a => ({ value: a.id, label: a.name}));


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
  const optionBuilding = buildings.map(a => ({ value: a.id, label: a.name}));



 
  //Vaccination
  useEffect(() => {
    if(isEdit){
        vaccinationApi.getById(id).then(data => {
          console.log(data)
          if(data !== null) setForm( data)
        })
    }
  }, [id, isEdit]);

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true);
    const errors: Record<string, string> = {};
    if (!form.date.trim()) {
      errors.date = "Le dtae est obligatoire";
    }
    if (!form.vaccins.trim()) {
      errors.vaccins = " Le champ vaccin est obligatoire";
    }

    if (!form.building_id.trim() ) {
      errors.building_id = "Le champ Batiment est obligatoire";
    }


    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    setFieldErrors({});
    
    try {
      if(isEdit){
        await vaccinationApi.update((id), form)
      } else {
        await vaccinationApi.create(form)
      }

      navigate('/admin/vaccins')
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
        title={isEdit ? "Modifier Vaccination " : " Ajouter Vaccination"} 
       
        description="Vos Vaccinations"
      />
      <PageBreadcrumb pageTitle="Vaccination" />

      <ComponentCard  
        title= "Vaccination"
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

            <div className="col-span-12 md:col-span-4">
              <Label htmlFor="Building_id"> Ferme * </Label>
              <Select

                options = {optionFarm}
                placeholder = "Select une ferme"
                onChange={handleSelectFarm}
                defaultValue= { isEdit ? String('')  : ""}
              />
              {/* 
              {fieldErrors.building_id && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.building_id}
                </small>
              )}
              */}
            </div>

            <div className="col-span-12 md:col-span-4">
              <Label htmlFor="Building_id"> Batiment * </Label>
              <Select
                name="Building_id"
                
                options = {optionBuilding}
                placeholder = "Select une categorie"
                onChange={handleSelectBuilding}
                defaultValue= { isEdit ? String(form.building_id)  : ""}
              />
              {fieldErrors.building_id && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.building_id}
                </small>
              )}
            </div>



            {/* date */}
            <div className="col-span-4">
              <Label htmlFor="date">Date</Label>
              <Inputfield
                name="date"
                type="date"
                placeholder=""
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              {fieldErrors.date && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.date}
                </small>
              )}
            </div>

   

            <div className="col-span-12 md:col-span-12">
              <Label htmlFor="msg"> Vaccins à administrer</Label>
              <TextArea
                name="vaccins"
                placeholder = "Citez les Vaccins"
                value={form.vaccins}
                onChange={(value) => setForm({ ...form, vaccins: value })}
                rows={3}
              />
              {fieldErrors.vaccins && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.vaccins}
                </small>
              )}
            </div>

            <div className="col-span-12 md:col-span-12">
              <Label htmlFor="msg"> Remarque</Label>
              <TextArea
                name="name"
                placeholder = "Mettez votre remarque ici"
                value={form.remarque}
                onChange={(value) => setForm({ ...form, remarque: value })}
                rows={3}
              />
              {fieldErrors.remarque && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.remarque}
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


