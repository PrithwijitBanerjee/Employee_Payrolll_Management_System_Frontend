import React from "react";

interface PropsType {
    name: string
    width: number
}

const DefaultProfile: React.FC<PropsType> = ({ name, width }) => {

    // Generate a random color when the component renders
    const randomColor = () => {
        const colors = [
            "#FF6B6B", // Red
            "#4ECDC4", // Teal
            "#FF8C42", // Orange
            "#6A0572", // Purple
            "#1A535C", // Dark Teal
            "#FFD166", // Yellow
            "#06D6A0", // Green
            "#118AB2", // Blue
            "#EF476F", // Pink
            "#073B4C", // Navy
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div
            style={{
                width: `${width}px`,
                height: `${width}px`,
                fontSize: `${width / 2}px`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "500",
                borderRadius: "50%",
                backgroundColor: randomColor(),
                color: "#FFFFFF",
            }}
        >
            {name.trim().charAt(0).toUpperCase()}
        </div>
    );

};

export default React.memo(DefaultProfile);