package fruit;

import fruit.controller.FruitController;
import fruit.controller.InputValidator;
import fruit.view.FruitView;

/**
 * Main application entry point for J1.L.P0023 (Fruit Shop Management Program).
 */
public class Main {

    /**
     * Program main method.
     *
     * @param args command line arguments
     */
    public static void main(String[] args) {
        FruitController controller = new FruitController();
        FruitView view = new FruitView(controller);

        while (true) {
            view.displayMenu();
            int choice = InputValidator.getMenuChoice("(Please choose 1 to create product, 2 to view order, 3 for shopping, 4 to Exit program): ", 1, 4);

            switch (choice) {
                case 1:
                    view.runCreateFruit();
                    break;
                case 2:
                    view.viewOrders();
                    break;
                case 3:
                    view.runShopping();
                    break;
                case 4:
                    System.out.println("Goodbye!");
                    return;
                default:
                    break;
            }
            System.out.println();
        }
    }
}
