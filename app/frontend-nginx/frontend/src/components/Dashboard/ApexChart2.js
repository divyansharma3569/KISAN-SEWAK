import React from "react";
import Chart from 'react-apexcharts';

const ApexChart2 = ({ dailyData = [] }) => {
    const categories = [];
    const seriesData = [];

    // Loop backwards from 13 days ago up to TODAY
    for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        
        // Format to YYYY-MM-DD exactly like our backend aggregation
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        categories.push(dateStr);

        // Map the real count if it exists, otherwise it stays a true 0
        const foundData = dailyData.find(item => item._id === dateStr);
        seriesData.push(foundData ? foundData.count : 0);
    }

    const options = {
        colors: ["#14b8a6"], // Teal
        chart: { type: 'area', toolbar: { show: false }, foreColor: '#e2e8f0' },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        xaxis: { type: 'datetime', categories: categories },
        tooltip: { x: { format: 'dd MMM yyyy' }, theme: 'dark' },
    };

    const series = [{ name: 'Total Detections', data: seriesData }];

    return (
        <div className="w-full">
            <Chart options={options} series={series} type="area" width="100%" height={300} />
        </div>
    );
};

export default ApexChart2;