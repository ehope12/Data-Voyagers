import React, { useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const SpectralSignatureChart = ({ spectralData, metadata }) => {
    useEffect(() => {
        const ctx = document.getElementById('spectralChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line', // Line chart for spectral data
            data: {
                labels: spectralData.bands,
                datasets: [
                    {
                        label: 'Reflectance',
                        data: spectralData.values,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Reflectance',
                        },
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Spectral Bands',
                        },
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toFixed(2)}`;
                            },
                        },
                    },
                },
            },
        });

        // Cleanup chart instance on component unmount
        return () => {
            chart.destroy();
        };
    }, [spectralData]);

    return (
        <div>
            <h2>Spectral Signature</h2>
            <canvas id="spectralChart" width="400" height="200"></canvas>
            <div>
                <h3>Metadata</h3>
                <p>Date: {metadata.date}</p>
                <p>Cloud Coverage: {metadata.cloudCoverage}</p>
                {/* Display other metadata fields as needed */}
            </div>
        </div>
    );
};

export default SpectralSignatureChart;
