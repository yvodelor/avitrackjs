// src/pages/business/index.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {type  Vaccin, vaccinApi } from "@/api/vaccin.api";
import { type Categorie, categorieApi } from "@/api/categorie.api";
import { type Souche, soucheApi } from "@/api/souche.api";


import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import AdminLayout from "@/layouts/AdminLayout";
import { DynamicTable} from "@/components/tables/DynamicTable";
import type{ Column } from "@/components/tables/DynamicTable";
import  Button  from "@/components/button/Button";
import ComponentCard from "@/components/common/ComponentCard";

import {Edit,  BookOpen} from 'lucide-react'




const VaccinPage = () => {
  
  const [elts, setElts] = useState<Vaccin[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [souches, setSouches] = useState<Souche[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
 

  //Categorie 
  useEffect(() => {
    categorieApi.getAll().then(data => {
      if(data !== null) setCategories( data)
    })  
  }, []);

  //Souche 
  useEffect(() => {
    soucheApi.getAll().then(data => {
      if(data !== null) setSouches( data)
    })  
  }, []);





  const  EltCols:  Column<Vaccin>[] = [
    {
      key: 'name',
      header: 'Nom',
      sortable: true, 
    },
  
    {
      key: 'categorie_id',
      header: 'Categorie',
      sortable: true,
      render:(_value, row) => {
        if (!row.categorie_id) return "-";
        const cat = categories.find( b => b.id == row.categorie_id) 
        return cat?.name|| '-'
      }
    
    },
    {
      key: 'souche_id',
      header: 'Souche',
      sortable: true,
      render:(_value, row) => {
        if (!row.souche_id) return "-";
        const sch = souches.find( b => b.id == row.souche_id) 
        return sch?.name || '-'
      }
    
    },
  

    {
      key: 'age_min',
      header: 'Age min',
      sortable: true, 
    },

    {
      key: 'age_max',
      header: 'Age max',
      sortable: true, 
    },


  
  ];

  /* =========================
     FETCH DATA
  ========================= */
  
  useEffect(() => {
    const load= async () => {
      try {
        const res = await vaccinApi.getAll();

        console.log("RESPONSE Vaccin:", res);
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
    <AdminLayout>
      
      <PageMeta
        title="Liste des Agents IA"
        description="Vaccin"
      />
      <PageBreadcrumb pageTitle="Vaccin" />

      <ComponentCard  
        title="Vaccin"
        desc = "Vaccin"
      >
        <div>
          
          <DynamicTable 
            data={elts} 
            columns={ EltCols }
            textButton="Ajouter"
            linkButton="/admin/vaccin"
            actions={(elt) => (
              
              <div className="flex gap-1 justify-end">
                <Button  size="sm" variant="primary" className="bg-green-600 px-0 py-0">
                  <Link to = {`/admin/vaccin/${elt.id}`}><Edit  size="15"/></Link>
                </Button> 
                
                <Button  size ="sm" variant="primary"  className="bg-blue-600 px-2">
                  <Link to = {`/admin/vaccin/${elt.id}`}><BookOpen  size="15"/></Link>
                </Button>
                
              </div>
            )}
              
          >

          </DynamicTable>
        </div>
      </ComponentCard>
    </AdminLayout>
  );
};

export default VaccinPage;