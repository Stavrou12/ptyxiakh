/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */
  document.addEventListener('DOMContentLoaded', initializeMap);
  
function updateCheckboxValue(checkbox) {
    // If the checkbox is checked, its value is "YES"
    // If unchecked, we don't need to change the value since it won't be submitted
    if (checkbox.checked) {
        checkbox.value = "YES"; // Set to NO if unchecked
    }
    if (!checkbox.checked) {
        checkbox.value = "NO"; // Set to NO if unchecked
    }
}


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
       toggleFilterMenu();
             userLat = position.coords.latitude;
             userLon = position.coords.longitude;
         clearMarkers();
            // Prepare data to send to the server
            const data = `lat=${userLat}&lon=${userLon}`;
            sendRequest(`lat=${userLat}&lon=${userLon}`);

            // Send data using XMLHttpRequest
        }
        
        function sendRequest(data) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'GetCleanBeache', true); // Change URL to your servlet
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              try {
                    const jsonResponse = JSON.parse(xhr.responseText);
                    console.log("Server response:", jsonResponse); // Log the response for debugging

                    // Check if beaches is defined and is an array
                    if (Array.isArray(jsonResponse.beaches)) {
                        plotBeachesOnMap(jsonResponse.beaches); // Plot beaches on the map
                    } else {
                        console.error('Beaches data is undefined or not an array:', jsonResponse.beaches);
                    }
                } catch (e) {
                    console.error('Error parsing JSON response:', e);
                }
                 
            } else {
                console.error('Error fetching beaches:', xhr.statusText);
            }
        }
    };

    xhr.send(data); // Send the request with the user's location
}
    function plotBeachesOnMap(beaches) {
    clearMarkers(); // Ensure previous markers are cleared
     if (beaches.length === 0) {
        console.log("No beaches to plot.");
        return; // Early exit if there are no beaches to plot
    }
    beaches.forEach(beach => {
        const { name, lat, lon, cleanliness, tar, glass, plastic, caoutchouc, garbage } = beach;
        const marker = L.marker([lat, lon]).addTo(map2);
        currentMarkers.push(marker); // Add to current markers array

        marker.bindPopup(` <div>
        <h4>${name}</h4>
        <p>Cleanliness Score: ${cleanliness}</p>
        <ul>
            <li>Tar: ${tar}</li>
            <li>Glass: ${glass}</li>
            <li>Plastic: ${plastic}</li>
            <li>Caoutchouc: ${caoutchouc}</li>
            <li>Garbage: ${garbage}</li>
        </ul>
    </div>`);
        
    });

   
}

    // Function to clear all markers from the map
    function clearMarkers() {
        if (currentMarkers.length > 0) {
                currentMarkers.forEach(marker => {
                    map2.removeLayer(marker); // Remove marker from the map
                });
                currentMarkers = []; // Clear the array
                
            } else {
                currentMarkers = [];
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
    const selectedYear = document.getElementById('year').value;
    const selectedMonth = document.getElementById('month').value;
    const tar = document.getElementById('tar').value;
    const glass = document.getElementById('glass').value;
    const plastic = document.getElementById('plastic').value;
    const caoutchouc = document.getElementById('caoutchouc').value;
    const garbage = document.getElementById('garbage').value;
    
    const data = `lat=${userLat}&lon=${userLon}&year=${selectedYear}&month=${selectedMonth}&tar=${tar}&glass=${glass}&plastic=${plastic}&caoutchouc=${caoutchouc}&garbage=${garbage}`;
    console.log("Requesting beaches with data:", data);
    clearMarkers();
    sendRequest(data); // Reuse the sendRequest function
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
   
     
  
