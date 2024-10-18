/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package database.Tables;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import mainClasses.User;
import com.google.gson.Gson;
import database.DB_Connection;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.sql.PreparedStatement;

/**
 *
 * @author Mike
 */
public class EditUserTable {

    public void addUserFromJSON(String json) throws ClassNotFoundException {
        User user = jsonToUser(json);
        addNewUser(user);
    }

    public User jsonToUser(String json) {
        Gson gson = new Gson();

        User user = gson.fromJson(json, User.class);
        return user;
    }

    public String UserToJSON(User user) {
        Gson gson = new Gson();

        String json = gson.toJson(user, User.class);
        return json;
    }

    public void printUserDetails(String username, String password) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM users WHERE username = '" + username + "' AND password='" + password + "'");
            while (rs.next()) {
                System.out.println("===Result===");
                DB_Connection.printResults(rs);
            }

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
    }

    public User databaseToUser(String username, String password) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM users WHERE username = '" + username + "' AND password='" + password + "'");
            System.out.println("SELECT * FROM users WHERE username = '" + username + "' AND password='" + password + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            User user = gson.fromJson(json, User.class);
            return user;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public User databaseToUser2(int user1) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM users WHERE user_id = '" + user1 + "'");
            System.out.println("SELECT * FROM users WHERE user_id = '" + user1 + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            User user = gson.fromJson(json, User.class);
            return user;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public String databaseUserToJSON(String username, String password) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM users WHERE username = '" + username + "' AND password='" + password + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            return json;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public void createUserTable() throws SQLException, ClassNotFoundException {

        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE users "
                + "(user_id INTEGER not NULL AUTO_INCREMENT, "
                + "    username VARCHAR(30) not null unique,"
                + "    email VARCHAR(200) not null unique,	"
                + "    password VARCHAR(32) not null,"
                + "    firstname VARCHAR(30) not null,"
                + "    lastname VARCHAR(30) not null,"
                + " PRIMARY KEY ( user_id))";
        stmt.execute(query);
        stmt.close();
    }

    /**
     * Establish a database connection and add in the database.
     *
     * @param user
     * @throws ClassNotFoundException
     */
    public void addNewUser(User user) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " users (username,email,password,firstname,lastname) "
                    + " VALUES ("
                    + "'" + user.getUsername() + "',"
                    + "'" + user.getEmail() + "',"
                    + "'" + user.getPassword() + "',"
                    + "'" + user.getFirstname() + "',"
                    + "'" + user.getLastname() + "'"
                    + ")";
            //stmt.execute(table);
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The user was successfully added in the database.");

            /* Get the member id from the database and set it to the member */
            stmt.close();

        } catch (SQLException ex) {
            Logger.getLogger(EditUserTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public String DATABASE_USER_TO_JSON_USERNAME(String s) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet r;
        try {
            r = stmt.executeQuery("SELECT * FROM users WHERE username = '" + s + "'");
            r.next();
            String j = DB_Connection.getResultsToJSON(r);
            return j;
        } catch (SQLException e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
        //return null;
    }

    public String DATABASE_USER_TO_JSON_EMAIL(String s) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet r;
        try {
            r = stmt.executeQuery("SELECT * FROM users WHERE email = '" + s + "'");
            r.next();
            String j = DB_Connection.getResultsToJSON(r);
            return j;
        } catch (SQLException e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
        //return null;
    }

    public void updateUser(User user) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String update = "UPDATE users SET email='" + user.getEmail() + "' , firstname='" + user.getFirstname()
                + "' , user_id='" + user.getUser_id() + "' , lastname='" + user.getLastname() + "' , password='" + user.getPassword()
                + "' WHERE username = '" + user.getUsername() + "'";
        stmt.executeUpdate(update);
    }

    public void deleteUser(int id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String update = "DELETE FROM users WHERE user_id = '" + id + "'";
        stmt.executeUpdate(update);
    }

    public boolean verifyUser(String username, String password) throws SQLException, ClassNotFoundException {
        // Retrieve the user from the database
        EditUserTable u = new EditUserTable();
        User user = u.databaseToUser(username, password);
        if (user != null) {
            // Compare the provided password with the stored hashed password
            return password.equals(user.getPassword());
        }
        return false; // User not found
    }

    public boolean changeUserPassword(String username, String oldPassword, String newPassword) throws SQLException, ClassNotFoundException {
        // Verify the old password
        if (verifyUser(username, oldPassword)) {
            // Hash the new passwor
            // Update the database with the new password
            Connection con = DB_Connection.getConnection();
            String update = "UPDATE users SET password = ? WHERE username = ?";
            try (PreparedStatement pstmt = con.prepareStatement(update)) {
                pstmt.setString(1, newPassword);
                pstmt.setString(2, username);
                pstmt.executeUpdate();
                return true; // Password change successful
            }
        }
        return false; // Old password was incorrect
    }
}
