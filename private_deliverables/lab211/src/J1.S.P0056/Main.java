package worker;

import worker.controller.InputValidator;
import worker.controller.WorkerController;
import worker.view.WorkerView;

/**
 * Main application entry point for J1.S.P0056 (Worker Management Program).
 */
public class Main {

    /**
     * Program main method.
     *
     * @param args command line arguments
     */
    public static void main(String[] args) {
        WorkerController controller = new WorkerController();
        WorkerView view = new WorkerView(controller);

        while (true) {
            view.displayMenu();
            int choice = InputValidator.getMenuOption("Please choose an option (1-5): ", 1, 5);

            switch (choice) {
                case 1:
                    view.runAddWorker();
                    break;
                case 2:
                    view.runUpSalary();
                    break;
                case 3:
                    view.runDownSalary();
                    break;
                case 4:
                    view.displaySalaryHistory();
                    break;
                case 5:
                    System.out.println("Goodbye!");
                    return;
                default:
                    break;
            }
            System.out.println();
        }
    }
}
