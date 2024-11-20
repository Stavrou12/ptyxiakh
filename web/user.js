

function gotoform() {
 //   window.location.href = '/PTYXIAKH/index.html';
 window.scrollTo({ top: 0, behavior: 'smooth' });
}
function refresh(){
     window.location.href = './user.html';
}

let stcode;
let userLat;
let userLon;
function logout() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            window.location.href = "./index.html";
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.open('POST', 'servlet_Logout');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}


function openGoogleMaps(userLat, userLng, destinationLat, destinationLng) {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destinationLat},${destinationLng}&travelmode=driving`;
    window.open(url, '_blank');
}

function handleLocationSelection() {
    const trackLocationRadio = document.getElementById('trackLocation');
    const chooseOnMapRadio = document.getElementById('chooseOnMap');
    const findBeachBtn = document.getElementById('findBeachBtn');
    const mapContainer = document.getElementById('map2');

    if (trackLocationRadio.checked) {
        // Hide the map container if tracking is selected
        mapContainer.style.display = 'block';
        mapContainer.classList.remove("hidden");  // Show the map first
        // Track user location via geolocation
        //initializeMap();
        map2.off('click', onMapClick);
        document.getElementById('findBeachBtn').disabled = false;
        //getLocation();
    } else if (chooseOnMapRadio.checked) {
        // Show the map for manual location selection
        mapContainer.style.display = 'block';
        mapContainer.classList.remove("hidden");  // Show the map first

        // Initialize or display your map
        // initializeMap();
        if (chooseOnMapRadio.checked) {
            map2.on('click', onMapClick);
        }
        document.getElementById('findBeachBtn').disabled = false;
    }
}
let currentMarker = null;
function onMapClick(e) {
    userLat = e.latlng.lat;
    userLon = e.latlng.lng;
    clearMarkers();

    // Create a new red marker at the clicked position
    const redIcon = L.icon({
        iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // URL for a red marker icon
        iconSize: [32, 32], // Size of the icon
        iconAnchor: [16, 32] // Anchor point of the icon
    });
    if (currentMarker) {
        map2.removeLayer(currentMarker);
        map2.removeLayer(L.icon(redIcon));
        currentMarker = null;

    }

    // Add a new marker at the clicked location
    currentMarker = L.marker([userLat, userLon], {icon: redIcon})
            .addTo(map2)
            .bindPopup(`Selected Position: ${userLat.toFixed(5)}, ${userLon.toFixed(5)}`)
            .openPopup();

    // Optionally, add a popup to show coordinates
    userMarker.bindPopup(`Selected Position: ${userLat.toFixed(5)}, ${userLon.toFixed(5)}`).openPopup();
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
document.addEventListener("DOMContentLoaded", function () {
    initializeMap();
});
let map2, currentMarkers = [];
// Initialize the Leaflet filter
function initializeMap() {
    const chooseOnMapRadio = document.getElementById('chooseOnMap');
    if (map2) {
        console.log("Map is already initialized.");
        return; // Exit the function if map2 is already defined
    }
    map2 = L.map('map2').setView([35.0, 25.0], 7);
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 100,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    // Satellite view tile layer (e.g., from Esri)
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    // Add OpenStreetMap layer to the map by default
    osmLayer.addTo(map2);

    // Add layer control to switch between OpenStreetMap and Satellite view
    const baseLayers = {
        "OpenStreetMap": osmLayer,
        "Satellite": satelliteLayer
    };

    // Add layer control to the map
    L.control.layers(baseLayers).addTo(map2);

}
// Function to get user's geolocation
function getLocation() {
    const mapDiv2 = document.getElementById("mapc");
    mapDiv2.classList.remove("hidden");  // Show the map first
    const mapDiv = document.getElementById("map2");
    mapDiv.classList.remove("hidden");  // Show the map first
    //  const f2 = document.getElementById("fmenu");
    // f2.classList.remove('hidden');  // Show the map first
    //  const f = document.getElementById("filterMenu");
    // f.classList.remove('hidden');  // Show the map first


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
    /*
     setTimeout(() => {
     initializeMap(); 
     
     
     }, 1);  // Add a small delay to allow the div to be fully visible before initializing  */

}
// Function to show position
function showPosition(position) {
    // toggleFilterMenu();

    const trackLocationRadio = document.getElementById('trackLocation');
    const chooseOnMapRadio = document.getElementById('chooseOnMap');
    if (trackLocationRadio.checked) {
        userLat = position.coords.latitude;
        userLon = position.coords.longitude;
        console.log(userLat, userLon);
        // Prepare data to send to the server
        const data = `lat=${userLat}&lon=${userLon}`;
        console.log("Requesting beaches with data:", data);
        clearMarkers();
        sendRequest(data);
    } else if (chooseOnMapRadio.checked) {
        const data = `lat=${userLat}&lon=${userLon}`;
        console.log("Requesting beaches with data:", data);
        clearMarkers();
        sendRequest(data);
    }
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


function fetchReviews(stationCode) {
    document.getElementById('reviewModal').classList.add('hidden');
    document.getElementById('Reviews').classList.remove('hidden');
    const xhr = new XMLHttpRequest();
    // Construct the URL with the station code as a query parameter
    const url = `GetReviewsServlet?StationCode=${stationCode}`;
    xhr.open('GET', url, true); // Initialize a GET request

    xhr.onreadystatechange = function () {
        // Check if the request is complete
        if (xhr.readyState === XMLHttpRequest.DONE) {
            // Check the status of the response
            if (xhr.status === 200) {
                // Parse the JSON response
                const reviews = JSON.parse(xhr.responseText);
                console.log(reviews);
                displayReviews(reviews, stationCode); // Call the function to display reviews
                openReviewsModal();
            } else {
                // Handle errors
                console.error('Request failed:', xhr.status, xhr.statusText);
                const reviewsContainer = document.getElementById(`reviewsContainer-${stationCode}`);
                reviewsContainer.innerHTML = '<p>Failed to load reviews. Please try again later.</p>';
            }
        }
    };

    xhr.send(); // Send the request
}

function createImageModal() {
    // Check if the modal already exists to avoid duplication
    if (document.getElementById("imageModal"))
        return;

    // Create the modal elements
    const modal = document.createElement('div');
    modal.id = "imageModal";
    modal.className = "modal";
    modal.style.display = "none";  // Initially hidden
    modal.onclick = closeModal;    // Close when clicked outside the image

    const closeBtn = document.createElement('span');
    closeBtn.className = "close";
    closeBtn.innerHTML = "&times;";
    closeBtn.onclick = closeModal; // Close when clicking the 'x'

    const modalImage = document.createElement('img');
    modalImage.className = "modal-content";
    modalImage.id = "modalImage";

    // Append the modal structure
    modal.appendChild(closeBtn);
    modal.appendChild(modalImage);

    // Append the modal to the body
    document.body.appendChild(modal);
}

// Function to open the modal and display the full-size image
function openModal(imageSrc) {
    createImageModal();  // Ensure the modal exists

    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");

    if (modal && modalImage) {
        modal.style.display = "block";
        modalImage.src = imageSrc;
    } else {
        console.error("Modal elements not found.");
    }
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById("imageModal");

    if (modal) {
        modal.style.display = "none";
    } else {
        console.error("Modal elements not found.");
    }
}


function displayReviews(reviews, stationCode) {
    const reviewsContainer = document.getElementById("allreviews");

    // Clear previous content
    reviewsContainer.innerHTML = '';
    if (reviews.length > 0) {
        const totalStars = reviews.reduce((sum, review) => sum + review.starRating, 0);
        const averageRating = (totalStars / reviews.length).toFixed(1); // Round to one decimal place
        // Display average rating
        const averageRatingDiv = document.createElement('div');
        averageRatingDiv.classList.add('average-rating');
        averageRatingDiv.innerHTML = `
            <h4>Average Rating: <span class="average-score">${averageRating}</span></h4>
        `;
        reviewsContainer.appendChild(averageRatingDiv);
        // Loop through each review and create the structure
        reviews.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.classList.add('review-item');

            // Create review content (name, text, rating)
            const reviewContent = document.createElement('div');
            reviewContent.classList.add('review-content');
            reviewContent.innerHTML = `
                <h4 class="reviewer-name">${review.username}</h4>
                <div class="rating">${'★'.repeat(review.starRating)}${'☆'.repeat(5 - review.starRating)}</div>
                <p class="review-text">${review.reviewText}</p>
            `;

            // Append review content to review item
            reviewItem.appendChild(reviewContent);

            // Check if review has media (image) and add it
            if (review.media) {
                const reviewImage = document.createElement('div');
                reviewImage.classList.add('review-image');
                reviewImage.innerHTML = `<img src="${review.media}" alt="Review Media" style="max-width: 150px; border-radius: 8px; margin-left: 20px;" cursor: pointer;" onclick="openModal('${review.media}')">`;

                // Append the image to review item
                reviewItem.appendChild(reviewImage);
            }
            reviewsContainer.appendChild(reviewItem);
        });
    } else {
        reviewsContainer.innerHTML = '<p>No reviews available for this beach.</p>';
    }
}





        function openContactForm() {
    document.getElementById("md").classList.add("active");
    document.getElementById("md").style.display="block";
}
function closeContactForm() {
     document.getElementById('contactForm').reset(); // Reset the form
    document.getElementById("md").classList.remove("active");
    document.getElementById("md").style.display = "none";
}

function plotBeachesOnMap(beaches) {

    clearMarkers(); // Ensure previous markers are cleared
    console.log(beaches);
    const rev = document.getElementById("Reviews");
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


        marker.bindPopup(` <div id="popd">
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
        <button onclick="fetchReviews('${stationCode}')" class="btn-primary">See Reviews</button>
        <button onclick="openBooking(${lat}, ${lon})" class="btn-primary">Find your place to stay</button>
        
    </div>`);

        const distance = calculateDistance(userLat, userLon, lat, lon);
        const row = document.createElement('tr');
        const row2 = document.getElementById("Reviews");

        // row2.innerHTML = `<div id="reviewsContainer-${stationCode}" class="reviewsContainer hidden"></div>`;
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
        //  rev.appendChild(row2);
        // stcode = stationCode;
    });
    document.getElementById('tabc').classList.remove('hidden');
    // Show the table container after plotting beaches
    document.getElementById('beachesTableContainer').classList.remove('hidden');
    // document.getElementById('Reviews').classList.remove('hidden');
}

function openBooking(lat, lon) {
    // Booking.com search URL format using latitude and longitude
    const bookingUrl = `https://www.booking.com/searchresults.html?ss=&ssne=&ssne_untouched=&dest_type=&checkin_year=&checkin_month=&checkin_monthday=&checkout_year=&checkout_month=&checkout_monthday=&group_adults=2&no_rooms=1&latitude=${lat}&longitude=${lon}&order=distance_from_landmark`;
    window.open(bookingUrl, '_blank');
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

    const f2 = document.getElementById("fmenu");
    const filterMenu = document.getElementById("filterMenu");

    if (f2.classList.contains("active")) {
        f2.style.display = "block";
        filterMenu.style.display = "block";
        f2.classList.remove('hidden'); // Show the filter menu container
        f2.classList.add("active"); // Add active class
        filterMenu.classList.remove('hidden'); // Show the inner filter content


    } else {
        // Activate the filter menu
        f2.style.display = "block";
        filterMenu.style.display = "block";
        f2.classList.remove('hidden'); // Show the filter menu container
        f2.classList.add("active"); // Add active class
        filterMenu.classList.remove('hidden'); // Show the inner filter content
    }

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

    const limit = 25;
    document.getElementById("beachesLimit").value = limit;

    const data = `lat=${userLat}&lon=${userLon}&year=${selectedYear}&month=${selectedMonth}&tar=${tar}&glass=${glass}&plastic=${plastic}&caoutchouc=${caoutchouc}&garbage=${garbage}&intenterococci=${intenterococci}&ecoli=${ecoli}`;
    console.log("Requesting beaches with data:", data);
    clearMarkers();
    sendRequest(data); // Reuse the sendRequest function

}


// Call getLocation to request the user's location
// Event listener for "Find the Cleanest Beach" button
document.getElementById('findBeachBtn').addEventListener('click', () => {
    getLocation();
    const limit = 25;
    document.getElementById("beachesLimit").value = limit;
    // const f2 = document.getElementById("fmenu");
    // f2.classList.remove('hidden');  // Show the map first
    // document.getElementById("filterMenu").classList.remove('hidden');
    if (window.innerWidth > 768) {
        toggleFilterMenu();
    }
    document.getElementById("tabc").classList.remove('hidden');
    document.getElementById("beachesTableContainer").classList.remove('hidden');
});

// Event listener for "Apply Filter" button
document.getElementById('filterBtn').addEventListener('click', () => {
    applyFilter();
});

let currentBeachName = '';
let currentLat = '';
let currentLon = '';

function openReviewForm(beachName, lat, lon, stationCode) {
     document.getElementById("revsub").disabled = false;
    console.log(stationCode);
    currentBeachName = beachName;
    currentLat = lat;
    currentLon = lon;
    // Update modal content
    document.getElementById('modalBeachName').innerText = `Write a Review for ${beachName}`;
    const stationCodeInput = document.getElementById('stCode');
;
    if (!stationCodeInput) {
        console.error("stationCode element not found!");
        return; // Early exit if element is not found
    }
    stationCodeInput.value = stationCode;
      console.log(stationCodeInput.value);
    // Show the modal
    document.getElementById('Reviews').classList.add('hidden');
    document.getElementById('reviewModal').classList.remove('hidden');
    document.getElementById('reviewModal').style.display = 'block';
}

function closeReviewForm() {
    // Clear the form
    document.getElementById('revv').reset(); // Reset the form
    document.getElementById('reviewModal').style.display = 'none';
    document.getElementById('reviewModal').classList.add('hidden');
    // Hide the modal

}

window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

function openReviewsModal() {
    // Show the reviews modal
    document.getElementById('Reviews').classList.remove('hidden');
    document.getElementById('reviewModal').classList.add('hidden');

    document.getElementById('Reviews').style.display = 'block';
}

function closeReviews() {

    document.getElementById('Reviews').classList.add('hidden');
    document.getElementById('Reviews').style.display = 'none';

}

function closeFilter() {
    document.getElementById('fmenu').classList.add('hidden');
    document.getElementById('fmenu').style.display = 'none';
    document.getElementById('filterMenu').classList.add('hidden');
    document.getElementById('filterMenu').style.display = 'none';
}

document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission
    const formData = new FormData(this); // Use FormData to handle file upload

    for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }
    // Submit the form via AJAX (no need to send the username here)
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/PTYXIAKH/ContactServlet', true); // Adjust to the correct server endpoint
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const jsonResponse = JSON.parse(xhr.responseText);
                 document.getElementById("contb").disabled = true;
                console.log("Server response:", jsonResponse); // Log the response for debugging
                 const successMessage = document.createElement('p');
                        successMessage.textContent = "Message submitted successfully!";
                        successMessage.style.color = "green";
                        document.getElementById('contactForm').appendChild(successMessage);
                        setTimeout(() => {
                                  closeContactForm();
                                  document.getElementById('contactForm').removeChild(successMessage);
                            }, 4000);
            } else {
                const jsonResponse = JSON.parse(xhr.responseText);
                console.log("Server response:", jsonResponse); // Log the response for debugging
                const successMessage = document.createElement('p');
                        successMessage.textContent = "Message was not sent!";
                        successMessage.style.color = "red";
                        document.getElementById('contactForm').appendChild(successMessage);
                        setTimeout(() => {
                                  
                                  document.getElementById('contactForm').removeChild(successMessage);
                                  closeContactForm();
                            }, 4000);
                
            }
        }
    };
    xhr.send(formData);
});


                        
                        
document.addEventListener('DOMContentLoaded', function () {
    // Get the form element
    const formElement = document.getElementById('revv');
    
    if (formElement) {
        formElement.addEventListener('submit', function (event) {
            console.log("Form submission intercepted."); // Debugging log
            event.preventDefault(); // Prevent the default form submission

            const formData = new FormData(this); // Collect form data
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/PTYXIAKH/SubmitRev', true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    try {
                        const jsonResponse = JSON.parse(xhr.responseText);
                        if (jsonResponse.status === "success") {
                            document.getElementById("revsub").disabled = true;
                            console.log("Server response:", jsonResponse.message);

                            // Show success message in the form
                         const successMessage = document.createElement('p');
                        successMessage.textContent = "Review submitted successfully!";
                        successMessage.style.color = "green";
                        document.getElementById('revv').appendChild(successMessage);

                            // Close the form after 3 seconds
                            setTimeout(() => {
                                closeReviewForm();
                                  document.getElementById('revv').removeChild(successMessage);
                            }, 4000);
                        } else {
                            console.error("Error:", jsonResponse.message);
                            alert(jsonResponse.message);
                        }
                    } catch (e) {
                        console.error("Invalid JSON response:", xhr.responseText);
                        alert('Unexpected server response. Please try again.');
                    }
                }
            };
            
            xhr.send(formData); // Send the form data via AJAX
        });
    } else {
        console.error("Form with ID 'revv' not found.");
    }
});


document.getElementById("changePasswordForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword = document.getElementById("confirmNewPassword").value;
    // Check if new passwords match
    if (newPassword !== confirmNewPassword) {
        alert("New passwords do not match. Please try again.");
        return;
    }

    const formData = new FormData(this); // Use FormData to handle file upload
    console.log(formData);
    // Submit the form via AJAX (no need to send the username here)
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/ChangePassword', true); // Adjust to the correct server endpoint
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const jsonResponse = JSON.parse(xhr.responseText);
                console.log("Server response:", jsonResponse); // Log the response for debugging
                alert('password submitted successfully!');
                closeReviewForm(); // Close the form on success
            } else {
                const jsonResponse = JSON.parse(xhr.responseText);
                console.log("Server response:", jsonResponse); // Log the response for debugging
                alert('Error submitting password. Please try again.');
            }
        }
       
    };
    xhr.send(formData);
});

function onBeachLimitChange() {
    var selectedLimit = document.getElementById("beachesLimit").value;
    // Make an AJAX request to the servlet with the selected limit
    const data = `lat=${userLat}&lon=${userLon}&limit=${selectedLimit}`;

    clearMarkers();
    // Plot the new beaches on the map
    sendRequest(data);

}

function openSettings() {
    document.getElementById('settingsModal').classList.remove('hidden');
}

// Function to close the settings modal
function closeSettings() {
    document.getElementById('settingsModal').classList.add('hidden');
}

// Open Change Password Modal
function openChangePasswordModal() {
    document.getElementById("changePasswordModal").classList.remove("hidden");
}

// Close Change Password Modal
function closeChangePasswordModal() {
    document.getElementById("changePasswordModal").classList.add("hidden");
}


