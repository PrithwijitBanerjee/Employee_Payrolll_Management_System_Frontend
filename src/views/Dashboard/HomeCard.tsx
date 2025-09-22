import React from "react";
// import { Link } from 'react-router-dom'; // Assuming you're using React Router

interface CardItem {
    id: number;
    color: string;
    name: string;
    link: string;
    userType: string;
}

const HomeCard: React.FC = () => {
    const card: CardItem[] = [
        {
            id: 1,
            color: "rgb(236, 64, 122)",
            name: "Budding Talent Count",
            link: "/buddingview",
            userType: "BuddingTalent",
        },
        {
            id: 2,
            color: "rgb(73, 163, 241)",
            name: "Influencer",
            link: "/influencerview",
            userType: "Influencer",
        },
        {
            id: 3,
            color: "rgb(102, 187, 106)",
            name: "Scout",
            link: "/scoutview",
            userType: "Scout",
        },
    ];

    return (
        <>
            <div className="HomeTop">
                <div className="row">
                    {card.map((item) => {
                        return (
                            <div key={item.id} className="col-md-4 col-12">
                                <div className="HomeCard">
                                    <h5 className="HomeCardHead">Lorem Ipsum</h5>
                                    <p className="HomeCardPara">Lorem ipsum dolor sit amet</p>
                                    <hr />

                                    <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "end" }}>
                                        <button
                                            className="HomeCardViewbtn"
                                        >
                                            View
                                        </button>
                                    </div>
                                    {/* <Link to={item.link} className="homecardLink">
                    View More
                  </Link> */}
                                    <div
                                        className="cardIconDiv"
                                        style={{ backgroundColor: item.color }}
                                    >
                                        <i className="fa-regular fa-user"></i>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default HomeCard;