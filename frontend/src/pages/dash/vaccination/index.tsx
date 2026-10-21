import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {type  Building, buildingApi } from "@/api/building.api";
import {type  Vaccination, vaccinationApi } from "@/api/vaccination.api";
import {type  Vaccin, vaccinApi } from "@/api/vaccin.api";

import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import DashLayout from "@/layouts/DashLayout";
import { DynamicTable} from "@/components/tables/DynamicTable";
import type{ Column } from "@/components/tables/DynamicTable";
import  Button  from "@/components/button/Button";
import ComponentCard from "@/components/common/ComponentCard";

import {Edit,  BookOpen} from 'lucide-react'

import { formatDate } from "@/utils/date";


const VaccinationPage = () => {
  const [elts, setElts] = useState<Vaccination[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);  
  const [vaccinListe, setVaccins] = useState<Vaccin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");



// Building
useEffect(() => {
  buildingApi.getAll().then(data => {
    if(data !== null) setBuildings( data)
  })  
}, []);

// Vaccin
useEffect(() => {
  vaccinApi.getAll().then(data => {
    if(data !== null) setVaccins( data)
  })  
}, []);


  const  EltCols:  Column<Vaccination>[] = [
  
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render:(_value) =>formatDate(_value)
       
    },

    {
      key: 'building_id',
      header: 'Bâtiment',
      sortable: true,  
      render:(_value, row) => {
        if (!row.building_id) return "-";
        const building = buildings.find( b => b.id == row.building_id) 
        return building?.name|| '-'
      }
    },
    {
      key: 'vaccin_id',
      header: 'Vaccin',
      sortable: true,  
      render:(_value, row) => {
        if (!row.vaccin_id) return "-";
        const vac = vaccinListe.find( b => b.id == String(row.vaccin_id)) 
        return vac?.name|| '-'
      }
    },

    {
      key: 'vaccins',
      header: 'Autres vaccins',    
    },
  
  ];

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    const load= async () => {
      try {
        const res = await vaccinationApi.getAll();

        console.log("RESPONSE Vaccinations:", res);
        const data = res;

        setElts(data);
      } catch (err) {
        console.error("FETCH ERROR:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);


  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return <p>⏳ Chargement...</p>;
  }

  /* =========================
     ERROR
  ========================= */
  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }


  /* =========================
     UI
  ========================= */
  return (
    <DashLayout>
      
      <PageMeta
        title="Liste des Vaccination"
        description="Vaccination"
      />
      <PageBreadcrumb pageTitle="Vaccination" />

      <ComponentCard  
        title="Vaccination"
        desc = "Vaccination"
      >
        <div>
          <DynamicTable 
            data={elts} 
            columns={ EltCols }
            linkButton="/vaccination"
            actions={(elt) => (
              
              <div className="flex gap-1 justify-end">
                <Button  size="sm" variant="primary" className="bg-green-600 px-0 py-0">
                  <Link to = {`/vaccination/${elt.id}`}><Edit  size="15"/></Link>
                </Button> 
                
                <Button  size ="sm" variant="primary"  className="bg-blue-600 px-2">
                  <Link to = {`/vaccination/${elt.id}`}><BookOpen  size="15"/></Link>
                </Button>
              </div>
            )}
              
          >

          </DynamicTable>
        </div>
      </ComponentCard>
    </DashLayout>
  );
};

export default VaccinationPage;