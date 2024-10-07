
package Servlets;

import database.DB_Connection;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import mainClasses.Beach;
import org.json.JSONArray;
import org.json.JSONObject;

public class GetCleanBeache extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
           request.setCharacterEncoding("UTF-8"); // Set request encoding to UTF-8
    response.setContentType("application/json; charset=UTF-8"); // Set response encoding to UTF-8
     // Set the content type to application/json
      //  response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        JSONObject jsonResponse = new JSONObject();

String latParam = request.getParameter("lat");
    String lonParam = request.getParameter("lon");

    double userLat = 0.0;
    double userLon = 0.0;

    // Parse latitude and longitude while handling commas
    try {
        // Log the original parameters
        System.out.println("Received Latitude: " + latParam);
        System.out.println("Received Longitude: " + lonParam);

        // Replace commas with dots for correct parsing
        latParam = latParam.replace(",", ".");
        lonParam = lonParam.replace(",", ".");

        // Log the modified parameters
        System.out.println("Modified Latitude: " + latParam);
        System.out.println("Modified Longitude: " + lonParam);

        // Parse to double
        userLat = Double.parseDouble(latParam);
        userLon = Double.parseDouble(lonParam);
        } catch (NumberFormatException e) {
            // Log and handle the error if the format is invalid
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid latitude or longitude format");
            return;
        }

        // Fetch clean beaches from the database based on proximity and cleanliness
        try {
            ArrayList<Beach> cleanBeaches = getCleanBeaches(userLat, userLon);
           System.out.println("User Latitude: " + userLat);
System.out.println("User Longitude: " + userLon);
            // Check if any beaches were found
            if (cleanBeaches.isEmpty()) {
                jsonResponse.put("message", "No clean beaches found near your location.");
            } else {
                // Add beaches to JSON response
                jsonResponse.put("beaches", new JSONArray(cleanBeaches));
            }

            out.print(jsonResponse.toString());
        } catch (Exception e) {
            // Handle exceptions and send an error message
            jsonResponse.put("error", "An error occurred: " + e.getMessage());
            out.print(jsonResponse.toString());
            e.printStackTrace();
        } finally {
            out.flush();
        }
    }

    private ArrayList<Beach> getCleanBeaches(double userLat, double userLon) throws SQLException {
    ArrayList<Beach> cleanBeaches = new ArrayList<>();
    String sql = "SELECT sp.Y AS lat, sp.X AS lon, "
               + "(m.Ecoli + m.Intenterococci) AS cleanlinessScore, "
               + "(6371 * acos(cos(radians(?)) * cos(radians(sp.Y)) * cos(radians(sp.X) - radians(?)) "
               + "+ sin(radians(?)) * sin(radians(sp.Y)))) AS distance "
               + "FROM maios_2016 m "
               + "JOIN simeia_parakoloythisis_2019 sp ON m.StationCode = sp.code_1 "
               + "WHERE m.Ecoli >2 AND m.Intenterococci >2 "
               + "ORDER BY cleanlinessScore ASC, distance ASC "
               + "LIMIT 20";

    try (Connection conn = DB_Connection.getConnection(); 
         PreparedStatement stmt = conn.prepareStatement(sql)) {

        // Print user latitude and longitude
        System.out.println("User Latitude: " + userLat);
        System.out.println("User Longitude: " + userLon);

        // Set the parameters for the prepared statement
        stmt.setDouble(1, userLat);
        stmt.setDouble(2, userLon);
        stmt.setDouble(3, userLat);

        // Execute the query and process the result set
        ResultSet rs = stmt.executeQuery();
        if (!rs.next()) {
            System.out.println("No beaches found.");
            return cleanBeaches; // Return empty list if no results
        }
        do {
            double lat = rs.getDouble("lat");
            double lon = rs.getDouble("lon");
            double cleanlinessScore = rs.getDouble("cleanlinessScore");
            double distance = rs.getDouble("distance");
            System.out.printf(" Latitude: %.6f, Longitude: %.6f, Cleanliness: %.2f, Distance: %.2f km%n", 
                 lat, lon, cleanlinessScore, distance);
            cleanBeaches.add(new Beach(lat, lon, cleanlinessScore, distance));
           // System.out.println("Beach found: " + description + ", Distance: " + distance);
        } while (rs.next());
    } catch (SQLException e) {
        e.printStackTrace();
        throw e; // Rethrow the exception for further handling
    }   catch (ClassNotFoundException ex) {
            Logger.getLogger(GetCleanBeache.class.getName()).log(Level.SEVERE, null, ex);
        }
    return cleanBeaches;
}


    // Dummy method to illustrate database connection
  
}
