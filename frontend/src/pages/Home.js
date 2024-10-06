import React, { useState, useRef, useEffect } from 'react';
import bgimg from "../assets/bgimg.png";
import ImageCarousel from '../components/ImageCarousel';
import CloudCoverageFilter from '../components/CloudCoverageFilter';
import LandsatAcquisitionFilter from '../components/LandsatAquisition filter';
import SpectralSignatureChart from '../components/SpectralSignatureChart';
import NotificationSystem from '../components/NotificationSystem';
import { ToastContainer } from 'react-toastify';

const Home = () => {
     // Initialize with placeholder data
     const defaultData = {
        spectralData: {
            bands: ["B1", "B2", "B3", "B4", "B5", "B6", "B7"],
            values: Array(7).fill(0) // Fill with zeros for placeholder
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
    const [inputValue, setInputValue] = useState('');
    const [latValue, setLatValue] = useState('');
    const [lonValue, setLonValue] = useState('');
    const [outputValue, setOutputValue] = useState('');
    const [latLon, setLatLon] = useState('');
    const [selectedOption, setSelectedOption] = useState('Location Input');
    const [pinCoordinates, setPinCoordinates] = useState(null);

    const mapRef = useRef(null);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleLatChange = (e) => {
        setLatValue(e.target.value);
    };

    const handleLonChange = (e) => {
        setLonValue(e.target.value);
    };

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
        setOutputValue('');
        setLatLon('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedOption === 'Location Input') {
            try {
                const response = await fetch('http://localhost:5000/geocode/geocode', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ input: inputValue }),
                });

                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    setOutputValue(`Latitude: ${data.latitude}, Longitude: ${data.longitude}`);
                } else {
                    setOutputValue(`Error: ${data.error}`);
                }
            } catch (error) {
                setOutputValue(`Error: ${error.message}`);
            }
        } else if (selectedOption === 'Lat/Lon') {
            setLatLon(`Latitude: ${latValue}, Longitude: ${lonValue}`);
        }
    };

    const loadGoogleMapsScript = (callback) => {
        const apiKey = process.env.REACT_APP_API_KEY;
        if (!apiKey) {
            console.error('Google Maps API key is not defined');
            return;
        }
        
        if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
            callback();
        } else {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
            script.async = true;
            script.defer = true;
            script.onload = () => callback();
            document.head.appendChild(script);
        }
    };
    
    useEffect(() => {
        if (selectedOption === 'Pin Drop' && mapRef.current) {
            loadGoogleMapsScript(() => {
                const map = new window.google.maps.Map(mapRef.current, {
                    center: { lat: 41.8781, lng: -87.6298 }, // Default center in Chicago
                    zoom: 17.75,
                });
    
                map.addListener('click', (event) => {
                    const lat = event.latLng.lat();
                    const lng = event.latLng.lng();
    
                    setPinCoordinates({ lat, lng });
    
                    new window.google.maps.Marker({
                        position: event.latLng,
                        map: map,
                    });
                });
            });
        }
    }, [selectedOption]);   
    

    //for the graph in point 10
    useEffect(() => {
        // Fetch the sample data from the JSON file
        fetch('/sampleLandsatData.json') // Adjust the path as necessary
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(fetchedData => setData(fetchedData))
            .catch(error => console.error('Error fetching data:', error));
        // // Fetch your Landsat data from the backend
        // fetch('http://localhost:5000/api/landsat-data') // Replace with your actual API endpoint
        //     .then(response => response.json())
        //     .then(data => setData(data))
        //     .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-black">
            <img src={bgimg} alt="placeholder" className="pb-10"></img>
            <div className="bg-space bg-cover bg-center py-16 flex flex-col justify-center items-center text-center px-5 md:px-10 lg:px-20">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Explore the Universe!</h1>
                <p className="text-lg md:text-xl mb-8 drop-shadow-lg">Enter your space data and unlock the mysteries of the cosmos.</p>
                <button
                    onClick={() => document.getElementById('input-section').scrollIntoView({ behavior: 'smooth' })}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                >
                    Get Started
                </button>
            </div>
            <div className="bg-slate-100 py-10 font-semibold px-10 space-y-5">
                <h1 className="text-blue-950 font-bold text-xl">Fun Fact!</h1>
                <p>Free and open data from Landsat offers over fifty years of satellite-based Earth observations 
                to engage members of the public and enable them to learn how Earth is changing. </p>
                <p>To know when Landsat will pass over a certain land area.</p>
            </div> 
            
            {/* Input Section 1*/}
            <div id="input-section" className="bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-md mt-10 px-5 md:px-8">
                {/* Dropdown to select input method */}
                <label className="block mb-4 text-lg text-white">
                    Select Input Method:
                    <select
                        value={selectedOption}
                        onChange={handleOptionChange}
                        className="mt-2 block w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                    >
                        <option value="Location Input">Location Input</option>
                        <option value="Lat/Lon">Lat/Lon</option>
                        <option value="Pin Drop">Pin Drop</option>
                    </select>
                </label>

                {/* Input based on selection */}
                {selectedOption === 'Location Input' && (
                    <form onSubmit={handleSubmit}>
                        <label className="block mb-4">
                            <span className="text-lg text-white">Enter the target location:</span>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                className="mt-2 block w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                                placeholder="Type here..."
                            />
                        </label>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full transition duration-300"
                        >
                            Submit
                        </button>
                    </form>
                )}

                {selectedOption === 'Lat/Lon' && (
                    <form onSubmit={handleSubmit}>
                        <label className="block mb-4">
                            <span className="text-lg text-white">Enter Latitude:</span>
                            <input
                                type="text"
                                value={latValue}
                                onChange={handleLatChange}
                                className="mt-2 block w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                                placeholder="Enter latitude..."
                            />
                        </label>
                        <label className="block mb-4">
                            <span className="text-lg text-white">Enter Longitude:</span>
                            <input
                                type="text"
                                value={lonValue}
                                onChange={handleLonChange}
                                className="mt-2 block w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                                placeholder="Enter longitude..."
                            />
                        </label>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full transition duration-300"
                        >
                            Submit
                        </button>
                    </form>
                )}

                {selectedOption === 'Pin Drop' && (
                    <div>
                        {/* Google Map Section */}
                        <div id="map" ref={mapRef} style={{ width: '100%', height: '400px' }}></div>

                        {/* Display Pin Coordinates */}
                        {pinCoordinates && (
                            <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-lg">
                                <h2 className="text-xl font-bold text-white">Coordinates:</h2>
                                <p className="mt-2 text-white">
                                    Latitude: {pinCoordinates.lat}, Longitude: {pinCoordinates.lng}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Output */}
                {outputValue && (
                    <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold">Output:</h2>
                        <p className="mt-2">{outputValue}</p>
                    </div>
                )}
                {latLon && (
                    <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold">Coordinates:</h2>
                        <p className="mt-2">{latLon}</p>
                    </div>
                )}
            </div>
        
            {/* Output Section 1 */}
            <div id="input-section" className="bg-green-400 rounded-lg p-6 shadow-lg w-full max-w-md mt-10 px-5 md:px-8">
                <form onSubmit={handleSubmit}>
                    <label className="block mb-4">
                        <span className="text-lg text-white">A Landsat satellite is passing over the defined target location at:</span>
                        
                    </label>
                    
                </form>
            </div>

        {/* Input Section 2 */}
       {/* Deleted the notification input */}
   <div className="py-10 w-full">
   <ImageCarousel />
   </div>

   {/* point 4 */}
        <h1 className="">This is the 3x3 grid including a total of 9 Landsat pixels centered on the user-defined location (target pixel).</h1>
        
        {/* The image of the 3x3 grid including a total of 9 Landsat pixels centered on the user-defined location (target pixel). */}

   {/* point 5 */}
            <h1>The Landsat scene that contains the target pixel</h1> 
            {/* using the Worldwide Reference System-2 (WRS-2) */}
     
   {/* point 6 - Allow users to set a threshold for cloud coverage (e.g., only return data with less than 15% land cloud cover).*/}
    {/* Imput box 4 */}
    <CloudCoverageFilter/>

   {/* point 7 - Permit users to specify whether they want access to only the most recent Landsat acquisition or acquisitions spanning a particular time span. */}
    <LandsatAcquisitionFilter/>

    <NotificationSystem/>
    {/* <ToastContainer /> */}

    {/* point 8 - Acquire scene metadata such as acquisition satellite, date, time, latitude/longitude, Worldwide Reference System path and row, percent cloud cover, and image quality. */}

    {/* point 9 - Access and acquire Landsat SR data values (and possibly display the surface temperature data from the thermal infrared bands) for the target pixel by leveraging cloud data catalogs and existing applications. */}
    
    {/* point 10 - Display a graph of the Landsat SR data along the spectrum (i.e., the spectral signature) in addition to scene metadata. */}
   
    <div>
            <SpectralSignatureChart spectralData={data.spectralData} metadata={data.metadata} />
        </div>

    {/* point 11 - Allow users to download or share data in a useful format (e.g., csv). */}
     </div>

    );
};

export default Home;