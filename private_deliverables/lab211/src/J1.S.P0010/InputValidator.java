package linearsearch;

import java.util.Scanner;

/**
 * Input validation utility for Linear Search program.
 * Separate class handling all user input validation cleanly.
 */
public class InputValidator {

    private static final Scanner scanner = new Scanner(System.in);

    /**
     * Prompts the user to enter a positive integer (> 0).
     *
     * @param prompt the message displayed to the user
     * @return a valid positive integer entered by the user
     */
    public static int getPositiveInteger(String prompt) {
        int value;
        while (true) {
            System.out.println(prompt);
            String input = scanner.nextLine().trim();

            if (input.isEmpty()) {
                System.out.println("Input cannot be empty. Please enter a positive integer.");
                continue;
            }

            try {
                value = Integer.parseInt(input);
                if (value <= 0) {
                    System.out.println("Value must be greater than 0. Please enter again.");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("Invalid number format. Please enter a valid integer.");
            }
        }
    }

    /**
     * Prompts the user to enter any integer value.
     *
     * @param prompt the message displayed to the user
     * @return a valid integer entered by the user
     */
    public static int getInteger(String prompt) {
        int value;
        while (true) {
            System.out.println(prompt);
            String input = scanner.nextLine().trim();

            if (input.isEmpty()) {
                System.out.println("Input cannot be empty. Please enter an integer.");
                continue;
            }

            try {
                value = Integer.parseInt(input);
                return value;
            } catch (NumberFormatException e) {
                System.out.println("Invalid number format. Please enter a valid integer.");
            }
        }
    }
}
