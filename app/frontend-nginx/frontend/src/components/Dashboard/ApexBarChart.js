import React from "react";
import Chart from 'react-apexcharts';

function ApexBarChart({ diseaseData }) {
    // 1. If there's no data at all, show a message
    if (!diseaseData || !diseaseData.legends || diseaseData.legends.length === 0) {
        return <div className="text-center text-slate-400 py-10">Upload a leaf to generate graph data!</div>;
    }

    // 2. Extract ONLY the plants and diseases that actually exist in your database
    const plantNames = [];
    const diseaseSeriesMap = {};

    diseaseData.legends.forEach((legend, index) => {
        if (!legend || legend === "Unknown") return;

        // Split "Tomato___Early_blight" into "Tomato" and "Early blight"
        const parts = legend.split("___");
        const plant = parts[0].replace("_(maize)", "").replace(/_/g, " ");
        let disease = parts[1] ? parts[1].replace(/_/g, " ") : "Healthy";
        if (disease.toLowerCase() === "healthy") disease = "Healthy";

        // Add to our Y-axis list ONLY if we haven't added it yet
        if (!plantNames.includes(plant)) {
            plantNames.push(plant);
        }

        // Create a bucket for this specific disease if it doesn't exist yet
        if (!diseaseSeriesMap[disease]) {
            diseaseSeriesMap[disease] = {};
        }

        // Tally up the count for this specific disease on this specific plant
        diseaseSeriesMap[disease][plant] = (diseaseSeriesMap[disease][plant] || 0) + diseaseData.data[index];
    });

    // 3. Convert our dynamic buckets into the exact format ApexCharts needs for stacked bars
    const series = Object.keys(diseaseSeriesMap).map(diseaseName => {
        // For each disease, map it to the corresponding plant rows
        const dataArray = plantNames.map(plant => diseaseSeriesMap[diseaseName][plant] || 0);
        return {
            name: diseaseName,
            data: dataArray
        };
    });

    // 4. The exact styling and layout from your screenshot
    const options = {
        // A nice array of colors for the different disease segments
        colors: ['#0f172a','#1e3a8a','#0f766e','#14b8a6','#d97706','#f59e0b','#fbbf24', '#e11d48', '#8b5cf6'],
        chart: {
            type: 'bar',
            stacked: true, // THIS is what puts the diseases on the same line!
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
            colors: ['#1e293b'] // Dark separator lines between the segments
        },
        xaxis: {
            categories: plantNames, // ONLY shows the plants you actually scanned
        },
        tooltip: {
            theme: 'dark' // This forces the tooltip to have a dark background!
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