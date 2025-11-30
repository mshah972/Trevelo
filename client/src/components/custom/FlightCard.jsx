import React from "react";
import { Plane } from "lucide-react";

const FlightCard = ({ data }) => (
    <div className={"bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"}>
        <div className={"flex justify-between items-start mb-4"}>
            <div className={"flex items-center gap-3"}>
                <div className={"w-10 h-10 bg-red-50 rounded-full flex items-center justify-center"}>
                    <Plane className={"w-5 h-5 text-red-500"} />
                </div>
                <div>
                    <p className={"font-semibold text-gray-900 text-sm"}>{data.departure.code} to {data.arrival.code}</p>
                    <p className={"text-xs text-gray-500"}>{data.airline.name}</p>
                </div>
            </div>
            <div className={"text-right"}>
                <p className={"font-bold text-gray-900"}>{data.price.currency}{data.price.amount}</p>
                <p className={"text-xs text-gray-500"}>Round-Trip</p>
            </div>
        </div>
        <div className={"flex items-center justify-between bg-gray-50 rounded-lg p-3 relative"}>
            <span className={"font-bold text-gray-900 text-sm"}>{data.departure.time}</span>
            <div className={"flex-1 px-4 flex flex-col items-center"}>
                <div className={"w-full h-[2px] bg-gray-300 relative my-1"}>
                    <Plane className={"w-3 h-3 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90"} />
                </div>
                <span className={"text-[10px] text-gray-400"}>{data.duration}</span>
            </div>
            <span className={"font-bold text-gray-900 text-sm"}>{data.arrival.time}</span>
        </div>
    </div>
);

export default FlightCard;