import React, { useState, useEffect } from 'react';
import SpectralSignatureChart from './SpectralSignatureChart';
import { downloadCSV } from '../utils/csvUtils'; // Import the utility function

const LandsatDataDisplay = () => {
    const defaultData = {
        spectralData: {
            bands: ["B1", "B2", "B3", "B4", "B5", "B6", "B7"],
            values: Array(7).fill(0)
        },
        metadata: {
            date: "N/A",
            cloudCoverage: "N/A",
            sceneID: "N/A",
            sunElevation: "N/A",
            sunAzimuth: "N/A",
            sensorType: "N/A",
            platform: "N/A",
            qualityAssessment: "N/A"
        }
    };

    const [data, setData] = useState(defaultData);

    useEffect(() => {
        fetch('/sampleLandsatData.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(fetchedData => setData(fetchedData))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <SpectralSignatureChart spectralData={data.spectralData} metadata={data.metadata} />
            <button onClick={() => downloadCSV(data)} className="mt-4 p-2 bg-blue-500 text-white rounded">
                Download CSV
            </button>
        </div>
    );
};

export default LandsatDataDisplay;
