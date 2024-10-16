/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package Servlets;

import com.google.gson.Gson;
import com.mysql.cj.jdbc.Blob;
import database.DB_Connection;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.annotation.WebServlet;

/**
 *
 * @author gnnss
 */
public class GetReviewsServlet extends HttpServlet {

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
            out.println("<title>Servlet GetReviewsServlet</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet GetReviewsServlet at " + request.getContextPath() + "</h1>");
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
        String stationCode = request.getParameter("StationCode");
        System.out.println("hello "+stationCode);
         PrintWriter out = response.getWriter();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (Connection connection = DB_Connection.getConnection()) {
            String sql = "SELECT username, review_text, star_rating, media FROM reviews WHERE StationCode = ?";
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, stationCode);
            ResultSet resultSet = statement.executeQuery();

            List<Review> reviews = new ArrayList<>();
            while (resultSet.next()) {
                Review review = new Review();
                review.setUsername(resultSet.getString("username"));
                
                review.setReviewText(resultSet.getString("review_text"));
                review.setStarRating(resultSet.getInt("star_rating"));
                
               Blob blob = (Blob) resultSet.getBlob("media");
            if (blob != null) {
                byte[] blobBytes = blob.getBytes(1, (int) blob.length());
                String base64Media = Base64.getEncoder().encodeToString(blobBytes);
                review.setMedia("data:image/jpeg;base64," + base64Media); // Assuming the image is JPEG
            } else {
                review.setMedia(null);
            }
                reviews.add(review);
            }

            // Convert reviews list to JSON and send it back to the client
            String json = new Gson().toJson(reviews);
            response.getWriter().write(json);
            

        } catch (SQLException e) {
            throw new ServletException("Database access error", e);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(GetReviewsServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    // Simple Review class
    public class Review {
        private String username;
        private String reviewText;
        private int starRating;
        private String media;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getReviewText() { return reviewText; }
        public void setReviewText(String reviewText) { this.reviewText = reviewText; }
        public int getStarRating() { return starRating; }
        public void setStarRating(int starRating) { this.starRating = starRating; }
        public String getMedia() {
        return media;
    }
    public void setMedia(String media) {
        this.media = media;
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
        processRequest(request, response);
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
