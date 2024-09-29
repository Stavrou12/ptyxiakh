

package Servlets;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import database.DB_Connection;
import java.io.BufferedReader;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;

import java.sql.PreparedStatement;

import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;



class EditBeachTable{

    
    public void updateBeach(String tableName,BeachData user) throws SQLException, ClassNotFoundException {
    Connection con = null;
    PreparedStatement pstmt = null;
    
    try {
        con = DB_Connection.getConnection();
        String update = "UPDATE " + tableName +" SET Perunit=?, Municipal=?, Coast=?, Description=?, SampleDate=?, SampleTime=?, DeliveryDate=?, AnalyseDate=?, Intenterococci=?, Ecoli=?, Tar=?, Glass=?, Plastic=?, Caoutchouc=?, Garbage=?, Wave=?, Airdirection=?, Rainfail=?, Yestrainfail=? WHERE StationCode=?";
        pstmt = con.prepareStatement(update);
        
        // Set parameters
        pstmt.setString(1, user.getPerunit());
        pstmt.setString(2, user.getMunicipal());
        pstmt.setString(3, user.getCoast());
        pstmt.setString(4, user.getDescription());
        pstmt.setString(5, user.getSampleDate());
        pstmt.setString(6, user.getSampleTime());
        pstmt.setString(7, user.getDeliveryDate());
        pstmt.setString(8, user.getAnalyseDate());
        pstmt.setString(9, user.getIntenterococci());
        pstmt.setString(10, user.getEcoli());
        pstmt.setString(11, user.getTar());
        pstmt.setString(12, user.getGlass());
        pstmt.setString(13, user.getPlastic());
        pstmt.setString(14, user.getCaoutchouc());
        pstmt.setString(15, user.getGarbage());
        pstmt.setString(16, user.getWave());
        pstmt.setString(17, user.getAirdirection());
        pstmt.setString(18, user.getRainfail());
        pstmt.setString(19, user.getYestrainfail());
        pstmt.setString(20, user.getStationCode());

        // Execute the update
        pstmt.executeUpdate();
    } finally {
        // Ensure resources are closed
        if (pstmt != null) {
            pstmt.close();
        }
        if (con != null) {
            con.close();
        }
    }
}

    public BeachData jsonToBeach(String json) {
        Gson gson = new Gson();

        BeachData b = gson.fromJson(json, BeachData.class);
        return b;
    }
}

// The BeachData class to map the incoming data
class BeachData {
    private String StationCode;
    private String Perunit;
    private String Municipal;
    private String Coast;
    private String Description;
    private String SampleDate;
    private String SampleTime;
    private String DeliveryDate;
    private String AnalyseDate;
    private String Intenterococci;
    private String Ecoli;
    private String Tar;
    private String Glass;
    private String Plastic;
    private String Caoutchouc;
    private String Garbage;
    private String Wave;
    private String Airdirection;
    private String Rainfail;
    private String Yestrainfail;

    // Getters and setters for each field (or use Lombok for brevity)
        public String getStationCode() {
        return StationCode;
    }

    public void setStationCode(String stationCode) {
        this.StationCode = stationCode;
    }

    public String getPerunit() {
        return Perunit;
    }

    public void setPerunit(String perunit) {
        this.Perunit = perunit;
    }

    public String getMunicipal() {
        return Municipal;
    }

    public void setMunicipal(String municipal) {
        this.Municipal = municipal;
    }

    public String getCoast() {
        return Coast;
    }

    public void setCoast(String coast) {
        this.Coast = coast;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String description) {
        this.Description = description;
    }

    public String getSampleDate() {
        return SampleDate;
    }

    public void setSampleDate(String sampleDate) {
        this.SampleDate = sampleDate;
    }

    public String getSampleTime() {
        return SampleTime;
    }

    public void setSampleTime(String sampleTime) {
        this.SampleTime = sampleTime;
    }

    public String getDeliveryDate() {
        return DeliveryDate;
    }

    public void setDeliveryDate(String deliveryDate) {
        this.DeliveryDate = deliveryDate;
    }

    public String getAnalyseDate() {
        return AnalyseDate;
    }

    public void setAnalyseDate(String analyseDate) {
        this.AnalyseDate = analyseDate;
    }

    public String getIntenterococci() {
        return Intenterococci;
    }

    public void setIntenterococci(String intenterococci) {
        this.Intenterococci = intenterococci;
    }

    public String getEcoli() {
        return Ecoli;
    }

    public void setEcoli(String ecoli) {
        this.Ecoli = ecoli;
    }

    public String getTar() {
        return Tar;
    }

    public void setTar(String tar) {
        this.Tar = tar;
    }

    public String getGlass() {
        return Glass;
    }

    public void setGlass(String glass) {
        this.Glass = glass;
    }

    public String getPlastic() {
        return Plastic;
    }

    public void setPlastic(String plastic) {
        this.Plastic = plastic;
    }

    public String getCaoutchouc() {
        return Caoutchouc;
    }

    public void setCaoutchouc(String caoutchouc) {
        this.Caoutchouc = caoutchouc;
    }

    public String getGarbage() {
        return Garbage;
    }

    public void setGarbage(String garbage) {
        this.Garbage = garbage;
    }

    public String getWave() {
        return Wave;
    }

    public void setWave(String wave) {
        this.Wave = wave;
    }

    public String getAirdirection() {
        return Airdirection;
    }

    public void setAirdirection(String airdirection) {
        this.Airdirection = airdirection;
    }

    public String getRainfail() {
        return Rainfail;
    }

    public void setRainfail(String rainfail) {
        this.Rainfail = rainfail;
    }

    public String getYestrainfail() {
        return Yestrainfail;
    }

    public void setYestrainfail(String yestrainfail) {
        this.Yestrainfail = yestrainfail;
    }
}


public class UpdateBeachDataServlet extends HttpServlet {


protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {       
    try {
        
        
        response.setCharacterEncoding("UTF-8");
response.setContentType("application/json; charset=UTF-8");
request.setCharacterEncoding("UTF-8");
        // Read JSON from the request
        BufferedReader reader = request.getReader();
        Gson gson = new Gson();
        
         JsonObject jsonObject = gson.fromJson(reader, JsonObject.class);
        String tableName = jsonObject.get("tableName").getAsString(); // Retrieve the table name
        System.out.println(tableName);
        // Parse the JSON array (not a single object)
        
        JsonArray beachDataArrayJson = jsonObject.getAsJsonArray("updatedData");
         BeachData[] beachDataArray = gson.fromJson(beachDataArrayJson, BeachData[].class);
       // BeachData[] beachDataArray = gson.fromJson(reader, BeachData[].class);

        // Initialize your table object to handle database operations
        EditBeachTable user_table = new EditBeachTable();
       
        // Loop through the array and update each record in the database
        for (BeachData beachData : beachDataArray) {
            user_table.updateBeach(tableName,beachData); // Assuming updateBeach is the method to update the record
        }

        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write("{\"message\": \"Data updated successfully\"}");
        
    } catch (SQLException ex) {
        Logger.getLogger(UpdateBeachDataServlet.class.getName()).log(Level.SEVERE, null, ex);
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.getWriter().write("{\"error\": \"Database error occurred.\"}");
    } catch (ClassNotFoundException ex) {
        Logger.getLogger(UpdateBeachDataServlet.class.getName()).log(Level.SEVERE, null, ex);
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.getWriter().write("{\"error\": \"Class not found.\"}");
    }
}

    // Function to update the database with the array of BeachData objects
    
}

