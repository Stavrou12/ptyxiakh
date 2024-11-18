/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


document.addEventListener('DOMContentLoaded', function() {
    // Your existing functions...

    function validatePasswordMatch() {
        const password1 = document.getElementById('p1').value;
        const password2 = document.getElementById('p2').value;
        const message = document.getElementById('message');
        const submitButton = document.querySelector('button[type="submit"]');

        if (password1 !== password2) {
            message.innerText = "Passwords do not match.";
            message.style.color = "red";
            submitButton.disabled = true;
        } else {
            message.innerText = ""; // Clear the message
            submitButton.disabled = false; // Enable the button if passwords match
        }
    }

    // Add event listeners to check for password match on input change
    document.getElementById('p2').addEventListener('change', validatePasswordMatch);

});




function toggle(){
const passwordInput = document.getElementById('p1');
    const toggleIcon = document.getElementById('togglepas');

    if (passwordInput.type === "password") {
        passwordInput.type = "text";  // Show password
       // toggleIcon.classList.remove('fa-eye');  // Change icon to eye-slash
       // toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = "password";  // Hide password
        //toggleIcon.classList.remove('fa-eye-slash');  // Change icon to eye
       // toggleIcon.classList.add('fa-eye');
    }
    
}

function toggle2(){
const passwordInput = document.getElementById('p2');
    const toggleIcon = document.getElementById('togglepas2');

    if (passwordInput.type === "password") {
        passwordInput.type = "text";  // Show password
       // toggleIcon.classList.remove('fa-eye');  // Change icon to eye-slash
        //toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = "password";  // Hide password
        //toggleIcon.classList.remove('fa-eye-slash');  // Change icon to eye
        //toggleIcon.classList.add('fa-eye');
    }
    
}

// The checkPasswordStrength function remains the same


function checkPasswordStrength() {
    const password = document.getElementById('p1').value;
    const strengthMessage = document.getElementById('strengthMessage');
    let strength = "Medium"; // Default strength
    const numbers = password.match(/\d/g) || [];
    const symbols = password.match(/[@$!%*#?&]/g) || [];
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);

    // Check for weak password
    if (numbers.length / password.length >= 0.5) {
        strength = "Weak";
    }
    
    // Check for strong password
    if (hasUpperCase && hasLowerCase && symbols.length >= 2) {
        strength = "Strong";
    }

    // Update strength message and color
    switch (strength) {
        case "Strong":
            strengthMessage.innerText = "Password Strength: Strong";
            strengthMessage.style.color = "green";  // Green for strong
            break;
        case "Weak":
            strengthMessage.innerText = "Password Strength: Weak";
            strengthMessage.style.color = "red";    // Red for weak
            break;
        default:
            strengthMessage.innerText = "Password Strength: Medium";
            strengthMessage.style.color = "orange"; // Orange for medium
    }
    
    // Disable or enable the submit button based on strength
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = (strength === "Weak");
}

// Check password strength on input change
document.getElementById('p1').addEventListener('input', checkPasswordStrength);




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

function RegisterPOST() {
    event.preventDefault();
    let myForm = document.getElementById('reg');
    let formData = new FormData(myForm);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    var jsonData = JSON.stringify(data);
    var xhr = new XMLHttpRequest();

     //   if (usernameflag === 0 || emailflag === 0) {
       //     $('#ajaxContent').html("REQUEST FAILED.");
        //    document.getElementById("ajaxContent").style.color = "red";
         //   return 0;
       // }

    usernameflag = 0;
    emailflag = 0;
    const strengthMessage = document.getElementById('strengthMessage');
    strengthMessage.innerText="";
    xhr.onload = function () {
        console.log(xhr.readyState);
        console.log(xhr.status);
        console.log(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.readyState);
            console.log(xhr.status);
            var responseData = JSON.parse(jsonData);
            $('#ajaxContent').html("Successful User Registration.");
            // $('#ajaxContent').html("Successful Registration.");
            $('#reg')[0].reset();
            $('#ajaxContent').append(createTableFromJSON(responseData));
            document.getElementById("ajaxContent").style.color = "green";
            
            setTimeout(function() {
    $('#ajaxContent').html(""); // Clear the content
}, 3000); // 3000 milliseconds = 3 seconds


        } else if (xhr.status !== 200) {
            document.getElementById("ajaxContent").style.color = "red";
            document.getElementById('ajaxContent').innerHTML =
                    'Request failed. Returned status of ' + xhr.status + "<br>";
        }
    };
        xhr.open('POST', 'GetUser');
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(jsonData);
         //xhr.send(JSON.stringify(data));
        //console.log(jsonData);
}



function isChecked() {
    if (document.getElementById("check").checked) {
        return true;
    } else {
        alert("Παρακαλώ πατήστε:Συμφωνία με όρους χρήσης");
        return false;
    }
}


var usernameflag = 0;

function USERNAME() {
    var mydata = $("#reg").serialize();
    if (mydata["username"] === "") {
        return 0;
    }

    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            usernameflag = 1;


            document.getElementById('requsername').innerText = "";
             document.querySelector('button[type="submit"]').disabled = false;

        } else if (xhr.status === 403) {
            usernameflag = 0;
            document.getElementById("requsername").style.color = "red";
            document.getElementById('requsername').innerText =
                    'Αυτό το username υπάρχει ήδη,παρακαλώ επιλέξετε ένα άλλο';
             document.querySelector('button[type="submit"]').disabled = true;
            console.log("mphke sthn else username");
        }
    };

    xhr.open('POST', 'ServletUsername');
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(mydata);
    // xhr.send(JSON.stringify(data));
    //console.log(jsonData);

}

var emailflag = 0;
function EMAIL() {
    console.log("mphke sthn func");
    var mydata = $("#reg").serialize();
    if (mydata["email"] === "") {
        console.log("mphke edw");
        return 0;
    }

    var xhr = new XMLHttpRequest();
    console.log("proxwrhse thn if return 0");
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            emailflag = 1;

            console.log("mphke sto email if");
            document.getElementById('reqemail').innerText = "";
             document.querySelector('button[type="submit"]').disabled = false; 
        } else if (xhr.status === 403) {
            console.log("mphke sto email else");
            emailflag = 0;
            document.getElementById("reqemail").style.color = "red";
            document.getElementById('reqemail').innerText =
                    'Αυτό το email υπάρχει ήδη,παρακαλώ επιλέξετε ένα άλλο';
             document.querySelector('button[type="submit"]').disabled = true;
        }
    };
    xhr.open('POST', 'ServletEmail');
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(mydata);

}


