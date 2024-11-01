/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package Servlets;

import database.DB_Connection;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import org.json.JSONObject;
import java.sql.Statement;

/**
 *
 * @author gnnss
 */
public class GetSimeiaParakoloythisisDataServlet extends HttpServlet {

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
            out.println("<title>Servlet GetSimeiaParakoloythisisDataServlet</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet GetSimeiaParakoloythisisDataServlet at " + request.getContextPath() + "</h1>");
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
        JSONArray jsonArray = new JSONArray();
        try (Connection conn = DB_Connection.getConnection()) {
            String query = "SELECT * FROM simeia_parakoloythisis_2019";
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(query);
            while (rs.next()) {
                JSONObject json = new JSONObject();
                json.put("FID", rs.getInt("FID"));
json.put("X", rs.getString("X"));
json.put("Y", rs.getString("Y"));
json.put("Name", rs.getString("Name"));
json.put("acth", rs.getString("acth"));
json.put("Easting_", rs.getString("Easting_"));
json.put("Field_1", rs.getString("Field_1"));
json.put("Lat", rs.getString("Lat"));
json.put("Lon", rs.getString("Lon"));
json.put("Northing", rs.getString("Northing"));
json.put("dhmos", rs.getString("dhmos"));
json.put("dhmot", rs.getString("dhmot"));
json.put("code_1", rs.getString("code_1"));
json.put("code", rs.getString("code"));
json.put("description", rs.getString("description"));
json.put("perifereia", rs.getString("perifereia"));

                // Add remaining fields here
                jsonArray.put(json);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        response.getWriter().write(jsonArray.toString());
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
