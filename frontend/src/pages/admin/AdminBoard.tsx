import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { socket } from "@/services/socket";
import axiosClient from "@/api/axiosClient";
import ReactECharts from "echarts-for-react";

//import React from 'react';
import { MetricGaugeCard } from '@/components/MetricGaugeCard';

import { type Building, buildingApi } from "@/api/building.api";
import { type Farm, farmApi } from "@/api/farm.api";
import { type Device, deviceApi } from "@/api/device.api";
import {type Souche,  soucheApi } from "@/api/souche.api";

import Select from "@/components/form/Select";
import Label from "@/components/form/Label";




export default function Dashboard() {
 
  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */
  const nbFerme = 0
  const nbVeterinaire = 0
  const nbFermier = 0
  const nbUsers = 0
  

  return (
    <AdminLayout>

      <div className="p-6 bg-gray-100 min-h-screen">

        {/* ==================================================
            TITRE
        ================================================== */}
        <div className="flex justify-between items-center mb-4">

          <h1 className="text-3xl font-bold mb-6">
            Admin Dashboard
          </h1>

        </div>
        

        {/* ==================================================
            VALEURS ACTUELLES
        ================================================== */}

        <div className="grid md:grid-cols-4 gap-5 mb-6">

          {/* Users */}

          <div className="bg-white p-5 rounded-xl shadow">

            <p className="text-gray-500">
              Users
            </p>

            <h2 className="text-3xl font-bold">
              {nbUsers ??
                "--"}{" "}
            
            </h2>

          </div>

          {/* Fermier */}

          <div className="bg-white p-5 rounded-xl shadow">

            <p className="text-gray-500">
                Fermier
            </p>

            <h2 className="text-3xl font-bold">
              {nbFermier ??
                "--"}{" "}
              
            </h2>

          </div>

          {/* Veterinaire */}

          <div className="bg-white p-5 rounded-xl shadow">

            <p className="text-gray-500">
              Vétérinaire
            </p>

            <h2 className="text-3xl font-bold">
              {nbVeterinaire ??
                "--"}{" "}
            
            </h2>

          </div>

          {/* Ferme */}

          <div className="bg-white p-5 rounded-xl shadow">

            <p className="text-gray-500">
              Fermes
            </p>

            <h2 className="text-3xl font-bold">
              {nbFerme ?? "--"}
              
            </h2>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
}
