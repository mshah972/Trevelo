import React from 'react';
import { ChevronDown, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityCard from './ActivityCard';
import FoodCard from './FoodCard';

const DayAccordion = ({ dayData, isOpen, toggle }) => {
    const { day, theme, activities, restaurants } = dayData;

    return (
        <div className="relative pl-8 md:pl-32 pb-8 last:pb-0">
            {/* Date Marker (Desktop) */}
            <div className="hidden md:block absolute left-[8.3rem] top-3 text-right w-24 pr-4">
                <span className="block text-sm font-bold text-gray-900">Day {day}</span>
            </div>
            {/* Date Marker (Mobile) */}
            <div className="md:hidden absolute left-10 top-2">
                <span className="block text-xs font-bold text-gray-900">Day {day}</span>
            </div>

            {/* Connector Line */}
            <div className="absolute left-[11px] md:left-[8.5rem] top-8 bottom-0 w-[2px] bg-gray-100 last:hidden"></div>

            {/* Dot */}
            <div className={`absolute left-[3px] md:left-[8.25rem] top-2 w-4 h-4 rounded-full border-2 border-white ring-1 ring-gray-200 flex items-center justify-center z-10 transition-colors duration-300 ${isOpen ? 'bg-blue-600 ring-blue-100' : 'bg-gray-100'}`}></div>

            {/* Main Card */}
            <div className="md:ml-8">
                <div
                    onClick={toggle}
                    className={`group border bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${isOpen ? 'border-blue-200 shadow-md ring-1 ring-blue-100' : 'border-gray-100 hover:shadow-sm'}`}
                >
                    <div className="p-4 flex justify-between items-center bg-gray-50/50">
                        <div>
                            <h3 className="text-sm md:text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors lg:mt-5 mt-4">
                                {theme}
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">{activities.length} Activities • {restaurants ? 'Dining included' : 'Free dining'}</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                            >
                                <div className="p-4 pt-0 flex flex-col gap-6">
                                    {/* Activities List */}
                                    <div className="flex flex-col gap-3 mt-4">
                                        <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Itinerary</h4>
                                        {activities.map((act, idx) => (
                                            <ActivityCard key={idx} activity={act} />
                                        ))}
                                    </div>

                                    {/* Food Section (Using Schema Data) */}
                                    {restaurants && (
                                        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                                            <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Culinary Spots</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {restaurants.lunch && <FoodCard type="Lunch" data={restaurants.lunch} />}
                                                {restaurants.dinner && <FoodCard type="Dinner" data={restaurants.dinner} />}
                                            </div>
                                            {/* Snacks / Must Try */}
                                            {restaurants.mustTry && restaurants.mustTry.length > 0 && (
                                                <div className="mt-2 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                                                    <h5 className="text-xs font-bold text-yellow-800 mb-1 flex items-center gap-1">
                                                        <Star className="w-3 h-3 fill-yellow-600" /> Must Try
                                                    </h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {restaurants.mustTry.map((item, i) => (
                                                            <span key={i} className="text-xs text-yellow-900 bg-white px-2 py-1 rounded-md border border-yellow-100 shadow-sm">
                                {item.name}
                              </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default DayAccordion;