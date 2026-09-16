package convertbase.model;

/**
 * Model class representing a number in a specific base system.
 * Contains original base, target base, input value, and converted output value.
 */
public class BaseNumber {

    private int inBase;
    private int outBase;
    private String inValue;
    private String outValue;

    /**
     * Default constructor.
     */
    public BaseNumber() {
    }

    /**
     * Parameterized constructor.
     *
     * @param inBase the input base system (2, 10, or 16)
     * @param outBase the output base system (2, 10, or 16)
     * @param inValue the input value string
     */
    public BaseNumber(int inBase, int outBase, String inValue) {
        this.inBase = inBase;
        this.outBase = outBase;
        this.inValue = inValue;
    }

    /**
     * Gets the input base system.
     *
     * @return the input base
     */
    public int getInBase() {
        return inBase;
    }

    /**
     * Sets the input base system.
     *
     * @param inBase the input base
     */
    public void setInBase(int inBase) {
        this.inBase = inBase;
    }

    /**
     * Gets the output base system.
     *
     * @return the output base
     */
    public int getOutBase() {
        return outBase;
    }

    /**
     * Sets the output base system.
     *
     * @param outBase the output base
     */
    public void setOutBase(int outBase) {
        this.outBase = outBase;
    }

    /**
     * Gets the input value.
     *
     * @return the input value string
     */
    public String getInValue() {
        return inValue;
    }

    /**
     * Sets the input value.
     *
     * @param inValue the input value string
     */
    public void setInValue(String inValue) {
        this.inValue = inValue;
    }

    /**
     * Gets the converted output value.
     *
     * @return the output value string
     */
    public String getOutValue() {
        return outValue;
    }

    /**
     * Sets the converted output value.
     *
     * @param outValue the output value string
     */
    public void setOutValue(String outValue) {
        this.outValue = outValue;
    }

    @Override
    public String toString() {
        return "BaseNumber{"
                + "inBase=" + inBase
                + ", outBase=" + outBase
                + ", inValue='" + inValue + '\''
                + ", outValue='" + outValue + '\''
                + '}';
    }
}
