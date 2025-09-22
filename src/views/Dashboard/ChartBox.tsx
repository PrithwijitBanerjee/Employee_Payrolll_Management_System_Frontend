import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface ChartData {
    series: {
        name: string;
        data: number[];
    }[];
    options: ApexOptions;
}

const INITIAL_CHART_DATA: ChartData = {
    series: [
        {
            name: "",
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
        },
        {
            name: "Revenue",
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
        },
        {
            name: "Free Cash Flow",
            data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
        },
    ],
    options: {
        chart: {
            type: "bar",
            height: 350,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "55%",
                // endingShape: "rounded",
                borderRadius: 10,
                borderRadiusApplication: "end",
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],
        },
        xaxis: {
            categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        },
        yaxis: {
            title: {
                text: "$ (thousands)",
            },
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return "$ " + val + " thousands";
                },
            },
        },
    },
};

const ChartBox: React.FC = (): React.ReactElement => {
    const [chartData, setChartData] = useState<ChartData>(INITIAL_CHART_DATA);

    useEffect(() => {
        setChartData(INITIAL_CHART_DATA);
    }, []);

    return (
        <>
            <section className='chartBox_area'>
                <div id="chart">
                    <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />
                </div>
            </section>
        </>
    );
};

export default ChartBox;