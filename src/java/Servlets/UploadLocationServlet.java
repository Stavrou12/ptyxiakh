/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package Servlets;

import database.DB_Connection;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.sql.Connection;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import com.opencsv.CSVReader;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author gnnss
 */
@WebServlet("/uploadLocationServlet")
@MultipartConfig
public class UploadLocationServlet extends HttpServlet {

    private String getSafeValue(String[] array, int index) {
        return index < array.length ? array[index] : null;
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Part filePart = request.getPart("file2");  // Get the uploaded file
        if (filePart == null || filePart.getSize() == 0) {
            response.getWriter().write("No file uploaded.");
            return;
        }
        String fileName = getFileName(filePart);
        String tableName = sanitizeFileName(fileName);
        System.out.println(fileName);
        try (InputStream fileContent = filePart.getInputStream(); BufferedReader reader = new BufferedReader(new InputStreamReader(fileContent, "UTF-8"))) {

            String line;
            boolean firstRow = true;  // Skip the first row (headers)

            // Establish database connection
            try (Connection conn = DB_Connection.getConnection()) {

                createTableIfNotExists(conn, tableName);
                String checkSql = "SELECT COUNT(*) FROM " + tableName;  // Adjust based on your schema
                try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {

                    try (ResultSet rs = checkStmt.executeQuery()) {
                        rs.next();
                        int count = rs.getInt(1);
                        // If the record exists, respond or handle accordingly
                        if (count > 0) {
                            response.setContentType("text/html");
                            response.getWriter().write("<html><body>");
                            response.getWriter().write("<h3>File already exists in the table: " + fileName + "</h3>");
                            response.getWriter().write("<p>Skipping data insertion.</p>");
                            response.getWriter().write("<p>You will be redirected to the admin page in 5 seconds...</p>");

                            // JavaScript for redirection after 5 seconds
                            response.getWriter().write("<script type='text/javascript'>");
                            response.getWriter().write("setTimeout(function() {");
                            response.getWriter().write("window.location.href = 'admin.html';"); // Change to your admin page URL
                            response.getWriter().write("}, 5000);"); // 5000 milliseconds = 5 seconds
                            response.getWriter().write("</script>");
                            response.getWriter().write("</body></html>");
                            return;  // Exit to avoid insertion
                        }
                    }
                }
                String sql = "INSERT INTO " + tableName + " (X, Y, Name, acth, "
                        + "Easting_, Field_1, Lat, Lon, Northing, dhmos, dhmot, "
                        + "code_1, code, description, perifereia) "
                        + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                try (PreparedStatement ps = conn.prepareStatement(sql)) {
                    while ((line = reader.readLine()) != null) {
                        if (firstRow) {
                            firstRow = false;  // Skip headers
                            continue;
                        }

                        // Manually parse the CSV line, handling commas
                        String[] values = parseCSVLine(line);
                        if (values.length != 15) { // Adjust based on your table columns
                            response.getWriter().write("Invalid data format.");
                            return;
                        }

                        // Set the prepared statement parameters
                        for (int i = 0; i < values.length; i++) {
                            ps.setString(i + 1, values[i]); // assuming values match your table schema
                        }
                        ps.executeUpdate();
                    }
                }

                response.setContentType("text/html");
                response.getWriter().write("<html><body>");
                response.getWriter().write("<h3>File was uploaded " + fileName + "</h3>");

                response.getWriter().write("<p>You will be redirected to the admin page in 5 seconds...</p>");

                // JavaScript for redirection after 5 seconds
                response.getWriter().write("<script type='text/javascript'>");
                response.getWriter().write("setTimeout(function() {");
                response.getWriter().write("window.location.href = 'admin.html';"); // Change to your admin page URL
                response.getWriter().write("}, 5000);"); // 5000 milliseconds = 5 seconds
                response.getWriter().write("</script>");
                response.getWriter().write("</body></html>");
                return;  // Exit to avoid insertion
            } catch (SQLException e) {
                e.printStackTrace();
                response.getWriter().write("Error: " + e.getMessage());
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().write("Error: " + e.getMessage());
        }
    }

    private String getFileName(Part part) {
        String contentDisposition = part.getHeader("content-disposition");
        for (String cd : contentDisposition.split(";")) {
            if (cd.trim().startsWith("filename")) {
                String fileName = cd.substring(cd.indexOf('=') + 1).trim().replace("\"", "");
                return fileName.substring(0, fileName.lastIndexOf('.'));  // Remove file extension
            }
        }
        return null;
    }

    /**
     * Helper method to sanitize file name for use as a table name in SQL
     */
    private String sanitizeFileName(String fileName) {
        // Replace invalid characters for SQL table names (only letters, digits, and underscores allowed)
        return fileName.replaceAll("[^a-zA-Z0-9_]", "_").toLowerCase();
    }

    private void createTableIfNotExists(Connection conn, String tableName) throws SQLException {
        String createTableSQL = "CREATE TABLE IF NOT EXISTS " + tableName + " ("
                + "X VARCHAR(100),"
                + "Y VARCHAR(100),"
                + "Name VARCHAR(100),"
                + "acth VARCHAR(100),"
                + "Easting_ VARCHAR(100),"
                + "Field_1 VARCHAR(100),"
                + "Lat VARCHAR(100),"
                + "Lon VARCHAR(100),"
                + "Northing VARCHAR(100),"
                + "dhmos VARCHAR(100),"
                + "dhmot VARCHAR(100),"
                + "code_1 VARCHAR(100),"
                + "code VARCHAR(100),"
                + "description VARCHAR(58),"
                + "perifereia VARCHAR(100)"
                + ")";
        try (Statement stmt = conn.createStatement()) {
            stmt.executeUpdate(createTableSQL);
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

    private String[] parseCSVLine(String line) {
        // This method splits the CSV line, handling quoted fields
        StringBuilder currentField = new StringBuilder();
        boolean inQuotes = false;
        List<String> fields = new ArrayList<>();

        for (char c : line.toCharArray()) {
            if (c == '"') {
                inQuotes = !inQuotes; // toggle the state of inQuotes
            } else if (c == ',' && !inQuotes) {
                fields.add(currentField.toString().trim());
                currentField.setLength(0); // reset for the next field
            } else {
                currentField.append(c);
            }
        }
        fields.add(currentField.toString().trim()); // add the last field

        return fields.toArray(new String[0]); // return as an array
    }
}
