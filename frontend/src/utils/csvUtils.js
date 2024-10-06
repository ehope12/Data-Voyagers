// Function to convert data to CSV format
export const convertToCSV = (data) => {
    const header = ['Band', 'Value']; // Change as needed based on your data structure
    const rows = data.spectralData.bands.map((band, index) => [
        band,
        data.spectralData.values[index],
    ]);

    // Combine header and rows
    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
    return csvContent;
};

// Function to download CSV file
export const downloadCSV = (data) => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'landsat_data.csv'); // Specify your file name
    a.style.visibility = 'hidden';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};
