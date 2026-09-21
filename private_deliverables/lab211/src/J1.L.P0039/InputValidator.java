package studentcourse.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Scanner;
import java.util.regex.Pattern;

/**
 * Utility class for validating inputs for Student and Short Course Management System.
 * Strictly placed in package controller as mandated by rule.md.
 */
public class InputValidator {

    private static final Scanner SCANNER = new Scanner(System.in);
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("dd/MM/yyyy");
    private static final Pattern STUDENT_ID_PATTERN = Pattern.compile("^STU\\d{4}$");

    static {
        DATE_FORMAT.setLenient(false);
    }

    private InputValidator() {
    }

    /**
     * Prompts user for an integer within [min, max].
     *
     * @param msg prompt message
     * @param min minimum value
     * @param max maximum value
     * @return valid integer
     */
    public static int inputInteger(String msg, int min, int max) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.isEmpty()) {
                System.out.println("Input cannot be empty. Please enter a number between " + min + " and " + max + ".");
                continue;
            }
            try {
                int value = Integer.parseInt(input);
                if (value < min || value > max) {
                    System.out.println("Value out of range. Please enter an integer from " + min + " to " + max + ".");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("Invalid integer format. Please re-enter.");
            }
        }
    }

    /**
     * Prompts user for student ID following STU0000 format.
     *
     * @param msg prompt message
     * @return valid student ID
     */
    public static String inputStudentId(String msg) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (STUDENT_ID_PATTERN.matcher(input).matches()) {
                return input;
            }
            System.out.println("Student ID must follow the format STU0000 (e.g., STU0001, STU1234).");
        }
    }

    /**
     * Prompts user for full name containing at least two words.
     *
     * @param msg prompt message
     * @return valid full name
     */
    public static String inputFullName(String msg) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.isEmpty()) {
                System.out.println("Full name cannot be empty.");
                continue;
            }
            String[] words = input.split("\\s+");
            if (words.length >= 2) {
                return input;
            }
            System.out.println("Full name must contain at least two words. Please re-enter.");
        }
    }

    /**
     * Prompts user for non-empty string.
     *
     * @param msg prompt message
     * @return non-empty string
     */
    public static String inputNonEmptyString(String msg) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (!input.isEmpty()) {
                return input;
            }
            System.out.println("This field cannot be empty. Please re-enter.");
        }
    }

    /**
     * Prompts user for GPA between 0.0 and 4.0.
     *
     * @param msg prompt message
     * @return valid GPA
     */
    public static double inputGpa(String msg) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.isEmpty()) {
                System.out.println("GPA cannot be empty.");
                continue;
            }
            try {
                double gpa = Double.parseDouble(input);
                if (gpa >= 0.0 && gpa <= 4.0) {
                    return gpa;
                }
                System.out.println("GPA must be a double value between 0.0 and 4.0.");
            } catch (NumberFormatException e) {
                System.out.println("Invalid number format. Please enter a valid GPA.");
            }
        }
    }

    /**
     * Prompts user for positive integer weeks (minimum 1 week).
     *
     * @param msg prompt message
     * @return positive integer >= 1
     */
    public static int inputDurationWeeks(String msg) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.isEmpty()) {
                System.out.println("Duration cannot be empty.");
                continue;
            }
            try {
                int weeks = Integer.parseInt(input);
                if (weeks >= 1) {
                    return weeks;
                }
                System.out.println("Duration must be a positive integer in weeks, minimum 1 week.");
            } catch (NumberFormatException e) {
                System.out.println("Invalid integer format. Please re-enter.");
            }
        }
    }

    /**
     * Checks if a date is strictly in the future (after today).
     *
     * @param date date to check
     * @return true if date is after today
     */
    public static boolean isFutureDate(Date date) {
        if (date == null) {
            return false;
        }
        Calendar today = Calendar.getInstance();
        today.set(Calendar.HOUR_OF_DAY, 0);
        today.set(Calendar.MINUTE, 0);
        today.set(Calendar.SECOND, 0);
        today.set(Calendar.MILLISECOND, 0);

        Calendar inputCal = Calendar.getInstance();
        inputCal.setTime(date);
        inputCal.set(Calendar.HOUR_OF_DAY, 0);
        inputCal.set(Calendar.MINUTE, 0);
        inputCal.set(Calendar.SECOND, 0);
        inputCal.set(Calendar.MILLISECOND, 0);

        return inputCal.after(today);
    }

    /**
     * Prompts user for future date formatted dd/MM/yyyy.
     *
     * @param msg prompt message
     * @return Date in the future
     */
    public static Date inputFutureDate(String msg) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.isEmpty()) {
                System.out.println("Start date cannot be empty.");
                continue;
            }
            try {
                Date date = DATE_FORMAT.parse(input);
                if (isFutureDate(date)) {
                    return date;
                }
                System.out.println("Start date must be a future date (after today).");
            } catch (ParseException e) {
                System.out.println("Invalid date format. Please use dd/MM/yyyy (e.g., 20/10/2025).");
            }
        }
    }

    /**
     * Prompts user for Y/N confirmation.
     *
     * @param msg prompt message
     * @return true if Y/y, false if N/n
     */
    public static boolean inputYesNo(String msg) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.equalsIgnoreCase("Y")) {
                return true;
            }
            if (input.equalsIgnoreCase("N")) {
                return false;
            }
            System.out.println("Please enter Y or N.");
        }
    }
}
