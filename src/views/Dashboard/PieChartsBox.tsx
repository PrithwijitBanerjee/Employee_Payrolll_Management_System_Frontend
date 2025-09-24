import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

const INITAL_PIE_CHART_DATA: {
    series: number[];
    options: ApexOptions;
} = {
    series: [44, 55, 41, 17, 15],
    options: {
        chart: {
            type: "donut",
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200,
                },
                legend: {
                    position: "bottom",
                },
            },
        }],
    },
};

const PieChartsBox = () => {
    const [chartState, setChartState] = useState<{
        series: number[];
        options: ApexOptions;
    }>(INITAL_PIE_CHART_DATA);

    useEffect(() => {
        setChartState(INITAL_PIE_CHART_DATA);
    }, []);

    return (
        <>
            <section
                className='piechartsBox_area'
            >
                <div id="chart">
                    <ReactApexChart
                        options={chartState.options}
                        series={chartState.series}
                        type="donut"
                    />
                </div>
            </section>
        </>
    );
};

export default PieChartsBox;