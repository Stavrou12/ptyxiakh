/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package Servlets;

import com.mysql.cj.jdbc.Blob;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Paths;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import database.DB_Connection;
import java.io.InputStream;
import java.io.OutputStream;

import java.sql.ResultSet;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpSession;

/**
 *
 * @author gnnss
 */

@MultipartConfig(
 fileSizeThreshold = 1024 * 1024 * 2, // 2MB threshold after which files are written to disk
    maxFileSize = 1024 * 1024 * 10,      // Max file size is 10MB
    maxRequestSize = 1024 * 1024 * 50    // Max request size is 50MB
) // This enables multipart/form-data handling
public class SubmitRev extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet SubmitRev</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet SubmitRev at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
    // Assume you have the review ID to fetch the media
    String reviewId = request.getParameter("review_id");

    try (Connection connection = DB_Connection.getConnection()) {
        String sql = "SELECT media FROM reviews WHERE review_id = ?";
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
        preparedStatement.setString(1, reviewId);

        ResultSet resultSet = preparedStatement.executeQuery();

        if (resultSet.next()) {
            Blob mediaBlob = (Blob) resultSet.getBlob("media");
            if (mediaBlob != null) {
                InputStream mediaStream = mediaBlob.getBinaryStream();

                // Set appropriate content type (image/video)
                response.setContentType("image/jpeg"); // Or "video/mp4" depending on the file type

                byte[] buffer = new byte[4096];
                int bytesRead = -1;
                OutputStream outStream = response.getOutputStream();

                while ((bytesRead = mediaStream.read(buffer)) != -1) {
                    outStream.write(buffer, 0, bytesRead);
                }

                mediaStream.close();
                outStream.close();
            } else {
                response.getWriter().write("No media found");
            }
        }
    } catch (SQLException e) {
        throw new ServletException("Database error while retrieving media", e);
    } catch (ClassNotFoundException ex) {
            Logger.getLogger(SubmitRev.class.getName()).log(Level.SEVERE, null, ex);
        }
}


    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
       // processRequest(request, response);
         response.setCharacterEncoding("UTF-8");
response.setContentType("application/json; charset=UTF-8");
request.setCharacterEncoding("UTF-8");
       String reviewText = request.getParameter("review_text");
       String stationCode = request.getParameter("stCode");
        System.out.println(stationCode);
         HttpSession session = request.getSession();
        String username = (String) session.getAttribute("username");
       
       
         String starRatingStr = request.getParameter("star_rating");
    int starRating = 0; // Default to 0 if no rating provided

    if (starRatingStr != null && !starRatingStr.isEmpty()) {
        try {
            starRating = Integer.parseInt(starRatingStr); // Convert to int
        } catch (NumberFormatException e) {
            response.getWriter().write("{\"error\": \"Invalid star rating\"}");
            return;
        }
    } else {
        response.getWriter().write("{\"error\": \"Star rating is required\"}");
        return;
    }

     Part filePart = request.getPart("media"); // Retrieves the media file
     InputStream mediaStream = null;

        // Check if media is uploaded
        if (filePart != null && filePart.getSize() > 0) {
            mediaStream = filePart.getInputStream(); // Get binary input stream for the file
        }

        
         try (Connection connection = DB_Connection.getConnection()) {
            String sql = "INSERT INTO reviews (username, review_text, StationCode, star_rating, media) VALUES (?, ?, ?, ?, ?)";
             PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, username);
            preparedStatement.setString(2, reviewText);
            preparedStatement.setString(3, stationCode);
            preparedStatement.setInt(4, starRating); // Insert star rating
       // preparedStatement.setString(5, mediaFilePath); // Insert file path or null
       
       if (mediaStream != null) {
                preparedStatement.setBlob(5, mediaStream); // Set the binary stream for the BLOB
            } else {
                preparedStatement.setNull(5, java.sql.Types.BLOB); // No file uploaded, set null
            }
            int rowsInserted = preparedStatement.executeUpdate();

            // Respond with success or failure
            if (rowsInserted > 0) {
                response.getWriter().write("Data inserted successfully!");
            } else {
                response.getWriter().write("Data insertion failed.");
            }
            
         }catch (SQLException e) {
            e.printStackTrace();
            // Handle SQL exceptions
            response.sendRedirect("error.jsp"); // Redirect to an error page
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(SubmitRev.class.getName()).log(Level.SEVERE, null, ex);
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

}
