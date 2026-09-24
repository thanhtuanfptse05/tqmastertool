package studentmanagement.controller;

import java.util.Scanner;

/**
 * Handles all input validation and safe input reading from the user.
 * Must reside in the controller package per coding standards.
 */
public class InputValidator {

    private static final Scanner scanner = new Scanner(System.in);

    /** Valid course names allowed by the system. */
    public static final String[] VALID_COURSES = {"Java", ".Net", "C/C++"};

    /**
     * Reads a non-empty trimmed string from console.
     *
     * @param msg prompt message
     * @return valid non-empty string
     */
    public static String inputString(String msg) {
        String value;
        while (true) {
            System.out.print(msg);
            value = scanner.nextLine().trim();
            if (!value.isEmpty()) {
                return value;
            }
            System.out.println("Input cannot be empty. Please try again.");
        }
    }

    /**
     * Reads an integer within [min, max] range from console.
     *
     * @param msg prompt message
     * @param min minimum value (inclusive)
     * @param max maximum value (inclusive)
     * @return valid integer
     */
    public static int inputInteger(String msg, int min, int max) {
        while (true) {
            System.out.print(msg);
            String line = scanner.nextLine().trim();
            try {
                int value = Integer.parseInt(line);
                if (value >= min && value <= max) {
                    return value;
                }
                System.out.println("Value must be between " + min + " and " + max + ". Please try again.");
            } catch (NumberFormatException e) {
                System.out.println("Invalid number. Please enter an integer.");
            }
        }
    }

    /**
     * Reads a student ID (non-empty, no spaces, alphanumeric).
     *
     * @param msg prompt message
     * @return validated student ID string
     */
    public static String inputStudentId(String msg) {
        while (true) {
            System.out.print(msg);
            String value = scanner.nextLine().trim();
            if (value.isEmpty()) {
                System.out.println("ID cannot be empty. Please try again.");
            } else if (!value.matches("[A-Za-z0-9]+")) {
                System.out.println("ID must contain only letters and digits (no spaces). Please try again.");
            } else {
                return value;
            }
        }
    }

    /**
     * Reads and validates a course name from the allowed list.
     *
     * @param msg prompt message
     * @return one of: "Java", ".Net", "C/C++"
     */
    public static String inputCourseName(String msg) {
        while (true) {
            System.out.println(msg);
            System.out.println("  1. Java");
            System.out.println("  2. .Net");
            System.out.println("  3. C/C++");
            int choice = inputInteger("Enter course choice (1-3): ", 1, 3);
            return VALID_COURSES[choice - 1];
        }
    }

    /**
     * Reads a Y/N confirmation from the user.
     *
     * @param msg prompt message
     * @return true if user enters 'Y' or 'y'
     */
    public static boolean inputYesNo(String msg) {
        while (true) {
            System.out.print(msg);
            String input = scanner.nextLine().trim();
            if (input.equalsIgnoreCase("Y")) {
                return true;
            } else if (input.equalsIgnoreCase("N")) {
                return false;
            }
            System.out.println("Please enter Y or N.");
        }
    }

    /**
     * Reads a choice between two options (U or D).
     *
     * @param msg prompt message
     * @return 'U' or 'D' character
     */
    public static char inputUpdateOrDelete(String msg) {
        while (true) {
            System.out.print(msg);
            String input = scanner.nextLine().trim();
            if (input.equalsIgnoreCase("U")) {
                return 'U';
            } else if (input.equalsIgnoreCase("D")) {
                return 'D';
            }
            System.out.println("Please enter U (Update) or D (Delete).");
        }
    }
}
