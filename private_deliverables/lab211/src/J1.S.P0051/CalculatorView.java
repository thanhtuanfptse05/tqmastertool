package calculator.view;

import calculator.controller.CalculatorController;
import calculator.controller.InputValidator;
import calculator.model.BMIData;
import calculator.model.Operator;
import java.util.Locale;

/**
 * View class managing the console interface for the Calculator Program.
 */
public class CalculatorView {

    private final CalculatorController controller;

    /**
     * Constructor injecting the CalculatorController.
     *
     * @param controller the business controller
     */
    public CalculatorView(CalculatorController controller) {
        this.controller = controller;
    }

    /**
     * Displays the main menu.
     */
    public void displayMainMenu() {
        System.out.println("========= Calculator Program =========");
        System.out.println("1. Normal Calculator");
        System.out.println("2. BMI Calculator");
        System.out.println("3. Exit");
    }

    /**
     * Executes the Normal Calculator interface loop.
     */
    public void runNormalCalculator() {
        System.out.println("----- Normal Calculator -----");
        double memory = InputValidator.getDouble("Enter number: ");

        while (true) {
            Operator op = InputValidator.getOperator();
            if (op == Operator.EQUAL) {
                System.out.println("Result:" + memory);
                break;
            }

            double nextNum = InputValidator.getDouble("Enter number: ");
            try {
                memory = controller.calculate(memory, op, nextNum);
                System.out.println("Memory:" + memory);
            } catch (ArithmeticException e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }

    /**
     * Executes the BMI Calculator interface loop.
     */
    public void runBMICalculator() {
        System.out.println("----- BMI Calculator -----");
        double weight = InputValidator.getBMIDouble("Enter Weight(kg): ");
        double height = InputValidator.getBMIDouble("Enter Height(cm): ");

        BMIData data = new BMIData(weight, height);
        controller.processBMI(data);

        System.out.printf(Locale.US, "BMI Number: %.2f\n", data.getBmiScore());
        System.out.println("BMI Status: " + data.getStatus().name());
    }

    /**
     * Displays program termination message.
     */
    public void displayExitMessage() {
        System.out.println("Goodbye!");
    }
}
