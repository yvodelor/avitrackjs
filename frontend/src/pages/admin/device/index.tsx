// src/pages/business/index.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//import {type  Farm } from "@/api/farm.api";
import {type  Device, deviceApi } from "@/api/device.api";

import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import DashLayout from "@/layouts/DashLayout";
import { DynamicTable} from "@/components/tables/DynamicTable";
import type{ Column } from "@/components/tables/DynamicTable";
import  Button  from "@/components/button/Button";
import ComponentCard from "@/components/common/ComponentCard";

import {Edit,  BookOpen} from 'lucide-react'



const DevicePage = () => {
  const [elts, setElts] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
//  const [farms, setFarms] = useState<Farm[]>([]);


  const  EltCols:  Column<Device>[] = [
  

    {
      key: 'code',
      header: 'Device',
      sortable: true,
    
    },

    {
      key: 'building_id',
      header: 'Batiment',
      sortable: true,
    
    },

    {
      key: 'status',
      header: 'Statut',
      sortable: true,
    },



  
  ];

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    const load= async () => {
      try {
        const res = await deviceApi.getAll();

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
        title="Device"
        description=""
      />
      <PageBreadcrumb pageTitle="Device" />
      
      <ComponentCard  
        title="Installation"
        desc = "Installation"
      >
        <div>
          <div>
            <div className="flex justify-end">
              <Button size="sm" variant="primary" className="bg-gray-600">
                <a href = "/admin/device">Ajouter Device</a>
              </Button>
            </div>
          </div>
          <DynamicTable 
            data={elts} 
            columns={ EltCols }
            actions={(elt) => (
              
              <div className="flex gap-1 justify-end">
                <Button  size="sm" variant="primary" className="bg-green-600 px-0 py-0">
                  <Link to = {`/device/${elt.id}`}><Edit  size="15"/></Link>
                </Button> 
                
                <Button  size ="sm" variant="primary"  className="bg-blue-600 px-2">
                  <Link to = {`/device/${elt.id}`}><BookOpen  size="15"/></Link>
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

export default DevicePage;