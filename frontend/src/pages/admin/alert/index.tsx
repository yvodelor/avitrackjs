// src/pages/business/index.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {type  Alert, alertApi } from "@/api/alert.api";
import { type Categorie, categorieApi } from "@/api/categorie.api";
import { type Souche, soucheApi } from "@/api/souche.api";
import { type TypeMesure, typeMesureApi } from "@/api/typeMesure.api";

import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import DashLayout from "@/layouts/DashLayout";
import { DynamicTable} from "@/components/tables/DynamicTable";
import type{ Column } from "@/components/tables/DynamicTable";
import  Button  from "@/components/button/Button";
import ComponentCard from "@/components/common/ComponentCard";

import {Edit,  BookOpen} from 'lucide-react'




const AlertPage = () => {
  
  const [elts, setElts] = useState<Alert[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [souches, setSouches] = useState<Souche[]>([]);
  const [typeMesures, setTypeMesures] = useState<TypeMesure[]>([]);
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


  //TypeMesure
  useEffect(() => {
    typeMesureApi.getAll().then(data => {
      if(data !== null) setTypeMesures( data)
    })  
  }, []);



  const  EltCols:  Column<Alert>[] = [
  
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
      key: 'type_mesure_id',
      header: 'Type Mesure',
      sortable: true, 

      render:(_value, row) => {
      if (!row.type_mesure_id) return "-";
      const tymes = typeMesures.find( b => b.id == row.type_mesure_id) 
      return tymes?.name || '-'
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

      {
      key: 'val_min',
      header: 'Val min',
      sortable: true, 
    },

    {
      key: 'val_max',
      header: 'Val max',
      sortable: true, 
    },

    {
      key: 'val_limit',
      header: '+/-',
      sortable: true, 
    },  

  
  ];

  /* =========================
     FETCH DATA
  ========================= */
  
  useEffect(() => {
    const load= async () => {
      try {
        const res = await alertApi.getAll();

        console.log("RESPONSE Alert:", res);
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
        title="Liste des Agents IA"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Agent IA" />

      <ComponentCard  
        title="Base de connaisance"
        desc = "Ajouter une Question"
      >
        <div>
          
          <DynamicTable 
            data={elts} 
            columns={ EltCols }
            textButton="Ajouter"
            linkButton="/admin/alert"
            actions={(elt) => (
              
              <div className="flex gap-1 justify-end">
                <Button  size="sm" variant="primary" className="bg-green-600 px-0 py-0">
                  <Link to = {`/admin/alert/${elt.id}`}><Edit  size="15"/></Link>
                </Button> 
                
                <Button  size ="sm" variant="primary"  className="bg-blue-600 px-2">
                  <Link to = {`/admin/alert/${elt.id}`}><BookOpen  size="15"/></Link>
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

export default AlertPage;