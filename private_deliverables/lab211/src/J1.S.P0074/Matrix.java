package matrix.model;

/**
 * Model class representing an integer 2D matrix.
 */
public class Matrix {

    private int rows;
    private int cols;
    private int[][] data;

    /**
     * Default constructor.
     */
    public Matrix() {
    }

    /**
     * Constructor initializing matrix with specified dimensions.
     *
     * @param rows number of rows
     * @param cols number of columns
     */
    public Matrix(int rows, int cols) {
        if (rows <= 0 || cols <= 0) {
            throw new IllegalArgumentException("Matrix dimensions must be greater than 0.");
        }
        this.rows = rows;
        this.cols = cols;
        this.data = new int[rows][cols];
    }

    /**
     * Constructor wrapping an existing 2D integer array.
     *
     * @param data 2D array of integers
     */
    public Matrix(int[][] data) {
        if (data == null || data.length == 0 || data[0].length == 0) {
            throw new IllegalArgumentException("Matrix data cannot be null or empty.");
        }
        this.rows = data.length;
        this.cols = data[0].length;
        this.data = data;
    }

    /**
     * Gets number of rows.
     *
     * @return rows
     */
    public int getRows() {
        return rows;
    }

    /**
     * Gets number of columns.
     *
     * @return columns
     */
    public int getCols() {
        return cols;
    }

    /**
     * Gets underlying 2D array.
     *
     * @return 2D integer array
     */
    public int[][] getData() {
        return data;
    }

    /**
     * Sets underlying 2D array.
     *
     * @param data 2D integer array
     */
    public void setData(int[][] data) {
        this.data = data;
        if (data != null && data.length > 0) {
            this.rows = data.length;
            this.cols = data[0].length;
        }
    }

    /**
     * Gets element at specified row and column (0-indexed).
     *
     * @param r row index
     * @param c column index
     * @return element value
     */
    public int get(int r, int c) {
        return data[r][c];
    }

    /**
     * Sets element at specified row and column (0-indexed).
     *
     * @param r row index
     * @param c column index
     * @param value element value
     */
    public void set(int r, int c, int value) {
        data[r][c] = value;
    }
}
