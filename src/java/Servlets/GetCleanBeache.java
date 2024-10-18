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
        PrintWriter out = response.getWriter();
        JSONObject jsonResponse = new JSONObject();
        // Retrieve latitude, longitude, year, month, and environmental filter parameters from request
        String latParam = request.getParameter("lat");
        String lonParam = request.getParameter("lon");
        String yearParam = request.getParameter("year");
        String monthParam = request.getParameter("month");
        String tarParam = request.getParameter("tar");
        String glassParam = request.getParameter("glass");
        String plasticParam = request.getParameter("plastic");
        String caoutchoucParam = request.getParameter("caoutchouc");
        String garbageParam = request.getParameter("garbage");
         String intenterococciParam = request.getParameter("intenterococci");
        String ecoliParam = request.getParameter("ecoli");
        
        String limitParam = request.getParameter("limit");
int limit = 25; // Default limit

// Convert limit parameter to an integer, if provided
if (limitParam != null && !limitParam.isEmpty()) {
    try {
        limit = Integer.parseInt(limitParam);
    } catch (NumberFormatException e) {
        System.out.println("Invalid limit value: " + limitParam);
    }
}
        int ecoli = 0;
    int intenterococci = 0;
        if (ecoliParam != null && !ecoliParam.isEmpty()) {
        try {
            ecoli = Integer.parseInt(ecoliParam);  // Converts string to integer
        } catch (NumberFormatException e) {
            System.out.println("Invalid Ecoli value: " + ecoliParam);
            // Handle the invalid case as per your logic, like assigning a default value
        }
    }

    // Convert Intenterococci to Integer (check if it's not null or empty before converting)
    if (intenterococciParam != null && !intenterococciParam.isEmpty()) {
        try {
            intenterococci = Integer.parseInt(intenterococciParam);  // Converts string to integer
        } catch (NumberFormatException e) {
            System.out.println("Invalid Intenterococci value: " + intenterococciParam);
            // Handle the invalid case as per your logic, like assigning a default value
        }
    }
        
        System.out.println("Received parameters:");
System.out.println("Lat: " + latParam);
System.out.println("Lon: " + lonParam);
System.out.println("Year: " + yearParam);
System.out.println("Month: " + monthParam);
System.out.println("Tar: " + tarParam);
System.out.println("Glass: " + glassParam);
System.out.println("Plastic: " + plasticParam);
System.out.println("Caoutchouc: " + caoutchoucParam);
System.out.println("Garbage: " + garbageParam);
System.out.println("inte: " + intenterococciParam);
System.out.println("ecoli: " + ecoliParam);
System.out.println("limit: " + limit);
   
        double userLat = 0.0;
        double userLon = 0.0;
        try {
            latParam = latParam.replace(",", ".");
            lonParam = lonParam.replace(",", ".");
            userLat = Double.parseDouble(latParam);
            userLon = Double.parseDouble(lonParam);
        } catch (NumberFormatException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid latitude or longitude format");
            return;
        }
        try {
            ArrayList<Beach> cleanBeaches;

            // If both year and month are provided, filter by them and the environmental factors
            if (yearParam != null && monthParam != null) {
                cleanBeaches = getFilteredBeaches(limit,ecoliParam,intenterococciParam,userLat, userLon, yearParam, monthParam, tarParam, glassParam, plasticParam, caoutchoucParam, garbageParam, response);
                
            } else {
                // Use the current month if no year and month are provided
                cleanBeaches = getCleanBeaches(limit,userLat, userLon, response);

            }
            // Check if any beaches were found
            if (cleanBeaches.isEmpty()) {
                jsonResponse.put("beaches", new JSONArray()); // Return an empty array for beaches
                jsonResponse.put("message", "No clean beaches found near your location.");
            } else {
                jsonResponse.put("beaches", new JSONArray(cleanBeaches)); // Return the found beaches
            }
            out.print(jsonResponse.toString());
        } catch (Exception e) {
            jsonResponse.put("error", "An error occurred: " + e.getMessage());
            out.print(jsonResponse.toString());
            e.printStackTrace();
        } finally {
            out.flush();
        }
    }
    // Method to filter beaches by year, month, and environmental factors
    private ArrayList<Beach> getFilteredBeaches(int limit,String ecoli,String inter,double userLat, double userLon, String year, String month, String tar, String glass, String plastic, String caoutchouc, String garbage, HttpServletResponse response) throws SQLException, UnsupportedEncodingException, IOException {
        ArrayList<Beach> cleanBeaches = new ArrayList<>();
        String result = month; // e.g., "maios_", "ioynios_", etc.
        System.out.println("month " +result);
        System.out.println(ecoli);
        System.out.println(inter);
        int ecoli2 = Integer.parseInt(ecoli);
        int inter2 = Integer.parseInt(inter);
        Connection conn = null;
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=UTF-8");
        try {
            conn = DB_Connection.getConnection();
            String sql = "SELECT sp.code_1 as st, "
                    + "CAST(m.Ecoli AS INTEGER) AS Ecoli," +
                    " CAST(m.Intenterococci AS INTEGER) AS Intenterococci,sp.acth as name, sp.Y AS lat, sp.X AS lon, "
                    + "(m.Ecoli + m.Intenterococci) AS cleanlinessScore, "
                    + "m.Tar, m.Glass, m.Plastic, m.Caoutchouc, m.Garbage, "
                    + "(6371 * acos(cos(radians(?)) * cos(radians(sp.Y)) * cos(radians(sp.X) - radians(?)) "
                    + "+ sin(radians(?)) * sin(radians(sp.Y)))) AS distance "
                    + "FROM " + result + year + " m "
                    + "JOIN simeia_parakoloythisis_2019 sp ON m.StationCode = sp.code_1 "
                    + "WHERE m.Tar = ? AND m.Glass = ? AND m.Plastic = ? AND m.Caoutchouc = ? AND m.Garbage = ? "
                    + "AND CAST(m.Ecoli AS INTEGER) >= ? "        // Add this line for Ecoli filter
                    + "AND CAST(m.Intenterococci AS INTEGER) >= ? " // Add this line for Intenterococci filter
                    + "ORDER BY cleanlinessScore ASC, distance ASC "
                    + "LIMIT ?";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setDouble(1, userLat);
                stmt.setDouble(2, userLon);
                stmt.setDouble(3, userLat);
                stmt.setString(4, tar);
                stmt.setString(5, glass);
                stmt.setString(6, plastic);
                stmt.setString(7, caoutchouc);
                stmt.setString(8, garbage);
                stmt.setInt(9, ecoli2);
                stmt.setInt(10,inter2);
                stmt.setInt(11, limit);
                ResultSet rs = stmt.executeQuery();
                while (rs.next()) {
                    String name = rs.getString("name");
                    double lat = rs.getDouble("lat");
                    double lon = rs.getDouble("lon");
                    double cleanlinessScore = rs.getDouble("cleanlinessScore");
                    double distance = rs.getDouble("distance"); // Fetch distance
                    // Add environmental factors to the beach
                    String tarVal = rs.getString("Tar");
                    String glassVal = rs.getString("Glass");
                    String plasticVal = rs.getString("Plastic");
                    String caoutchoucVal = rs.getString("Caoutchouc");
                    String garbageVal = rs.getString("Garbage");
                    String ecoliVal = rs.getString("Ecoli");
                    String inteVal = rs.getString("Intenterococci");
                    String stVal = rs.getString("st");
                    System.out.println(ecoliVal +" "+inteVal );
                   
                    cleanBeaches.add(new Beach(stVal,ecoliVal,inteVal,name, lat, lon, cleanlinessScore, distance, tarVal, glassVal, plasticVal, caoutchoucVal, garbageVal));
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

    // Method to get clean beaches based on current month and environmental factors
    private ArrayList<Beach> getCleanBeaches(int limit,double userLat, double userLon, HttpServletResponse response) throws SQLException, UnsupportedEncodingException, IOException {
        ArrayList<Beach> cleanBeaches = new ArrayList<>();
        LocalDate currentDate = LocalDate.now();
        int currentMonth = currentDate.getMonthValue();
  
        String result = getMonthString(currentMonth);
        System.out.println(result);
        Connection conn = null;
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=UTF-8");
        try {
            conn = DB_Connection.getConnection();
            String sql = "SELECT sp.code_1 as stationcode, m.Ecoli as Ecoli, m.Intenterococci as Intenterococci,sp.acth as name, sp.Y AS lat, sp.X AS lon, "
                    + "(m.Ecoli + m.Intenterococci) AS cleanlinessScore, "
                    + "m.Tar, m.Glass, m.Plastic, m.Caoutchouc, m.Garbage, "
                    + "(6371 * acos(cos(radians(?)) * cos(radians(sp.Y)) * cos(radians(sp.X) - radians(?)) "
                    + "+ sin(radians(?)) * sin(radians(sp.Y)))) AS distance "
                    + "FROM " + result + "2023 m "
                    + "JOIN simeia_parakoloythisis_2019 sp ON m.StationCode = sp.code_1 "
                    + "ORDER BY cleanlinessScore ASC, distance ASC "
                    + "LIMIT ?";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setDouble(1, userLat);
                stmt.setDouble(2, userLon);
                stmt.setDouble(3, userLat);
                stmt.setInt(4, limit);
                ResultSet rs = stmt.executeQuery();
                while (rs.next()) {
                     String stVal = rs.getString("stationcode");
    System.out.println("Station Code Retrieved: " + stVal); // Add this line
                    String name = rs.getString("name");
                    double lat = rs.getDouble("lat");
                    double lon = rs.getDouble("lon");
                    double cleanlinessScore = rs.getDouble("cleanlinessScore");
                    double distance = rs.getDouble("distance"); // Fetch distance
                    String tarVal = rs.getString("Tar");
                    String glassVal = rs.getString("Glass");
                    String plasticVal = rs.getString("Plastic");
                    String caoutchoucVal = rs.getString("Caoutchouc");
                    String garbageVal = rs.getString("Garbage");
                     String ecoliVal = rs.getString("Ecoli");
                    String inteVal = rs.getString("Intenterococci");
                    
                   
                    cleanBeaches.add(new Beach(stVal,ecoliVal ,inteVal,name, lat, lon, cleanlinessScore, distance, tarVal, glassVal, plasticVal, caoutchoucVal, garbageVal));
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

    // Helper method to get the corresponding month string based on integer month
    private String getMonthString(int month) {
        switch (month) {
            case 5:
                return "maios_";
            case 6:
                return "ioynios_";
            case 7:
                return "ioylios_";
            case 8:
                return "aygoystos_";
            case 9:
                return "septemvrios_";
            case 10:
                return "oktovrios_"; // default to August for fallback
           
    }
        return null;
}
    
}

