package task.view;

import task.controller.InputValidator;
import task.controller.TaskController;
import task.model.Task;
import java.util.List;

/**
 * TaskView handles user interface and interactions for Task Management.
 */
public class TaskView {
    private TaskController taskController;

    public TaskView(TaskController taskController) {
        this.taskController = taskController;
    }

    /**
     * Displays main menu.
     */
    public void displayMenu() {
        System.out.println("========= Task program =========");
        System.out.println("1. Add Task");
        System.out.println("2. Delete task");
        System.out.println("3. Display Task");
        System.out.println("4. exit");
    }

    /**
     * Application execution loop.
     */
    public void run() {
        while (true) {
            displayMenu();
            int choice = InputValidator.getInt("Choose option: ", 1, 4);
            switch (choice) {
                case 1:
                    addTaskView();
                    break;
                case 2:
                    deleteTaskView();
                    break;
                case 3:
                    displayTasksView();
                    break;
                case 4:
                    System.out.println("Exiting program.");
                    return;
            }
            System.out.println();
        }
    }

    /**
     * View flow for adding a task.
     */
    private void addTaskView() {
        System.out.println("------------Add Task---------------");
        String requirementName = InputValidator.getString("Requirement Name: ");
        int taskType = InputValidator.getInt("Task Type: ", 1, 4);
        String date = InputValidator.getDate("Date: ");
        double planFrom = InputValidator.getPlanFrom("From: ");
        double planTo = InputValidator.getPlanTo("To: ", planFrom);
        String assignee = InputValidator.getString("Assignee: ");
        String reviewer = InputValidator.getString("Reviewer: ");

        try {
            int id = taskController.addTask(requirementName, assignee, reviewer,
                    String.valueOf(taskType), date, String.valueOf(planFrom), String.valueOf(planTo));
            System.out.println("Task added successfully with ID: " + id);
        } catch (Exception e) {
            System.out.println("Error adding task: " + e.getMessage());
        }
    }

    /**
     * View flow for deleting a task.
     */
    private void deleteTaskView() {
        System.out.println("---------Del Task------");
        int id = InputValidator.getPositiveInt("ID: ");
        try {
            taskController.deleteTask(String.valueOf(id));
            System.out.println("Delete task successfully!");
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    /**
     * Formats numeric time representation (e.g. 9.0 -> "9", 9.5 -> "9.5").
     */
    private String formatTime(double val) {
        if (val == (long) val) {
            return String.valueOf((long) val);
        } else {
            return String.valueOf(val);
        }
    }

    /**
     * View flow for displaying all tasks in tabular format.
     */
    private void displayTasksView() {
        List<Task> list = taskController.getDataTasks();
        if (list.isEmpty()) {
            System.out.println("No tasks found.");
            return;
        }

        System.out.println("----------------------------------------- Task ---------------------------------------");
        System.out.printf("%-5s %-15s %-12s %-12s %-6s %-6s %-10s %-10s\n",
                "ID", "Name", "Task Type", "Date", "From", "To", "Assignee", "Reviewer");

        for (Task task : list) {
            System.out.printf("%-5d %-15s %-12s %-12s %-6s %-6s %-10s %-10s\n",
                    task.getId(),
                    task.getRequirementName(),
                    task.getTaskTypeName(),
                    task.getDate(),
                    formatTime(task.getPlanFrom()),
                    formatTime(task.getPlanTo()),
                    task.getAssignee(),
                    task.getReviewer());
        }
    }
}
