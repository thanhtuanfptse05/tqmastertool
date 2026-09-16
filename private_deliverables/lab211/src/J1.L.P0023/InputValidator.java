package fruit.controller;

import java.util.Scanner;

/**
 * Controller utility class for user input validation in Fruit Shop program.
 */
public class InputValidator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private InputValidator() {
        // Prevent instantiation
    }

    /**
     * Reads a menu option within [min, max].
     *
     * @param prompt prompt message
     * @param min minimum option
     * @param max maximum option
     * @return selected integer option
     */
    public static int getMenuChoice(String prompt, int min, int max) {
        while (true) {
            System.out.print(prompt);
            String input = SCANNER.nextLine().trim();
            try {
                int choice = Integer.parseInt(input);
                if (choice >= min && choice <= max) {
                    return choice;
                }
                System.out.println("Please choose an option between " + min + " and " + max + ".");
            } catch (NumberFormatException e) {
                System.out.println("Invalid choice. Please enter an integer number.");
            }
        }
    }

    /**
     * Reads a non-empty string.
     *
     * @param prompt prompt message
     * @return trimmed non-empty string
     */
    public static String getNonEmptyString(String prompt) {
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
     * Reads a positive integer (> 0).
     *
     * @param prompt prompt message
     * @return positive integer
     */
    public static int getPositiveInt(String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = SCANNER.nextLine().trim();
            try {
                int val = Integer.parseInt(input);
                if (val > 0) {
                    return val;
                }
                System.out.println("Value must be greater than 0.");
            } catch (NumberFormatException e) {
                System.out.println("Invalid input. Please enter a valid integer.");
            }
        }
    }

    /**
     * Reads a positive double (> 0).
     *
     * @param prompt prompt message
     * @return positive double
     */
    public static double getPositiveDouble(String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = SCANNER.nextLine().trim();
            try {
                double val = Double.parseDouble(input);
                if (val > 0) {
                    return val;
                }
                System.out.println("Price must be greater than 0.");
            } catch (NumberFormatException e) {
                System.out.println("Invalid input. Please enter a valid numeric value.");
            }
        }
    }

    /**
     * Prompts user for Y/N decision.
     *
     * @param prompt prompt message
     * @return true if user enters Y/y, false if N/n
     */
    public static boolean getYesNo(String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = SCANNER.nextLine().trim();
            if ("Y".equalsIgnoreCase(input)) {
                return true;
            }
            if ("N".equalsIgnoreCase(input)) {
                return false;
            }
            System.out.println("Please enter 'Y' for Yes or 'N' for No.");
        }
    }
}
