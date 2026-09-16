package user.controller;

import java.util.Scanner;

/**
 * InputValidator handles all user input validation.
 * Must reside in the controller package according to project architecture rules.
 */
public class InputValidator {
    private static final Scanner SCANNER = new Scanner(System.in);

    /**
     * Reads an integer within [min, max] from user input.
     *
     * @param prompt prompt message
     * @param min minimum allowed value
     * @param max maximum allowed value
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
                System.out.println("Please enter a number from " + min + " to " + max + ".");
            } catch (NumberFormatException e) {
                System.out.println("Please enter a valid integer.");
            }
        }
    }

    /**
     * Validates and reads username.
     * Username must be at least 5 characters and contain no spaces.
     *
     * @param prompt prompt message
     * @return valid username
     */
    public static String getUsername(String prompt) {
        while (true) {
            System.out.print(prompt);
            String username = SCANNER.nextLine();
            if (username != null && username.matches("^\\S{5,}$")) {
                return username;
            }
            System.out.println("You must enter least at 5 character, and no space!");
        }
    }

    /**
     * Validates and reads password.
     * Password must be at least 6 characters and contain no spaces.
     *
     * @param prompt prompt message
     * @return valid password
     */
    public static String getPassword(String prompt) {
        while (true) {
            System.out.print(prompt);
            String password = SCANNER.nextLine();
            if (password != null && password.matches("^\\S{6,}$")) {
                return password;
            }
            System.out.println("You must enter least at 6 character, and no space!");
        }
    }
}
