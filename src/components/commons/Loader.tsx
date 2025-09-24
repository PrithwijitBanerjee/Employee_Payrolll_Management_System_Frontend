import React from "react";
import "@/styles/Loader.css";

const Loader: React.FC = (): React.ReactElement => {
    return (
        <div className="overlay">
            <div className="loader"></div>
        </div>
    );
};

export default Loader;