package task;

import task.controller.TaskController;
import task.view.TaskView;

/**
 * Entry point for J1.S.P0071 Task Management Program.
 */
public class Main {
    public static void main(String[] args) {
        TaskController controller = new TaskController();
        TaskView view = new TaskView(controller);
        view.run();
    }
}
