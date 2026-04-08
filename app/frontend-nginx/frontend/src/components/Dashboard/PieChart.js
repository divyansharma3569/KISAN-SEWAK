import React from "react";
import Chart from "react-apexcharts";

const PieChart = ({ plantData }) => {
  // Ensure we gracefully handle empty or loading data
  const series = plantData?.data || [];
  const labels = plantData?.legends || [];

  const options = {
    chart: {
      type: "donut",
      foreColor: "#e2e8f0", // Light text for dark mode
    },
    labels: labels,
    plotOptions: {
      pie: {
        customScale: 1, 
        donut: {
          size: "65%", // Thickness of the donut ring
        },
        expandOnClick: true,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.5,
      },
    },
    stroke: {
      show: true,
      colors: ["#020617"], // Matches slate-950 background
      width: 2,
    },
    legend: {
      position: "bottom", // Moves the legend below the pie chart
      horizontalAlign: "center", // Centers the names horizontally
      fontSize: "13px",
      markers: {
        radius: 12,
      },
      itemMargin: {
        horizontal: 10, // Adds nice spacing between the names
        vertical: 5     // Adds spacing if names wrap to a second line
      }
    },
    tooltip: {
      theme: "dark",
    },
  };

  return (
    <div className="w-full flex justify-center items-center min-h-[350px]">
      <Chart 
        options={options} 
        series={series} 
        type="donut" 
        width="100%" 
        // Increased height slightly to accommodate the bottom legend
        height={380} 
      />
    </div>
  );
};

export default PieChart;