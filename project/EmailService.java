package com.FestOrg.FestOrg.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.List;

@Service
public class EmailService {
	@Autowired
	private JavaMailSender mailSender;

	public void sendResetMail(String toEmail, String resetLink) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(toEmail);
		message.setSubject("Reset  mail !");
		message.setText("click the link to reset your password : \n" + resetLink);
		mailSender.send(message);
	}

	public void sendBookingConfirmation(String toEmail, String studentName, String programTitle, String festTitle,
			String collegeName, String date, String time, String venue, double price, String transactionId) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
			
			helper.setTo(toEmail);
			helper.setSubject("🎉 Booking Confirmation: " + programTitle);
			
			String htmlContent = "<!DOCTYPE html>" +
				"<html>" +
				"<head>" +
					"<meta charset=\"UTF-8\">" +
					"<style>" +
						"body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
						".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
						".header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }" +
						".content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }" +
						".details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }" +
						".detail-row { display: flex; justify-content: space-between; margin: 10px 0; }" +
						".label { font-weight: bold; color: #555; }" +
						".value { color: #333; }" +
						".transaction { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; }" +
						".footer { text-align: center; margin-top: 30px; color: #666; }" +
						".success-icon { font-size: 48px; margin-bottom: 10px; }" +
					"</style>" +
				"</head>" +
				"<body>" +
					"<div class=\"container\">" +
						"<div class=\"header\">" +
							"<div class=\"success-icon\">✅</div>" +
							"<h1>Booking Confirmed!</h1>" +
							"<p>Your program registration has been successfully completed</p>" +
						"</div>" +
						"<div class=\"content\">" +
							"<h2>Hello " + studentName + ",</h2>" +
							"<p>Your booking for <strong>" + programTitle + "</strong> at the festival <strong>" + festTitle + "</strong> has been confirmed!</p>" +
							
							"<div class=\"details\">" +
								"<h3>📋 Booking Details</h3>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Program:</span>" +
									"<span class=\"value\">" + programTitle + "</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Festival:</span>" +
									"<span class=\"value\">" + festTitle + "</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">College:</span>" +
									"<span class=\"value\">" + collegeName + "</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Date:</span>" +
									"<span class=\"value\">" + date + "</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Time:</span>" +
									"<span class=\"value\">" + time + "</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Venue:</span>" +
									"<span class=\"value\">" + venue + "</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Price:</span>" +
									"<span class=\"value\">₹" + String.format("%.2f", price) + "</span>" +
								"</div>" +
							"</div>" +
							
							"<div class=\"transaction\">" +
								"<h3>💳 Payment Information</h3>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Transaction ID:</span>" +
									"<span class=\"value\">" + (transactionId != null ? transactionId : "N/A") + "</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Payment Status:</span>" +
									"<span class=\"value\">✅ Paid</span>" +
								"</div>" +
							"</div>" +
							
							"<p><strong>Please keep this email for your records.</strong></p>" +
							"<p>We look forward to seeing you at the event!</p>" +
						"</div>" +
						"<div class=\"footer\">" +
							"<p>Thank you for choosing FestBooker!</p>" +
							"<p>If you have any questions, please contact us.</p>" +
						"</div>" +
					"</div>" +
				"</body>" +
				"</html>";
			
			helper.setText(htmlContent, true);
			mailSender.send(message);
		} catch (MessagingException e) {
			System.err.println("Error sending HTML email: " + e.getMessage());
			// Fallback to simple text email
			SimpleMailMessage fallbackMessage = new SimpleMailMessage();
			fallbackMessage.setTo(toEmail);
			fallbackMessage.setSubject("Booking Confirmation: " + programTitle);
			fallbackMessage.setText("Hello " + studentName + ",\n\n" + "Your booking for the program \"" + programTitle
				+ "\" at the festival \"" + festTitle + "\" (" + collegeName + ") is confirmed!\n\n" + "Details:\n"
				+ "Date: " + date + "\n" + "Time: " + time + "\n" + "Venue: " + venue + "\n" + "Price: ₹"
					+ String.format("%.2f", price) + "\n" + "Transaction ID: " + (transactionId != null ? transactionId : "N/A") + "\n\n" + "Thank you for booking with us!\nFestBooker Team");
			mailSender.send(fallbackMessage);
		}
	}

	public void sendGroupBookingConfirmation(String toEmail, String studentName, String programTitle, String festTitle,
			String collegeName, String date, String time, String venue, double totalPrice, int groupSize, 
			List<String> groupMemberNames, String transactionId) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
			
			helper.setTo(toEmail);
			helper.setSubject("🎉 Group Booking Confirmation: " + programTitle);
			
			StringBuilder membersList = new StringBuilder();
			if (groupMemberNames != null && !groupMemberNames.isEmpty()) {
				for (int i = 0; i < groupMemberNames.size(); i++) {
					membersList.append("<div class=\"member\">")
						.append("<span class=\"member-number\">").append(i + 1).append(".</span> ")
						.append("<span class=\"member-name\">").append(groupMemberNames.get(i)).append("</span>")
						.append("</div>");
				}
			}
			
			String htmlContent = "<!DOCTYPE html>" +
				"<html>" +
				"<head>" +
					"<meta charset=\"UTF-8\">" +
					"<style>" +
						"body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
						".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
						".header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }" +
						".content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }" +
						".details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }" +
						".detail-row { display: flex; justify-content: space-between; margin: 10px 0; }" +
						".label { font-weight: bold; color: #555; }" +
						".value { color: #333; }" +
						".transaction { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; }" +
						".members { background: #f0f8ff; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #4CAF50; }" +
						".member { margin: 8px 0; padding: 5px 0; }" +
						".member-number { font-weight: bold; color: #4CAF50; margin-right: 10px; }" +
						".member-name { color: #333; }" +
						".footer { text-align: center; margin-top: 30px; color: #666; }" +
						".success-icon { font-size: 48px; margin-bottom: 10px; }" +
					"</style>" +
				"</head>" +
				"<body>" +
					"<div class=\"container\">" +
						"<div class=\"header\">" +
							"<div class=\"success-icon\">✅</div>" +
							"<h1>Group Booking Confirmed!</h1>" +
							"<p>Your team registration has been successfully completed</p>" +
						"</div>" +
						"<div class=\"content\">" +
							"<h2>Hello " + studentName + ",</h2>" +
							"<p>Your group booking for <strong>" + programTitle + "</strong> at the festival <strong>" + festTitle + "</strong> has been confirmed!</p>" +
							
							"<div class=\"details\">" +
								"<h3>📋 Booking Details</h3>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Program:</span>" +
									"<span class=\"value\">" + programTitle + "</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Festival:</span>" +
									"<span class=\"value\">" + festTitle + "</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">College:</span>" +
									"<span class=\"value\">" + collegeName + "</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Date:</span>" +
									"<span class=\"value\">" + date + "</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Time:</span>" +
									"<span class=\"value\">" + time + "</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Venue:</span>" +
									"<span class=\"value\">" + venue + "</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Group Size:</span>" +
									"<span class=\"value\">" + groupSize + " members</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Total Price:</span>" +
									"<span class=\"value\">₹" + String.format("%.2f", totalPrice) + "</span>" +
								"</div>" +
							"</div>" +
							
							"<div class=\"members\">" +
								"<h3>👥 Team Members</h3>" +
								membersList.toString() +
							"</div>" +
							
							"<div class=\"transaction\">" +
								"<h3>💳 Payment Information</h3>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Transaction ID:</span>" +
									"<span class=\"value\">" + (transactionId != null ? transactionId : "N/A") + "</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Payment Status:</span>" +
									"<span class=\"value\">✅ Paid</span>" +
								"</div>" +
							"</div>" +
							
							"<p><strong>Please keep this email for your records.</strong></p>" +
							"<p>We look forward to seeing your team at the event!</p>" +
						"</div>" +
						"<div class=\"footer\">" +
							"<p>Thank you for choosing FestBooker!</p>" +
							"<p>If you have any questions, please contact us.</p>" +
						"</div>" +
					"</div>" +
				"</body>" +
				"</html>";
			
			helper.setText(htmlContent, true);
			mailSender.send(message);
		} catch (MessagingException e) {
			System.err.println("Error sending HTML email: " + e.getMessage());
			// Fallback to simple text email
			SimpleMailMessage fallbackMessage = new SimpleMailMessage();
			fallbackMessage.setTo(toEmail);
			fallbackMessage.setSubject("Group Booking Confirmation: " + programTitle);
		
		StringBuilder emailText = new StringBuilder();
		emailText.append("Hello ").append(studentName).append(",\n\n");
		emailText.append("Your group booking for the program \"").append(programTitle)
				.append("\" at the festival \"").append(festTitle).append("\" (").append(collegeName).append(") is confirmed!\n\n");
		emailText.append("Details:\n");
		emailText.append("Date: ").append(date).append("\n");
		emailText.append("Time: ").append(time).append("\n");
		emailText.append("Venue: ").append(venue).append("\n");
		emailText.append("Group Size: ").append(groupSize).append(" members\n");
			emailText.append("Total Price: ₹").append(String.format("%.2f", totalPrice)).append("\n");
			emailText.append("Transaction ID: ").append(transactionId != null ? transactionId : "N/A").append("\n\n");
		
		if (groupMemberNames != null && !groupMemberNames.isEmpty()) {
			emailText.append("Group Members:\n");
			for (int i = 0; i < groupMemberNames.size(); i++) {
				emailText.append(i + 1).append(". ").append(groupMemberNames.get(i)).append("\n");
			}
			emailText.append("\n");
		}
		
		emailText.append("Thank you for booking with us!\nFestBooker Team");
		
			fallbackMessage.setText(emailText.toString());
			mailSender.send(fallbackMessage);
		}
	}

	public void sendFestivalApprovalNotification(String toEmail, String collegeName, String festTitle, boolean isApproved) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(toEmail);
		message.setSubject("Festival " + (isApproved ? "Approved" : "Rejected") + ": " + festTitle);
		
		String statusText = isApproved ? "approved" : "rejected";
		String body = "Dear " + collegeName + ",\n\n" +
				"Your festival \"" + festTitle + "\" has been " + statusText + " by our admin team.\n\n";
		
		if (isApproved) {
			body += "Your festival is now live and visible to students. Students can now book programs from your festival.\n\n" +
					"Thank you for using FestOrg!\nFestOrg Team";
		} else {
			body += "Please review your festival details and make necessary changes before resubmitting.\n\n" +
					"If you have any questions, please contact our support team.\nFestOrg Team";
		}
		
		message.setText(body);
		mailSender.send(message);
	}

	// Send Excel report with group members via email
	public void sendExcelReportWithGroupMembers(String toEmail, String collegeName, byte[] excelData, String fileName) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
			
			helper.setTo(toEmail);
			helper.setSubject("📊 College Bookings Report - " + collegeName);
			
			String htmlContent = "<!DOCTYPE html>" +
				"<html>" +
				"<head>" +
					"<meta charset=\"UTF-8\">" +
					"<style>" +
						"body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
						".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
						".header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }" +
						".content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }" +
						".details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }" +
						".footer { text-align: center; margin-top: 30px; color: #666; }" +
						".excel-icon { font-size: 48px; margin-bottom: 10px; }" +
					"</style>" +
				"</head>" +
				"<body>" +
					"<div class=\"container\">" +
						"<div class=\"header\">" +
							"<div class=\"excel-icon\">📊</div>" +
							"<h1>College Bookings Report</h1>" +
							"<p>Complete booking analysis with group members</p>" +
						"</div>" +
						"<div class=\"content\">" +
							"<h2>Hello " + collegeName + ",</h2>" +
							"<p>Please find attached the comprehensive Excel report containing all student bookings for your college's programs.</p>" +
							
							"<div class=\"details\">" +
								"<h3>📋 Report Contents</h3>" +
								"<ul>" +
									"<li><strong>Summary Sheet:</strong> Program statistics and revenue overview</li>" +
									"<li><strong>Individual Program Sheets:</strong> Detailed booking information for each program</li>" +
									"<li><strong>Student Details:</strong> Complete booking information including payment status</li>" +
									"<li><strong>Group Members:</strong> Detailed information for all group bookings</li>" +
									"<li><strong>Revenue Analysis:</strong> Total earnings and booking breakdowns</li>" +
								"</ul>" +
							"</div>" +
							
							"<p><strong>Note:</strong> The Excel file includes all group member details with their names, emails, and phone numbers for group bookings.</p>" +
							"<p>This report will help you analyze booking patterns and manage your festival programs effectively.</p>" +
						"</div>" +
						"<div class=\"footer\">" +
							"<p>Thank you for using FestBooker!</p>" +
							"<p>If you have any questions about the report, please contact us.</p>" +
						"</div>" +
					"</div>" +
				"</body>" +
				"</html>";
			
			helper.setText(htmlContent, true);
			
			// Attach the Excel file
			helper.addAttachment(fileName, new javax.mail.util.ByteArrayDataSource(excelData, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
			
			mailSender.send(message);
			System.out.println("✅ Excel report email sent successfully to: " + toEmail);
		} catch (MessagingException e) {
			System.err.println("❌ Error sending Excel report email: " + e.getMessage());
			e.printStackTrace();
			
			// Fallback to simple text email
			SimpleMailMessage fallbackMessage = new SimpleMailMessage();
			fallbackMessage.setTo(toEmail);
			fallbackMessage.setSubject("College Bookings Report - " + collegeName);
			fallbackMessage.setText("Hello " + collegeName + ",\n\n" +
				"Please find attached the comprehensive Excel report containing all student bookings for your college's programs.\n\n" +
				"The report includes:\n" +
				"- Summary sheet with program statistics\n" +
				"- Individual program sheets with detailed booking information\n" +
				"- Complete group member details for group bookings\n" +
				"- Revenue analysis and payment information\n\n" +
				"Thank you for using FestBooker!\nFestBooker Team");
			mailSender.send(fallbackMessage);
		}
	}

	// Send booking reminder email with group member details
	public void sendBookingReminder(String toEmail, String studentName, String programTitle, String festTitle,
			String collegeName, String date, String time, String venue, boolean isGroupBooking, 
			List<String> groupMemberNames, String transactionId) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
			
			helper.setTo(toEmail);
			helper.setSubject("⏰ Reminder: " + programTitle + " - Tomorrow!");
			
			StringBuilder membersList = new StringBuilder();
			if (isGroupBooking && groupMemberNames != null && !groupMemberNames.isEmpty()) {
				for (int i = 0; i < groupMemberNames.size(); i++) {
					membersList.append("<div class=\"member\">")
						.append("<span class=\"member-number\">").append(i + 1).append(".</span> ")
						.append("<span class=\"member-name\">").append(groupMemberNames.get(i)).append("</span>")
						.append("</div>");
				}
			}
			
			String htmlContent = "<!DOCTYPE html>" +
				"<html>" +
				"<head>" +
					"<meta charset=\"UTF-8\">" +
					"<style>" +
						"body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
						".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
						".header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }" +
						".content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }" +
						".details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ff6b6b; }" +
						".reminder { background: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ffc107; }" +
						".members { background: #f0f8ff; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #4CAF50; }" +
						".member { margin: 8px 0; padding: 5px 0; }" +
						".member-number { font-weight: bold; color: #4CAF50; margin-right: 10px; }" +
						".member-name { color: #333; }" +
						".footer { text-align: center; margin-top: 30px; color: #666; }" +
						".reminder-icon { font-size: 48px; margin-bottom: 10px; }" +
					"</style>" +
				"</head>" +
				"<body>" +
					"<div class=\"container\">" +
						"<div class=\"header\">" +
							"<div class=\"reminder-icon\">⏰</div>" +
							"<h1>Event Reminder</h1>" +
							"<p>Your program is tomorrow!</p>" +
						"</div>" +
						"<div class=\"content\">" +
							"<h2>Hello " + studentName + ",</h2>" +
							"<p>This is a friendly reminder that your program <strong>" + programTitle + "</strong> is scheduled for tomorrow!</p>" +
							
							"<div class=\"reminder\">" +
								"<h3>⚠️ Important Reminder</h3>" +
								"<p><strong>Please arrive 15 minutes before the scheduled time to complete registration.</strong></p>" +
								"<p>Don't forget to bring your confirmation email or transaction ID.</p>" +
							"</div>" +
							
							"<div class=\"details\">" +
								"<h3>📋 Event Details</h3>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Program:</span>" +
									"<span class=\"value\">" + programTitle + "</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Festival:</span>" +
									"<span class=\"value\">" + festTitle + "</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">College:</span>" +
									"<span class=\"value\">" + collegeName + "</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Date:</span>" +
									"<span class=\"value\">" + date + "</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Time:</span>" +
									"<span class=\"value\">" + time + "</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Venue:</span>" +
									"<span class=\"value\">" + venue + "</span>" +
								"</div>" +
								"<div class=\"detail-row\">" +
									"<span class=\"label\">Transaction ID:</span>" +
									"<span class=\"value\">" + (transactionId != null ? transactionId : "N/A") + "</span>" +
								"</div>" +
							"</div>" +
							
							(isGroupBooking && groupMemberNames != null && !groupMemberNames.isEmpty() ? 
								"<div class=\"members\">" +
									"<h3>👥 Team Members</h3>" +
									membersList.toString() +
								"</div>" : "") +
							
							"<p><strong>We look forward to seeing you at the event!</strong></p>" +
						"</div>" +
						"<div class=\"footer\">" +
							"<p>Thank you for choosing FestBooker!</p>" +
							"<p>If you have any questions, please contact us.</p>" +
						"</div>" +
					"</div>" +
				"</body>" +
				"</html>";
			
			helper.setText(htmlContent, true);
			mailSender.send(message);
		} catch (MessagingException e) {
			System.err.println("Error sending reminder email: " + e.getMessage());
			// Fallback to simple text email
			SimpleMailMessage fallbackMessage = new SimpleMailMessage();
			fallbackMessage.setTo(toEmail);
			fallbackMessage.setSubject("Reminder: " + programTitle + " - Tomorrow!");
			
			StringBuilder emailText = new StringBuilder();
			emailText.append("Hello ").append(studentName).append(",\n\n");
			emailText.append("This is a friendly reminder that your program \"").append(programTitle)
					.append("\" is scheduled for tomorrow!\n\n");
			emailText.append("Event Details:\n");
			emailText.append("Date: ").append(date).append("\n");
			emailText.append("Time: ").append(time).append("\n");
			emailText.append("Venue: ").append(venue).append("\n");
			emailText.append("Transaction ID: ").append(transactionId != null ? transactionId : "N/A").append("\n\n");
			
			if (isGroupBooking && groupMemberNames != null && !groupMemberNames.isEmpty()) {
				emailText.append("Team Members:\n");
				for (int i = 0; i < groupMemberNames.size(); i++) {
					emailText.append(i + 1).append(". ").append(groupMemberNames.get(i)).append("\n");
				}
				emailText.append("\n");
			}
			
			emailText.append("Please arrive 15 minutes before the scheduled time.\n");
			emailText.append("We look forward to seeing you!\n\n");
			emailText.append("Thank you for choosing FestBooker!\nFestBooker Team");
			
			fallbackMessage.setText(emailText.toString());
			mailSender.send(fallbackMessage);
		}
	}
} 