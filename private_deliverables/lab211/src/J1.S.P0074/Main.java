package matrix;

import matrix.controller.MatrixController;
import matrix.model.Matrix;
import matrix.controller.InputValidator;
import matrix.view.MatrixView;

/**
 * Main application entry point for J1.S.P0074 (Matrix Calculator Program).
 */
public class Main {

    /**
     * Program main method.
     *
     * @param args command line arguments
     */
    public static void main(String[] args) {
        MatrixController controller = new MatrixController();
        MatrixView view = new MatrixView();

        while (true) {
            view.displayMenu();
            int choice = InputValidator.getMenuChoice(1, 4);

            switch (choice) {
                case 1:
                    runAddition(controller, view);
                    break;
                case 2:
                    runSubtraction(controller, view);
                    break;
                case 3:
                    runMultiplication(controller, view);
                    break;
                case 4:
                    System.out.println("Goodbye!");
                    return;
                default:
                    break;
            }
            System.out.println();
        }
    }

    private static void runAddition(MatrixController controller, MatrixView view) {
        System.out.println("-------- Addition --------");
        Matrix m1 = view.inputMatrix(1, -1, -1);
        Matrix m2 = view.inputMatrix(2, m1.getRows(), m1.getCols());
        Matrix result = controller.add(m1, m2);
        view.printResult(m1, m2, result, "+");
    }

    private static void runSubtraction(MatrixController controller, MatrixView view) {
        System.out.println("-------- Subtraction --------");
        Matrix m1 = view.inputMatrix(1, -1, -1);
        Matrix m2 = view.inputMatrix(2, m1.getRows(), m1.getCols());
        Matrix result = controller.subtract(m1, m2);
        view.printResult(m1, m2, result, "-");
    }

    private static void runMultiplication(MatrixController controller, MatrixView view) {
        System.out.println("-------- Multiplication --------");
        Matrix m1 = view.inputMatrix(1, -1, -1);
        Matrix m2 = view.inputMatrix(2, m1.getCols(), -1);
        Matrix result = controller.multiply(m1, m2);
        view.printResult(m1, m2, result, "*");
    }
}
