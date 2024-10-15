/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package Servlets;

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
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpSession;


@MultipartConfig
public class SubmitReviewServlet extends HttpServlet {


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // Retrieve form data
          response.setCharacterEncoding("UTF-8");
response.setContentType("application/json; charset=UTF-8");
request.setCharacterEncoding("UTF-8");
        String reviewText = request.getParameter("review_text");
        String stationCode = request.getParameter("stationCode");
        System.out.println(stationCode);
        // Retrieve star rating
        String starRatingString = request.getParameter("star_rating");
        int starRating = starRatingString != null ? Integer.parseInt(starRatingString) : 0;

        // Retrieve username from session
        HttpSession session = request.getSession();
        String username = (String) session.getAttribute("username");

        // Retrieve uploaded photo (optional)
        Part photoPart = request.getPart("review_photo");
        InputStream photoInputStream = null;
        if (photoPart != null && photoPart.getSize() > 0) {
            photoInputStream = photoPart.getInputStream();
        }

        // Database insertion
        try (Connection connection = DB_Connection.getConnection()) {
            String sql = "INSERT INTO reviews (username, review_text, StationCode, review_photo, star_rating) VALUES (?, ?, ?, ?, ?)";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, username);
            preparedStatement.setString(2, reviewText);
            preparedStatement.setString(3, stationCode);
            preparedStatement.setBlob(4, photoInputStream);
            preparedStatement.setInt(5, starRating);

            int rowsInserted = preparedStatement.executeUpdate();
            if (rowsInserted > 0) {
                // Redirect or show success message
                response.sendRedirect("success.jsp"); // Redirect to a success page
            } else {
                // Handle insertion failure
                response.sendRedirect("error.jsp"); // Redirect to an error page
            }
        } catch (SQLException e) {
            e.printStackTrace();
            // Handle SQL exceptions
            response.sendRedirect("error.jsp"); // Redirect to an error page
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(SubmitReviewServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
