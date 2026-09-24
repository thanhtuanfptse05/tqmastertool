package candidatemanagement.controller;

import java.util.Calendar;
import java.util.Scanner;

/**
 * Handles all input reading and validation from the user.
 * Must reside in the controller package per coding standards.
 */
public class InputValidator {

    private static final Scanner scanner = new Scanner(System.in);

    /** Current year used for birth year validation. */
    private static final int CURRENT_YEAR = Calendar.getInstance().get(Calendar.YEAR);

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
     * @return valid integer in range
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
                System.out.println("Invalid number format. Please enter an integer.");
            }
        }
    }

    /**
     * Reads a non-empty alphanumeric candidate ID from console.
     *
     * @param msg prompt message
     * @return valid candidate ID
     */
    public static String inputCandidateId(String msg) {
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
     * Reads and validates a birth year (1900..current year, exactly 4 digits).
     *
     * @param msg prompt message
     * @return valid birth year
     */
    public static int inputBirthYear(String msg) {
        while (true) {
            System.out.print(msg);
            String line = scanner.nextLine().trim();
            if (line.length() != 4) {
                System.out.println("Birth year must be exactly 4 digits (e.g. 1995). Please try again.");
                continue;
            }
            try {
                int year = Integer.parseInt(line);
                if (year >= 1900 && year <= CURRENT_YEAR) {
                    return year;
                }
                System.out.println("Birth year must be between 1900 and " + CURRENT_YEAR + ". Please try again.");
            } catch (NumberFormatException e) {
                System.out.println("Invalid year format. Please enter a 4-digit number.");
            }
        }
    }

    /**
     * Reads and validates a phone number (digits only, minimum 10 characters).
     *
     * @param msg prompt message
     * @return valid phone string
     */
    public static String inputPhone(String msg) {
        while (true) {
            System.out.print(msg);
            String value = scanner.nextLine().trim();
            if (value.matches("\\d{10,}")) {
                return value;
            }
            System.out.println("Phone must contain at least 10 digits (numbers only). Please try again.");
        }
    }

    /**
     * Reads and validates an email address with format account@domain (e.g. user@fpt.edu.vn).
     *
     * @param msg prompt message
     * @return valid email string
     */
    public static String inputEmail(String msg) {
        while (true) {
            System.out.print(msg);
            String value = scanner.nextLine().trim();
            if (value.matches("^[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,}$")) {
                return value;
            }
            System.out.println("Invalid email format. Example: user@fpt.edu.vn. Please try again.");
        }
    }

    /**
     * Reads and validates years of experience (0-100).
     *
     * @param msg prompt message
     * @return valid experience year value
     */
    public static int inputExpInYear(String msg) {
        return inputInteger(msg, 0, 100);
    }

    /**
     * Reads and validates a graduation rank from allowed values.
     * Allowed: Excellence, Good, Fair, Poor.
     *
     * @param msg prompt message
     * @return one of the four valid rank strings
     */
    public static String inputGraduationRank(String msg) {
        System.out.println(msg);
        System.out.println("  1. Excellence");
        System.out.println("  2. Good");
        System.out.println("  3. Fair");
        System.out.println("  4. Poor");
        int choice = inputInteger("Enter rank choice (1-4): ", 1, 4);
        String[] ranks = {"Excellence", "Good", "Fair", "Poor"};
        return ranks[choice - 1];
    }

    /**
     * Reads a graduation date string (non-empty, e.g. "2024-06").
     *
     * @param msg prompt message
     * @return graduation date string
     */
    public static String inputGraduationDate(String msg) {
        return inputString(msg);
    }

    /**
     * Reads a Y/N confirmation from the user.
     *
     * @param msg prompt message
     * @return true if user enters 'Y', false if 'N'
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
}
