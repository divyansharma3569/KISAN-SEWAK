import React from "react";
import Chart from 'react-apexcharts';

const ApexChart1 = ({ monthlyData = [] }) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Gets month from 1 to 12

    const categories = [];
    const seriesData = [];

    // Loop from January up to the Current Month (No predicting the future!)
    for (let i = 1; i <= currentMonth; i++) {
        const monthName = new Date(currentYear, i - 1).toLocaleString('en-US', { month: 'short' });
        categories.push(`${monthName} ${currentYear}`);

        // Check if our database has detections for this month
        const foundData = monthlyData.find(d => d._id === i);
        seriesData.push(foundData ? foundData.count : 0);
    }

    const options = {
        colors: ["#f59e0b"], // Amber 
        chart: { type: 'area', toolbar: { show: false }, foreColor: '#e2e8f0' },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        xaxis: { type: 'category', categories: categories },
        tooltip: { theme: 'dark' },
    };

    const series = [{ name: 'Total Detections', data: seriesData }];

    return (
        <div className="w-full">
            <Chart options={options} series={series} type="area" width="100%" height={300} />
        </div>
    );
};

export default ApexChart1;