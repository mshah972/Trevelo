import React, { useState } from 'react';
import {
    Calendar, MapPin, Info, Share2, Download,
    Plane, Hotel
} from 'lucide-react';

// Import our sub-components
import SectionHeader from '../custom/SectionHeader.jsx';
import FlightCard from '../custom/FlightCard.jsx';
import HotelCard from '../custom/HotelCard.jsx';
import DayAccordion from '../custom/DayAccordion.jsx';
import ErrorState from '../custom/ErrorState.jsx';

// --- MOCK DATA FOR FLIGHTS/HOTELS (Since schema doesn't provide these yet) ---
const FLIGHT_DATA = {
    airline: {
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/American_Airlines_Group_logo_2013.svg/1024px-American_Airlines_Group_logo_2013.svg.png",
        name: "American Airlines",
        shortName: "AA"
    },
    price: { currency: "$", amount: "450" },
    departure: { city: "New York", code: "JFK", date: "May 11", time: "10:30 AM" },
    arrival: { city: "Barcelona", code: "BCN", date: "May 12", time: "11:50 PM" },
    duration: "7h 20m",
    numberOfStops: 0
};

const HOTEL_DATA = {
    images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2025&auto=format&fit=crop"
    ],
    name: "Grand Hotel Central",
    location: "Gothic Quarter, Barcelona",
    stars: 5,
    rating: { value: 4.8, count: 120 },
    reviews: 324,
    roomType: ["Deluxe King", "Twin Room"],
    freeCancellation: true,
    price: {
        discountType: "Mobile only price",
        currency: "$",
        amount: "320",
        discountedAmount: "280",
        totalPrice: "560"
    }
};

const Divider = () => <div className="w-full h-[1px] bg-gray-200 my-6" />;

export const ItineraryView = ({ plan }) => {
    const [openDay, setOpenDay] = useState(0);

    // 1. Handle Error Mode or Missing Data
    if (!plan) return null;
    if (plan.mode === 'error') {
        return <ErrorState message={plan.error} />;
    }

    // 2. Destructure Trip Data
    const { tripTitle, startingMessage, summary, dailyPlan, totalBudget, listOfPlaces } = plan;

    // Helper to get main destination name
    const mainDestination = listOfPlaces?.[0]?.places?.city || "Destination";
    const coverImageQuery = encodeURIComponent(mainDestination);

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 pb-10">

            {/* HERO SECTION */}
            <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden group shadow-lg">
                <img
                    src={`https://source.unsplash.com/1600x900/?${coverImageQuery},travel`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={tripTitle}
                    // Fallback image if Unsplash fails
                    onError={(e) => e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-10">
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/10 uppercase tracking-wide">
                AI Generated Trip
              </span>
                            {totalBudget && (
                                <span className="px-3 py-1 bg-green-500/80 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/10 capitalize">
                  {totalBudget} Budget
                </span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight shadow-sm leading-tight">
                            {tripTitle || "Your Dream Itinerary"}
                        </h1>
                        <div className="flex items-center gap-4 text-white/90 text-sm font-medium">
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {dailyPlan?.length || 0} Days</span>
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {listOfPlaces?.map(p => p.places.city).join(', ') || "Multiple Locations"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* INTRO & SUMMARY */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Info className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Trip Overview</h2>
                        {startingMessage && <p className="text-sm text-gray-500 italic mb-2">{startingMessage}</p>}
                    </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base pl-[3.25rem]">
                    {summary}
                </p>
            </div>

            {/* STATIC BOOKING SECTION (Placeholder for future API integration) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <SectionHeader title="Flights" icon={Plane} subAction="Find cheapest" />
                    <FlightCard data={FLIGHT_DATA} />
                </div>
                <div>
                    <SectionHeader title="Accommodation" icon={Hotel} subAction="View map" />
                    <HotelCard data={HOTEL_DATA} />
                </div>
            </div>

            {/* DYNAMIC TIMELINE */}
            <div>
                <SectionHeader title="Daily Plan" icon={Calendar} />
                <div className="relative mt-6">
                    {dailyPlan && dailyPlan.length > 0 ? (
                        dailyPlan.map((day, index) => (
                            <DayAccordion
                                key={index}
                                dayData={day}
                                isOpen={openDay === index}
                                toggle={() => setOpenDay(openDay === index ? -1 : index)}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 italic text-center py-4">No daily plan details available.</p>
                    )}
                </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-100">
                <p className="text-xs text-gray-400">Generated by Trevelo AI</p>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" /> Download PDF
                    </button>
                </div>
            </div>

        </div>
    );
};