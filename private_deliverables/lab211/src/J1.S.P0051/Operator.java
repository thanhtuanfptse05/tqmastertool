package calculator.model;

/**
 * Enum representing mathematical operators supported by the calculator.
 */
public enum Operator {
    ADD("+"),
    SUBTRACT("-"),
    MULTIPLY("*"),
    DIVIDE("/"),
    EXPONENT("^"),
    EQUAL("=");

    private final String symbol;

    Operator(String symbol) {
        this.symbol = symbol;
    }

    /**
     * Gets operator symbol string.
     *
     * @return symbol string (+, -, *, /, ^, =)
     */
    public String getSymbol() {
        return symbol;
    }

    /**
     * Finds an Operator enum constant by its symbol.
     *
     * @param symbol the operator character/string
     * @return matching Operator or null if not found
     */
    public static Operator fromSymbol(String symbol) {
        if (symbol == null) {
            return null;
        }
        for (Operator op : values()) {
            if (op.symbol.equals(symbol.trim())) {
                return op;
            }
        }
        return null;
    }
}
