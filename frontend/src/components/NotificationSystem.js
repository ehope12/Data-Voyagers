import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const NotificationSystem = () => {
    const [notificationMethod, setNotificationMethod] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState(new Date());
    const [timeUnit, setTimeUnit] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [latValue, setLatValue] = useState(0);
    const [lonValue, setLonValue] = useState(0);
    const [outputValue, setOutputValue] = useState('');

    const handleDateChange = (selectedDate) => {
        setDate(selectedDate);
    };

    const handleNotificationSubmit = async (e) => {
        e.preventDefault();
        if (latValue < -90 || latValue > 90 || lonValue < -180 || lonValue > 180) {
            toast('Please enter a valid location.'); // Show a toast notification
            return; // Prevent the API call
        }

        const payload = {
            date: date.toISOString(),
            notificationMethod,
            timeUnit,
            inputValue,
            latitude: latValue,
            longitude: lonValue,
            landsat_number: 9, // Replace with your actual Landsat number if dynamic
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

            // Schedule the notification
            const notificationTime = new Date(date);
            const now = new Date();
            const delay = notificationTime - now;

            // Extract necessary details from the response data
            const landsatNumber = payload.landsat_number; // Assuming it remains constant as 9
            const overpassTime = new Date(data.next_overpass_time); // Ensure your backend sends this time in a suitable format
            console.log('Overpass Time:', data.next_overpass_time); // Debug
            console.log('Overpass Time:', overpassTime); // Debug
            const localOverpassTimeStr = overpassTime.toLocaleString(); // Format it as required

            if (delay > 0) {
                setTimeout(() => {
                    toast.info(
                        <div>
                            <strong>{`Landsat ${landsatNumber} Overpass Alert`}</strong>
                            <p>{`Landsat ${landsatNumber} will pass over at [TIME] (local time).`}</p>
                        </div>
                    ); // Trigger a toast notification with detailed info
                }, delay);
            } else {
                toast.error('The scheduled time is in the past.'); // Handle past dates
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setOutputValue('Error submitting notification setup.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <form onSubmit={handleNotificationSubmit} className="bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-md mt-10 px-5 md:px-8">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-white mb-4">Set Notification Method</h2>
                    <p className="text-white">Choose between email, desktop notification, or both.</p>
                </div>
                <label className="block mb-4">
                    <DatePicker
                        selected={date}
                        onChange={handleDateChange}
                        showTimeSelect
                        dateFormat="Pp"
                        className="mt-2 block w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </label>
                <label className="block mb-4">
                    <select
                        value={notificationMethod}
                        onChange={(e) => setNotificationMethod(e.target.value)}
                        className="mt-2 block w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                    >
                        <option value="" disabled>Select a notification method</option>
                        <option value="Email">Email</option>
                        <option value="Desktop">Desktop</option>
                        <option value="Both">Both</option>
                    </select>
                </label>

                {(notificationMethod === 'Email' || notificationMethod === 'Both') && (
                    <label className="block mb-4">
                        <span className="text-lg text-gray-700">Email Address:</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 block w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                            required
                        />
                    </label>
                )}

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full transition duration-300"
                >
                    Submit
                </button>
            </form>

            {outputValue && (
                <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-white">Output:</h2>
                    <p className="mt-2 text-white">{outputValue}</p>
                </div>
            )}
            <ToastContainer /> {/* Add ToastContainer here */}
        </div>
    );
};

export default NotificationSystem;
