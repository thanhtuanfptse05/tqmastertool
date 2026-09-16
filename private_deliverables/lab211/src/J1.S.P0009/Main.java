package fibonacci;

/**
 * Main application entry point for J1.S.P0009 (Fibonacci).
 */
public class Main {

    public static void main(String[] args) {
        Fibonacci fibonacci = new Fibonacci(45);
        System.out.println("The 45 sequence fibonacci:");
        System.out.println(fibonacci.getSequenceString());
    }
}
