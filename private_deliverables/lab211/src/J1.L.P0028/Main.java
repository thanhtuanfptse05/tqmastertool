package feastorder;

import feastorder.controller.FeastOrderController;
import feastorder.view.FeastOrderView;

/**
 * Application Entry Point for Traditional Feast Order Management.
 */
public class Main {

    public static void main(String[] args) {
        FeastOrderController controller = new FeastOrderController();
        FeastOrderView view = new FeastOrderView(controller);

        // Load menus from CSV
        controller.loadMenus(FeastOrderController.MENU_FILE);

        // Auto-load binary files if available
        try {
            controller.loadData();
        } catch (Exception ignored) {
        }

        boolean running = true;
        while (running) {
            int choice = view.displayMenu();
            switch (choice) {
                case 1:
                    view.handleRegisterCustomer();
                    break;
                case 2:
                    view.handleUpdateCustomer();
                    break;
                case 3:
                    view.handleSearchCustomer();
                    break;
                case 4:
                    view.handleDisplayFeastMenus();
                    break;
                case 5:
                    view.handlePlaceFeastOrder();
                    break;
                case 6:
                    view.handleUpdateOrder();
                    break;
                case 7:
                    view.handleSaveData();
                    break;
                case 8:
                    view.handleDisplayLists();
                    break;
                case 9:
                    if (view.handleQuit()) {
                        running = false;
                    }
                    break;
                default:
                    break;
            }
        }
    }
}
