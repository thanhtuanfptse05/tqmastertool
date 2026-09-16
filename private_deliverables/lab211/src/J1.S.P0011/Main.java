package convertbase;

import convertbase.controller.ConvertController;
import convertbase.model.BaseNumber;
import convertbase.view.ConvertView;
import convertbase.controller.InputValidator;

/**
 * Main application entry point for J1.S.P0011 (Change Base Number System).
 */
public class Main {

    /**
     * Program main method.
     *
     * @param args command line arguments
     */
    public static void main(String[] args) {
        ConvertView view = new ConvertView();
        ConvertController controller = new ConvertController();

        view.displayHeader();

        boolean keepRunning = true;
        while (keepRunning) {
            try {
                BaseNumber baseNumber = view.inputConversionData();
                controller.convert(baseNumber);
                view.displayResult(baseNumber);
            } catch (Exception e) {
                System.out.println("Error during conversion: " + e.getMessage());
            }

            keepRunning = InputValidator.checkContinue();
        }

        view.displayExitMessage();
    }
}
