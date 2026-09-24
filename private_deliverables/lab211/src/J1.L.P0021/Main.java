package studentmanagement;

import studentmanagement.controller.StudentController;
import studentmanagement.view.StudentView;

/**
 * Main entry point for the Student Management application.
 * Initializes MVC components and runs the main application loop.
 */
public class Main {

    /**
     * Application main method.
     *
     * @param args command-line arguments (not used)
     */
    public static void main(String[] args) {
        StudentController controller = new StudentController();
        StudentView view = new StudentView(controller);

        boolean running = true;
        while (running) {
            int choice = view.displayMenu();
            switch (choice) {
                case 1:
                    view.handleCreate();
                    break;
                case 2:
                    view.handleFindAndSort();
                    break;
                case 3:
                    view.handleUpdateDelete();
                    break;
                case 4:
                    view.handleReport();
                    break;
                case 5:
                    view.displayExit();
                    running = false;
                    break;
                default:
                    System.out.println("Invalid choice. Please select 1-5.");
            }
        }
    }
}
