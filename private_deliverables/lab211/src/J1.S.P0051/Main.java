package calculator;

import calculator.controller.CalculatorController;
import calculator.view.CalculatorView;
import calculator.controller.InputValidator;

/**
 * Main application entry point for J1.S.P0051 (Calculator Program).
 */
public class Main {

    /**
     * Program main method.
     *
     * @param args command line arguments
     */
    public static void main(String[] args) {
        CalculatorController controller = new CalculatorController();
        CalculatorView view = new CalculatorView(controller);

        while (true) {
            view.displayMainMenu();
            int choice = InputValidator.getMenuOption(1, 3);
            switch (choice) {
                case 1:
                    view.runNormalCalculator();
                    break;
                case 2:
                    view.runBMICalculator();
                    break;
                case 3:
                    view.displayExitMessage();
                    return;
                default:
                    break;
            }
            System.out.println();
        }
    }
}
