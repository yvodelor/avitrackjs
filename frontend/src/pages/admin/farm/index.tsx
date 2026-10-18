// src/pages/business/index.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {type  Farm, farmApi } from "@/api/farm.api";
import {type  Pays, paysApi } from "@/api/pays.api";
import {type  Ville, villeApi } from "@/api/ville.api";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import DashLayout from "@/layouts/DashLayout";
import { DynamicTable} from "@/components/tables/DynamicTable";
import type{ Column } from "@/components/tables/DynamicTable";
import  Button  from "@/components/button/Button";
import ComponentCard from "@/components/common/ComponentCard";

import {Edit,  BookOpen} from 'lucide-react'







const FarmPage = () => {
  const [elts, setElts] = useState<Farm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [pays, setPays] = useState<Pays[]>([]);
  const [villes, setVilles] = useState<Ville[]>([]);



  
// Pays
useEffect(() => {
  paysApi.getAll().then(data => {
    if(data !== null) setPays( data)
  })  
}, []);

// Pays
useEffect(() => {
  villeApi.getAll().then(data => {
    if(data !== null) setVilles( data)
  })  
}, []);

console.log('pays', pays)
const  EltCols:  Column<Farm>[] = [
 
  {
    key: 'name',
    header: 'Ferme',
    sortable: true,
  
  },

  {
    key: 'pays_id',
    header: 'Pays',
    sortable: true,
     render:(_value, row) => {
      if (!row.pays_id) return "-";
      const  pa = pays.find( b => b.id == row.pays_id) 
      console.log('p', pa)
      return pa?.nom|| '-'
    }

  },

  {
    key: 'ville_id',
    header: 'Ville',
    sortable: true,
    render:(_value, row) => {
      if (!row.ville_id) return "-";
      const ville = villes.find( b => b.id == row.ville_id) 
      return ville?.nom|| '-'
    }
  },

 
];

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    const load= async () => {
      try {
        const res = await farmApi.getAll();

        console.log("RESPONSE farm:", res);
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
        title="Liste des fermes"
        description="Toutes mes fermes"
      />
      <PageBreadcrumb pageTitle="Femes" />

      <ComponentCard  
        title="Toutes mes ferme"
        desc = "Voici la listes de toutes vos fermes enrégistrées"
      >
        <div>
          <DynamicTable 
            data={elts} 
            columns={ EltCols }
            linkButton="/farm"
            actions={(elt) => (
              
              <div className="flex gap-1 justify-end">
                <Button  size="sm" variant="primary" className="bg-green-600 px-0 py-0">
                  <Link to = {`/farm/${elt.id}`}><Edit  size="15"/></Link>
                </Button> 
                
                <Button  size ="sm" variant="primary"  className="bg-blue-600 px-2">
                  <Link to = {`/farm/${elt.id}`}><BookOpen  size="15"/></Link>
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

export default FarmPage;