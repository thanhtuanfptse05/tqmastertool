package task.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Scanner;

/**
 * InputValidator handles all user input validation for Task Management.
 * Must reside in the controller package according to project architecture rules.
 */
public class InputValidator {
    private static final Scanner SCANNER = new Scanner(System.in);
    private static final String DATE_FORMAT = "dd-MM-yyyy";

    /**
     * Prompts for and validates an integer within [min, max].
     *
     * @param prompt prompt message
     * @param min minimum value
     * @param max maximum value
     * @return valid integer
     */
    public static int getInt(String prompt, int min, int max) {
        while (true) {
            System.out.print(prompt);
            String input = SCANNER.nextLine().trim();
            try {
                int value = Integer.parseInt(input);
                if (value >= min && value <= max) {
                    return value;
                }
                System.out.println("Please enter an integer in range [" + min + ", " + max + "].");
            } catch (NumberFormatException e) {
                System.out.println("Please enter a valid integer number.");
            }
        }
    }

    /**
     * Prompts for and validates a positive integer.
     *
     * @param prompt prompt message
     * @return valid positive integer
     */
    public static int getPositiveInt(String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = SCANNER.nextLine().trim();
            try {
                int value = Integer.parseInt(input);
                if (value > 0) {
                    return value;
                }
                System.out.println("Please enter a positive integer (> 0).");
            } catch (NumberFormatException e) {
                System.out.println("Please enter a valid integer number.");
            }
        }
    }

    /**
     * Prompts for and validates a non-empty string.
     *
     * @param prompt prompt message
     * @return non-empty string
     */
    public static String getString(String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = SCANNER.nextLine().trim();
            if (!input.isEmpty()) {
                return input;
            }
            System.out.println("Input cannot be empty. Please enter again.");
        }
    }

    /**
     * Prompts for and validates a date with format dd-MM-yyyy.
     * Uses SimpleDateFormat with setLenient(false).
     *
     * @param prompt prompt message
     * @return valid date string formatted as dd-MM-yyyy
     */
    public static String getDate(String prompt) {
        SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT);
        sdf.setLenient(false);

        while (true) {
            System.out.print(prompt);
            String input = SCANNER.nextLine().trim();
            if (input.matches("^\\d{2}-\\d{2}-\\d{4}$")) {
                try {
                    Date date = sdf.parse(input);
                    return sdf.format(date);
                } catch (ParseException e) {
                    System.out.println("Invalid calendar date! Please enter a valid date in dd-MM-yyyy format.");
                }
            } else {
                System.out.println("Invalid date format! Please enter date formatted as dd-MM-yyyy (e.g. 28-08-2015).");
            }
        }
    }

    /**
     * Prompts for and validates Plan From time (8.0 to 17.5).
     *
     * @param prompt prompt message
     * @return valid planFrom value
     */
    public static double getPlanFrom(String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = SCANNER.nextLine().trim();
            try {
                double value = Double.parseDouble(input);
                if (value >= 8.0 && value <= 17.5) {
                    if (value % 0.5 == 0) {
                        return value;
                    } else {
                        System.out.println("Time must be in 0.5 increments (8.0, 8.5, 9.0, ..., 17.5).");
                    }
                } else {
                    System.out.println("Plan From must be within 8.0 to 17.5.");
                }
            } catch (NumberFormatException e) {
                System.out.println("Please enter a valid numeric value.");
            }
        }
    }

    /**
     * Prompts for and validates Plan To time (greater than planFrom and <= 17.5).
     *
     * @param prompt prompt message
     * @param planFrom Plan From time
     * @return valid planTo value
     */
    public static double getPlanTo(String prompt, double planFrom) {
        while (true) {
            System.out.print(prompt);
            String input = SCANNER.nextLine().trim();
            try {
                double value = Double.parseDouble(input);
                if (value > planFrom && value <= 17.5) {
                    if (value % 0.5 == 0) {
                        return value;
                    } else {
                        System.out.println("Time must be in 0.5 increments (8.0, 8.5, 9.0, ..., 17.5).");
                    }
                } else {
                    System.out.println("Plan To must be greater than Plan From (" + planFrom + ") and <= 17.5.");
                }
            } catch (NumberFormatException e) {
                System.out.println("Please enter a valid numeric value.");
            }
        }
    }
}
