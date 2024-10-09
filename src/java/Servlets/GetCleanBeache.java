package Servlets;

import java.time.LocalDate;
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

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        response.setContentType("application/json; charset=UTF-8"); // Set response encoding to UTF-8
        response.setCharacterEncoding("UTF-8");

        // Set the content type to application/json
        //  response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        JSONObject jsonResponse = new JSONObject();

        String latParam = request.getParameter("lat");
        String lonParam = request.getParameter("lon");
                String yearParam = request.getParameter("year");
        String monthParam = request.getParameter("month");
        
        double userLat = 0.0;
        double userLon = 0.0;
        // Parse latitude and longitude while handling commas
        try {
            // Replace commas with dots for correct parsing
            latParam = latParam.replace(",", ".");
            lonParam = lonParam.replace(",", ".");
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
               ArrayList<Beach> cleanBeaches;
            
            // If both year and month are provided, filter by them
            if (yearParam != null && monthParam != null) {
                cleanBeaches = getFilteredBeaches(userLat, userLon, yearParam, monthParam, response);
            } else {
                // Otherwise, use the default month based on the current date and user's location
                cleanBeaches = getCleanBeaches(userLat, userLon, response);
            }
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
    
    
        private ArrayList<Beach> getFilteredBeaches(double userLat, double userLon, String year, String month, HttpServletResponse response) throws SQLException, UnsupportedEncodingException, IOException {
        ArrayList<Beach> cleanBeaches = new ArrayList<>();
        String result = month; // This should be like "maios_", "ioynios_", etc.

        Connection conn = null;
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=UTF-8");

        try {
            conn = DB_Connection.getConnection();

            String sql = "SELECT sp.acth as name, sp.Y AS lat, sp.X AS lon, "
                    + "(m.Ecoli + m.Intenterococci) AS cleanlinessScore, "
                    + "(6371 * acos(cos(radians(?)) * cos(radians(sp.Y)) * cos(radians(sp.X) - radians(?)) "
                    + "+ sin(radians(?)) * sin(radians(sp.Y)))) AS distance "
                    + "FROM " + result + year + " m "  // Dynamically use year and month
                    + "JOIN simeia_parakoloythisis_2019 sp ON m.StationCode = sp.code_1 "
                    + "ORDER BY cleanlinessScore ASC, distance ASC "
                    + "LIMIT 10";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setDouble(1, userLat);
                stmt.setDouble(2, userLon);
                stmt.setDouble(3, userLat);
                ResultSet rs = stmt.executeQuery();
                while (rs.next()) {
                    String name = rs.getString("name");
                    double lat = rs.getDouble("lat");
                    double lon = rs.getDouble("lon");
                    double cleanlinessScore = rs.getDouble("cleanlinessScore");
                    double distance = rs.getDouble("distance");

                    cleanBeaches.add(new Beach(name, lat, lon, cleanlinessScore, distance));
                }
            }
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(GetCleanBeache.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            if (conn != null) {
                conn.close();
            }
        }
        return cleanBeaches;
    }
        
        

    public static String getMonthString(int month) {
        switch (month) {
            case 5:
                return "maios_";
            case 6:
                return "ioynios_";
            case 7:
                return "ioylios_";
            case 8:
                return "aygoystos";
            case 9:
                return "septemvrios_";
            case 10:
                return "oktovrios_";
            default:
                return "Invalid month";
        }
    }

    private ArrayList<Beach> getCleanBeaches(double userLat, double userLon, HttpServletResponse response) throws SQLException, UnsupportedEncodingException, IOException {
        ArrayList<Beach> cleanBeaches = new ArrayList<>();
        LocalDate currentDate = LocalDate.now();

        // Get the current month (1-12)
        int currentMonth = currentDate.getMonthValue();
        System.out.println("Current month: " + currentMonth);
        String result = getMonthString(currentMonth);
        System.out.println("Current month: " + result);
        Connection conn = null;
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=UTF-8");

        try {
            conn = DB_Connection.getConnection();

            String sql = "SELECT sp.acth as name, sp.Y AS lat, sp.X AS lon, "
                    + "(m.Ecoli + m.Intenterococci) AS cleanlinessScore, "
                    + "(6371 * acos(cos(radians(?)) * cos(radians(sp.Y)) * cos(radians(sp.X) - radians(?)) "
                    + "+ sin(radians(?)) * sin(radians(sp.Y)))) AS distance "
                    + "FROM " + result + "2023 m "
                    + "JOIN simeia_parakoloythisis_2019 sp ON m.StationCode = sp.code_1 "
                    + "ORDER BY cleanlinessScore ASC, distance ASC "
                    + "LIMIT 10";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setDouble(1, userLat);
                stmt.setDouble(2, userLon);
                stmt.setDouble(3, userLat);
                // Execute the query and process the result set
                ResultSet rs = stmt.executeQuery();
                if (!rs.next()) {
                    System.out.println("No beaches found.");
                    return cleanBeaches; // Return empty list if no results
                }
                while (rs.next()) {
                    double lat = rs.getDouble("lat");
                    double lon = rs.getDouble("lon");
                    double cleanlinessScore = rs.getDouble("cleanlinessScore");
                    double distance = rs.getDouble("distance");
                    String d = rs.getString("name");
                    cleanBeaches.add(new Beach(d, lat, lon, cleanlinessScore, distance));

                }
            }
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(GetCleanBeache.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            if (conn != null) {
                conn.close(); // Ensure connection is closed
            }
        }
        return cleanBeaches;
    }
}
