/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package mainClasses;

import javax.mail.*;
import javax.mail.internet.*;
import java.util.Properties;

public class SendEmail {

    public static boolean sendEmail(String fromEmail, String subject, String messageText) {
        final String smtpHost = "smtp.elasticemail.com";  // Elastic Email's SMTP server
        final String smtpUsername = "stavrgiannis5@gmail.com";
        final String smtpPassword = "E2156C5D49AECA91016D963742588AC3ED87";
        final String toEmail = "stavrgiannis5@gmail.com";

        Properties properties = new Properties();
        properties.put("mail.smtp.host", smtpHost);
        properties.put("mail.smtp.port", "587");
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.starttls.enable", "true"); // Enable STARTTLS
properties.put("mail.smtp.ssl.protocols", "TLSv1.2"); // Specify TLS version

        // Create a session with an authenticator
        Session session = Session.getInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(smtpUsername, smtpPassword);
            }
        });

        try {
            // Create a message with the provided subject and message text
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(smtpUsername)); // Fixed From address for authentication
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
            message.setReplyTo(new Address[] { new InternetAddress(fromEmail) }); // Sender's email
            message.setSubject(subject);
            message.setText("From: " + fromEmail + "\n\n" + messageText); // Embed sender’s email in body

            // Send the email
            Transport.send(message);
            System.out.println("Email sent successfully!");
            return true;
        } catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }
    }
}

