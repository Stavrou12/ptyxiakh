document.addEventListener('DOMContentLoaded', initializeMap);

let stcode;
function openGoogleMaps(userLat, userLng, destinationLat, destinationLng) {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destinationLat},${destinationLng}&travelmode=driving`;
    window.open(url, '_blank');
}


function createBeachPopup(beachName, destinationLat, destinationLng) {
    // Content for the popup with a Find Path button
    const popupContent = `
        <div>
            <h3>${beachName}</h3>
            <button onclick="findPathToBeach(${destinationLat}, ${destinationLng})" class="btn-primary">Find Path</button>
        </div>
    `;

    return popupContent;
}
function getUserLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            console.log("User coordinates:", userLat, userLng); // Log user coordinates
            callback(userLat, userLng);
        }, (error) => {
            showError(error); // Handle errors if location fetching fails
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
// Function to find path to the beach when "Find Path" button is clicked
function findPathToBeach(destinationLat, destinationLng) {
    getUserLocation((userLat, userLng) => {
        openGoogleMaps(userLat, userLng, destinationLat, destinationLng);
    });
}

// Example of adding a popup to a map marker (Leaflet example)



document.getElementById('sortBtn').addEventListener('click', () => {
    const sortOption = document.getElementById('sortOption').value;

    // Fetch table rows data
    let tableRows = Array.from(document.querySelectorAll('#beachesTable tbody tr'));

    // Sort rows based on the selected option
    if (sortOption === 'cleanliness_asc') {
        tableRows.sort((a, b) => parseFloat(a.cells[1].innerText) - parseFloat(b.cells[1].innerText));
    } else if (sortOption === 'cleanliness_desc') {
        tableRows.sort((a, b) => parseFloat(b.cells[1].innerText) - parseFloat(a.cells[1].innerText));
    } else if (sortOption === 'distance_asc') {
        tableRows.sort((a, b) => parseFloat(a.cells[2].innerText) - parseFloat(b.cells[2].innerText));
    } else if (sortOption === 'distance_desc') {
        tableRows.sort((a, b) => parseFloat(b.cells[2].innerText) - parseFloat(a.cells[2].innerText));
    }

    // Clear the table body and append the sorted rows
    const beachesTableBody = document.querySelector('#beachesTable tbody');
    beachesTableBody.innerHTML = '';
    tableRows.forEach(row => beachesTableBody.appendChild(row));
});


function updateIntenterococciValue(value) {
    document.getElementById('intenterococciValue').textContent = value;
}

function updateEcoliValue(value) {
    document.getElementById('ecoliValue').textContent = value;
}

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
    console.log(userLat, userLon);

    // Prepare data to send to the server
    const data = `lat=${userLat}&lon=${userLon}`;
    console.log("Requesting beaches with data:", data);
    clearMarkers();
    sendRequest(data);

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
    console.log(beaches);

    const beachesTableBody = document.querySelector('#beachesTable tbody');
    beachesTableBody.innerHTML = ''; // Clear any previous table rows

    if (beaches.length === 0) {
        console.log("No beaches to plot.");
        return; // Early exit if there are no beaches to plot
    }
    beaches.forEach(beach => {
        const {stationCode, ecoli, intenterococci, name, lat, lon, cleanliness, tar, glass, plastic, caoutchouc, garbage} = beach;
        const marker = L.marker([lat, lon]) // Create a marker
                .addTo(map2) // Add it to the map
                .bindPopup(createBeachPopup(name, lat, lon)) // Bind the popup to this marker
                .on('popupopen', () => console.log(`Popup opened for: ${name}`)); // Log when popup is opened
        currentMarkers.push(marker); // Add to current markers array


        marker.bindPopup(` <div>
        <h4>${name}</h4>
        <h4>${stationCode}</h4>
        <p>Cleanliness Score: ${cleanliness}</p>
        <ul>
            <li>Tar: ${tar}</li>
            <li>Glass: ${glass}</li>
            <li>Plastic: ${plastic}</li>
            <li>Caoutchouc: ${caoutchouc}</li>
            <li>Garbage: ${garbage}</li>
            <li>Intenterococci: ${intenterococci}</li>
            <li>Ecoli: ${ecoli}</li>
        </ul>
        <button onclick="findPathToBeach(${lat}, ${lon})" class="btn-primary">Find Path</button>
        <button onclick="openReviewForm('${name}', ${lat}, ${lon},'${stationCode}')" class="btn-primary">Write a Review</button>
        <div id="reviewForm-${stationCode}}" class="reviewForm hidden"></div>
    </div>`);

        //});


        const distance = calculateDistance(userLat, userLon, lat, lon);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${name}</td>
        
            <td>${cleanliness}</td>
               <td>${distance.toFixed(2)}</td> 
            <td>${tar}</td>
            <td>${glass}</td>
            <td>${plastic}</td>
            <td>${caoutchouc}</td>
            <td>${garbage}</td>
            <td>${intenterococci}</td>
            <td>${ecoli}</td>
        `;
        beachesTableBody.appendChild(row);
    stcode = stationCode;
    });
    // Show the table container after plotting beaches
    document.getElementById('beachesTableContainer').classList.remove('hidden');
}


function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
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
    switch (error.code) {
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

    const ecoli = document.getElementById('ecoliRange').value.toString();
    const intenterococci = document.getElementById('intenterococciRange').value.toString();


    const data = `lat=${userLat}&lon=${userLon}&year=${selectedYear}&month=${selectedMonth}&tar=${tar}&glass=${glass}&plastic=${plastic}&caoutchouc=${caoutchouc}&garbage=${garbage}&intenterococci=${intenterococci}&ecoli=${ecoli}`;
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

let currentBeachName = '';
let currentLat = '';
let currentLon = '';

function openReviewForm(beachName, lat, lon, stationCode) {
    // Store the beach info in global variables for later submission
    currentBeachName = beachName;
    currentLat = lat;
    currentLon = lon;

    // Update modal content
    document.getElementById('modalBeachName').innerText = `Write a Review for ${beachName}`;
     const stationCodeInput = document.getElementById('stCode');
     stationCodeInput.value = stationCode;
     console.log(stationCodeInput.value);
    if (!stationCodeInput) {
        console.error("stationCode element not found!");
        return; // Early exit if element is not found
    }

    // Show the modal
    document.getElementById('reviewModal').classList.remove('hidden2');
}

function closeReviewForm() {
    // Clear the form
    document.getElementById('review_text').value = '';
    document.getElementById('review_photo').value = '';

    // Hide the modal
    document.getElementById('reviewModal').classList.add('hidden2');
}

document.getElementById('reviewForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(this); // Use FormData to handle file upload
    console.log(formData);
    // Submit the form via AJAX (no need to send the username here)
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/SubmitRev', true); // Adjust to the correct server endpoint
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                 const jsonResponse = JSON.parse(xhr.responseText);
                    console.log("Server response:", jsonResponse); // Log the response for debugging
                alert('Review submitted successfully!');
                closeReviewForm(); // Close the form on success
            } else {
                const jsonResponse = JSON.parse(xhr.responseText);
                    console.log("Server response:", jsonResponse); // Log the response for debugging
                alert('Error submitting review. Please try again.');
            }
        }
    };
    xhr.send(formData);
});




