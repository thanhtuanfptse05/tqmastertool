package matrix.controller;

import java.util.Scanner;

/**
 * Controller utility class for user input validation in Matrix Calculator.
 */
public class InputValidator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private InputValidator() {
        // Prevent instantiation
    }

    /**
     * Reads a menu option between min and max.
     *
     * @param min minimum choice
     * @param max maximum choice
     * @return selected integer choice
     */
    public static int getMenuChoice(int min, int max) {
        while (true) {
            System.out.print("Your choice: ");
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
     * Reads a positive integer (greater than 0) for row or column count.
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
                System.out.println("Value of matrix is digit");
            }
        }
    }

    /**
     * Reads an integer value for a matrix element.
     * Displays "Value of matrix is digit" on invalid input.
     *
     * @param prompt prompt message
     * @return integer value
     */
    public static int getMatrixValue(String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = SCANNER.nextLine().trim();
            try {
                return Integer.parseInt(input);
            } catch (NumberFormatException e) {
                System.out.println("Value of matrix is digit");
            }
        }
    }
}
