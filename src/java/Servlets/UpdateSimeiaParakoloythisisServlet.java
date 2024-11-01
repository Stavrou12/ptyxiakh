/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package Servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;
import database.DB_Connection;
import java.sql.Connection;
import java.sql.PreparedStatement;

/**
 *
 * @author gnnss
 */
public class UpdateSimeiaParakoloythisisServlet extends HttpServlet {

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
            out.println("<title>Servlet UpdateSimeiaParakoloythisisServlet</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet UpdateSimeiaParakoloythisisServlet at " + request.getContextPath() + "</h1>");
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
                response.setCharacterEncoding("UTF-8");
response.setContentType("application/json; charset=UTF-8");
request.setCharacterEncoding("UTF-8");
StringBuilder jsonBuilder = new StringBuilder();
    String line;
    try (BufferedReader reader = request.getReader()) {
        while ((line = reader.readLine()) != null) {
            jsonBuilder.append(line);
        }
    }

    // Convert JSON string to JSONObject
    JSONObject jsonObject = new JSONObject(jsonBuilder.toString());
        String X = jsonObject.optString("X", null);
    String Y = jsonObject.optString("Y", null);
    String Name = jsonObject.optString("Name", null);
    String acth = jsonObject.optString("acth", null);
    String Easting_ = jsonObject.optString("Easting_", null);
    String Field_1 = jsonObject.optString("Field_1", null);
    String Lat = jsonObject.optString("Lat", null);
    String Lon = jsonObject.optString("Lon", null);
    String Northing = jsonObject.optString("Northing", null);
    String dhmos = jsonObject.optString("dhmos", null);
    String dhmot = jsonObject.optString("dhmot", null);
    String code = jsonObject.optString("code", null);
    String description = jsonObject.optString("description", null);
    String perifereia = jsonObject.optString("perifereia", null);
    String code_1 = jsonObject.optString("code_1", null);
       
         String sql = "UPDATE simeia_parakoloythisis_2019 SET " +
                     "X = ?, Y = ?, Name = ?, acth = ?, Easting_ = ?, Field_1 = ?, Lat = ?, Lon = ?, " +
                     "Northing = ?, dhmos = ?, dhmot = ?, code = ?, description = ?, " +
                     "perifereia = ? WHERE code_1 = ?";
         
         
        try (Connection conn = DB_Connection.getConnection()) {
          
            PreparedStatement stmt = conn.prepareStatement(sql);
           
            stmt.setString(1, X);
            stmt.setString(2, Y);
            stmt.setString(3, Name);
            stmt.setString(4, acth);
            stmt.setString(5, Easting_);
            stmt.setString(6, Field_1);
            stmt.setString(7, Lat);
            stmt.setString(8, Lon);
            stmt.setString(9, Northing);
            stmt.setString(10, dhmos);
            stmt.setString(11, dhmot);
            
            stmt.setString(12, code);
            stmt.setString(13, description);
            stmt.setString(14, perifereia);
            stmt.setString(15, code_1);

               int rowsAffected = stmt.executeUpdate();
System.out.println("SQL Query: " + sql);

System.out.println("Updating record with values: " +
    "X=" + X + ", Y=" + Y + ", Name=" + Name + ", acth=" + acth + ", " +
    "Easting_=" + Easting_ + ", Field_1=" + Field_1 + ", Lat=" + Lat + ", " +
    "Lon=" + Lon + ", Northing=" + Northing + ", dhmos=" + dhmos + ", " +
    "dhmot=" + dhmot + ", code=" + code + ", description=" + description + ", " +
    "perifereia=" + perifereia + ", code_1=" + code_1);
    if (rowsAffected > 0) {
       // Commit the transaction on success
        
    } else {
        // Rollback if no rows were affected
       
    }
            response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write("{\"message\": \"Data updated successfully\"}");
        } catch (Exception e) {
            e.printStackTrace();
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
