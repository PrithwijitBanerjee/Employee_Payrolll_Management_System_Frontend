import type React from "react";
import ChartBox from "@/views/Dashboard/ChartBox";
import "@/views/Dashboard/Dashboard.css";
import HomeCard from "@/views/Dashboard/HomeCard";
import PieChartsBox from "@/views/Dashboard/PieChartsBox";

const Dashboard: React.FC = () => {
    return (
        <div className="main_wrap">
            <div className="container-fluid">
                <HomeCard />

                <div className='row mt-2'>
                    <div className='col-md-7 col-12'>
                        <ChartBox />
                    </div>
                    <div className='col-md-5 col-12'>
                        <PieChartsBox />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;