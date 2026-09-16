package matrix.controller;

import matrix.model.Matrix;

/**
 * Controller class executing matrix arithmetic operations:
 * addition, subtraction, and multiplication.
 */
public class MatrixController {

    /**
     * Adds two matrices. Both matrices must have the exact same dimensions.
     *
     * @param matrix1 first matrix
     * @param matrix2 second matrix
     * @return sum matrix result
     * @throws IllegalArgumentException if dimensions do not match
     */
    public int[][] additionMatrix(int[][] matrix1, int[][] matrix2) {
        validateSameDimensions(matrix1, matrix2);
        int rows = matrix1.length;
        int cols = matrix1[0].length;
        int[][] result = new int[rows][cols];

        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                result[i][j] = matrix1[i][j] + matrix2[i][j];
            }
        }
        return result;
    }

    /**
     * Subtracts the second matrix from the first matrix.
     *
     * @param matrix1 first matrix
     * @param matrix2 second matrix
     * @return difference matrix result
     * @throws IllegalArgumentException if dimensions do not match
     */
    public int[][] subtractionMatrix(int[][] matrix1, int[][] matrix2) {
        validateSameDimensions(matrix1, matrix2);
        int rows = matrix1.length;
        int cols = matrix1[0].length;
        int[][] result = new int[rows][cols];

        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                result[i][j] = matrix1[i][j] - matrix2[i][j];
            }
        }
        return result;
    }

    /**
     * Multiplies two matrices. Columns of matrix1 must equal rows of matrix2.
     *
     * @param matrix1 first matrix
     * @param matrix2 second matrix
     * @return product matrix result
     * @throws IllegalArgumentException if matrix1 cols != matrix2 rows
     */
    public int[][] multiplicationMatrix(int[][] matrix1, int[][] matrix2) {
        if (matrix1 == null || matrix2 == null || matrix1.length == 0 || matrix2.length == 0) {
            throw new IllegalArgumentException("Matrices cannot be null or empty.");
        }
        int r1 = matrix1.length;
        int c1 = matrix1[0].length;
        int r2 = matrix2.length;
        int c2 = matrix2[0].length;

        if (c1 != r2) {
            throw new IllegalArgumentException("Matrix multiplication dimension mismatch: matrix1 columns must equal matrix2 rows.");
        }

        int[][] result = new int[r1][c2];
        for (int i = 0; i < r1; i++) {
            for (int j = 0; j < c2; j++) {
                int sum = 0;
                for (int k = 0; k < c1; k++) {
                    sum += matrix1[i][k] * matrix2[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }

    /**
     * Wrapper method to add two Matrix models.
     *
     * @param m1 first matrix
     * @param m2 second matrix
     * @return sum Matrix
     */
    public Matrix add(Matrix m1, Matrix m2) {
        return new Matrix(additionMatrix(m1.getData(), m2.getData()));
    }

    /**
     * Wrapper method to subtract two Matrix models.
     *
     * @param m1 first matrix
     * @param m2 second matrix
     * @return difference Matrix
     */
    public Matrix subtract(Matrix m1, Matrix m2) {
        return new Matrix(subtractionMatrix(m1.getData(), m2.getData()));
    }

    /**
     * Wrapper method to multiply two Matrix models.
     *
     * @param m1 first matrix
     * @param m2 second matrix
     * @return product Matrix
     */
    public Matrix multiply(Matrix m1, Matrix m2) {
        return new Matrix(multiplicationMatrix(m1.getData(), m2.getData()));
    }

    private void validateSameDimensions(int[][] m1, int[][] m2) {
        if (m1 == null || m2 == null || m1.length == 0 || m2.length == 0) {
            throw new IllegalArgumentException("Matrices cannot be null or empty.");
        }
        if (m1.length != m2.length || m1[0].length != m2[0].length) {
            throw new IllegalArgumentException("Both matrices must have the same number of rows and columns.");
        }
    }
}
