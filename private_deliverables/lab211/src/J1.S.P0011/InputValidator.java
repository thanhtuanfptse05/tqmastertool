package convertbase.controller;

import java.util.Scanner;

/**
 * Controller utility class for user input validation in base conversion program.
 */
public class InputValidator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private InputValidator() {
        // Prevent instantiation
    }

    /**
     * Prompts the user to select a base system (1: Binary, 2: Decimal, 3: Hexadecimal).
     *
     * @param prompt the message displayed to prompt the user
     * @return the selected base as an integer (2, 10, or 16)
     */
    public static int getBaseChoice(String prompt) {
        while (true) {
            System.out.println(prompt);
            System.out.println("1. Binary (BIN)");
            System.out.println("2. Decimal (DEC)");
            System.out.println("3. Hexadecimal (HEX)");
            System.out.print("Please choose an option (1-3): ");
            String input = SCANNER.nextLine().trim();

            if (input.isEmpty()) {
                System.out.println("Input cannot be empty. Please enter a number between 1 and 3.");
                continue;
            }

            try {
                int choice = Integer.parseInt(input);
                switch (choice) {
                    case 1:
                        return 2;
                    case 2:
                        return 10;
                    case 3:
                        return 16;
                    default:
                        System.out.println("Invalid choice. Please choose 1, 2, or 3.");
                }
            } catch (NumberFormatException e) {
                System.out.println("Invalid input format. Please enter an integer (1-3).");
            }
        }
    }

    /**
     * Reads and validates the value string according to the selected base.
     *
     * @param base the base system (2, 10, or 16)
     * @return valid value string matching the base
     */
    public static String getBaseValue(int base) {
        String baseName = getBaseName(base);
        String regex = getBaseRegex(base);

        while (true) {
            System.out.print("Enter the input value (" + baseName + "): ");
            String value = SCANNER.nextLine().trim();

            if (value.isEmpty()) {
                System.out.println("Value cannot be empty. Please enter a valid " + baseName + " number.");
                continue;
            }

            if (value.matches(regex)) {
                return value.toUpperCase();
            }

            System.out.println("Invalid " + baseName + " format. Allowed digits/characters: "
                    + getAllowedCharsDescription(base));
        }
    }

    /**
     * Checks if the user wants to continue the program.
     *
     * @return true if user enters Y/y, false if N/n
     */
    public static boolean checkContinue() {
        while (true) {
            System.out.print("Do you want to continue (Y/N)?: ");
            String input = SCANNER.nextLine().trim();

            if ("Y".equalsIgnoreCase(input)) {
                return true;
            }
            if ("N".equalsIgnoreCase(input)) {
                return false;
            }
            System.out.println("Please enter 'Y' to continue or 'N' to exit.");
        }
    }

    /**
     * Gets display name of base system.
     *
     * @param base base number
     * @return base name string
     */
    public static String getBaseName(int base) {
        switch (base) {
            case 2:
                return "Binary";
            case 10:
                return "Decimal";
            case 16:
                return "Hexadecimal";
            default:
                return "Base " + base;
        }
    }

    private static String getBaseRegex(int base) {
        switch (base) {
            case 2:
                return "^[01]+$";
            case 10:
                return "^[0-9]+$";
            case 16:
                return "^[0-9a-fA-F]+$";
            default:
                return ".*";
        }
    }

    private static String getAllowedCharsDescription(int base) {
        switch (base) {
            case 2:
                return "0, 1";
            case 10:
                return "0-9";
            case 16:
                return "0-9, A-F (or a-f)";
            default:
                return "";
        }
    }
}
