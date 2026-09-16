package fibonacci;

/**
 * Handles the calculation and formatting of the Fibonacci sequence using recursion.
 * Follows OOP design principles.
 */
public class Fibonacci {

    public static final int DEFAULT_TERMS = 45;
    private final int termCount;

    /**
     * Default constructor initializing with 45 terms.
     */
    public Fibonacci() {
        this(DEFAULT_TERMS);
    }

    /**
     * Parameterized constructor to specify the number of terms.
     *
     * @param termCount the number of Fibonacci terms to display
     */
    public Fibonacci(int termCount) {
        this.termCount = termCount;
    }

    /**
     * Finds the n-th Fibonacci number recursively according to the mathematical formula:
     * F(0) = 0
     * F(1) = 1
     * F(n) = F(n-1) + F(n-2) for n > 1
     *
     * Memoization is used to ensure linear time complexity O(N) while preserving recursion.
     *
     * @param n    the term index (0-based)
     * @param memo array storing previously computed values
     * @return the n-th Fibonacci number
     */
    public int findFibonacci(int n, int[] memo) {
        if (n == 0) {
            return 0;
        }
        if (n == 1) {
            return 1;
        }
        if (memo[n] != 0) {
            return memo[n];
        }
        memo[n] = findFibonacci(n - 1, memo) + findFibonacci(n - 2, memo);
        return memo[n];
    }

    /**
     * Generates and returns the formatted Fibonacci sequence.
     *
     * @return comma-separated sequence string
     */
    public String getSequenceString() {
        if (termCount <= 0) {
            return "";
        }

        int[] memo = new int[termCount];
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < termCount; i++) {
            int value = findFibonacci(i, memo);
            sb.append(value);
            if (i < termCount - 1) {
                sb.append(", ");
            }
        }
        return sb.toString();
    }

    public int getTermCount() {
        return termCount;
    }
}
