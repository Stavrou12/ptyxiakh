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
public class DeleteLocationServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */

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
        response.setContentType("text/plain; charset=UTF-8");
         String code1 = request.getParameter("code_1_");

        try (Connection conn = DB_Connection.getConnection()) {
            String sql = "DELETE FROM simeia_parakoloythisis_2019 WHERE code_1 = ?";
            try (PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setString(1, code1);
                int rowsAffected = ps.executeUpdate();

                if (rowsAffected > 0) {
                    response.getWriter().write("Η τοποθεσία παραλίας διαγράφηκε με επιτυχία.");
                } else {
                    response.getWriter().write("Δεν βρέθηκε παραλία με τον καθορισμένο κωδικό.");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.getWriter().write("Error occurred while deleting beach location.");
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(DeleteLocationServlet.class.getName()).log(Level.SEVERE, null, ex);
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
