import React from 'react';
import { Utensils, Coffee } from 'lucide-react';

const FoodCard = ({ type, data }) => {
    if (!data) return null;
    return (
        <div className="flex gap-3 items-start p-3 rounded-xl border border-gray-100 bg-white">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                {type === 'Lunch' || type === 'Dinner' ? <Utensils className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
            </div>
            <div>
                <h5 className="text-xs font-bold uppercase text-gray-400 mb-0.5">{type}</h5>
                <h4 className="text-sm font-bold text-gray-900">{data.name}</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{data.description}</p>
            </div>
        </div>
    );
};

export default FoodCard;