/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */



$(document).ready(function () {

    document.getElementById("btform").addEventListener("click", function () {
        var newDiv = document.getElementById("secform");
        newDiv.style.display = "block";  // Make the div visible
    });
    $('#dataForm-3').on('submit', function (event) {
        event.preventDefault();  // Prevent default form submission

        // Get form data
        var formData = $(this).serialize();

        // Send form data to backend (servlet)
        $.ajax({
            url: 'InsertDataServlet', // Adjust this URL to match your servlet
            type: 'POST',
            data: formData,
            success: function (response) {
                $('#response').html('<p>Data inserted successfully!</p>');
            },
            error: function (xhr, status, error) {
                $('#response').html('<p>Error: ' + error + '</p>');
            }
        });
    });



    $('#dataForm-2').on('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        // Get selected values
        const selectedMonth = $('#month-select-2').val();
        const selectedYear = $('#year-select-2').val();
        // Make AJAX request
        $.ajax({
            url: 'RemoveTable',
            method: 'GET',
            data: {
                'month-select-2': selectedMonth,
                'year-select-2': selectedYear
            },
            success: function (response) {
                // Clear previous data
                $('#tablermmes').empty();
                // Check if the response has data
                if (response && response.length > 0) {
                    // Create a table to display the data
                    $('#nameoftable').attr('name', selectedMonth + selectedYear);
                    // Set inner HTML content
                    $('#nameoftable').html(selectedMonth + selectedYear);
                    // Optionally log to confirm
                    console.log($('#nameoftable').attr('name')); // Should output: giannis
                    console.log($('#nameoftable').html()); // Should output: This is the content for the div.                                
                    $('#tablermmes').html("Table " + selectedMonth + selectedYear + " was successfully removed"); // Insert the table into the display area
                } else {
                    $('#tablermmes').html('<p>No data available for the selected month and year.</p>');
                }
            },
            error: function (xhr, status, error) {
                // Handle errors
                console.error('AJAX Error:', status, error);
                $('#tablermmes').html('<p>An error occurred while retrieving data. Please try again later.</p>');
            }
        });
    });





    $('#dataForm-2-beach').on('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        // Get selected values
        const selectedMonth = $('#month-select-2-beach').val();
        const selectedYear = $('#year-select-2-beach').val();
        const beach = $('#code').val();
        console.log(beach);
        // Make AJAX request
        $.ajax({
            url: 'RemoveBeach',
            method: 'GET',
            data: {
                'month-select-2-beach': selectedMonth,
                'year-select-2-beach': selectedYear,
                'code': beach
            },
            success: function (response) {
                // Clear previous data
                $('#tablermmesbeach').empty();
                // Check if the response has data
                if (response && response.length > 0) {
                    // Create a table to display the data
                    $('#nameoftable').attr('name', selectedMonth + selectedYear);
                    // Set inner HTML content
                    $('#nameoftable').html(selectedMonth + selectedYear);
                    // Optionally log to confirm
                    console.log($('#nameoftable').attr('name')); // Should output: giannis
                    console.log($('#nameoftable').html()); // Should output: This is the content for the div.                                
                    $('#tablermmesbeach').html("beach " + beach + " was removed from Table " + selectedMonth + selectedYear); // Insert the table into the display area
                } else {
                    $('#tablermmesbeach').html('<p>No data available for the selected month and year.</p>');
                }
            },
            error: function (xhr, status, error) {
                // Handle errors
                console.error('AJAX Error:', status, error);
                $('#tablermmes').html('<p>An error occurred while retrieving data. Please try again later.</p>');
            }
        });
    });

    // Handle form submission
    $('#dataForm').on('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        // Get selected values
        const selectedMonth = $('#month-select').val();
        const selectedYear = $('#year-select').val();
        // Make AJAX request
        $.ajax({
            url: 'GetBeachDataServlet',
            method: 'GET',
            data: {
                'month-select': selectedMonth,
                'year-select': selectedYear
            },
            success: function (response) {
                // Clear previous data
                $('#beachDataDisplay').empty();

                // Check if the response has data
                if (response && response.length > 0) {
                    // Create a table to display the data
                    let table = '<table id="data-table"><thead><tr>';
                    // Create table headers (modify according to your data properties)
                    table += '<th>Perunit</th>';
                    table += '<th>Municipal</th>';
                    table += '<th>Coast</th>';
                    table += '<th>Station Code</th>';
                    table += '<th>Description</th>';
                    table += '<th>Sample Date</th>';
                    table += '<th>Sample Time</th>';
                    table += '<th>Delivery Date</th>';
                    table += '<th>Analyse Date</th>';
                    table += '<th>Intenterococci</th>';
                    table += '<th>Ecoli</th>';
                    table += '<th>Tar</th>';
                    table += '<th>Glass</th>';
                    table += '<th>Plastic</th>';
                    table += '<th>Caoutchouc</th>';
                    table += '<th>Garbage</th>';
                    table += '<th>Wave</th>';
                    table += '<th>Airdirection</th>';
                    table += '<th>Rainfail</th>';
                    table += '<th>Yestrainfail</th>';
                    table += '</tr></thead><tbody>';
                    // Populate the table with beach data
                    response.forEach(beach => {
                        table += `<tr>
                                      <td>${beach.Perunit}</td>
                                      <td>${beach.Municipal}</td>
                                      <td>${beach.Coast}</td>
                                      <td>${beach.StationCode}</td>
                                      <td>${beach.Description}</td>
                                      <td>${beach.SampleDate}</td>
                                      <td>${beach.SampleTime}</td>
                                      <td>${beach.DeliveryDate}</td>
                                      <td>${beach.AnalyseDate}</td>
                                      <td>${beach.Intenterococci}</td>
                                      <td>${beach.Ecoli}</td>
                                      <td>${beach.Tar}</td>
                                      <td>${beach.Glass}</td>
                                      <td>${beach.Plastic}</td>
                                      <td>${beach.Caoutchouc}</td>
                                      <td>${beach.Garbage}</td>
                                      <td>${beach.Wave}</td>
                                      <td>${beach.Airdirection}</td>
                                      <td>${beach.Rainfail}</td>
                                      <td>${beach.Yestrainfail}</td>
                                      <td><button class="updateButton">Update</button></td>
                                  </tr>`;
                    });
                    // Set the name attribute to "giannis"
                    $('#nameoftable').attr('name', selectedMonth + selectedYear);

                    // Set inner HTML content
                    $('#nameoftable').html(selectedMonth + selectedYear);

                    // Optionally log to confirm
                    console.log($('#nameoftable').attr('name')); // Should output: giannis
                    console.log($('#nameoftable').html()); // Should output: This is the content for the div.
                    table += '</tbody></table>';
                    $('#beachDataDisplay').html(table); // Insert the table into the display area
                } else {
                    $('#beachDataDisplay').html('<p>No data available for the selected month and year.</p>');
                }
            },
            error: function (xhr, status, error) {
                // Handle errors
                console.error('AJAX Error:', status, error);
                $('#beachDataDisplay').html('<p>An error occurred while retrieving data. Please try again later.</p>');
            }
        });
    });
    $('#saveButton').on('click', function () {
        const tableName = document.getElementById("nameoftable").getAttribute("name");
        console.log(tableName);
        const updatedData = saveAllUpdates(); // Get the updated data from the function
        console.log(updatedData);
        // Check if there's any updated data
        if (updatedData.length === 0) {
            console.log('No data to update.');
            return;
        }
        // Make an AJAX POST request to send the updated data to the server
        $.ajax({
            url: 'UpdateBeachDataServlet', // Change this to the actual servlet URL
            method: 'POST',
            //   data: JSON.stringify(updatedData), // Send the data as JSON
            data: JSON.stringify({tableName, updatedData}),
            contentType: 'application/json; charset=UTF-8',
            success: function (response) {
                // Handle success (you can show a message or update the UI)
                console.log('Data updated successfully!');
                console.log('Server response:', response); // For debugging
            },
            error: function (xhr, status, error) {
                // Handle error (show an error message to the user)
                console.error('Update Error:', status, error);
                console.log('Response:', xhr.responseText); // Log server response for debugging
                console.log('An error occurred while saving updates. Please try again.');
            }
        });
    });


    $(document).on('click', '.updateButton', function () {
        handleUpdateButtonClick($(this));
    });
// Save all updates
});


function handleUpdateButtonClick(button) {
    console.log('Update button clicked');
    let es = document.getElementById("saveButton");
    es.style.display = "block";
    const row = button.closest('tr');
    // Get current values from the row
    const fields = row.find('td').slice(0, -1); // Exclude the last cell (Update button)

    fields.each(function () {
        const currentValue = $(this).text();
        $(this).html(`<input type='text' value='${currentValue}' />`);
    });

    button.prop('disabled', true); // Disable the Update button
}

function saveAllUpdates() {
    const updatedData = []; // Array to hold the updated rows

    $('#data-table tbody tr').each(function () {
        const row = $(this);
        const rowData = {
            // StationCode: row.data('id'), // Use data attribute for unique ID

            // If the input exists, use its value; otherwise, use the cell text
            Perunit: row.find('td:nth-child(1) input').length ? row.find('td:nth-child(1) input').val() : row.find('td:nth-child(1)').text(),
            Municipal: row.find('td:nth-child(2) input').length ? row.find('td:nth-child(2) input').val() : row.find('td:nth-child(2)').text(),
            Coast: row.find('td:nth-child(3) input').length ? row.find('td:nth-child(3) input').val() : row.find('td:nth-child(3)').text(),
            StationCode: row.find('td:nth-child(4) input').length ? row.find('td:nth-child(4) input').val() : row.find('td:nth-child(4)').text(),
            Description: row.find('td:nth-child(5) input').length ? row.find('td:nth-child(5) input').val() : row.find('td:nth-child(5)').text(),
            SampleDate: row.find('td:nth-child(6) input').length ? row.find('td:nth-child(6) input').val() : row.find('td:nth-child(6)').text(),
            SampleTime: row.find('td:nth-child(7) input').length ? row.find('td:nth-child(7) input').val() : row.find('td:nth-child(7)').text(),
            DeliveryDate: row.find('td:nth-child(8) input').length ? row.find('td:nth-child(8) input').val() : row.find('td:nth-child(8)').text(),
            AnalyseDate: row.find('td:nth-child(9) input').length ? row.find('td:nth-child(9) input').val() : row.find('td:nth-child(9)').text(),
            Intenterococci: row.find('td:nth-child(10) input').length ? row.find('td:nth-child(10) input').val() : row.find('td:nth-child(10)').text(),
            Ecoli: row.find('td:nth-child(11) input').length ? row.find('td:nth-child(11) input').val() : row.find('td:nth-child(11)').text(),
            Tar: row.find('td:nth-child(12) input').length ? row.find('td:nth-child(12) input').val() : row.find('td:nth-child(12)').text(),
            Glass: row.find('td:nth-child(13) input').length ? row.find('td:nth-child(13) input').val() : row.find('td:nth-child(13)').text(),
            Plastic: row.find('td:nth-child(14) input').length ? row.find('td:nth-child(14) input').val() : row.find('td:nth-child(14)').text(),
            Caoutchouc: row.find('td:nth-child(15) input').length ? row.find('td:nth-child(15) input').val() : row.find('td:nth-child(15)').text(),
            Garbage: row.find('td:nth-child(16) input').length ? row.find('td:nth-child(16) input').val() : row.find('td:nth-child(16)').text(),
            Wave: row.find('td:nth-child(17) input').length ? row.find('td:nth-child(17) input').val() : row.find('td:nth-child(17)').text(),
            Airdirection: row.find('td:nth-child(18) input').length ? row.find('td:nth-child(18) input').val() : row.find('td:nth-child(18)').text(),
            Rainfail: row.find('td:nth-child(19) input').length ? row.find('td:nth-child(19) input').val() : row.find('td:nth-child(19)').text(),
            Yestrainfail: row.find('td:nth-child(20) input').length ? row.find('td:nth-child(20) input').val() : row.find('td:nth-child(20)').text(),
        };

        updatedData.push(rowData); // Add the row data to the array
        // console.log(rowData); // For debugging purposes
    });

    return updatedData; // Return the array of updated data
}



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


document.getElementById('uploadForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    // Check if a file is selected
    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    // Create a FormData object to hold the file
    const formData = new FormData();
    formData.append('file', file);

    // Create an XMLHttpRequest to send the file
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'uploadServlet', true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            alert('File uploaded successfully!');
            // Optionally, refresh the page or redirect
            // location.reload();
        } else {
            alert('File upload failed. Please try again.');
        }
    };

    xhr.onerror = function () {
        alert('An error occurred while uploading the file.');
    };

    // Send the file data
    xhr.send(formData);
});


function deleteuser1() {
    document.getElementById("delete-page").style.display = 'flex';
    document.getElementById("user1").style.display = 'flex';
    document.getElementById("butdel").style.display = 'flex';

}

function deleteuser() {
    var userId = document.getElementById("USER1").value;  // Get the user ID
    console.log("Deleting user with ID: " + userId);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'diagrafh_user', true);  // POST to your server endpoint
    xhr.setRequestHeader("Content-type", "application/json");

    // Wrap the userId in a JSON object
    var jsonData = JSON.stringify({"user_id": userId});
    console.log("Sending JSON: ", jsonData);  // For debugging purposes

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("User deleted successfully.");
            console.log(xhr.responseText);

            // You can update the UI here to show that the user was deleted.
            document.getElementById('responseMessage').innerText = "User deleted successfully.";
        } else {
            console.error("Failed to delete user. Status: " + xhr.status);
            document.getElementById('responseMessage').innerText = "Failed to delete user.";
        }
    };

    xhr.onerror = function () {
        console.error("Request failed.");
        document.getElementById('responseMessage').innerText = "Request failed.";
    };

    xhr.send(jsonData);  // Send the user_id in JSON format
}

function createTableFromJSON(data) {
    var html = "<table><tr><th>Category</th><th>Value</th></tr>";
    for (const x in data) {
        var category = x;
        var value = data[x];
        html += "<tr><td>" + category + "</td><td>" + value + "</td></tr>";
    }
    html += "</table>";
    return html;

}
function DELETEPOST() {
    let myForm = document.getElementById('apolyshform');
    let formData = new FormData(myForm);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));

    var jsonData = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    console.log(jsonData);
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("mphke");
            var responseData = JSON.parse(jsonData);
            console.log(responseData);
            //   if (document.getElementById("txtTypeUser").value === "emp3") {
            //     $('#ajaxContent').html("Successful permanentadm Registration.");

            // $('#ajaxContent').html("Successful Registration.");
            // $('#reg')[0].reset();
            $('#pinakas').append(createTableFromJSON(responseData));
        } else if (xhr.status !== 200) {
            //  document.getElementById("ajaxContent").style.color = "red";
            // document.getElementById('ajaxContent').innerHTML =
            //         'Request failed. Returned status of ' + xhr.status + "<br>";
        }
    };

    xhr.open('POST', 'diagrafh_user');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(jsonData);
}