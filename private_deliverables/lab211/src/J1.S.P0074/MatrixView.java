package matrix.view;

import matrix.controller.InputValidator;
import matrix.model.Matrix;

/**
 * View class handling console UI and formatted matrix display.
 */
public class MatrixView {

    /**
     * Displays main menu.
     */
    public void displayMenu() {
        System.out.println("=======Calculator program======");
        System.out.println("1. Addition Matrix");
        System.out.println("2. Subtraction Matrix");
        System.out.println("3. Multiplication Matrix");
        System.out.println("4. Quit");
    }

    /**
     * Inputs matrix dimensions and element values.
     *
     * @param matrixNum matrix index (1 or 2)
     * @param expectedRows expected rows constraint (-1 if no constraint)
     * @param expectedCols expected cols constraint (-1 if no constraint)
     * @return populated Matrix object
     */
    public Matrix inputMatrix(int matrixNum, int expectedRows, int expectedCols) {
        int rows;
        if (expectedRows > 0) {
            while (true) {
                rows = InputValidator.getPositiveInt("Enter Row Matrix " + matrixNum + ": ");
                if (rows == expectedRows) {
                    break;
                }
                System.out.println("Row Matrix " + matrixNum + " must equal " + expectedRows + ".");
            }
        } else {
            rows = InputValidator.getPositiveInt("Enter Row Matrix " + matrixNum + ": ");
        }

        int cols;
        if (expectedCols > 0) {
            while (true) {
                cols = InputValidator.getPositiveInt("Enter Column Matrix " + matrixNum + ": ");
                if (cols == expectedCols) {
                    break;
                }
                System.out.println("Column Matrix " + matrixNum + " must equal " + expectedCols + ".");
            }
        } else {
            cols = InputValidator.getPositiveInt("Enter Column Matrix " + matrixNum + ": ");
        }

        Matrix matrix = new Matrix(rows, cols);
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                String prompt = String.format("Enter Matrix%d[%d][%d]: ", matrixNum, i + 1, j + 1);
                int val = InputValidator.getMatrixValue(prompt);
                matrix.set(i, j, val);
            }
        }
        return matrix;
    }

    /**
     * Prints a matrix in [val][val] format.
     *
     * @param matrix the matrix to print
     */
    public void printMatrix(Matrix matrix) {
        for (int i = 0; i < matrix.getRows(); i++) {
            for (int j = 0; j < matrix.getCols(); j++) {
                System.out.print("[" + matrix.get(i, j) + "]");
            }
            System.out.println();
        }
    }

    /**
     * Prints the full calculation result in standard assignment format.
     *
     * @param m1 first matrix
     * @param m2 second matrix
     * @param result result matrix
     * @param operator operation symbol (+, -, *)
     */
    public void printResult(Matrix m1, Matrix m2, Matrix result, String operator) {
        System.out.println("-------- Result --------");
        printMatrix(m1);
        System.out.println(operator);
        printMatrix(m2);
        System.out.println("=");
        printMatrix(result);
    }
}
