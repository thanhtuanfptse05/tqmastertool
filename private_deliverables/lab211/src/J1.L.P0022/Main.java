package candidatemanagement;

import candidatemanagement.controller.CandidateController;
import candidatemanagement.view.CandidateView;

/**
 * Main entry point for the Candidate Management application.
 * Initializes MVC components and runs the main application loop.
 */
public class Main {

    /**
     * Application main method.
     *
     * @param args command-line arguments (not used)
     */
    public static void main(String[] args) {
        CandidateController controller = new CandidateController();
        CandidateView view = new CandidateView(controller);

        boolean running = true;
        while (running) {
            int choice = view.displayMenu();
            switch (choice) {
                case 1:
                    view.handleCreateExperience();
                    break;
                case 2:
                    view.handleCreateFresher();
                    break;
                case 3:
                    view.handleCreateIntern();
                    break;
                case 4:
                    view.handleSearch();
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
