package com.FestOrg.FestOrg.service;

import com.FestOrg.FestOrg.model.*;
import com.FestOrg.FestOrg.repository.ProgramBookingRepository;
import com.FestOrg.FestOrg.repository.ProgramRepository;
import com.FestOrg.FestOrg.repository.GroupMemberRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ExcelService {

    @Autowired
    private ProgramBookingRepository programBookingRepository;

    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private GroupMemberRepository groupMemberRepository;

    public byte[] generateCollegeBookingsExcel(Long collegeId) throws IOException {
        System.out.println("🚀 DEBUG: Starting Excel generation for college ID: " + collegeId);
        
        try (Workbook workbook = new XSSFWorkbook()) {
            System.out.println("✅ DEBUG: Workbook created successfully");
            
            // Create styles
            System.out.println("🎨 DEBUG: Creating styles...");
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);
            CellStyle titleStyle = createTitleStyle(workbook);
            System.out.println("✅ DEBUG: Styles created successfully");

            // Get all programs for this college
            System.out.println("🔍 DEBUG: Searching for programs for college ID: " + collegeId);
            List<Program> programs = programRepository.findByFestCollegeId(collegeId);
            System.out.println("📊 DEBUG: Found " + programs.size() + " programs for college ID: " + collegeId);
            
            if (programs.isEmpty()) {
                System.out.println("⚠️  WARNING: No programs found for college ID: " + collegeId);
                // Create a minimal Excel file with just headers
                createEmptySummarySheet(workbook, headerStyle, titleStyle);
            } else {
                System.out.println("✅ DEBUG: Programs found:");
                for (Program program : programs) {
                    System.out.println("   - Program ID: " + program.getId() + ", Title: " + program.getTitle());
                }
                
                // Create summary sheet
                System.out.println("📋 DEBUG: Creating summary sheet...");
                createSummarySheet(workbook, programs, headerStyle, dataStyle, titleStyle);
                
                // Create individual program sheets
                System.out.println("📄 DEBUG: Creating individual program sheets...");
                for (Program program : programs) {
                    System.out.println("   📄 DEBUG: Creating sheet for program: " + program.getTitle());
                    createProgramSheet(workbook, program, headerStyle, dataStyle, titleStyle);
                }
            }

            // Write to byte array
            System.out.println("💾 DEBUG: Writing workbook to byte array...");
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            byte[] result = outputStream.toByteArray();
            System.out.println("✅ DEBUG: Excel generation completed. File size: " + result.length + " bytes");
            return result;
        } catch (Exception e) {
            System.err.println("❌ ERROR in Excel generation: " + e.getMessage());
            e.printStackTrace();
            throw new IOException("Failed to generate Excel file: " + e.getMessage(), e);
        }
    }

    private void createEmptySummarySheet(Workbook workbook, CellStyle headerStyle, CellStyle titleStyle) {
        System.out.println("📋 DEBUG: Creating empty summary sheet...");
        Sheet sheet = workbook.createSheet("Summary");
        
        // Create title
        Row titleRow = sheet.createRow(0);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("College Programs - Booking Summary (No Programs Found)");
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new org.apache.poi.ss.util.CellRangeAddress(0, 0, 0, 7));

        // Create headers
        Row headerRow = sheet.createRow(2);
        String[] headers = {"Program Name", "Festival", "Date", "Time", "Venue", "Total Bookings", "Solo Bookings", "Group Bookings", "Total Revenue"};
        
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Add a message row
        Row messageRow = sheet.createRow(3);
        Cell messageCell = messageRow.createCell(0);
        messageCell.setCellValue("No programs found for this college.");
        sheet.addMergedRegion(new org.apache.poi.ss.util.CellRangeAddress(3, 3, 0, 8));

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
        System.out.println("✅ DEBUG: Empty summary sheet created");
    }

    private void createSummarySheet(Workbook workbook, List<Program> programs, 
                                  CellStyle headerStyle, CellStyle dataStyle, CellStyle titleStyle) {
        System.out.println("📋 DEBUG: Creating summary sheet with " + programs.size() + " programs");
        Sheet sheet = workbook.createSheet("Summary");
        
        // Create title
        Row titleRow = sheet.createRow(0);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("College Programs - Booking Summary");
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new org.apache.poi.ss.util.CellRangeAddress(0, 0, 0, 7));

        // Create headers
        Row headerRow = sheet.createRow(2);
        String[] headers = {"Program Name", "Festival", "Date", "Time", "Venue", "Total Bookings", "Solo Bookings", "Group Bookings", "Total Revenue"};
        
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Add data
        int rowNum = 3;
        for (Program program : programs) {
            System.out.println("📋 DEBUG: Processing program " + program.getId() + " (" + program.getTitle() + ")");
            List<ProgramBooking> bookings = programBookingRepository.findByProgramId(program.getId());
            System.out.println("�� DEBUG: Program " + program.getId() + " (" + program.getTitle() + ") has " + bookings.size() + " bookings");
            
            Row row = sheet.createRow(rowNum++);
            
            row.createCell(0).setCellValue(program.getTitle());
            row.createCell(1).setCellValue(program.getFest().getTitle());
            row.createCell(2).setCellValue(program.getDate().toString());
            row.createCell(3).setCellValue(program.getTime());
            row.createCell(4).setCellValue(program.getVenue());
            row.createCell(5).setCellValue(bookings.size());
            
            long soloBookings = bookings.stream().filter(b -> !b.isGroupBooking()).count();
            long groupBookings = bookings.stream().filter(ProgramBooking::isGroupBooking).count();
            
            row.createCell(6).setCellValue(soloBookings);
            row.createCell(7).setCellValue(groupBookings);
            
            double totalRevenue = bookings.stream()
                .mapToDouble(ProgramBooking::getTotalAmount)
                .sum();
            row.createCell(8).setCellValue(totalRevenue);
            
            // Apply data style to all cells
            for (int i = 0; i < 9; i++) {
                row.getCell(i).setCellStyle(dataStyle);
            }
        }

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
        System.out.println("✅ DEBUG: Summary sheet created successfully");
    }

    private void createProgramSheet(Workbook workbook, Program program, 
                                  CellStyle headerStyle, CellStyle dataStyle, CellStyle titleStyle) {
        System.out.println("📄 DEBUG: Creating program sheet for: " + program.getTitle());
        
        // Create unique sheet name using program ID and title
        String baseSheetName = program.getTitle().replaceAll("[^a-zA-Z0-9\\s]", "");
        String sheetName = baseSheetName + "_" + program.getId();
        
        // Ensure sheet name is within Excel's 31 character limit
        if (sheetName.length() > 31) {
            sheetName = sheetName.substring(0, 28) + "_" + program.getId();
        }
        
        System.out.println("�� DEBUG: Using sheet name: " + sheetName);
        
        // Check if sheet name already exists and make it unique if needed
        int counter = 1;
        String finalSheetName = sheetName;
        while (workbook.getSheet(finalSheetName) != null) {
            finalSheetName = sheetName + "_" + counter;
            counter++;
            System.out.println("📄 DEBUG: Sheet name conflict, using: " + finalSheetName);
        }
        
        Sheet sheet = workbook.createSheet(finalSheetName);
        
        // Create title
        Row titleRow = sheet.createRow(0);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("Program: " + program.getTitle() + " - Student Bookings");
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new org.apache.poi.ss.util.CellRangeAddress(0, 0, 0, 7));

        // Program details
        Row detailsRow = sheet.createRow(1);
        detailsRow.createCell(0).setCellValue("Festival: " + program.getFest().getTitle());
        detailsRow.createCell(1).setCellValue("Date: " + program.getDate());
        detailsRow.createCell(2).setCellValue("Time: " + program.getTime());
        detailsRow.createCell(3).setCellValue("Venue: " + program.getVenue());
        detailsRow.createCell(4).setCellValue("Price: ₹" + program.getTicketPrice());

        // Create headers
        Row headerRow = sheet.createRow(3);
        String[] headers = {"Student Name", "Email", "Phone", "Booking Type", "Group Size", "Payment Status", "Transaction ID", "Amount"};
        
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Get bookings for this program
        List<ProgramBooking> bookings = programBookingRepository.findByProgramId(program.getId());
        System.out.println("📋 DEBUG: Found " + bookings.size() + " bookings for program " + program.getTitle());
        
        // Add booking data
        int rowNum = 4;
        for (ProgramBooking booking : bookings) {
            Row row = sheet.createRow(rowNum++);
            
            row.createCell(0).setCellValue(booking.getStudentName());
            row.createCell(1).setCellValue(booking.getStudentEmail());
            row.createCell(2).setCellValue(""); // Phone not stored in booking
            row.createCell(3).setCellValue(booking.isGroupBooking() ? "Group" : "Solo");
            row.createCell(4).setCellValue(booking.getGroupSize());
            row.createCell(5).setCellValue(booking.getPaymentStatus().toString());
            row.createCell(6).setCellValue(booking.getRazorpayPaymentId() != null ? booking.getRazorpayPaymentId() : "N/A");
            row.createCell(7).setCellValue(booking.getTotalAmount());
            
            // Apply data style to all cells
            for (int i = 0; i < 8; i++) {
                row.getCell(i).setCellStyle(dataStyle);
            }
        }

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
        System.out.println("✅ DEBUG: Program sheet created for: " + program.getTitle());
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    private CellStyle createDataStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.LEFT);
        return style;
    }

    private CellStyle createTitleStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 14);
        font.setColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }
}