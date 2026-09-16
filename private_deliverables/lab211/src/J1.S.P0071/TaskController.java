package task.controller;

import task.model.Task;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Controller handling task business operations:
 * addTask, deleteTask, getDataTasks.
 */
public class TaskController {
    private List<Task> tasks;
    private static final String DATE_FORMAT = "dd-MM-yyyy";

    public TaskController() {
        this.tasks = new ArrayList<Task>();
    }

    /**
     * Adds a new task according to the exact specification guidelines.
     *
     * @param requirementName Name of requirement
     * @param assignee Assignee name
     * @param reviewer Reviewer name
     * @param taskTypeID Task type ID (1: Code, 2: Test, 3: Design, 4: Review)
     * @param date Date formatted as dd-MM-yyyy
     * @param planFrom Plan From time (8.0 - 17.5)
     * @param planTo Plan To time (planFrom < planTo <= 17.5)
     * @return generated ID of the task
     * @throws Exception if any parameter is invalid
     */
    public int addTask(String requirementName, String assignee, String reviewer, String taskTypeID, String date, String planFrom, String planTo) throws Exception {
        if (requirementName == null || requirementName.trim().isEmpty()) {
            throw new Exception("Requirement name cannot be empty.");
        }
        if (assignee == null || assignee.trim().isEmpty()) {
            throw new Exception("Assignee cannot be empty.");
        }
        if (reviewer == null || reviewer.trim().isEmpty()) {
            throw new Exception("Reviewer cannot be empty.");
        }

        int typeId;
        try {
            typeId = Integer.parseInt(taskTypeID.trim());
            if (typeId < 1 || typeId > 4) {
                throw new Exception("Task type ID must be between 1 and 4.");
            }
        } catch (NumberFormatException e) {
            throw new Exception("Invalid task type ID format.");
        }

        SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT);
        sdf.setLenient(false);
        try {
            Date parsedDate = sdf.parse(date.trim());
            date = sdf.format(parsedDate);
        } catch (ParseException e) {
            throw new Exception("Invalid date or date format. Must be dd-MM-yyyy.");
        }

        double from;
        double to;
        try {
            from = Double.parseDouble(planFrom.trim());
            to = Double.parseDouble(planTo.trim());
        } catch (NumberFormatException e) {
            throw new Exception("Plan From and Plan To must be valid numbers.");
        }

        if (from < 8.0 || from > 17.5) {
            throw new Exception("Plan From must be within 8.0 to 17.5.");
        }
        if (to <= from || to > 17.5) {
            throw new Exception("Plan To must be greater than Plan From and <= 17.5.");
        }

        int newId = tasks.isEmpty() ? 1 : tasks.get(tasks.size() - 1).getId() + 1;
        Task task = new Task(newId, typeId, requirementName.trim(), date, from, to, assignee.trim(), reviewer.trim());
        tasks.add(task);
        return newId;
    }

    /**
     * Strongly typed helper method.
     */
    public int addTask(String requirementName, int taskTypeId, String date, double planFrom, double planTo, String assignee, String reviewer) throws Exception {
        return addTask(requirementName, assignee, reviewer, String.valueOf(taskTypeId), date, String.valueOf(planFrom), String.valueOf(planTo));
    }

    /**
     * Deletes a task by ID.
     *
     * @param id String representation of task ID
     * @throws Exception if ID is invalid or task is not found
     */
    public void deleteTask(String id) throws Exception {
        if (id == null || id.trim().isEmpty()) {
            throw new Exception("ID cannot be empty.");
        }
        int taskId;
        try {
            taskId = Integer.parseInt(id.trim());
        } catch (NumberFormatException e) {
            throw new Exception("ID must be an integer.");
        }

        int foundIndex = -1;
        for (int i = 0; i < tasks.size(); i++) {
            if (tasks.get(i).getId() == taskId) {
                foundIndex = i;
                break;
            }
        }

        if (foundIndex != -1) {
            tasks.remove(foundIndex);
        } else {
            throw new Exception("Task not found with ID: " + taskId);
        }
    }

    /**
     * Retrieves all tasks in the system.
     *
     * @return list of tasks
     */
    public List<Task> getDataTasks() {
        return tasks;
    }
}
