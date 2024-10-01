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
public class InsertDataServlet extends HttpServlet {

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
            out.println("<title>Servlet InsertDataServlet</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet InsertDataServlet at " + request.getContextPath() + "</h1>");
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
        processRequest(request, response);
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
         String perunit = request.getParameter("Perunit");
        String municipal = request.getParameter("Municipal");
        String coast = request.getParameter("Coast");
        String stationCode = request.getParameter("StationCode");
        String description = request.getParameter("Description");
        String sampleDate = request.getParameter("SampleDate");
        String sampleTime = request.getParameter("SampleTime");
        String deliveryDate = request.getParameter("DeliveryDate");
        String analyseDate = request.getParameter("AnalyseDate");
        int intenterococci = Integer.parseInt(request.getParameter("Intenterococci"));
        int ecoli = Integer.parseInt(request.getParameter("Ecoli"));
        String tar = request.getParameter("Tar");
        String glass = request.getParameter("Glass");
        String plastic = request.getParameter("Plastic");
        String caoutchouc = request.getParameter("Caoutchouc");
        String garbage = request.getParameter("Garbage");
        String wave = request.getParameter("Wave");
        String airDirection = request.getParameter("Airdirection");
        String rainfall = request.getParameter("Rainfail");
        String yestRainfall = request.getParameter("Yestrainfail");

        // Get selected month and year
        String month = request.getParameter("month-select-3");
        String year = request.getParameter("year-select-3");

        // Construct table name dynamically based on month and year
        String tableName = month + year;

        Connection connection = null;
        PreparedStatement pstmt = null;

        try {
            // Get the connection from DB_Connection class
            connection = DB_Connection.getConnection();

            // Insert query
            String sql = "INSERT INTO " + tableName + " (Perunit, Municipal, Coast, StationCode, Description, SampleDate, SampleTime, " +
                    "DeliveryDate, AnalyseDate, Intenterococci, Ecoli, Tar, Glass, Plastic, Caoutchouc, Garbage, Wave, Airdirection, Rainfail, Yestrainfail) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

             try {
                 pstmt = connection.prepareStatement(sql);
             } catch (SQLException ex) {
                 Logger.getLogger(InsertDataServlet.class.getName()).log(Level.SEVERE, null, ex);
             }

            // Set parameters
            pstmt.setString(1, perunit);
            pstmt.setString(2, municipal);
            pstmt.setString(3, coast);
            pstmt.setString(4, stationCode);
            pstmt.setString(5, description);
            pstmt.setString(6, sampleDate);
            pstmt.setString(7, sampleTime);
            pstmt.setString(8, deliveryDate);
            pstmt.setString(9, analyseDate);
            pstmt.setInt(10, intenterococci);
            pstmt.setInt(11, ecoli);
            pstmt.setString(12, tar);
            pstmt.setString(13, glass);
            pstmt.setString(14, plastic);
            pstmt.setString(15, caoutchouc);
            pstmt.setString(16, garbage);
            pstmt.setString(17, wave);
            pstmt.setString(18, airDirection);
            pstmt.setString(19, rainfall);
            pstmt.setString(20, yestRainfall);

            // Execute the update
            int rowsInserted = pstmt.executeUpdate();

            // Respond with success or failure
            if (rowsInserted > 0) {
                response.getWriter().write("Data inserted successfully!");
            } else {
                response.getWriter().write("Data insertion failed.");
            }

        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            response.getWriter().write("Error: " + e.getMessage());
        } finally {
            // Close the statement and connection
            try {
                if (pstmt != null) pstmt.close();
                if (connection != null) connection.close();
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
