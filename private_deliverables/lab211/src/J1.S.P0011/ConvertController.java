package convertbase.controller;

import convertbase.model.BaseNumber;
import java.math.BigInteger;

/**
 * Controller class handling business logic for base conversion.
 * Supports converting between binary (2), decimal (10), and hexadecimal (16).
 */
public class ConvertController {

    /**
     * Converts the number stored in BaseNumber model from inBase to outBase.
     * Updates the outValue of the model.
     *
     * @param baseNumber the BaseNumber model object
     * @return the converted result string
     */
    public String convert(BaseNumber baseNumber) {
        String result = convert(baseNumber.getInValue(), baseNumber.getInBase(), baseNumber.getOutBase());
        baseNumber.setOutValue(result);
        return result;
    }

    /**
     * Converts a value string from input base to output base.
     *
     * @param value the input value string
     * @param inBase the source base (2, 10, or 16)
     * @param outBase the destination base (2, 10, or 16)
     * @return the converted value string in upper case
     */
    public String convert(String value, int inBase, int outBase) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("Input value cannot be empty.");
        }
        String cleanValue = value.trim();
        if (inBase == outBase) {
            return cleanValue.toUpperCase();
        }
        BigInteger decimalValue = toDecimal(cleanValue, inBase);
        return fromDecimal(decimalValue, outBase);
    }

    /**
     * Converts a value in a specified base to BigInteger decimal.
     *
     * @param value the value string
     * @param inBase the base of the value (2, 10, or 16)
     * @return the decimal BigInteger representation
     */
    public BigInteger toDecimal(String value, int inBase) {
        return new BigInteger(value, inBase);
    }

    /**
     * Converts a BigInteger decimal to the target base string.
     *
     * @param decimal the decimal value
     * @param outBase the target base (2, 10, or 16)
     * @return the representation in target base in uppercase
     */
    public String fromDecimal(BigInteger decimal, int outBase) {
        return decimal.toString(outBase).toUpperCase();
    }
}
