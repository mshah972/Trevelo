import React from 'react';
import { Sunrise, Sun, Sunset, MoonStar, Camera } from 'lucide-react';
import Badge from './Badge';

const ActivityCard = ({ activity }) => {
    const timeIcon = {
        Morning: <Sunrise className="w-3 h-3 text-orange-500" />,
        Afternoon: <Sun className="w-3 h-3 text-yellow-500" />,
        Evening: <Sunset className="w-3 h-3 text-purple-500" />,
        Night: <MoonStar className="w-3 h-3 text-indigo-500" />
    };

    return (
        <div className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="w-16 h-16 rounded-lg bg-white overflow-hidden flex-shrink-0 relative shadow-sm">
                <img
                    src={`https://source.unsplash.com/random/200x200?sig=${activity.location}`}
                    alt={activity.location}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm p-1 rounded-md text-xs">
                    {timeIcon[activity.timeOfDay] || <Camera className="w-3 h-3" />}
                </div>
            </div>
            <div className="flex flex-col justify-center min-w-0 flex-1">
                <div className="flex justify-between items-start">
                    <h5 className="font-bold text-gray-900 text-sm truncate">{activity.location}</h5>
                    {activity.costLabel && (
                        <Badge color={activity.costLabel === 'high' ? 'orange' : 'green'}>{activity.costLabel}</Badge>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {activity.description}
                </p>
            </div>
        </div>
    );
};

export default ActivityCard;