import React, { useState } from 'react';

const Home = () => {
    const [inputValue, setInputValue] = useState('');
    const [outputValue, setOutputValue] = useState('');
    const [inputType, setInputType] = useState('placeName');
    const [additionalOption, setAdditionalOption] = useState('option1');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'inputType') setInputType(value);
        else if (name === 'additionalOption') setAdditionalOption(value);
        else setInputValue(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setOutputValue(`You entered: ${inputValue}, Additional Option: ${additionalOption}`);
    };

    const inputFields = {
        placeName: (
            <input
                type="text"
                value={inputValue}
                name="inputValue"
                onChange={handleChange}
                className="mt-2 block w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                placeholder="Type place name..."
            />
        ),
        latitudeLongitude: (
            <input
                type="text"
                value={inputValue}
                name="inputValue"
                onChange={handleChange}
                className="mt-2 block w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                placeholder="e.g., 34.0522, -118.2437"
            />
        ),
        mapLocation: (
            <p className="text-lg text-white mb-4">Select a location on the map (functionality not implemented).</p>
        )
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-black">
            <div className="bg-space bg-cover bg-center min-h-screen flex flex-col justify-center items-center text-center px-5 md:px-10 lg:px-20">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Explore the Universe!</h1>
                <p className="text-lg md:text-xl mb-8 drop-shadow-lg">Enter your space data and unlock the mysteries of the cosmos.</p>
                <button
                    onClick={() => document.getElementById('input-section').scrollIntoView({ behavior: 'smooth' })}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
                >
                    Get Started
                </button>
            </div>

            <div id="input-section" className="bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-md mt-10 px-5 md:px-8">
                <form onSubmit={handleSubmit}>
                    {/* First Dropdown for Input Type Selection */}
                    <label className="block mb-4">
                        <span className="text-lg text-white">Select Input Type:</span>
                        <select 
                            name="inputType" 
                            value={inputType} 
                            onChange={handleChange} 
                            className="mt-2 block w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                        >
                            {['placeName', 'latitudeLongitude', 'mapLocation'].map(option => (
                                <option key={option} value={option}>{option.replace(/([A-Z])/g, ' $1')}</option>
                            ))}
                        </select>
                    </label>

                    {/* Input Field Based on Selected Type */}
                    <label className="block mb-4">
                        {inputFields[inputType]}
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
                        <h2 className="text-xl font-bold text-yellow-400">Output:</h2>
                        <p className="mt-2 text-yellow-300">{outputValue}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
