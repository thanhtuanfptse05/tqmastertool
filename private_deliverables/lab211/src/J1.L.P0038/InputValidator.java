package carinsurance.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Scanner;

/**
 * Utility class for validating console user inputs.
 * Strictly placed in package controller as mandated by rule.md.
 */
public class InputValidator {

    private static final Scanner SCANNER = new Scanner(System.in);
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("MM/dd/yyyy");

    static {
        DATE_FORMAT.setLenient(false);
    }

    /**
     * Private constructor to prevent instantiation.
     */
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
     * Prompts user for vehicle value (> 999).
     *
     * @param msg prompt message
     * @return valid double vehicle value
     */
    public static double inputVehicleValue(String msg) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.isEmpty()) {
                System.out.println("Vehicle value cannot be empty.");
                continue;
            }
            try {
                double val = Double.parseDouble(input);
                if (val <= 999.0) {
                    System.out.println("The value of the vehicle must be over 999. Please re-enter.");
                    continue;
                }
                return val;
            } catch (NumberFormatException e) {
                System.out.println("Invalid number format. Please enter a valid vehicle value.");
            }
        }
    }

    /**
     * Prompts user for vehicle type (5, 7, or 9).
     *
     * @param msg prompt message
     * @return 5, 7, or 9
     */
    public static int inputVehicleType(String msg) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if ("5".equals(input) || "7".equals(input) || "9".equals(input)) {
                return Integer.parseInt(input);
            }
            System.out.println("Vehicle type must be one of the following: 5, 7, or 9 seats.");
        }
    }

    /**
     * Prompts user for insurance period (12, 24, or 36).
     *
     * @param msg prompt message
     * @return 12, 24, or 36
     */
    public static int inputInsurancePeriod(String msg) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if ("12".equals(input) || "24".equals(input) || "36".equals(input)) {
                return Integer.parseInt(input);
            }
            System.out.println("Insurance period must be one of the following: 12, 24 or 36 months.");
        }
    }

    /**
     * Prompts user for a non-empty string.
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
            System.out.println("This field cannot be null or empty. Please re-enter.");
        }
    }

    /**
     * Prompts user for car owner name (2 to 35 characters).
     *
     * @param msg prompt message
     * @return valid car owner name
     */
    public static String inputCarOwner(String msg) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.length() >= 2 && input.length() <= 35) {
                return input;
            }
            System.out.println("The length of the car owner field must be from 2 to 35 characters.");
        }
    }

    /**
     * Prompts user for a valid date formatted MM/dd/yyyy.
     *
     * @param msg prompt message
     * @return valid Date object
     */
    public static Date inputDate(String msg) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.isEmpty()) {
                System.out.println("Date cannot be empty.");
                continue;
            }
            try {
                return DATE_FORMAT.parse(input);
            } catch (ParseException e) {
                System.out.println("Invalid date. Please enter in format MM/dd/yyyy (e.g., 01/30/2023).");
            }
        }
    }

    /**
     * Prompts user for confirmation (Y/N).
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

    // --- Optional / Update helpers (allows empty input to keep old value) ---

    /**
     * Prompts user for optional string update.
     *
     * @param msg prompt message
     * @param oldValue previous value
     * @return new value, or oldValue if left empty
     */
    public static String inputUpdateString(String msg, String oldValue) {
        System.out.print(msg);
        String input = SCANNER.nextLine().trim();
        if (input.isEmpty()) {
            return oldValue;
        }
        return input;
    }

    /**
     * Prompts user for optional car owner update (2 to 35 chars).
     *
     * @param msg prompt message
     * @param oldOwner previous owner
     * @return new owner, or oldOwner if left empty
     */
    public static String inputUpdateCarOwner(String msg, String oldOwner) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.isEmpty()) {
                return oldOwner;
            }
            if (input.length() >= 2 && input.length() <= 35) {
                return input;
            }
            System.out.println("The length of the car owner field must be from 2 to 35 characters.");
        }
    }

    /**
     * Prompts user for optional vehicle value update (> 999).
     *
     * @param msg prompt message
     * @param oldValue previous value
     * @return new value, or oldValue if left empty
     */
    public static double inputUpdateVehicleValue(String msg, double oldValue) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.isEmpty()) {
                return oldValue;
            }
            try {
                double val = Double.parseDouble(input);
                if (val > 999.0) {
                    return val;
                }
                System.out.println("The value of the vehicle must be over 999.");
            } catch (NumberFormatException e) {
                System.out.println("Invalid number format.");
            }
        }
    }

    /**
     * Prompts user for optional vehicle type update (5, 7, 9).
     *
     * @param msg prompt message
     * @param oldType previous type
     * @return new type, or oldType if left empty
     */
    public static int inputUpdateVehicleType(String msg, int oldType) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.isEmpty()) {
                return oldType;
            }
            if ("5".equals(input) || "7".equals(input) || "9".equals(input)) {
                return Integer.parseInt(input);
            }
            System.out.println("Vehicle type must be one of: 5, 7, or 9 seats.");
        }
    }

    /**
     * Prompts user for optional date update.
     *
     * @param msg prompt message
     * @param oldDate previous date
     * @return new date, or oldDate if left empty
     */
    public static Date inputUpdateDate(String msg, Date oldDate) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.isEmpty()) {
                return oldDate;
            }
            try {
                return DATE_FORMAT.parse(input);
            } catch (ParseException e) {
                System.out.println("Invalid date. Format: MM/dd/yyyy.");
            }
        }
    }
}
