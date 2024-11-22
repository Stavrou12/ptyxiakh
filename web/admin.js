/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */





function refresh() {
    window.location.href = './admin.html';
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

                const successMessage = document.createElement('p');
                successMessage.textContent = "Το μήνυμα υποβλήθηκε με επιτυχία!";
                successMessage.style.color = "green";
                document.getElementById('contactForm').appendChild(successMessage);
                setTimeout(() => {
                    closeContactForm();
                    document.getElementById('contactForm').removeChild(successMessage);
                }, 4000);
            } else {
                const jsonResponse = JSON.parse(xhr.responseText);

                const successMessage = document.createElement('p');
                successMessage.textContent = "Το μήνυμα δεν στάλθηκε!";
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


function openContactForm() {
    document.getElementById("contb").disabled = false;
    document.getElementById("md").classList.add("active");
    document.getElementById("md").style.display = "block";
}

function closeContactForm() {
    document.getElementById('contactForm').reset(); // Reset the form
    document.getElementById("md").classList.remove("active");
    document.getElementById("md").style.display = "none";
}

function showAddForm() {

    document.getElementById("bform").disabled = false;
    const form = document.getElementById('addLocationForm');
    if (form.style.display === 'block') {
        form.style.display = 'none';
    } else {
        form.style.display = 'block';
    }
}


function closeAddForm() {
    document.getElementById('addLocationForm').style.display = 'none';
}


function deleteLocation() {
    const code1 = document.getElementById('code_1_').value;
    document.getElementById("delbeachl").disabled = true;
    if (!confirm(`Είστε βέβαιοι ότι θέλετε να διαγράψετε την τοποθεσία της παραλίας με κωδικό ${code1}?`)) {
        return false; // Stop form submission if not confirmed
    }

    // Prepare AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "DeleteLocationServlet", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // Handle the server's response
    xhr.onload = function () {
        const responseDiv = document.getElementById('deleteResponse');
        if (xhr.status === 200) {
            responseDiv.textContent = xhr.responseText;
            responseDiv.style.color = "green";
            setTimeout(() => {
                responseDiv.textContent = ""; // Make the message empty
                document.getElementById("delbeachl").disabled = false;
                $('#deleteLocationForm')[0].reset();

            }, 5000); // 5000 milliseconds = 5 seconds
        } else {
            responseDiv.textContent = "Παρουσιάστηκε σφάλμα κατά τη διαγραφή της τοποθεσίας της παραλίας.";
            responseDiv.style.color = "red";
            setTimeout(() => {
                responseDiv.textContent = ""; // Make the message empty
                document.getElementById("delbeachl").disabled = false;
                $('#deleteLocationForm')[0].reset();
            }, 5000); // 5000 milliseconds = 5 seconds
        }
    };

    // Send request with the code_1 parameter
    xhr.send("code_1_=" + encodeURIComponent(code1));

    // Prevent the form from submitting the traditional way
    return false;
}

// Fetch and display the data from the database
function fetchData() {
    document.getElementById('dataDisplayTable').style.display = 'block';
    $.ajax({
        url: "GetSimeiaParakoloythisisDataServlet", // Your server endpoint to fetch data
        method: "GET",
        success: function (data) {
            renderTable(data);
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch data: ", error);
        }
    });
}

function renderTable(data) {
    let tableHtml = `<table border="1">
                        <tr>
                            <th>X</th><th>Y</th><th>Όνομα</th><th>Ακτή</th><th>Ανατολή</th><th>FID</th>
                            <th>Πεδίο_1</th><th>Γεωγραφικό πλάτος</th><th>Γεωγραφικό μήκος:</th><th>Βορράς</th><th>Δήμος</th><th>Δημοτική Ενότητα</th>
                            <th>Κωδικός_1</th><th>Κωδικός</th><th>Περιγραφή</th><th>Περιφέρεια</th><th>Επεξεργασία</th>
                        </tr>`;

    data.forEach((row, index) => {
        tableHtml += `<tr data-id="${row.FID}">
                        <td>${row.X}</td>
                        <td>${row.Y}</td>
                        <td>${row.Name}</td>
                        <td>${row.acth}</td>
                        <td>${row.Easting_}</td>
                        <td>${row.FID}</td>
                        <td>${row.Field_1}</td>
                        <td>${row.Lat}</td>
                        <td>${row.Lon}</td>
                        <td>${row.Northing}</td>
                        <td>${row.dhmos}</td>
                        <td>${row.dhmot}</td>
                        <td>${row.code_1}</td>
                        <td>${row.code}</td>
                        <td>${row.description}</td>
                        <td>${row.perifereia}</td>
                        <td>
                            <button onclick="updateRow(${index})">Ενημέρωση</button>
                            <button style="display:none;" onclick="saveChanges(${row.FID}, ${index})">Αποθήκευση</button>
                        </td>
                    </tr>`;
    });
    tableHtml += `</table>`;
    document.getElementById("dataDisplayTable").innerHTML = tableHtml;
}

function updateRow(rowIndex) {
    const row = document.querySelector(`#dataDisplayTable table tr:nth-child(${rowIndex + 2})`); // Row selector (1st row is header)

    row.querySelectorAll("td").forEach((cell, index) => {
        // Skip the last column (Actions) and non-editable columns
        if (index !== row.children.length - 1) {
            cell.setAttribute("contenteditable", "true");
            cell.style.backgroundColor = "#FFFFCC"; // Highlight the cell
        }
    });

    // Show the "Save Changes" button and optionally hide "Update" button
    row.querySelector("button[onclick^='saveChanges']").style.display = "inline";
    row.querySelector("button[onclick^='updateRow']").style.display = "none";

    row.querySelector("button[onclick^='saveChanges']").style.display = "inline"; // Show Save Changes button
}

function saveChanges(FID, rowIndex) {
    const row = document.querySelector(`#dataDisplayTable table tr:nth-child(${rowIndex + 2})`);
    const updatedData = {
        FID: FID,
        X: row.cells[0].innerText,
        Y: row.cells[1].innerText,
        Name: row.cells[2].innerText,
        acth: row.cells[3].innerText,
        Easting_: row.cells[4].innerText,
        Field_1: row.cells[6].innerText,
        Lat: row.cells[7].innerText,
        Lon: row.cells[8].innerText,
        Northing: row.cells[9].innerText,
        dhmos: row.cells[10].innerText,
        dhmot: row.cells[11].innerText,
        code_1: row.cells[12].innerText,
        code: row.cells[13].innerText,
        description: row.cells[14].innerText,
        perifereia: row.cells[15].innerText
    };
    console.log(updatedData);
    $.ajax({
        url: "UpdateSimeiaParakoloythisisServlet", // Your server endpoint to update data
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(updatedData),
        success: function (response) {

            fetchData(); // Refresh data to see updated values
        },
        error: function (xhr, status, error) {

            console.error("Failed to update data: ", error);
        }
    });
}




function showSection(sectionId) {
    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    // Show the selected section
    document.getElementById(sectionId).style.display = 'block';
    $('#beachDataDisplay').empty();
    $('#dataDisplayTable').empty();
    document.getElementById('beachDataDisplay').style.display = 'none';
    document.getElementById('dataDisplayTable').style.display = 'none';
    $('#uploadLocationForm')[0].reset();
    $('#deleteLocationForm')[0].reset();


    closeAddForm();
    $('#dataForm-2-beach')[0].reset();
    $('#dataForm-3')[0].reset();
    $('#dataForm-2')[0].reset();
    $('#dataForm-4')[0].reset();
    $('#dataForm-5')[0].reset();
    $('#dataForm')[0].reset();
    $('#uploadForm')[0].reset();
    $('#apolyshform')[0].reset();

    document.getElementById("delete-page").style.display = 'none';
    document.getElementById("user1").style.display = 'none';
    document.getElementById("butdel").style.display = 'none';
}



$(document).ready(function () {

    $('#dataForm-4').on('submit', function (event) {
        event.preventDefault();  // Prevent default form submission
        // Get form data
        var formData = $(this).serialize();
        document.getElementById("bform").disabled = true;
        // Send form data to backend (servlet)
        $.ajax({
            url: 'addLocationServlet', // Adjust this URL to match your servlet
            type: 'POST',
            data: formData,
            success: function (response) {
                $('#addResponse').html('<p>Τα δεδομένα εισήχθησαν με επιτυχία!</p>');
                const responseDiv = document.getElementById('addResponse');
                responseDiv.style.color = "green";
                setTimeout(function () {
                    $('#addResponse').html(''); // Clear the content
                    document.getElementById("bform").disabled = false;
                    $('#dataForm-4')[0].reset();
                }, 5000);
            },
            error: function (xhr, status, error) {
                const responseDiv = document.getElementById('addResponse');
                responseDiv.style.color = "red";
                $('#addResponse').html('<p>Error: ' + error + '</p>');
                setTimeout(function () {
                    $('#addResponse').html(''); // Clear the content
                }, 5000);
            }
        });
    });

    $('#dataForm-5').on('submit', function (event) {
        event.preventDefault();  // Prevent default form submission
        // Get form data
        let confirmDelete = confirm("Είστε βέβαιοι ότι θέλετε να καταργήσετε τον πίνακα?");
        document.getElementById("butdata-5").disabled = true;
        if (confirmDelete) {
            // Send form data to backend (servlet)
            $.ajax({
                url: 'RemoveLocationTable', // Adjust this URL to match your servlet
                type: 'GET',
                success: function (response) {
                    const responseDiv = document.getElementById('mes5');
                    responseDiv.style.color = "green";
                    $('#mes5').html('<p>Ο πίνακας διαγράφθηκε</p>');
                    setTimeout(function () {
                        $('#mes5').html(''); // Clear the content
                        document.getElementById("butdata-5").disabled = false;
                    }, 5000);
                },
                error: function (xhr, status, error) {
                    const responseDiv = document.getElementById('mes5');
                    responseDiv.style.color = "red";
                    $('#mes5').html('<p>Error: ' + error + '</p>');
                    setTimeout(function () {
                        $('#mes5').html(''); // Clear the content
                    }, 5000);
                }
            });
        } else {
            $('#mes5').html('<p>Η διαγραφή πίνακα ακυρώθηκε.</p>');
            setTimeout(function () {
                $('#mes5').html(''); // Clear the content
                document.getElementById("butdata-5").disabled = false;
            }, 5000);
        }
    });


    $('#dataForm-3').on('submit', function (event) {
        event.preventDefault();  // Prevent default form submission
        document.getElementById("bb2").disabled = true;
        // Get form data
        var formData = $(this).serialize();

        // Send form data to backend (servlet)
        $.ajax({
            url: 'InsertDataServlet', // Adjust this URL to match your servlet
            type: 'POST',
            data: formData,
            success: function (response) {
                $('#addInsertResponse').html('<p>Τα δεδομένα εισήχθησαν με επιτυχία!</p>');
                const responseDiv = document.getElementById('addInsertResponse');
                responseDiv.style.color = "green";
                setTimeout(function () {
                    $('#addInsertResponse').html(''); // Clear the content
                    document.getElementById("bb2").disabled = false;
                    $('#dataForm-3')[0].reset();
                }, 5000);
            },
            error: function (xhr, status, error) {
                $('#addInsertResponse').html('<p>Error: ' + error + '</p>');
                const responseDiv = document.getElementById('addInsertResponse');
                responseDiv.style.color = "red";
                setTimeout(function () {
                    $('#addInsertResponse').html(''); // Clear the content
                    document.getElementById("bb2").disabled = false;
                }, 5000);
            }
        });
    });



    $('#dataForm-2').on('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        // Get selected values
        const selectedMonth = $('#month-select-2').val();
        const selectedYear = $('#year-select-2').val();
        document.getElementById("butdata-2").disabled = true;
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
                    document.getElementById("tablermmes").style.color = "green";
                    $('#tablermmes').html("Ο πίνακας " + selectedMonth + selectedYear + " διαγράφθηκε με επιτυχία"); // Insert the table into the display area
                    setTimeout(function () {
                        $('#tablermmes').html(''); // Clear the content
                        document.getElementById("butdata-2").disabled = false;

                    }, 5000);
                } else {
                    $('#tablermmes').html('<p>Δεν υπάρχουν διαθέσιμα δεδομένα για τον επιλεγμένο μήνα και έτος.</p>');
                    setTimeout(function () {
                        $('#tablermmes').html(''); // Clear the content
                        document.getElementById("butdata-2").disabled = false;
                    }, 5000);
                }
            },
            error: function (xhr, status, error) {
                // Handle errors
                console.error('AJAX Error:', status, error);
                document.getElementById("tablermmes").style.color = "red";
                $('#tablermmes').html('<p>Παρουσιάστηκε σφάλμα κατά την ανάκτηση δεδομένων. Δοκιμάστε ξανά αργότερα.</p>');
                setTimeout(function () {
                    $('#tablermmes').html(''); // Clear the content

                    document.getElementById("butdata-2").disabled = false;
                }, 5000);
            }
        });
    });





    $('#dataForm-2-beach').on('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        // Get selected values
        const selectedMonth = $('#month-select-2-beach').val();
        const selectedYear = $('#year-select-2-beach').val();
        const beach = $('#code2').val();
        document.getElementById("butdata-2-beach").disabled = true;
        console.log(beach);
        // Make AJAX request
        $.ajax({
            url: 'RemoveBeach',
            method: 'GET',
            data: {
                'month-select-2-beach': selectedMonth,
                'year-select-2-beach': selectedYear,
                'code2': beach
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
                    document.getElementById('tablermmesbeach').style.color = "green";
                    $('#tablermmesbeach').html("Η παραλία" + beach + " αφαιρέθηκε από τον πίνακα " + selectedMonth + selectedYear); // Insert the table into the display area
                    setTimeout(function () {
                        $('#tablermmesbeach').html(''); // Clear the content
                        document.getElementById("butdata-2-beach").disabled = false;
                    }, 5000);
                } else {
                    document.getElementById('tablermmesbeach').style.color = "red";
                    $('#tablermmesbeach').html('<p>No data available for the selected month and year.</p>');
                    setTimeout(function () {
                        document.getElementById("butdata-2-beach").disabled = false;
                        $('#tablermmesbeach').html(''); // Clear the content
                    }, 5000);
                }
            },
            error: function (xhr, status, error) {
                // Handle errors
                document.getElementById("tablermmesbeach").style.color = "red";
                $('#tablermmesbeach').html('<p>Παρουσιάστηκε σφάλμα κατά την ανάκτηση δεδομένων. Δοκιμάστε ξανά αργότερα.</p>');
                setTimeout(function () {
                    $('#tablermmesbeach').html(''); // Clear the content

                    document.getElementById("butdata-2-beach").disabled = false;
                }, 5000);

            }
        });
    });

    let pp;
    let ll;
    $('#dataForm').on('submit', function (event) {

        document.getElementById('beachDataDisplay').style.display = 'block';
        console.log("Submit button clicked");
        event.preventDefault(); // Prevent the default form submission

        const selectedMonth = $('#month-select').val();
        pp = selectedMonth;
        const selectedYear = $('#year-select').val();
        ll = selectedYear;
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
                    table += '<th>Περιφερειακή Ενότητα</th>';
                    table += '<th>Δήμος</th>';
                    table += '<th>Ακτή</th>';
                    table += '<th>Κωδικός Σταθμού</th>';
                    table += '<th>Περιγραφή</th>';
                    table += '<th>Ημ/νία δειγμ/ας ΗΗ/ΜΜ/ΕΕΕΕ</th>';
                    table += '<th>Ώρα δειγμ/ας ΩΩ:ΛΛ (24ωρη)</th>';
                    table += '<th>Ημ/νία παράδοσης στο εργ/ριο</th>';
                    table += '<th>Ημ/νία ανάλυσης</th>';
                    table += '<th>Intestinal enterococci (cfu/100ml)</th>';
                    table += '<th>Escherichia coli (cfu/100ml)</th>';
                    table += '<th>ΚΑΤΑΛΟΙΠΑ ΠΙΣΣΑΣ</th>';
                    table += '<th>ΓΥΑΛΙΑ</th>';
                    table += '<th>ΠΛΑΣΤΙΚΑ</th>';
                    table += '<th>ΚΑΟΥΤΣΟΥΚ</th>';
                    table += '<th>ΑΠΟΡΡΙΜΜΑΤΑ ΑΛΛΑ</th>';
                    table += '<th>Κατάσταση Υδάτινης Επιφάνειας</th>';
                    table += '<th>Διεύθυνση Ανέμου</th>';
                    table += '<th>Βροχόπτωση της ημέρας δειγματοληψίας</th>';
                    table += '<th>Βροχόπτωση την προηγούμενη μέρα δειγματοληψίας</th>';
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
                                      <td><button class="updateButton">Ενημέρωση</button></td>
                                  </tr>`;
                    });
                    // Set the name attribute to "giannis"
                    $('#nameoftable').attr('name', selectedMonth + selectedYear);

                    // Set inner HTML content
                    $('#nameoftable').html(selectedMonth + selectedYear);
                    table += '</tbody></table>';
                    $('#beachDataDisplay').html(table); // Insert the table into the display area
                } else {
                    $('#beachDataDisplay').html('<p>Δεν υπάρχουν διαθέσιμα δεδομένα για τον επιλεγμένο μήνα και έτος.</p>');
                }
            },
            error: function (xhr, status, error) {
                // Handle errors
                console.error('AJAX Error:', status, error);
                $('#beachDataDisplay').html('<p>Παρουσιάστηκε σφάλμα κατά την ανάκτηση δεδομένων. Δοκιμάστε ξανά αργότερα.</p>');
            }
        });
    });

    $('#saveButton').on('click', function () {
        document.getElementById('beachDataDisplay').style.display = 'block';
        const selectedMonth = pp;
        const selectedYear = ll;
        const tableName = document.getElementById("nameoftable").getAttribute("name");
        console.log(tableName);
        const updatedData = saveAllUpdates(); // Get the updated data from the function
        console.log(updatedData);
        // Check if there's any updated data
        if (updatedData.length === 0) {
            console.log('No data to update.');
            return;
        }

        document.getElementById('responseMessage2').style.display = "block";
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
                $('#dataForm').trigger('submit');
                document.getElementById('saveButton').style.display = "none";
                document.getElementById('responseMessage2').style.color = "green";
                document.getElementById('responseMessage2').innerHTML = "Τα δεδομένα αποθηκεύτηκαν με επιτυχία";
                setTimeout(function () {
                    $('#tablermmesbeach').html(''); // Clear the content

                    document.getElementById('responseMessage2').innerHTML = "";
                    document.getElementById('responseMessage2').style.display = "none";
                }, 5000);

            },
            error: function (xhr, status, error) {
                // Handle error (show an error message to the user)
                console.error('Update Error:', status, error);
                console.log('Response:', xhr.responseText); // Log server response for debugging
                console.log('An error occurred while saving updates. Please try again.');
                document.getElementById('saveButton').style.display = "none";
                document.getElementById('responseMessage2').style.color = "red";
                document.getElementById('responseMessage2').innerHTML = "Τα δεδομένα δεν αποθηκεύτηκαν με επιτυχία";
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
            alert('Το αίτημα απέτυχε. Επιστράφηκε η κατάσταση του ' + xhr.status);
        }
    };
    xhr.open('POST', 'servlet_Logout');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
}
document.getElementById('uploadLocationForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const fileInput = document.getElementById('fileInput2');
    const file = fileInput.files[0];

    // Check if a file is selected
    if (!file) {
        alert('Επιλέξτε ένα αρχείο για μεταφόρτωση.');
        return;
    }

    // Create a FormData object to hold the file
    const formData = new FormData();
    formData.append('file', file);

    // Create an XMLHttpRequest to send the file
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'uploadLocationServlet', true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            alert('Το αρχείο μεταφορτώθηκε με επιτυχία!');
            // Optionally, refresh the page or redirect
            // location.reload();
        } else {
            alert('Η μεταφόρτωση του αρχείου απέτυχε. Δοκιμάστε ξανά.');
        }
    };

    xhr.onerror = function () {
        alert('Παρουσιάστηκε σφάλμα κατά τη μεταφόρτωση του αρχείου.');
    };

    // Send the file data
    xhr.send(formData);
});

document.getElementById('uploadForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    // Check if a file is selected
    if (!file) {
        alert('Επιλέξτε ένα αρχείο για μεταφόρτωση.');
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
            alert('Το αρχείο μεταφορτώθηκε με επιτυχία!');
            // Optionally, refresh the page or redirect
            // location.reload();
        } else {
            alert('Η μεταφόρτωση του αρχείου απέτυχε. Δοκιμάστε ξανά.');
        }
    };

    xhr.onerror = function () {
        alert('Παρουσιάστηκε σφάλμα κατά τη μεταφόρτωση του αρχείου.');
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


    document.getElementById('delemp').disabled = true;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'diagrafh_user', true);  // POST to your server endpoint
    xhr.setRequestHeader("Content-type", "application/json");

    // Wrap the userId in a JSON object
    var jsonData = JSON.stringify({"user_id": userId});
    console.log("Sending JSON: ", jsonData);  // For debugging purposes

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // You can update the UI here to show that the user was deleted.
            document.getElementById('responseMessage').style.color = "green";
            document.getElementById('responseMessage').innerText = "Ο χρήστης διαγράφηκε με επιτυχία.";
            setTimeout(function () {
                document.getElementById('responseMessage').innerText = ""; // Clear the content

                document.getElementById('delemp').disabled = false;
            }, 5000);
        } else {
            console.error("Failed to delete user. Status: " + xhr.status);
            document.getElementById('responseMessage').style.color = "red";
            document.getElementById('responseMessage').innerText = "Αποτυχία διαγραφής χρήστη.";
            setTimeout(function () {
                document.getElementById('responseMessage').innerText = ""; // Clear the content

                document.getElementById('delemp').disabled = false;
            }, 5000);
        }
    };

    xhr.onerror = function () {
        console.error("Request failed.");
        document.getElementById('responseMessage').innerText = "Το αίτημα απέτυχε.";
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
            setTimeout(function () {
                $('#pinakas').empty(); // Clear all content inside the #pinakas element
            }, 5000);
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