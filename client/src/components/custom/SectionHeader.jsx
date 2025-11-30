import React from 'react';
import { ChevronRight } from 'lucide-react';

const SectionHeader = ({ title, icon: Icon, subAction }) => (
    <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-2">
        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-blue-500" />} {title}
        </h3>
        {subAction && (
            <button className="text-xs font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                {subAction} <ChevronRight className="w-3 h-3" />
            </button>
        )}
    </div>
);

export default SectionHeader;