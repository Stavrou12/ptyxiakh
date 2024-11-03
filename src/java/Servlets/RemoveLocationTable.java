/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package Servlets;

import database.DB_Connection;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.Statement;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author gnnss
 */
public class RemoveLocationTable extends HttpServlet {

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
            out.println("<title>Servlet RemoveLocationTable</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet RemoveLocationTable at " + request.getContextPath() + "</h1>");
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
  
    
    
     boolean isLocationTableRemoved = removeLocationTableFromDatabase();
     response.setContentType("text/html");
        response.getWriter().write("<html><body>");
        if (isLocationTableRemoved) {
           response.sendRedirect("admin.html");
        } else {
            response.getWriter().write("<h3>Failed to remove the table simeia_parakoloythisis'" + "'.</h3>");
        }
        response.getWriter().write("</body></html>");
    }
    
    private boolean removeLocationTableFromDatabase() {
     Connection connection = null;
        Statement statement = null;
        boolean isRemoved = false;

        try {
            // Get the connection from DB_Connection class
            connection = DB_Connection.getConnection();
            String tableName = "simeia_parakoloythisis_2020";
            // Create the SQL statement
            statement = connection.createStatement();

            // Construct the DROP TABLE SQL query
            String sql = "DROP TABLE IF EXISTS " + tableName;

            // Execute the query to remove the table
            statement.executeUpdate(sql);
            isRemoved = true;
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
