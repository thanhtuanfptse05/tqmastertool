package worker.controller;

import java.util.Scanner;

/**
 * Controller utility class for user input validation in Worker Management program.
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
     * @param min minimum choice
     * @param max maximum choice
     * @return selected integer option
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
            System.out.println("Input cannot be empty. Please try again.");
        }
    }

    /**
     * Reads worker code for adding a new worker (must not duplicate existing code).
     *
     * @param prompt prompt message
     * @param controller the worker controller to verify uniqueness
     * @return unique worker code
     */
    public static String getNewWorkerCode(String prompt, WorkerController controller) {
        while (true) {
            String code = getNonEmptyString(prompt);
            if (controller.findWorkerByCode(code) == null) {
                return code;
            }
            System.out.println("Worker code already exists in system. Please enter a different code.");
        }
    }

    /**
     * Reads worker code for adjusting salary (must exist in DB).
     *
     * @param prompt prompt message
     * @param controller the worker controller to verify existence
     * @return existing worker code
     */
    public static String getExistingWorkerCode(String prompt, WorkerController controller) {
        while (true) {
            String code = getNonEmptyString(prompt);
            if (controller.findWorkerByCode(code) != null) {
                return code;
            }
            System.out.println("Worker code does not exist in system. Please enter an existing code.");
        }
    }

    /**
     * Reads worker age within [18, 50].
     *
     * @param prompt prompt message
     * @return valid age
     */
    public static int getAge(String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = SCANNER.nextLine().trim();
            try {
                int age = Integer.parseInt(input);
                if (age >= 18 && age <= 50) {
                    return age;
                }
                System.out.println("Age must be in range 18 to 50.");
            } catch (NumberFormatException e) {
                System.out.println("Invalid age format. Please enter an integer.");
            }
        }
    }

    /**
     * Reads salary (> 0).
     *
     * @param prompt prompt message
     * @return valid positive salary
     */
    public static double getSalary(String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = SCANNER.nextLine().trim();
            try {
                double salary = Double.parseDouble(input);
                if (salary > 0) {
                    return salary;
                }
                System.out.println("Salary must be greater than 0.");
            } catch (NumberFormatException e) {
                System.out.println("Invalid salary format. Please enter a positive number.");
            }
        }
    }

    /**
     * Reads amount of money to raise/cut (> 0).
     *
     * @param prompt prompt message
     * @return valid positive amount
     */
    public static double getAmount(String prompt) {
        return getSalary(prompt);
    }
}
