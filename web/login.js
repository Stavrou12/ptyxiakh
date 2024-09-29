/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function on_load() {
    isLoggedIn();
}

function login_post(event) {
    event.preventDefault();
    
    // Get the values of the username and password fields
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Check if the username and password match admin credentials
    if (username === "admin" && password === "admin12!") {
        // Redirect to the admin_servlet
        var data = $("#myForm").serialize();
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function () {   
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                document.getElementById("msg-login").style.color = "rgb(0, 0, 153)";
                document.getElementById("msg-login").innerText = "Συνδεθήκατε ως Admin";
                console.log("Logged in as Admin");
                window.location.href = './admin.html';  // Redirect to admin page
            } else if (xhttp.status === 401) {
                document.getElementById("msg-login").style.color = "red";
                document.getElementById("msg-login").innerText = "Λάθος στοιχεία";
            }
        };
        xhttp.open("POST", "admin_servlet");  // Admin-specific servlet
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(data);

    } else {
        // Normal user login
        var data = $("#myForm").serialize();
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function () {   
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                document.getElementById("msg-login").style.color = "rgb(0, 0, 153)";
                document.getElementById("msg-login").innerText = "Συνδεθήκατε";
                console.log("Logged in successfully");
                window.location.href = './user.html';  // Redirect to user page
            } else if (xhttp.status === 401) {
                document.getElementById("msg-login").style.color = "red";
                document.getElementById("msg-login").innerText = "Λάθος στοιχεία";
            }
        };
        xhttp.open("POST", "servlet_login");  // Regular login servlet
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(data);
    }
}


function gotoform() {
    window.location.href = './register.html';
}
function isLoggedIn() {
    
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById("msg-login").style.color = "rgb(0, 0, 153)";
            document.getElementById("msg-login").innerText = "Ειστε συνδεδεμενος";
            window.location.href = './user.html';
            
        } else if (xhr.status !== 200) {
        }
    };
    xhr.open("GET", "Login");
    xhr.send();
}
function redirectToHome() {
    window.location.href = 'index.html';
}