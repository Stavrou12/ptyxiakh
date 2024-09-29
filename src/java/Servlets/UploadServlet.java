package Servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import database.DB_Connection;


@WebServlet("/uploadServlet")
@MultipartConfig
public class UploadServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        Part filePart = request.getPart("file");  // Get the uploaded file
        if (filePart == null || filePart.getSize() == 0) {
            response.getWriter().write("No file uploaded.");
            return;
        }

        // Extract the file name and remove the extension to use as the table name
        String fileName = getFileName(filePart);
        String tableName = sanitizeFileName(fileName);

        // Process the file and insert data into the new table
        try (InputStream fileContent = filePart.getInputStream();
             BufferedReader reader = new BufferedReader(new InputStreamReader(fileContent))) {

            String line;
            boolean firstRow = true;  // Skip the first row (headers)

            // Establish database connection
            try (Connection conn = DB_Connection.getConnection()) {

                // Create the table using the file name as the table name
                createTableIfNotExists(conn, tableName);

                // Prepare the SQL insert statement
                String sql = "INSERT INTO " + tableName + " (Perunit, Municipal, Coast, StationCode, Description, "
                           + "SampleDate, SampleTime, DeliveryDate, AnalyseDate, Intenterococci, Ecoli, Tar, "
                           + "Glass, Plastic, Caoutchouc, Garbage, Wave, AirDirection, Rainfail, YesRainfail) "
                           + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                PreparedStatement ps = conn.prepareStatement(sql);

                // Read CSV line by line
                while ((line = reader.readLine()) != null) {
                    if (firstRow) {
                        firstRow = false;  // Skip headers
                        continue;
                    }

                    String[] values = line.split(",");  // Assuming CSV is comma-separated

                    if (values.length == 20) {  // Ensure correct number of columns
                        ps.setString(1, values[0]);  // Perunit
                        ps.setString(2, values[1]);  // Municipal
                        ps.setString(3, values[2]);  // Coast
                        ps.setString(4, values[3]);  // StationCode
                        ps.setString(5, values[4]);  // Description
                        ps.setString(6, values[5]);  // SampleDate
                        ps.setString(7, values[6]);  // SampleTime
                        ps.setString(8, values[7]);  // DeliveryDate
                        ps.setString(9, values[8]);  // AnalyseDate
                        ps.setString(10, values[9]);  // Intenterococci
                        ps.setString(11, values[10]);  // Ecoli
                        ps.setString(12, values[11]);  // Tar
                        ps.setString(13, values[12]);  // Glass
                        ps.setString(14, values[13]);  // Plastic
                        ps.setString(15, values[14]);  // Caoutchouc
                        ps.setString(16, values[15]);  // Garbage
                        ps.setString(17, values[16]);  // Wave
                        ps.setString(18, values[17]);  // AirDirection
                        ps.setString(19, values[18]);  // Rainfail
                        ps.setString(20, values[19]);  // YesRainfail

                        // Execute the insert statement
                        ps.executeUpdate();
                    }
                }

                response.getWriter().write("File uploaded and data inserted into table: " + tableName);
            } catch (SQLException e) {
                e.printStackTrace();
                response.getWriter().write("Error: " + e.getMessage());
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().write("Error: " + e.getMessage());
        }
    }

    /**
     * Helper method to extract the file name from the Part header
     */
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

    /**
     * Create the table if it doesn't already exist using the file name as the table name
     */
    private void createTableIfNotExists(Connection conn, String tableName) throws SQLException {
        String createTableSQL = "CREATE TABLE IF NOT EXISTS " + tableName + " ("
                + "Perunit VARCHAR(9),"
                + "Municipal VARCHAR(19),"
                + "Coast VARCHAR(49),"
                + "StationCode VARCHAR(16),"
                + "Description VARCHAR(59),"
                + "SampleDate VARCHAR(9),"
                + "SampleTime VARCHAR(11),"
                + "DeliveryDate VARCHAR(9),"
                + "AnalyseDate VARCHAR(9),"
                + "Intenterococci VARCHAR(2),"
                + "Ecoli VARCHAR(3),"
                + "Tar VARCHAR(3),"
                + "Glass VARCHAR(3),"
                + "Plastic VARCHAR(3),"
                + "Caoutchouc VARCHAR(3),"
                + "Garbage VARCHAR(3),"
                + "Wave VARCHAR(16),"
                + "AirDirection VARCHAR(2),"
                + "Rainfail VARCHAR(3),"
                + "YesRainfail VARCHAR(3)"
                + ")";
        
        try (Statement stmt = conn.createStatement()) {
            stmt.executeUpdate(createTableSQL);
        }
    }
}
