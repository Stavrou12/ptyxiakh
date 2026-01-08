# Beach-Discover

Beach-Discover is a web application designed to help users find the cleanest beaches in Crete based on official water quality data. The platform provides detailed information about beach cleanliness, allows for user reviews, and includes an administrative panel for data management. This project was developed as a university thesis.

## Project Overview

The application processes and displays data on coastal water quality from 2016 onwards, focusing on microbiological indicators like E. coli and Intestinal enterococci. Users can locate beaches, filter them based on various criteria, and view the results on an interactive map and in a sortable table. Administrators have a dedicated dashboard to manage all underlying data, including beach quality metrics, location information, and user accounts.

## Key Features

### For Users
- **Find Clean Beaches**: Locate the cleanest beaches based on your current location or by selecting a point on the map.
- **Interactive Map**: View beaches plotted on a Leaflet map with colored markers indicating water quality.
- **Detailed Filters**: Filter beaches by year, month, and environmental factors such as the presence of tar, glass, or plastic, as well as specific E. coli and enterococci levels.
- **Data Tables**: View detailed beach data in a sortable table, with options to sort by water quality score or distance.
- **Navigation**: Get driving directions to any beach using Google Maps integration.
- **Accommodation**: Find nearby places to stay via a link to Booking.com.
- **User Accounts**: Register, log in, and manage your account, including changing your password.
- **Reviews & Ratings**: Submit reviews with star ratings and media (images/videos) for beaches you've visited.
- **Community Feedback**: View reviews and average ratings submitted by other users.

### For Administrators
- **Admin Dashboard**: A secure panel for managing the application's data.
- **Data Upload**: Upload new water quality and beach location data from CSV files.
- **Data Management**:
    - View, edit, and update beach quality data for any given month and year.
    - Add, view, update, or delete beach location information.
    - Insert new beach data records manually.
- **Content Deletion**:
    - Delete entire data tables for a specific period (e.g., `maios_2024`).
    - Remove individual beach entries from a table.
    - Delete user accounts.

## Technology Stack

- **Backend**: Java Servlets
- **Frontend**: HTML5, CSS3, JavaScript, jQuery, Bootstrap
- **Database**: MySQL
- **Mapping**: Leaflet.js
- **Server**: Apache Tomcat
- **Java Libraries**:
    - **Gson**: For JSON parsing and serialization.
    - **OpenCSV**: For reading and processing CSV files.
    - **JavaMail API**: For handling email functionalities (e.g., contact form).
- **Development Environment**: NetBeans

## Setup and Installation

1.  **Prerequisites**:
    -   Java Development Kit (JDK) 15 or higher.
    -   Apache Tomcat Server.
    -   MySQL Database Server.

2.  **Database Setup**:
    -   Create a MySQL database named `PROJECT_BEACH`.
    -   Update the database credentials (username, password) in `src/java/database/DB_Connection.java`.
    -   The application will create the necessary tables, such as the `users` table, upon first run or through admin actions. Data tables (e.g., `maios_2024`) are created dynamically when CSV files are uploaded.

3.  **Dependencies**:
    -   Ensure all required JAR files (`gson`, `mysql-connector`, `opencsv`, `javax.mail`, etc.) are included in the project's classpath. The project is configured for NetBeans, which manages these dependencies via `nbproject/project.properties`.

4.  **Deployment**:
    -   Build the project into a `.war` file.
    -   Deploy the generated `PTYXIAKH.war` file to your Apache Tomcat server.

5.  **Accessing the Application**:
    -   The main page is available at `http://localhost:8080/PTYXIAKH/`.
    -   The user dashboard is at `user.html`.
    -   The admin panel is at `admin.html`. Default admin credentials are `admin` / `admin12!`.

https://drive.google.com/file/d/1eCZZ_JHSP21AbVV0XVBmUKNVgllRzNtn/view?usp=sharing
https://drive.google.com/file/d/1ir1UW5sAQpUXfbR7Y5PBno5ojExKcxxN/view?usp=drive_link
## File Structure

```
.
├── src/
│   ├── java/
│   │   ├── Servlets/      # Contains all backend servlet logic
│   │   ├── database/      # Database connection and table management classes
│   │   └── mainClasses/   # Core data models (User, Beach, etc.)
│   └── conf/
└── web/
    ├── *.html             # Frontend HTML files (index, user, admin, register)
    ├── *.js               # Frontend JavaScript for interactivity
    ├── *.css              # Stylesheets for the application
    ├── META-INF/
    └── WEB-INF/
        └── web.xml        # Servlet mappings and deployment configuration



