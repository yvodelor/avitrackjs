import { useEffect, useMemo, useState } from "react";
import DashLayout from "@/layouts/DashLayout";
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

/*
|--------------------------------------------------------------------------
| Mesure retournée par le backend
|--------------------------------------------------------------------------
*/

interface Mesure {
  id: number;
  type_mesure_id: number;
  val: number | string;
  date: string;
  device_code: string;
  message?: string
}

/*
|--------------------------------------------------------------------------
| Structure utilisée pour le graphique
|--------------------------------------------------------------------------
*/

interface Measures {
  time: string;
  temperature?: number;
  humidity?: number;
  ammoniac?: number;
  poids?: number;

}


export interface TypeAlert {
  id: number;
  code: string;
  couleur: string;
}

export interface Alert {
  id: number;
  type_mesure_id: string
  val_min: string;
  val_max: string;
  val_limit: string;
  age_min: string;
  age_max: string;
  source_id: string;
  categorie_id: string;
  message: string;
  message_warning: string;
  message_danger: string
}


/*
|--------------------------------------------------------------------------
| Donnée envoyée par Socket.IO
|--------------------------------------------------------------------------
|
| Le backend doit maintenant envoyer une mesure sous cette forme :
|
| {
|   id: 10,
|   type_mesure_id: 1,
|   val: 28.5,
|   date: "...",
|   device_code: "DEV001"
| }
|
*/

interface SensorData {
  id?: number;
  type_mesure_id: number;
  val: number | string;
  date: string;
  device_code: string;
}

interface AlertResult {
  type_mesure_id: number;
  valeur: number;
  niveau: "normal" | "warning" | "danger";
  message?: string;
  alerte?: Alert;
}

/*
|--------------------------------------------------------------------------
| Correspondance type_mesure_id
|--------------------------------------------------------------------------
|
| À adapter si tes IDs sont différents dans ta table type_mesure.
|
*/

const TYPE_MESURE = {
  TEMPERATURE: 1,
  HUMIDITE: 2,
  POIDS: 3,
  AMMONIAC: 4,
};

export default function Dashboard() {
  /*
  |--------------------------------------------------------------------------
  | Sélections
  |--------------------------------------------------------------------------
  */

  const [selectedFarm, setSelectedFarm] = useState<string>("");
  const [selectedBuilding, setSelectedBuilding] = useState<string>("");
  const [selectedDevice, setSelectedDevice] = useState<string>("");

  /*
  |--------------------------------------------------------------------------
  | Données
  |--------------------------------------------------------------------------
  */

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [age, setAge] = useState<String>('');
  const [souche, setSouche] = useState<Souche>();


  /*
  |--------------------------------------------------------------------------
  | Historique
  |--------------------------------------------------------------------------
  */

  const [history, setHistory] = useState<Measures[]>([]);

  /*
  |--------------------------------------------------------------------------
  | Valeurs actuelles
  |--------------------------------------------------------------------------
  */

  const [temperature, setTemperature] = useState<number>();
  const [humidity, setHumidity] = useState<number>();
  const [ammoniac, setAmmoniac] = useState<number>();
  const [poids, setPoids] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<AlertResult[]>([]);




  /*
  |--------------------------------------------------------------------------
  | Chargement des fermes
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadFarms = async () => {
      try {
        const data = await farmApi.getAll();

        if (data) {
          setFarms(data);
        }
      } catch (error) {
        console.error(
          "Erreur chargement fermes :",
          error
        );
      }
    };

    loadFarms();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Options Select
  |--------------------------------------------------------------------------
  */

  const optionFarm = useMemo(
    () =>
      farms.map((farm) => ({
        value: String(farm.id),
        label: farm.name,
      })),
    [farms]
  );

  const optionBuilding = useMemo(
    () =>
      buildings.map((building) => ({
        value: String(building.id),
        label: building.name,
      })),
    [buildings]
  );

  /*
   * IMPORTANT :
   *
   * mesure.device_code contient le code du device.
   *
   * Donc on utilise device.code comme value.
   */

  const optionDevice = useMemo(
    () =>
      devices.map((device) => ({
        value: String(device.code),
        label: device.code,
      })),
    [devices]
  );

  /*
  |--------------------------------------------------------------------------
  | Changement de ferme
  |--------------------------------------------------------------------------
  */

  const changeFarm = async (value: string) => {
    console.log("Selected farm:", value);

    setSelectedFarm(value);

    /*
     * Reset bâtiment + device
     */

    setSelectedBuilding("");
    setSelectedDevice("");

    setBuildings([]);
    setDevices([]);
    setHistory([]);

    setTemperature(undefined);
    setHumidity(undefined);
    setAmmoniac(undefined);
    setPoids(undefined);

    if (!value) {
      return;
    }

    try {
      const data = await buildingApi.getByField(
        "farm_id",
        value
      );

      if (data) {
        setBuildings(data);
      }
    } catch (error) {
      console.error(
        "Erreur chargement bâtiments :",
        error
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Changement de bâtiment
  |--------------------------------------------------------------------------
  */

  const changeBuilding = async (value: string) => {
    console.log( "Selected building:",  value );
    setSelectedBuilding(value);

    const batiment = buildings.find(building =>(building.id === value) || null)
    console.log('batiment', batiment?.date_initial)

    
    const date_initial  = batiment?.date_initial;
    const schId = batiment?.souche_id

    if(schId) {
      
      try {
        const data = await soucheApi.getById(schId) 
        
        if (data) {
          setSouche(data);
        }
      } catch (error) {
        console.error(
          "Erreur chargement bâtiments :",
          error
        );
      }
    }
    
      
    if(date_initial){
      const debut = new Date(date_initial)
      const maintenant  = new Date()
      debut.setHours(0,0,0,0)
      maintenant.setHours(0,0,0,0)
      const age = Math.floor(maintenant.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24 )

      if (age < 0) return;
      setAge(String(age))
    }
      

    /*
     * Reset device
     */

    setSelectedDevice("");
    setDevices([]);
    setHistory([]);

    setTemperature(undefined);
    setHumidity(undefined);
    setAmmoniac(undefined);
    setPoids(undefined);

    if (!value) {
      return;
    }
     


    try {
      const data = await deviceApi.getByField(
        "building_id",
        value
      );

      if (data) {
        setDevices(data);
      }
    } catch (error) {
      console.error(
        "Erreur chargement devices :",
        error
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Changement de device
  |--------------------------------------------------------------------------
  */

  const changeDevice = (value: string) => {
    console.log(  "Selected device:", value  );

    setSelectedDevice(value);

    /*
     * Reset anciennes valeurs
     */

    setTemperature(undefined);
    setHumidity(undefined);
    setAmmoniac(undefined);
    setPoids(undefined);

    setHistory([]);

  
  };

  
  /*
  |--------------------------------------------------------------------------
  | Transformer les mesures
  |--------------------------------------------------------------------------
  |
  | API :
  |
  | [
  |   {
  |     type_mesure_id: 1,
  |     val: 28.5,
  |     date: "..."
  |   },
  |   {
  |     type_mesure_id: 2,
  |     val: 65,
  |     date: "..."
  |   }
  | ]
  |
  | devient :
  |
  | [
  |   {
  |     time: "...",
  |     temperature: 28.5,
  |     humidity: 65
  |   }
  | ]
  |
  */

  const transformMesures = (
    mesures: Mesure[]
  ): Measures[] => {
    const grouped = new Map<
      string,
      Measures
    >();

    mesures.forEach((mesure) => {
      /*
       * On utilise la date comme clé.
       *
       * On retire les millisecondes pour éviter
       * d'avoir plusieurs points pour la même seconde.
       */

      const date = new Date(mesure.date);
      date.setMilliseconds(0);
      date.setSeconds(0); 
      const time = date.toISOString();

      /*
       * Si aucun groupe n'existe encore
       * pour cette date, on le crée.
       */

      if (!grouped.has(time)) {
        grouped.set(time, {
          time,
        });
      }

      const current = grouped.get(time)!;

      const value = Number(mesure.val);

      /*
       * Transformer type_mesure_id
       */

      switch (mesure.type_mesure_id) {
        case TYPE_MESURE.TEMPERATURE:
          current.temperature = value;
          break;

        case TYPE_MESURE.HUMIDITE:
          current.humidity = value;
          break;

        case TYPE_MESURE.AMMONIAC:
          current.ammoniac = value;
          break;

        case TYPE_MESURE.POIDS:
          current.poids = value;
          break;

        default:
          console.warn(
            "Type de mesure inconnu :",
            mesure.type_mesure_id
          );
      }
    });

    /*
     * Conversion Map → Array
     *
     * puis classement chronologique.
     */

    return Array.from(
      grouped.values()
    ).sort(
      (a, b) =>
        new Date(a.time).getTime() -
        new Date(b.time).getTime()
    );
  };



  const loadAlerts = async (last: Measures) => {
    try {
      const mesures = [
        {
          type_mesure_id: TYPE_MESURE.TEMPERATURE,
          valeur: last.temperature,
          age: Number(age),
          categorie_id: souche?.categorie_id,
          souche_id: souche?.id,
        },
        {
          type_mesure_id: TYPE_MESURE.HUMIDITE,
          valeur: last.humidity,
          age: Number(age),
          categorie_id: souche?.categorie_id,
          souche_id: souche?.id,
        },
        {
          type_mesure_id: TYPE_MESURE.POIDS,
          valeur: last.poids,
          age: Number(age),
          categorie_id: souche?.categorie_id,
          souche_id: souche?.id,
        },
        {
          type_mesure_id: TYPE_MESURE.AMMONIAC,
          valeur: last.ammoniac,
          age: Number(age),
          categorie_id: souche?.categorie_id,
          souche_id: souche?.id,
        },
      ].filter(
        (m) =>
          m.valeur !== undefined &&
          m.valeur !== null
      );

      if (!mesures.length) {
        setAlerts([]);
        return;
      }

      const res = await axiosClient.post<AlertResult[]>(
        "/alert/messages",
        { mesures }
      );

      console.log("Résultat alertes :", res.data);


      setAlerts(res.data);

    } catch (error) {
      console.error(
        "Erreur chargement alertes :",
        error
      );

      setAlerts([]);
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Charger historique du device
  |--------------------------------------------------------------------------
  */

  const loadHistory = async () => {
    if (!selectedDevice) {
      return;
    }

    setLoading(true);

    try {
      const res = await axiosClient.get<Mesure[]>(
        `/mesures/device/${selectedDevice}`
      );
    
      const formatted = transformMesures(
        res.data ?? []
      );

      setHistory(formatted);


      

      // Dernières valeurs
      const last = formatted[formatted.length - 1];

      if (last) {
        setTemperature(last.temperature);
        setHumidity(last.humidity);
        setAmmoniac(last.ammoniac);
        setPoids(last.poids);

        await loadAlerts(last);

      }

    } catch (error) {
      console.error(
        "Erreur chargement mesures :",
        error
      );
    } finally {
      setLoading(false);
    }

    console.log('alerts',  alerts)


  };

  /*
  |--------------------------------------------------------------------------
  | Rejoindre le device
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!selectedDevice) {
      return;
    }

    console.log(  "Join device:",  selectedDevice  );

    socket.emit(  "join-device", selectedDevice  );

    return () => {
      socket.emit( "leave-device",  selectedDevice  );
    };

  }, [selectedDevice]);

  /*
  |--------------------------------------------------------------------------
  | Temps réel
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleSensorData = (
      data: SensorData
    ) => {
      console.log( "Sensor data:",  data  );

      /*
       * Vérifier le device
       */

      if (
        String(data.device_code) !==  String(selectedDevice)
      ) {
        return;
      }

      const value =  Number(data.val);

      /*
       * Mise à jour de la valeur actuelle
       */

      switch (
        data.type_mesure_id
      ) {
        case TYPE_MESURE.TEMPERATURE:
          setTemperature(value);
          break;

        case TYPE_MESURE.HUMIDITE:
          setHumidity(value);
          break;

        case TYPE_MESURE.AMMONIAC:
          setAmmoniac(value);
          break;

        case TYPE_MESURE.POIDS:
          setPoids(value);
          break;

        default:
          return;
      }

      /*
       * Mise à jour de l'historique
       */

      setHistory((prev) => {
        const date = new Date(data.date);
        date.setMilliseconds(0);
        const time = date.toISOString();

        /*
         * Chercher un point existant
         * à cette date.
         */

        const existingIndex =
          prev.findIndex(
            (item) =>
              item.time === time
          );

        /*
         * Si le point existe déjà,
         * on le complète.
         */

        if (existingIndex !== -1) {
          const updated = [
            ...prev,
          ];

          const current = {
            ...updated[
              existingIndex
            ],
          };

          switch (
            data.type_mesure_id
          ) {
            case TYPE_MESURE.TEMPERATURE:
              current.temperature = value;
              break;

            case TYPE_MESURE.HUMIDITE:
              current.humidity =  value;
              break;

            case TYPE_MESURE.AMMONIAC:
              current.ammoniac =  value;
              break;

            case TYPE_MESURE.POIDS:
              current.poids =  value;
              break;
          }

          updated[
            existingIndex
          ] = current;

          return updated;
        }

        /*
         * Sinon créer un nouveau point
         */

        const newPoint: Measures = {
          time,
        };

        switch (
          data.type_mesure_id
        ) {
          case TYPE_MESURE.TEMPERATURE:
            newPoint.temperature =
              value;
            break;

          case TYPE_MESURE.HUMIDITE:
            newPoint.humidity = value;
            break;

          case TYPE_MESURE.AMMONIAC:
            newPoint.ammoniac = value;
            break;

          case TYPE_MESURE.POIDS:
            newPoint.poids = value;
            break;
        }

        /*
         * Garder maximum 50 points
         */

        return [
          ...prev.slice(-49),
          newPoint,
        ];
      });
    };

    socket.on(
      "sensor-data",
      handleSensorData
    );

    return () => {
      socket.off(
        "sensor-data",
        handleSensorData
      );
    };

  }, [selectedDevice]);

  /*
  |--------------------------------------------------------------------------
  | Graphique ECharts
  |--------------------------------------------------------------------------
  */

  const chartOption = {
    tooltip: {
      trigger: "axis",
    },

    legend: {
      data: [
        "Température",
        "Humidité",
        "Ammoniac",
        "Poids",
      ],
    },

    xAxis: {
      type: "category",

      data: history.map(
        (m) =>
          new Date(
            m.time
          ).toLocaleTimeString()
      ),
    },

    yAxis: [
      {
        type: "value",
        name: "Température / Humidité",
      },

      {
        type: "value",
        name: "Ammoniac / Poids",
      },
    ],

    series: [
      {
        name: "Température",
        type: "line",
        smooth: true,

        data: history.map(
          (m) =>
            m.temperature ??
            null
        ),
      },

      {
        name: "Humidité",
        type: "line",
        smooth: true,

        data: history.map(
          (m) =>
            m.humidity ??
            null
        ),
      },

      {
        name: "Ammoniac",
        type: "line",
        smooth: true,

        yAxisIndex: 1,

        data: history.map(
          (m) =>
            m.ammoniac ??
            null
        ),
      },

      {
        name: "Poids",
        type: "line",
        smooth: true,

        yAxisIndex: 1,

        data: history.map(
          (m) =>
            m.poids ??
            null
        ),
      },
    ],
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <DashLayout>

      <div className="p-6 bg-gray-100 min-h-screen">

        {/* ==================================================
            TITRE
        ================================================== */}
        <div className="flex justify-between items-center mb-4">

          <h1 className="text-3xl font-bold mb-6">
            Avitrack Dashboard
          </h1>

        </div>
        

        {/* ==================================================
            FILTRES
        ================================================== */}

        <div className="bg-white rounded-xl shadow p-5 mb-6">

          <div className="grid grid-cols-12 gap-4">

            {/* Ferme */}

            <div className="col-span-12 md:col-span-3">

              <Label htmlFor="farm_id">
                Ferme
              </Label>

              <Select
                name="farm_id"
                options={optionFarm}
                placeholder="Sélectionner une ferme"
                onChange={changeFarm}
                defaultValue={  selectedFarm  }
              />

            </div>

            {/* Bâtiment */}

            <div className="col-span-12 md:col-span-3">

              <Label htmlFor= "building_id"> Bâtiment </Label>

              <Select
                name="building_id"
                options={
                  optionBuilding
                }
                placeholder="Sélectionner un bâtiment"
                onChange={
                  changeBuilding
                }
                defaultValue={
                  selectedBuilding
                }
              />

            </div>

            {/* Device */}

            <div className="col-span-12 md:col-span-3">

              <Label htmlFor="device_id"> Device </Label>

              <Select
                name="device_id"
                options={ optionDevice }
                placeholder="Sélectionner un device"
                onChange={ changeDevice  }
                defaultValue={ selectedDevice  }
              />

            </div>

            <div col-span-12 md:col-span-3>
              <button
                type="button"
                onClick={loadHistory}
                disabled={!selectedDevice || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg
                          hover:bg-blue-700 disabled:bg-gray-400
                          disabled:cursor-not-allowed"
              >
                {loading ? "Actualisation..." : "Actualiser"}
              </button>
            </div>
          </div>

        </div>

        {/* ==================================================
            VALEURS ACTUELLES
        ================================================== */}

        <div className="grid md:grid-cols-4 gap-5 mb-6">

          {/* Température */}

          <div className="bg-white p-5 rounded-xl shadow">

            <p className="text-gray-500">
              Température
            </p>

            <h2 className="text-3xl font-bold">
              {temperature ??
                "--"}{" "}
              °C
            </h2>

          </div>

          {/* Humidité */}

          <div className="bg-white p-5 rounded-xl shadow">

            <p className="text-gray-500">
              Humidité
            </p>

            <h2 className="text-3xl font-bold">
              {humidity ??
                "--"}{" "}
              %
            </h2>

          </div>

          {/* Ammoniac */}

          <div className="bg-white p-5 rounded-xl shadow">

            <p className="text-gray-500">
              Ammoniac
            </p>

            <h2 className="text-3xl font-bold">
              {ammoniac ??
                "--"}{" "}
              ppm
            </h2>

          </div>

          {/* Poids */}

          <div className="bg-white p-5 rounded-xl shadow">

            <p className="text-gray-500">
              Poids
            </p>

            <h2 className="text-3xl font-bold">
              {poids ??
                "--"}{" "}
              kg
            </h2>

          </div>

        </div>



        {/* ==================================================
            Graphique en fonction de typeMesures
        ================================================== */}
        <div className="min-h-screen bg-gray-50 p-4 mb-4">
          <div className="w-full flex flex-col flex-row items-center justify-around gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm w-full mx-auto">
            {/* Souche */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-medium text-xs">
                Souche
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Type</span>
                <strong className="text-base font-semibold text-gray-800 dark:text-gray-100 uppercase tracking-wide">
                  {souche?.name}
                </strong>
              </div>
            </div>

            {/* Séparateur vertical (masqué sur mobile) */}
            <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-700" />

            {/* Âge */}
            <div className="w-full flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg font-medium text-xs">
                Âge
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Durée</span>
                <div className="flex items-baseline gap-1">
                  <strong className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {age}
                  </strong>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    jours
                  </span>
                </div>
              </div>
            </div>
          </div>
          

            <div className ="grid grid-cols-1 md:grid-cols-2">
            <MetricGaugeCard
              title="Température"
              metricType="temperature"
              current={alerts[1].valeur}
              min={alerts[1].valeur}
              max={34}
              gaugeMin={0}
              gaugeMax={50}
              unit="°C"
              message={alerts[1].message}
            />

            <MetricGaugeCard
              title="Humidité"
              metricType="humidity"
              current={74}
              min={50}
              max={70}
              gaugeMin={0}
              gaugeMax={100}
              unit="%"
            />

            <MetricGaugeCard
              title="Poids Moyen"
              metricType="weight"
              current={74}
              min={50}
              max={70}
              gaugeMin={0}
              gaugeMax={5}
              unit="kg"
            />

            <MetricGaugeCard
              title="Ammoniac"
              metricType="ammonia"
              current={74}
              min={20}
              max={30}
              gaugeMin={0}
              gaugeMax={100}
              unit="ppm"
            />

          </div>

        </div>







    


        {/* ==================================================
            HISTORIQUE
        ================================================== */}

        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Historique des indicateurs
            </h2>
          </div>

          <div className="flex justify-between items-center mb-4">
            {loading && (
              <span className="text-gray-500">
                Chargement...
              </span>
            )}

          </div>

          {!selectedDevice ? (

            <div className="text-gray-500 py-10 text-center">
              Sélectionnez un device
              pour afficher les mesures.
            </div>

          ) : history.length === 0 ? (

            <div className="text-gray-500 py-10 text-center">
              Aucune mesure disponible.
            </div>

          ) : (

            <ReactECharts
              option={chartOption}
              style={{
                height: 400,
                width: "100%",
              }}
            />

          )}

        </div>

      </div>

    </DashLayout>
  );
}
