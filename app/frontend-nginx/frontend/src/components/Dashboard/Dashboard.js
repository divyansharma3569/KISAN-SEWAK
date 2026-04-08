import React, { useEffect, useState } from "react";
import Map from "./Map";
import { axiosInstance } from "../../axios.config";
import CountUp from "react-countup";
import ApexChart1 from "./ApexChart1";
import ApexChart2 from "./ApexChart2";
import ApexBarChart from "./ApexBarChart";
import PieChart from "./PieChart";
import { GiCorn } from "react-icons/gi";
import { useTranslation } from 'react-i18next';

const defaultMaps = [
  { _id: "MH", numberOfValue: 24 },
  { _id: "GJ", numberOfValue: 46 },
  { _id: "TN", numberOfValue: 44 },
  { _id: "KA", numberOfValue: 120 },
  { _id: "PB", numberOfValue: 10 },
  { _id: "TS", numberOfValue: 80 },
  { _id: "WB", numberOfValue: 60 },
  { _id: "OD", numberOfValue: 35 },
];

const defaultPlants = {
  legends: [
    "Corn_(maize)",
    "Tomato",
    "Potato",
    "Grape",
    "Pepper bell",
    "Strawberry",
    "Apple",
  ],
  data: [2, 5, 4, 1, 7, 1, 4],
};

const defaultDisease = {
  legends: [
    "Apple Black rot",
    "Apple scab",
    "Potato Early blight",
    "Grape Black rot",
    "Tomato Septoria leaf spot",
    "Tomato Target Spot",
    "Corn Common rust",
    "Strawberry Leaf scorch",
    "Pepper_bell Bacterial spot",
  ],
  data: [2, 2, 4, 1, 4, 1, 2, 1, 7],
};

function Dashboard() {
  const [mapData, setMapData] = useState(defaultMaps);
  const [plantData, setPlantData] = useState(defaultPlants);
  const [diseaseData, setDiseaseData] = useState(defaultDisease);
  
  // State for the top cards
  const [stats, setStats] = useState({ 
    totalPredictions: 0, 
    topPlant: "N/A",
    totalVisitors: 0,
    todaysDetections: 0
  });

  // State for the trend charts
  const [dailyActivity, setDailyActivity] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    let componentMounted = true;

    const getData = async () => {
      try {
        const res = await axiosInstance.get("/auth/dashboard");
        const data = res.data;
        if (!data) return;

        if (componentMounted) {
          // ONLY use real map data. If database is empty, show empty map.
          setMapData(data.mapData || []); 
          setPlantData(data.plantData?.data?.length ? data.plantData : defaultPlants);
          setDiseaseData(data.diseaseData?.data?.length ? data.diseaseData : defaultDisease);
          
          setStats({
            totalPredictions: data.totalPredictions || 0,
            topPlant: data.topPlant || "N/A",
            totalVisitors: data.totalVisitors || 0,
            todaysDetections: data.todaysDetections || 0
          });

          // Save the real database aggregations
          setDailyActivity(data.dailyActivity || []);
          setMonthlyTrends(data.monthlyTrends || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    getData();
    return () => { componentMounted = false; };
  }, []);

  return (
    <div className="min-h-screen p-6 lg:p-8 text-slate-100">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400 mb-2">
          {t('Dashboard')}
        </h1>
        <p className="text-slate-400">{t('Real-time plant health monitoring and analytics')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="rounded-2xl p-6 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-300/20 shadow-lg hover:border-amber-300/40 transition-all">
          <div className="text-amber-300/70 text-sm font-medium mb-2">{t('Total Visitors')}</div>
          <div className="text-4xl font-bold text-amber-200 mb-1">
            <CountUp end={stats.totalVisitors} />
          </div>
          <div className="text-xs text-slate-400">{t('All-time count')}</div>
        </div>

        <div className="rounded-2xl p-6 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-300/20 shadow-lg hover:border-cyan-300/40 transition-all">
          <div className="text-cyan-300/70 text-sm font-medium mb-2">{t('Total Predictions')}</div>
          <div className="text-4xl font-bold text-cyan-200 mb-1">
            <CountUp end={stats.totalPredictions} />
          </div>
          <div className="text-xs text-slate-400">{t('All-time records')}</div>
        </div>

        <div className="rounded-2xl p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-300/20 shadow-lg hover:border-orange-300/40 transition-all">
          <div className="text-orange-300/70 text-sm font-medium mb-2">{t('Top at Risk')}</div>
          <div className="text-4xl font-bold text-orange-200 mb-1 flex items-center gap-2">
            <GiCorn /> {stats.topPlant}
          </div>
          <div className="text-xs text-slate-400">{t('Most affected overall')}</div>
        </div>

        <div className="rounded-2xl p-6 bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-300/20 shadow-lg hover:border-rose-300/40 transition-all">
          <div className="text-rose-300/70 text-sm font-medium mb-2">{t("Today's Detections")}</div>
          <div className="text-4xl font-bold text-rose-200 mb-1">
            <CountUp end={stats.todaysDetections} />
          </div>
          <div className="text-xs text-slate-400">{t('Active alerts')}</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Large Chart - Left */}
        <div className="lg:col-span-2 rounded-2xl p-6 border border-amber-200/10 bg-slate-950/70 backdrop-blur-md shadow-xl">
          <h2 className="text-xl font-bold text-amber-100 mb-4">{t('Plant Impact Analysis')}</h2>
          {/* Dynamically passing diseaseData */}
          <ApexBarChart diseaseData={diseaseData} />
        </div>

        {/* Pie Chart - Right */}
        <div className="rounded-2xl p-6 border border-amber-200/10 bg-slate-950/70 backdrop-blur-md shadow-xl">
          <h2 className="text-xl font-bold text-amber-100 mb-4">{t('Distribution')}</h2>
          {/* Dynamically passing plantData */}
          <PieChart plantData={plantData} />
        </div>
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl p-6 border border-amber-200/10 bg-slate-950/70 backdrop-blur-md shadow-xl">
          <h2 className="text-xl font-bold text-amber-100 mb-4">{t('Monthly Trends')}</h2>
          {/* Passing the real monthly data we aggregated */}
          <ApexChart1 monthlyData={monthlyTrends} />
        </div>

        <div className="rounded-2xl p-6 border border-amber-200/10 bg-slate-950/70 backdrop-blur-md shadow-xl">
          <h2 className="text-xl font-bold text-amber-100 mb-4">{t('Daily Activity')}</h2>
          {/* Passing the real daily data we aggregated */}
          <ApexChart2 dailyData={dailyActivity} />
        </div>
      </div>

      {/* Map Section */}
      <div className="rounded-2xl p-6 border border-amber-200/10 bg-slate-950/70 backdrop-blur-md shadow-xl">
        <h2 className="text-xl font-bold text-amber-100 mb-4">{t('Regional Distribution')}</h2>
        <div className="rounded-xl overflow-hidden">
          <Map mapData={mapData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;