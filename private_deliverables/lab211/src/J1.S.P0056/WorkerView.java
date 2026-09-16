package worker.view;

import java.util.List;
import java.util.Locale;
import worker.controller.InputValidator;
import worker.controller.WorkerController;
import worker.model.SalaryHistory;
import worker.model.SalaryStatus;
import worker.model.Worker;

/**
 * View class handling console UI and user interaction for Worker Management.
 */
public class WorkerView {

    private final WorkerController controller;

    /**
     * Parameterized constructor.
     *
     * @param controller the business controller
     */
    public WorkerView(WorkerController controller) {
        this.controller = controller;
    }

    /**
     * Displays main menu.
     */
    public void displayMenu() {
        System.out.println("======== Worker Management =========");
        System.out.println("1. Add Worker");
        System.out.println("2. Up salary");
        System.out.println("3. Down salary");
        System.out.println("4. Display Information salary");
        System.out.println("5. Exit");
    }

    /**
     * Handles adding a new worker.
     */
    public void runAddWorker() {
        System.out.println("--------- Add Worker ----------");
        String code = InputValidator.getNewWorkerCode("Enter Code: ", controller);
        String name = InputValidator.getNonEmptyString("Enter Name: ");
        int age = InputValidator.getAge("Enter Age: ");
        double salary = InputValidator.getSalary("Enter Salary: ");
        String location = InputValidator.getNonEmptyString("Enter work location: ");

        Worker worker = new Worker(code, name, age, salary, location);
        try {
            controller.addWorker(worker);
            System.out.println("Worker added successfully!");
        } catch (Exception e) {
            System.out.println("Error adding worker: " + e.getMessage());
        }
    }

    /**
     * Handles raising a worker's salary.
     */
    public void runUpSalary() {
        System.out.println("------- Up/Down Salary --------");
        String code = InputValidator.getExistingWorkerCode("Enter Code: ", controller);
        double amount = InputValidator.getAmount("Enter Salary: ");

        try {
            controller.changeSalary(SalaryStatus.UP, code, amount);
            System.out.println("Salary increased successfully!");
        } catch (Exception e) {
            System.out.println("Error increasing salary: " + e.getMessage());
        }
    }

    /**
     * Handles cutting a worker's salary.
     */
    public void runDownSalary() {
        System.out.println("------- Up/Down Salary --------");
        String code = InputValidator.getExistingWorkerCode("Enter Code: ", controller);
        double amount = InputValidator.getAmount("Enter Salary: ");

        try {
            controller.changeSalary(SalaryStatus.DOWN, code, amount);
            System.out.println("Salary decreased successfully!");
        } catch (Exception e) {
            System.out.println("Error decreasing salary: " + e.getMessage());
        }
    }

    /**
     * Displays all adjusted salary history in a formatted table.
     */
    public void displaySalaryHistory() {
        List<SalaryHistory> list = controller.getInfomationSalary();
        if (list.isEmpty()) {
            System.out.println("No salary adjustments recorded yet.");
            return;
        }

        System.out.println("--------------------Display Information Salary-----------------------");
        System.out.printf("%-8s %-12s %-6s %-10s %-8s %-12s\n", "Code", "Name", "Age", "Salary", "Status", "Date");
        for (SalaryHistory h : list) {
            System.out.printf(Locale.US, "%-8s %-12s %-6d %-10.0f %-8s %-12s\n",
                    h.getId(), h.getName(), h.getAge(), h.getSalary(), h.getStatus().name(), h.getDate());
        }
    }
}
