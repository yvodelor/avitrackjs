// src/pages/business/index.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {type  Farm, farmApi } from "@/api/farm.api";
import {type  Building, buildingApi } from "@/api/building.api";
import { type Souche, soucheApi } from "@/api/souche.api";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import DashLayout from "@/layouts/DashLayout";
import { DynamicTable} from "@/components/tables/DynamicTable";
import type{ Column } from "@/components/tables/DynamicTable";
import  Button  from "@/components/button/Button";
import ComponentCard from "@/components/common/ComponentCard";

import {Edit,  BookOpen} from 'lucide-react'




const BuildingPage = () => {

  const [elts, setElts] = useState<Building[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [farms, setFarms] = useState<Farm[]>([]);
  const [souches, setSouches] = useState<Souche[]>([]);

  
  // 
  useEffect(() => {
    farmApi.getAll().then(data => {
      if(data !== null) setFarms( data)
    })  
  }, []);

  // 
  useEffect(() => {
    soucheApi.getAll().then(data => {
      if(data !== null) setSouches( data)
    })  
  }, []);


const  EltCols:  Column<Building>[] = [
 
  {
    key: 'name',
    header: 'Nom',
    sortable: true,
  },

  {
    key: 'farm_id',
    header: 'Ferme',
    sortable: true,
    render:(_value, row) => {
      if (!row.farm_id) return "-";
      const  ferme = farms.find( b => b.id == row.farm_id) 
     
      return ferme?.name || '-'
    }
  },

  {
    key: 'souche_id',
    header: 'Souche',
    sortable: true,
    render:(_value, row) => {
      if (!row.souche_id) return "-";
      const  souche = souches.find( b => b.id == row.souche_id) 
      return souche?.name || '-'
    }
  },

  {
    key: 'date_initial',
    header: 'Date',
    sortable: true,
      render:(_value, _row) => {
      const debut = new Date(_value)
      const maintenant  = new Date()
      debut.setHours(0,0,0,0)
      maintenant.setHours(0,0,0,0)
      const jr = Math.floor(maintenant.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24 )
      return  (jr > 0) ? jr: '-'
    }

  },

  

 
];

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    const load= async () => {
      try {
        const res = await buildingApi.getAll();

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
        title="Tous les Bâtiments"
        description="Tous les Bâtiments"
      />
      <PageBreadcrumb pageTitle="Bâtiments" />

      <ComponentCard  
        title="Bâtiments"
        desc = "Tous les Bâtiments par ferme"
      >
        <div>
 
          <DynamicTable 
            data={elts} 
            columns={ EltCols }
            linkButton="/building"
            actions={(elt) => (
              
              <div className="flex gap-1 justify-end">
                <Button  size="sm" variant="primary" className="bg-green-600 px-0 py-0">
                  <Link to = {`/building/${elt.id}`}><Edit  size="15"/></Link>
                </Button> 
                
                <Button  size ="sm" variant="primary"  className="bg-blue-600 px-2">
                  <Link to = {`/building/${elt.id}`}><BookOpen  size="15"/></Link>
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