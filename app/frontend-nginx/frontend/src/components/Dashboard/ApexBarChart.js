import React from "react";
import Chart from 'react-apexcharts';
import { useTranslation } from "react-i18next";

function ApexBarChart({ diseaseData }) {
    const { t } = useTranslation();

    if (!diseaseData || !diseaseData.legends || diseaseData.legends.length === 0) {
        return <div className="text-center text-slate-400 py-10">{t("Upload a leaf to generate graph data!")}</div>;
    }

    const plantNames = [];
    const diseaseSeriesMap = {};

    diseaseData.legends.forEach((legend, index) => {
        if (!legend || legend === "Unknown") return;

        // legend is EXACTLY the raw string from the DB (e.g., "Tomato___Early_blight")
        const parts = legend.split("___");
        const rawPlant = parts[0]; // We still need the plant part for the X-axis (e.g., "Tomato")

        // 1. Translate the Plant for the X-axis
        const translatedPlant = t(rawPlant);
        
        // 2. Translate the Disease using the EXACT raw legend! 
        // This perfectly matches your new i18n.js keys
        const translatedDisease = t(legend);

        // Add to our Y-axis list ONLY if we haven't added it yet
        if (!plantNames.includes(translatedPlant)) {
            plantNames.push(translatedPlant);
        }

        // Create a bucket for this specific disease if it doesn't exist yet
        if (!diseaseSeriesMap[translatedDisease]) {
            diseaseSeriesMap[translatedDisease] = {};
        }

        // Tally up the count for this specific disease on this specific plant
        diseaseSeriesMap[translatedDisease][translatedPlant] = (diseaseSeriesMap[translatedDisease][translatedPlant] || 0) + diseaseData.data[index];
    });

    const series = Object.keys(diseaseSeriesMap).map(diseaseName => {
        const dataArray = plantNames.map(plant => diseaseSeriesMap[diseaseName][plant] || 0);
        return {
            name: diseaseName,
            data: dataArray
        };
    });

    const options = {
        colors: ['#0f172a','#1e3a8a','#0f766e','#14b8a6','#d97706','#f59e0b','#fbbf24', '#e11d48', '#8b5cf6'],
        chart: {
            type: 'bar',
            stacked: true,
            toolbar: { show: false },
            foreColor: '#e2e8f0',
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 2,
            },
        },
        stroke: {
            width: 1,
            colors: ['#1e293b'] 
        },
        xaxis: {
            categories: plantNames, 
        },
        tooltip: {
            theme: 'dark' 
        },
        fill: { opacity: 1 },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40
        }
    };

    return (
        <div id="chart" className="w-full">
            <Chart options={options} series={series} type="bar" width="100%" height={350} />
        </div>
    );
}

export default ApexBarChart;