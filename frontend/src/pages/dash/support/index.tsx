// src/pages/business/index.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {type  Farm, farmApi } from "@/api/farm.api";
import {type  Building, buildingApi } from "@/api/building.api";
import { type Support, supportApi } from "@/api/support.api";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import DashLayout from "@/layouts/DashLayout";
import { DynamicTable} from "@/components/tables/DynamicTable";
import type{ Column } from "@/components/tables/DynamicTable";
import  Button  from "@/components/button/Button";
import ComponentCard from "@/components/common/ComponentCard";

import {Edit,  BookOpen} from 'lucide-react'




const BuildingPage = () => {

  const [elts, setElts] = useState<Support[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [farms, setFarms] = useState<Farm[]>([]);


  
  // 
  useEffect(() => {
    farmApi.getAll().then(data => {
      if(data !== null) setFarms( data)
    })  
  }, []);

  // 
  useEffect(() => {
    buildingApi.getAll().then(data => {
      if(data !== null) setBuildings( data)
    })  
  }, []);


const  EltCols:  Column<Support>[] = [
 
  {
    key: 'id',
    header: 'N',
    sortable: true,
    render:(_value, _row) => {
    
      const  uid = _value + 10000
      return uid
    }
  },
  
  {
    key: 'building_id',
    header: 'Ferme',
    sortable: true,
    render:(_value, row) => {
      if (!row.building_id) return "-";
      const  building = buildings.find( b => b.id == _value) 
      if(building)  {
        const  ferme = farms.find( b => b.id == building?.farm_id) 
        return ferme?.name || '-'
      }
      
    }
  },

  {
    key: 'building_id',
    header: 'Batiment',
    sortable: true,
    render:(_value, row) => {
      if (!row.building_id) return "-";
      const  building = buildings.find( b => b.id == _value) 
     
      return building?.name || '-'
    }
  },

  {
    key: 'type',
    header: 'Type',
    sortable: true,
  
  },


  {
    key: 'status',
    header: 'statut',

  },

  

 
];

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    const load= async () => {
      try {
        const res = await supportApi.getAll();

        console.log("🔥 RESPONSE Building:", res);
        const data = res;

        setElts(data);
      } catch (err) {
        console.error("❌ FETCH ERROR:", err);
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
        title="Support"
        description="Notfifer ici vos problèmes"
      />

      <PageBreadcrumb pageTitle="Support" />

      <ComponentCard  
        title=" Support"
        desc = "Notfifer ici vos problèmes"
      >
        <div>
 
          <DynamicTable 
            data={elts} 
            columns={ EltCols }
            linkButton="/support"
            actions={(elt) => (
              
              <div className="flex gap-1 justify-end">
                <Button  size="sm" variant="primary" className="bg-green-600 px-0 py-0">
                  <Link to = {`/support/${elt.id}`}><Edit  size="15"/></Link>
                </Button> 
                
                <Button  size ="sm" variant="primary"  className="bg-blue-600 px-2">
                  <Link to = {`/support${elt.id}`}><BookOpen  size="15"/></Link>
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

export default BuildingPage;