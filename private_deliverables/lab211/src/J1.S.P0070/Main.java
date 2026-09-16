package ebank;

import ebank.controller.EbankController;
import ebank.view.EbankView;
import java.util.Locale;

/**
 * Main application entry point for J1.S.P0070 (Tien Phong Bank's Ebank Login System).
 */
public class Main {

    /**
     * Program main method.
     *
     * @param args command line arguments
     */
    public static void main(String[] args) {
        EbankController controller = new EbankController();
        EbankView view = new EbankView(controller);

        while (true) {
            view.displayMenu();
            int choice = view.getMenuChoice();
            switch (choice) {
                case 1:
                    controller.setLocate(new Locale("vi", "VN"));
                    view.performLogin();
                    break;
                case 2:
                    controller.setLocate(new Locale("en", "US"));
                    view.performLogin();
                    break;
                case 3:
                    System.out.println("Goodbye!");
                    return;
                default:
                    break;
            }
        }
    }
}
