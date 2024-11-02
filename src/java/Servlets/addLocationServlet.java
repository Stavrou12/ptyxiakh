/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package Servlets;

import database.DB_Connection;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
/**
 *
 * @author gnnss
 */
public class addLocationServlet extends HttpServlet {
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

 
        String x = request.getParameter("X");
        String y = request.getParameter("Y");
        String name = request.getParameter("Name");
        String acth = request.getParameter("acth");
        String easting = request.getParameter("Easting_");
        String field = request.getParameter("Field_1");
        String lat = request.getParameter("Lat");
        String lon = request.getParameter("Lon");
        String northing = request.getParameter("Northing");
        String dhmos = request.getParameter("dhmos");
         String dhmot = request.getParameter("dhmot");
        String code1 = request.getParameter("code_1");
        String code = request.getParameter("code");
        String description = request.getParameter("description");
        String perifereia = request.getParameter("perifereia");
     Connection conn = null;
        PreparedStatement stmt = null;
         try {
         
                conn = DB_Connection.getConnection();
                String sql = "INSERT INTO simeia_parakoloythisis_2020 (X, Y, Name, acth, Easting_,Field_1, Lat, Lon, Northing, dhmos,dhmot, code_1, code, description, perifereia) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
             try {
             stmt = conn.prepareStatement(sql);
             } catch (SQLException ex) {
                 Logger.getLogger(addLocationServlet.class.getName()).log(Level.SEVERE, null, ex);
             }
                
                // Set parameters and execute
                stmt.setString(1, x);
                stmt.setString(2, y);
                stmt.setString(3, name);
                stmt.setString(4, acth);
                stmt.setString(5, easting);
                stmt.setString(6, field);
                stmt.setString(7, lat);
                stmt.setString(8, lon);
                stmt.setString(9, northing);
                stmt.setString(10, dhmos);
                stmt.setString(11, dhmot);
                stmt.setString(12, code1);
                stmt.setString(13, code);
                stmt.setString(14, description);
                stmt.setString(15, perifereia);
              int rowsInserted = stmt.executeUpdate();

            // Respond with success or failure
            if (rowsInserted > 0) {
                response.getWriter().write("Data inserted successfully!");
            } else {
                response.getWriter().write("Data insertion failed.");
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            response.getWriter().write("Error: " + e.getMessage());
        }finally {
            // Close the statement and connection
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
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
