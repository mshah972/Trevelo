import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorState = ({ message }) => (
    <div className="w-full max-w-2xl mx-auto mt-10 p-6 bg-red-50 border border-red-100 rounded-2xl flex gap-4 items-start">
        <div className="p-3 bg-red-100 rounded-full flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <div>
            <h3 className="text-lg font-bold text-red-900 mb-2">Oops! We couldn't plan that trip.</h3>
            <p className="text-red-700 text-sm leading-relaxed">{message || "Please try again with a clearer prompt."}</p>
        </div>
    </div>
);

export default ErrorState;