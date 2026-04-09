import React from "react";
import Chart from 'react-apexcharts';
import { useTranslation } from "react-i18next";

function ApexBarChart({ diseaseData }) {
    const { t } = useTranslation(); // Translation hook added

    // 1. If there's no data at all, show a message
    if (!diseaseData || !diseaseData.legends || diseaseData.legends.length === 0) {
        return <div className="text-center text-slate-400 py-10">{t("Upload a leaf to generate graph data!")}</div>;
    }

    // 2. Extract ONLY the plants and diseases that actually exist in your database
    const plantNames = [];
    const diseaseSeriesMap = {};

    diseaseData.legends.forEach((legend, index) => {
        if (!legend || legend === "Unknown") return;

        // Split "Tomato___Early_blight"
        const parts = legend.split("___");
        
        // Extract the original name
        const rawPlant = parts[0]; // e.g., "Tomato", "Corn_(maize)"
        let rawDisease = parts[1] ? parts[1].replace(/_/g, " ") : "Healthy";
        
        if (rawDisease.toLowerCase() === "healthy") rawDisease = "Healthy";

        // Create the exact Key to match in i18n (e.g., "Tomato Early blight")
        const fullDiseaseKey = rawDisease === "Healthy" ? "Healthy" : `${rawPlant} ${rawDisease}`;

        // Apply translation
        const translatedPlant = t(rawPlant);
        const translatedDisease = t(fullDiseaseKey);

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

    // 3. Convert our dynamic buckets into the exact format ApexCharts needs for stacked bars
    const series = Object.keys(diseaseSeriesMap).map(diseaseName => {
        // For each disease, map it to the corresponding plant rows
        const dataArray = plantNames.map(plant => diseaseSeriesMap[diseaseName][plant] || 0);
        return {
            name: diseaseName, // Translated disease name
            data: dataArray
        };
    });

    // 4. The exact styling and layout from your screenshot
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
            categories: plantNames, // Translated plant names
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