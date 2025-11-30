import React from "react";
import { Star, MapPin } from "lucide-react";

const HotelCard = ({ data }) => (
  <div className={"group overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all"}>
      <div className={"relative h-32 overflow-hidden"}>
          <img src={data.images[0]} alt={data.name} className={"w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"} />
          <div className={"absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-sm text-xs font-bold flex items-center gap-1 shadow-sm"}>
              <Star className={"w-3 h-3 fill-yellow-400 text-yellow-400"} /> {data.rating.value}
          </div>
      </div>
      <div className={"p-4"}>
          <h4 className={"font-bold text-gray-900 text-sm mb-1"}>{data.name}</h4>
          <p className={"text-xs text-gray-500 flex items-center gap-1 mb-3"}>
              <MapPin className={"w-3 h-3"} /> {data.location}
          </p>
          <div className={"flex justify-between items-center border-t border-gray-50 pt-3"}>
              <span className={"text-xs text-gray-400"}>2 nights • 2 guests</span>
              <span className={"text-sm font-bold text-gray-900"}>{data.price.currency}{data.price.amount}</span>
          </div>
      </div>
  </div>
);

export default HotelCard;