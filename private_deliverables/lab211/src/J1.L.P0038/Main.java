package carinsurance;

import carinsurance.controller.CarInsuranceController;
import carinsurance.view.CarInsuranceView;

/**
 * Application Entry Point for Car Insurance Management System.
 */
public class Main {

    /**
     * Main method.
     *
     * @param args command-line arguments
     */
    public static void main(String[] args) {
        CarInsuranceController controller = new CarInsuranceController();
        CarInsuranceView view = new CarInsuranceView(controller);

        // Attempt to auto-load existing data files if present
        try {
            controller.loadData();
        } catch (Exception ignored) {
        }

        boolean running = true;
        while (running) {
            int choice = view.displayMenu();
            switch (choice) {
                case 1:
                    view.handleAddCar();
                    break;
                case 2:
                    view.handleFindCar();
                    break;
                case 3:
                    view.handleUpdateCar();
                    break;
                case 4:
                    view.handleDeleteCar();
                    break;
                case 5:
                    view.handleAddInsurance();
                    break;
                case 6:
                    view.handleListInsuranceStatements();
                    break;
                case 7:
                    view.handleReportUninsuredCars();
                    break;
                case 8:
                    view.handleSaveData();
                    break;
                case 9:
                    view.handleLoadData();
                    break;
                case 10:
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
