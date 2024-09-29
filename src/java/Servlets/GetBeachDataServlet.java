package Servlets;



import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import database.DB_Connection;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class GetBeachDataServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    response.setCharacterEncoding("UTF-8");
    response.setContentType("application/json; charset=UTF-8");
    PrintWriter out = response.getWriter();
       
        String selectedmonth = request.getParameter("month-select");
        String selectedyear = request.getParameter("year-select");
        System.out.println("Selected Month: " + selectedmonth);
        System.out.println("Selected Year: " + selectedyear);
        try {
            Connection con = DB_Connection.getConnection();
            String query = "SELECT * FROM "+selectedmonth+selectedyear;
           try (PreparedStatement stmt = con.prepareStatement(query)) {
                ResultSet rs = stmt.executeQuery();

                JsonArray jsonArray = new JsonArray();

                while (rs.next()) {
                    JsonObject jsonObject = new JsonObject();
                    jsonObject.addProperty("Perunit", rs.getString("Perunit"));
                    jsonObject.addProperty("Municipal", rs.getString("Municipal"));
                    jsonObject.addProperty("Coast", rs.getString("Coast"));
                    jsonObject.addProperty("StationCode", rs.getString("StationCode"));
                    jsonObject.addProperty("Description", rs.getString("Description"));
                    jsonObject.addProperty("SampleDate", rs.getString("SampleDate"));
                    jsonObject.addProperty("SampleTime", rs.getString("SampleTime"));
                    jsonObject.addProperty("DeliveryDate", rs.getString("DeliveryDate"));
                    jsonObject.addProperty("AnalyseDate", rs.getString("AnalyseDate"));
                    jsonObject.addProperty("Intenterococci", rs.getString("Intenterococci"));
                    jsonObject.addProperty("Ecoli", rs.getString("Ecoli"));
                    jsonObject.addProperty("Tar", rs.getString("Tar"));
                    jsonObject.addProperty("Glass", rs.getString("Glass"));
                    jsonObject.addProperty("Plastic", rs.getString("Plastic"));
                    jsonObject.addProperty("Caoutchouc", rs.getString("Caoutchouc"));
                    jsonObject.addProperty("Garbage", rs.getString("Garbage"));
                    jsonObject.addProperty("Wave", rs.getString("Wave"));
                    jsonObject.addProperty("Airdirection", rs.getString("Airdirection"));
                    jsonObject.addProperty("Rainfail", rs.getString("Rainfail"));
                    jsonObject.addProperty("Yestrainfail", rs.getString("Yestrainfail"));

                    jsonArray.add(jsonObject);
                }

                // Return the JSON response
                out.print(jsonArray.toString());
                out.flush();
            }
        } catch (SQLException | ClassNotFoundException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
