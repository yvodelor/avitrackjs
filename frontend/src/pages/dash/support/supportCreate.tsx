import { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {type  Farm, farmApi } from "@/api/farm.api";
import {type  Building, buildingApi } from "@/api/building.api";
import {type  Support, supportApi } from "@/api/support.api";

import DashLayout from "@/layouts/DashLayout";

import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import ComponentCard from "@/components/common/ComponentCard";

import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select"
import TextArea from "@/components/form/input/TextArea";
import axios from "axios";

export default function BuildingCreate() {
  const { id } = useParams()

  const [loading, setLoading] = useState(false);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [farmId, setFarmId] = useState<string>();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});


  const isEdit =!!id;

  const[form, setForm] = useState<Omit<Support, 'id'>>({
    type: '',
    building_id: '',
    subject: '',
    description: '',

  });

  const navigate = useNavigate();

  const handleSelectFarm = (value: string) => {
    console.log("Selected value:", value);
    setFarmId(value) 
  };

  // Farm
  useEffect(() => {
    farmApi.getAll().then(data => {
      console.log(data)
      if(data !== null) setFarms( data)
    })  
  }, []);
  const optionFarm = farms.map(a => ({ value: a.id, label: a.name }));

  //building
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
  const optionBuilding = buildings.map(a => ({ value: a.id, label: a.name }));
  

  // Support
  useEffect(() => {
    if(isEdit){
        supportApi.getById(id).then(data => {
          console.log(data)
          if(data !== null) setForm( data)
        })
    }
  }, [id, isEdit]);

  // Type 
  const optionType = [
    { value: 'complaint', label: 'Plainte'},
    { value: 'veterinay_help', label: 'Aide vétérinaire'},
    { value: 'technical_help', label: 'Support technique'}
  ]

  const handleSelectType = (value: string) => {
    console.log("Selected value:", value);
    setForm((prev) => ({
      ...prev,
      type: value
    })); 
  };


 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); 
    const errors: Record<string, string> = {};
    if (!form.type.trim()) {
      errors.type = "Le type de support";
    }

    if (!form.subject.trim()) {
      errors.sbject = "Le sujet";
    }

    if (!form.building_id.trim()) {
      errors.sbject = "Le bâtiment";
    }
    
    if (!String(form.description).trim()) {
      errors.description = "La description obligatoire";
    }



    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    setFieldErrors({});
    
    try {
      if(isEdit){
        await supportApi.update((id), form)
      } else {
        await supportApi.create(form)
      }

      navigate('/supports')
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
        title={isEdit ? "Modifier un Support" : " Ajouter un Support"} 
       
        description="Support"
      />
      <PageBreadcrumb pageTitle="Support" />

      <ComponentCard  
        title= "Support"
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
              <Label htmlFor="farm_id"> Ferme *  </Label>
              <Select
                name="farm_id"
                
                options = {optionFarm}
                placeholder = "Select une ferme"
                onChange={handleSelectFarm}
                defaultValue= { isEdit ? farmId : ""}
              />
              {fieldErrors.farm_id && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.farm_id}
                </small>
              )}
            </div>


            <div className="col-span-12 md:col-span-4">
              <Label htmlFor="building_id"> Batiment *  </Label>
              <Select
                name="building_id"
                
                options = {optionBuilding}
                placeholder = "Select un batiment"
                onChange={handleSelectBuilding}
                defaultValue= { isEdit ? String(form.building_id)  : ""}
              />
              {fieldErrors.building_id && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.building_id}
                </small>
              )}
            </div>


            <div className="col-span-12 md:col-span-4">
              <Label htmlFor="type"> Type *  </Label>
              <Select
                name="type"
                options = {optionType}
                placeholder = "Select une Type"
                onChange={handleSelectType}
                defaultValue= { isEdit ? String(form.type)  : ""}
              />
              {fieldErrors.type && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.type}
                </small>
              )}
            </div>  

            <div className="col-span-12 md:col-span-12">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                name="subject"
                placeholder="Suejet"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
              {fieldErrors.suject && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.subject}
                </small>
              )}
            </div>

            <div className="col-span-12 md:col-span-12">
              <Label htmlFor="msg">Descripion * </Label>
              <TextArea
                name="description"
                placeholder = "Description"
                value={form.description}
                onChange={(value) => setForm({ ...form, description: value })}
                rows={7}
              />
              {fieldErrors.descripion && (
                <small className="mt-1 text-sm text-red-500">
                  {fieldErrors.description}
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
     
 

