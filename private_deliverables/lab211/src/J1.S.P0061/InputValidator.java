package shape.controller;

import java.util.Scanner;

/**
 * Controller utility class for user input validation in Shape program.
 */
public class InputValidator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private InputValidator() {
        // Prevent instantiation
    }

    /**
     * Prompts for and returns a positive double value greater than 0.
     *
     * @param prompt the prompt message
     * @return positive double value
     */
    public static double getPositiveDouble(String prompt) {
        while (true) {
            System.out.println(prompt);
            String input = SCANNER.nextLine().trim();

            if (input.isEmpty()) {
                System.out.println("Input cannot be empty. Please enter a positive number.");
                continue;
            }

            try {
                double val = Double.parseDouble(input);
                if (val > 0) {
                    return val;
                }
                System.out.println("Value must be greater than 0. Please try again.");
            } catch (NumberFormatException e) {
                System.out.println("Invalid number format. Please enter a valid numeric value.");
            }
        }
    }
}
