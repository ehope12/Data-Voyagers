import React, { useState, useRef, useEffect } from 'react';
import bgimg from "../assets/bgimg.png";
import ImageCarousel from '../moreOnUI/ImageCarousel';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const Home = () => {
    const [inputValue, setInputValue] = useState('');
    const [latValue, setLatValue] = useState('');
    const [lonValue, setLonValue] = useState('');
    const [outputValue, setOutputValue] = useState('');
    const [notificationMethod, setNotificationMethod] = useState('');
    const [latLon, setLatLon] = useState('');
    const [selectedOption, setSelectedOption] = useState('Location Input');
    const [pinCoordinates, setPinCoordinates] = useState(null);
    const [date, setDate] = useState(new Date());
    const [timeUnit, setTimeUnit] = useState('');
    const [email, setEmail] = useState('');

    const mapRef = useRef(null);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    
    const handleTimeUnitChange = (e) => {
        setTimeUnit(e.target.value);
    };
    const handleNotificationMethodChange = (e) => {
        setNotificationMethod(e.target.value);
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

    const handleNotificationSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            date: date.toISOString(),
            notificationMethod,
            timeUnit,
            inputValue,
            latitude: latValue,
            longitude: lonValue,
            landsat_number: 9, // ADJUST THIS
            email: email,
        };

        try {
            const response = await fetch('http://localhost:5000/landsat/setup_notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            setOutputValue(data.message || 'Notification setup successfully!');
        } catch (error) {
            console.error('Error submitting form:', error);
            setOutputValue('Error submitting notification setup.');
        }
    };

    const handleDateChange = (selectedDate) => {
        setDate(selectedDate);
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

    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-black">
            <img src={bgimg} alt="placeholder" className="pb-10"></img>
            <div className="bg-space bg-cover bg-center py-16 flex flex-col justify-center items-center text-center px-5 md:px-10 lg:px-20">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Landsat Reflectance Data!</h1>
                <p className="text-lg md:text-xl mb-8 drop-shadow-lg">On the fly and at your fingertips.</p>
                <button
                    onClick={() => document.getElementById('input-section').scrollIntoView({ behavior: 'smooth' })}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                >
                    Get Started
                </button>
            </div>
            <div className="relative z-10 bg-slate-100 py-10 font-semibold px-10 space-y-5">
                <h1 className="text-blue-950 font-bold text-xl">Fun Fact!</h1>
                <p>Free and open data from Landsat offers over fifty years of satellite-based Earth observations 
                to engage members of the public and enable them to learn how Earth is changing. </p>
                <p>To know when Landsat will pass over a certain land area.</p>
            </div> 
            
            {/* Input Section 1*/}
            <div id="input-section" className="relative z-10 bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-md mt-10 px-5 md:px-8">
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
            {/* <div id="input-section" className="relative z-10 bg-green-400 rounded-lg p-6 shadow-lg w-full max-w-md mt-10 px-5 md:px-8">
                <form onSubmit={handleSubmit}>
                    <label className="block mb-4">
                        <span className="text-lg text-white">A Landsat satellite is passing over the defined target location at:</span>
                        
                    </label>
                    
                </form>
            </div> */}

        {/* Input Section 2 */}
        <div id="input-section" className="relative z-10 bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-md mt-10 px-5 md:px-8">
            <form onSubmit={handleNotificationSubmit}>
                {/* Calendar (DatePicker) */}
                <label className="block mb-4">
                    <span className="text-lg text-white">Select Notification Date & Time:</span>
                    <DatePicker
                        selected={date}
                        onChange={handleDateChange}
                        showTimeSelect
                        dateFormat="Pp"
                        className="mt-2 block w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </label>

                {/* Plain Input Field */}
                {/* <label className="block mb-4">
                    <span className="text-lg text-white">Enter a Value:</span>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="mt-2 block w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                        placeholder="Enter a value..."
                    />
                </label> */}

                {/* Dropdown for Time Unit */}
                {/* <label className="block mb-4">
                    <span className="text-lg text-white">Select Time Unit:</span>
                    <select
                        value={timeUnit}
                        onChange={(e) => setTimeUnit(e.target.value)}
                        className="mt-2 block w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                    >
                        <option value="" disabled>Select a time unit</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                    </select>
                </label> */}

                {/* Dropdown for Notification Method */}
                <label className="block mb-4">
                    <span className="text-lg text-white">How would you like to receive notifications?</span>
                    <select
                        value={notificationMethod}
                        onChange={(e) => setNotificationMethod(e.target.value)}
                        className="mt-2 block w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                    >
                        <option value="" disabled>Select a notification method</option>
                        <option value="Email">Email</option>
                        <option value="Desktop">Desktop</option>
                        <option value="Both">Both</option>
                    </select>
                </label>

                <label className="block mb-4">
                    <span className="text-lg text-white">Email Address:</span>
                    <input
                        type="email"
                        value={email} // Assuming you have a state variable for email
                        onChange={(e) => setEmail(e.target.value)} // Assuming setEmail is your state setter
                        className="mt-2 block w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                        required
                    />
                </label>

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full transition duration-300"
                >
                    Submit
                </button>
            </form>

            {outputValue && (
                <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold">Output:</h2>
                    <p className="mt-2">{outputValue}</p>
                </div>
            )}
        </div>

   <ImageCarousel />
     </div>
    );
};

export default Home;
