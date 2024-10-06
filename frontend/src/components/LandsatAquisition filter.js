import React, { useState } from 'react';

const LandsatAcquisitionFilter = () => {
    const [acquisitionType, setAcquisitionType] = useState('mostRecent');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleTypeChange = (event) => {
        setAcquisitionType(event.target.value); // Update acquisition type based on selection
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (acquisitionType === 'mostRecent') {
            console.log('Fetching the most recent Landsat acquisition');
        } else {
            console.log(`Fetching Landsat acquisitions from ${startDate} to ${endDate}`);
        }

        const data = {
            startDate,
            endDate
        };
    
        fetch('https://your-backend-url.com/api/landsat-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data); // Handle the response from the backend
        })
        .catch((error) => {
            console.error('Error:', error); // Handle any errors
        });
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Landsat Acquisition Filter</h2>
                    <p className="text-gray-500">Choose between the most recent Landsat data or specify a custom time range.</p>
                </div>

                {/* Acquisition Type Selector */}
                <div className="space-y-3">
                    <label htmlFor="acquisitionType" className="block text-gray-600 font-medium">
                        Select Acquisition Type
                    </label>
                    <select
                        id="acquisitionType"
                        value={acquisitionType}
                        onChange={handleTypeChange}
                        className="block w-full p-3 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
                    >
                        <option value="mostRecent">Most Recent</option>
                        <option value="customRange">Custom Range</option>
                    </select>
                </div>

                {/* Conditional Date Input (only shows if Custom Range is selected) */}
                {acquisitionType === 'customRange' && (
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <label htmlFor="startDate" className="block text-gray-600 font-medium">
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
                            />
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="endDate" className="block text-gray-600 font-medium">
                                End Date
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
                            />
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="text-center">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
                    >
                        Apply Filter
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LandsatAcquisitionFilter;
