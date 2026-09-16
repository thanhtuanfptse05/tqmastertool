package ebank.controller;

import java.util.Scanner;

/**
 * Controller utility class for user input validation in Ebank program.
 */
public class InputValidator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private InputValidator() {
        // Prevent instantiation
    }

    /**
     * Reads menu choice between min and max.
     *
     * @param prompt prompt message
     * @param min minimum choice
     * @param max maximum choice
     * @return selected integer choice
     */
    public static int getMenuOption(String prompt, int min, int max) {
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
     * Reads a line of text from console.
     *
     * @param prompt the prompt message
     * @return raw trimmed user input
     */
    public static String getString(String prompt) {
        System.out.print(prompt);
        return SCANNER.nextLine().trim();
    }
}
