package calculator.controller;

import calculator.model.Operator;
import java.util.Scanner;

/**
 * Controller utility class for user input validation in calculator operations.
 */
public class InputValidator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private InputValidator() {
        // Prevent instantiation
    }

    /**
     * Reads a menu option within [min, max].
     *
     * @param min minimum choice
     * @param max maximum choice
     * @return selected integer option
     */
    public static int getMenuOption(int min, int max) {
        while (true) {
            System.out.print("Please choice one option: ");
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
     * Reads a double value for the normal calculator.
     *
     * @param prompt the prompt message
     * @return valid double
     */
    public static double getDouble(String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = SCANNER.nextLine().trim();
            Double val = checkNumber(input);
            if (val != null) {
                return val;
            }
            System.out.println("Please input a valid number.");
        }
    }

    /**
     * Checks if string is a valid double.
     *
     * @param inputVal string to check
     * @return parsed Double or null if not a number
     */
    public static Double checkNumber(String inputVal) {
        if (inputVal == null || inputVal.trim().isEmpty()) {
            return null;
        }
        try {
            return Double.parseDouble(inputVal.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    /**
     * Alias method required by assignment specification (Double checkin).
     *
     * @param inputVal string to check
     * @return parsed Double or null
     */
    public static Double checkin(String inputVal) {
        return checkNumber(inputVal);
    }

    /**
     * Prompts and reads an arithmetic operator.
     *
     * @return valid Operator enum constant
     */
    public static Operator getOperator() {
        while (true) {
            System.out.print("Enter Operator: ");
            String input = SCANNER.nextLine().trim();
            Operator op = checkOperator(input);
            if (op != null) {
                return op;
            }
            System.out.println("Please input (+, -, *, /, ^)");
        }
    }

    /**
     * Validates if string corresponds to a valid Operator.
     *
     * @param operator input string
     * @return Operator or null if invalid
     */
    public static Operator checkOperator(String operator) {
        if (operator == null || operator.trim().isEmpty()) {
            return null;
        }
        String clean = operator.trim();
        if ("x".equalsIgnoreCase(clean)) {
            return Operator.MULTIPLY;
        }
        return Operator.fromSymbol(clean);
    }

    /**
     * Reads a positive double for BMI calculator (Weight or Height).
     * Prints "BMI is digit" upon invalid format as expected by assignment UI.
     *
     * @param prompt prompt message
     * @return positive double
     */
    public static double getBMIDouble(String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = SCANNER.nextLine().trim();
            Double val = checkNumber(input);
            if (val != null && val > 0) {
                return val;
            }
            System.out.println("BMI is digit");
        }
    }
}
