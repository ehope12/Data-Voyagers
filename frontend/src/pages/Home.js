import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import bgimg from "../assets/bgimg.png";

const Home = () => {
    const [inputValue, setInputValue] = useState('');
    const [outputValue, setOutputValue] = useState('');
    const [latLon, setLatLon] = useState('');

    const [timeUnit, setTimeUnit] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    
    const handleTimeUnitChange = (e) => {
        setTimeUnit(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // try {
        //     const response = await fetch('http://localhost:5000/geocode', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ input: inputValue }),
        //     });
    
        //     const data = await response.json();
        //     console.log(data);
        //     if (response.ok) {
        //         setOutputValue(`Latitude: ${data.latitude}, Longitude: ${data.longitude}`);
        //     } else {
        //         setOutputValue(`Error: ${data.error}`);
        //     }
        // } catch (error) {
        //     setOutputValue(`Error: ${error.message}`);
        // }
    };

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

            {/* Input Section 1*/}
            <div id="input-section" className="bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-md mt-10 px-5 md:px-8">
                <form onSubmit={handleSubmit}>
                    <label className="block mb-4">
                        <span className="text-lg text-white">Enter the target loaction:</span>
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
        <div id="input-section" className="bg-gray-800 rounded-lg p-6  shadow-lg w-full max-w-md mt-10 px-5 md:px-8">
           <form onSubmit={handleSubmit}>
            <label className="block ">
                <span className="text-lg text-white">Enter Your Space Data:</span> 
    
             </label> 
            
        
            {/* Input Section with Plain Input Field and Dropdown */}
            <div id="input-section" className="bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-md mt-10 px-5 md:px-8">
                <form onSubmit={handleSubmit}>
                    {/* Plain Input Field */}
                    <label className="block mb-4">
                        <span className="text-lg text-white">Enter a Value:</span>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            className="mt-2 block w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Enter a value..."
                        />
                    </label>

                    

                    {/* Dropdown for Time Unit */}
                    <label className="block mb-4">
                        <span className="text-lg text-white">Select Time Unit:</span>
                        <select
                            value={timeUnit}
                            onChange={handleTimeUnitChange}
                            className="mt-2 block w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                        >
                            <option value="" disabled>Select a time unit</option>
                            <option value="hours">Hours</option>
                            <option value="days">Days</option>
                            <option value="weeks">Weeks</option>
                            <option value="months">Months</option>
                            <option value="years">Years</option>
                        </select>
                    </label>
                    </form>
                    <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full transition duration-300"
            >
                Submit
            </button>

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
</form>
   </div>
     </div>

    );
};

export default Home;
