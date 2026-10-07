// src/pages/business/index.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {type  Categorie, categorieApi } from "@/api/categorie.api";

import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import DashLayout from "@/layouts/DashLayout";
import { DynamicTable} from "@/components/tables/DynamicTable";
import type{ Column } from "@/components/tables/DynamicTable";
import  Button  from "@/components/button/Button";
import ComponentCard from "@/components/common/ComponentCard";

import {Edit,  BookOpen} from 'lucide-react'



const CategoriePage = () => {
  const [elts, setElts] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const  EltCols:  Column<Categorie>[] = [
  

    {
      key: 'name',
      header: 'Catégorie',
      sortable: true,
    
    },

  ];

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    const load= async () => {
      try {
        const res = await categorieApi.getAll();

        console.log("RESPONSE Building:", res);
        const data = res;

        setElts(data);
      } catch (err) {
        console.error(" FETCH ERROR:", err);
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
    return <p>Chargement...</p>;
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
        title="Device"
        description=""
      />
      <PageBreadcrumb pageTitle="Device" />

      <ComponentCard  
        title="Recherche du batiment"
        desc = ""
      >
        <div>
          <div>
            <div className="flex justify-end">
              <Button size="sm" variant="primary" className="bg-gray-600">
                <a href = "/device">Ajouter Device</a>
              </Button>
            </div>
          </div>
 
        </div>
      </ComponentCard>


      <ComponentCard  
        title="Installation"
        desc = "Installation"
      >
        <div>
          <div>
            <div className="flex justify-end">
              <Button size="sm" variant="primary" className="bg-gray-600">
                <a href = "/categorie">Ajouter Device</a>
              </Button>
            </div>
          </div>
          <DynamicTable 
            data={elts} 
            columns={ EltCols }
            actions={(elt) => (
              
              <div className="flex gap-1 justify-end">
                <Button  size="sm" variant="primary" className="bg-green-600 px-0 py-0">
                  <Link to = {`/categorie/${elt.id}`}><Edit  size="15"/></Link>
                </Button> 
                
                <Button  size ="sm" variant="primary"  className="bg-blue-600 px-2">
                  <Link to = {`/categorie/${elt.id}`}><BookOpen  size="15"/></Link>
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

export default CategoriePage;