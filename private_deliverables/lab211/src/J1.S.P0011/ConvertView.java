package convertbase.view;

import convertbase.controller.InputValidator;
import convertbase.model.BaseNumber;

/**
 * View class responsible for displaying UI and interacting with user.
 */
public class ConvertView {

    /**
     * Displays the program header banner.
     */
    public void displayHeader() {
        System.out.println("=============================================");
        System.out.println("  CHANGE BASE NUMBER SYSTEM PROGRAM (2, 10, 16)");
        System.out.println("=============================================");
    }

    /**
     * Collects base and input value from the user and constructs a BaseNumber model.
     *
     * @return BaseNumber populated with inBase, outBase, and inValue
     */
    public BaseNumber inputConversionData() {
        System.out.println();
        int inBase = InputValidator.getBaseChoice("Choose the input base system:");
        int outBase = InputValidator.getBaseChoice("Choose the output base system:");
        String inValue = InputValidator.getBaseValue(inBase);

        return new BaseNumber(inBase, outBase, inValue);
    }

    /**
     * Displays the conversion result.
     *
     * @param baseNumber the BaseNumber containing input and output information
     */
    public void displayResult(BaseNumber baseNumber) {
        String inName = InputValidator.getBaseName(baseNumber.getInBase());
        String outName = InputValidator.getBaseName(baseNumber.getOutBase());

        System.out.println("---------------------------------------------");
        System.out.println("Input Value (" + inName + "): " + baseNumber.getInValue());
        System.out.println("Output Value (" + outName + "): " + baseNumber.getOutValue());
        System.out.println("---------------------------------------------");
    }

    /**
     * Displays exit message.
     */
    public void displayExitMessage() {
        System.out.println("Thank you for using the Change Base Program. Goodbye!");
    }
}
