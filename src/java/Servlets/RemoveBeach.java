/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package Servlets;

import database.DB_Connection;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.sql.PreparedStatement;
/**
 *
 * @author gnnss
 */
public class RemoveBeach extends HttpServlet {

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
            out.println("<title>Servlet RemoveBeach</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet RemoveBeach at " + request.getContextPath() + "</h1>");
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
                response.setCharacterEncoding("UTF-8");
    response.setContentType("application/json; charset=UTF-8");
    PrintWriter out = response.getWriter();
       
        String selectedmonth = request.getParameter("month-select-2-beach");
        String selectedyear = request.getParameter("year-select-2-beach");
        String beach = request.getParameter("code");
        String tableName = selectedmonth + selectedyear; 
         try {
            Connection con = DB_Connection.getConnection();
        } catch (SQLException ex) {
            Logger.getLogger(RemoveTable.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(RemoveTable.class.getName()).log(Level.SEVERE, null, ex);
        } 
         boolean isTableRemoved = removeBeachFromTable(tableName,beach);

        // Respond with success or failure message
        response.setContentType("text/html");
        response.getWriter().write("<html><body>");
        if (isTableRemoved) {
           response.sendRedirect("admin.html");
        } else {
            response.getWriter().write("<h3>Failed to remove the beach  '" + beach + "'.</h3>");
        }
        response.getWriter().write("</body></html>");
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

        
        
        
        
    }
    private boolean removeBeachFromTable(String tableName,String beachcode) {
     Connection connection = null;
      //  Statement statement = null;
        boolean isRemoved = false;
 PreparedStatement statement = null;
        try {
            // Get the connection from DB_Connection class
            connection = DB_Connection.getConnection();

            // Create the SQL statement
         //   statement = connection.createStatement();
            System.out.println(tableName);
            System.out.println(beachcode);
            // Construct the DROP TABLE SQL query
             String sql = "DELETE FROM " + tableName + " WHERE StationCode = ?";
              System.out.println("Executing SQL: " + sql + " with StationCode: " + beachcode);

        // Create a PreparedStatement
        statement = connection.prepareStatement(sql);
        statement.setString(1, beachcode);

            int affectedRows = statement.executeUpdate();
             isRemoved = affectedRows > 0;
             if (isRemoved) {
            System.out.println("Beach " + beachcode + " was successfully removed from " + tableName);
        } else {
            System.out.println("No beach found with StationCode: " + beachcode);
        }
        } catch (Exception e) {
            e.printStackTrace();
            isRemoved = false;
        } finally {
            // Close the statement and connection
            try {
                if (statement != null) statement.close();
                if (connection != null) connection.close();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
        return isRemoved;
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
