import React, { useState } from 'react';

const CloudCoverageFilter = () => {
    const [threshold, setThreshold] = useState(15); // Default threshold value

    const handleInputChange = (event) => {
        setThreshold(event.target.value); // Update threshold as the user types
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent page reload on form submit
        console.log(`Filtering data with cloud coverage less than ${threshold}%`);
        // Add your logic to fetch or filter the data based on this threshold
    // Construct the data to send to the backend
    const requestData = {
        threshold, // Include the threshold in the request
    };

    console.log(`Filtering data with cloud coverage less than ${threshold}%`);
    
    // Send the data to your backend
    fetch('http://localhost:5000/api/landsat-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData), // Convert the request data to JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON from the response
    })
    .then(data => {
        console.log('Response from backend:', data); // Handle the response from the backend
    })
    .catch(error => {
        console.error('Error fetching data:', error); // Handle any errors
    });
    
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Set Cloud Coverage Threshold</h2>
                    <p className="text-gray-500">Only return data with less than the specified land cloud cover percentage.</p>
                </div>

                <div className="relative">
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={threshold}
                        onChange={handleInputChange}
                        className="w-full p-3 text-lg border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
                        placeholder="Enter cloud coverage threshold (%)"
                    />
                    <span className="absolute top-3 right-4 text-gray-400">%</span>
                </div>

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

export default CloudCoverageFilter;
