/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */
 let map2, currentMarkers = [];
    // Initialize the Leaflet map
    function initializeMap() {
        map2 = L.map('map2').setView([35.0, 25.0], 7); // Set to a default location (Crete)
        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 100,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map2);
    }
    // Function to get user's geolocation
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }
   let userLat;
   let userLon;
    // Function to show position
   function showPosition(position) {
             userLat = position.coords.latitude;
             userLon = position.coords.longitude;
         clearMarkers();
            // Prepare data to send to the server
            const data = `lat=${userLat}&lon=${userLon}`;

            // Send data using XMLHttpRequest
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'GetCleanBeache', true); // Change URL to your servlet
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        const jsonResponse = JSON.parse(xhr.responseText);
                        plotBeachesOnMap(jsonResponse.beaches); // Plot beaches on the map
                        toggleFilterMenu();
                    } else {
                        console.error('Error fetching beaches:', xhr.statusText);
                    }
                }
            };

            xhr.send(data); // Send the request with the user's location
        }
    function plotBeachesOnMap(beaches) {
            clearMarkers(); // Ensure previous markers are cleared

            beaches.forEach(beach => {
                const { name, lat, lon, cleanliness } = beach;

                // Create a marker for each beach
                const marker = L.marker([lat, lon]).addTo(map2);
                currentMarkers.push(marker); // Add to current markers array
                
                marker.bindPopup(`Cleanliness Score: ${cleanliness}<br>Name: ${name}`);
                console.log("Added marker:", marker); // Debug log for added marker
            });

            console.log("Total markers after plotting:", currentMarkers.length); // Debug log
        }
    // Function to clear all markers from the map
    function clearMarkers() {
        if (currentMarkers.length > 0) {
                currentMarkers.forEach(marker => {
                    map2.removeLayer(marker); // Remove marker from the map
                });
                currentMarkers = []; // Clear the array
                console.log("Markers cleared successfully."); // Debugging log
            } else {
                currentMarkers = [];
                console.log("No markers to clear."); // Debugging log
            }
            
    }
    // Function to show error messages
    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                // Ask user to enable location services manually
                alert("User denied the request for Geolocation. Please enable location services or input your location manually.");
                // Optionally, provide a prompt to enter latitude and longitude
                promptForManualLocation();
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
    }
function toggleFilterMenu() {
    const filterMenu = document.getElementById('filterMenu');
    filterMenu.classList.toggle('hidden'); // Toggle hidden class
}

     function applyFilter() {
         
         //const userLat = position.coords.latitude;
           // const userLon = position.coords.longitude;
        const selectedYear = document.getElementById('year').value;
        const selectedMonth = document.getElementById('month').value;

        // Prepare data to send to the server
        const data = `lat=${userLat}&lon=${userLon}&year=${selectedYear}&month=${selectedMonth}`;
clearMarkers();
        // Send data using XMLHttpRequest
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'GetCleanBeache', true); // Change URL to your servlet
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const jsonResponse = JSON.parse(xhr.responseText);
                    plotBeachesOnMap(jsonResponse.beaches); // Plot beaches on the map
                } else {
                    console.error('Error fetching beaches:', xhr.statusText);
                }
            }
            
        };
        xhr.send(data); // Send the request with the filter data
    }
    
    // Call getLocation to request the user's location
        // Event listener for "Find the Cleanest Beach" button
    document.getElementById('findBeachBtn').addEventListener('click', () => {
        getLocation();
    });

    // Event listener for "Apply Filter" button
    document.getElementById('filterBtn').addEventListener('click', () => {
        applyFilter();
    });
     document.addEventListener('DOMContentLoaded', initializeMap);
     
     document.getElementById('toggleFilterBtn').addEventListener('click', toggleFilterMenu);
