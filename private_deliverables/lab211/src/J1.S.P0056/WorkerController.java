package worker.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import worker.model.SalaryHistory;
import worker.model.SalaryStatus;
import worker.model.Worker;

/**
 * Controller class managing Worker operations:
 * adding workers, adjusting salaries, and tracking salary history.
 */
public class WorkerController {

    private final List<Worker> workerList;
    private final List<SalaryHistory> salaryHistoryList;
    private final SimpleDateFormat dateFormat;

    /**
     * Default constructor.
     */
    public WorkerController() {
        this.workerList = new ArrayList<Worker>();
        this.salaryHistoryList = new ArrayList<SalaryHistory>();
        this.dateFormat = new SimpleDateFormat("dd/MM/yyyy");
    }

    /**
     * Adds a new worker to the database.
     *
     * @param worker worker information
     * @return true if successfully added
     * @throws Exception if worker is null or code is duplicated
     */
    public boolean addWorker(Worker worker) throws Exception {
        if (worker == null) {
            throw new IllegalArgumentException("Worker cannot be null.");
        }
        if (findWorkerByCode(worker.getId()) != null) {
            throw new Exception("Worker code " + worker.getId() + " already exists.");
        }
        return workerList.add(worker);
    }

    /**
     * Changes the salary of a worker (UP or DOWN) and records the event in history.
     *
     * @param status UP or DOWN
     * @param code worker code
     * @param amount amount to increase/decrease
     * @return true if adjusted successfully
     * @throws Exception if worker not found or amount invalid
     */
    public boolean changeSalary(SalaryStatus status, String code, double amount) throws Exception {
        Worker worker = findWorkerByCode(code);
        if (worker == null) {
            throw new Exception("Worker with code " + code + " not found.");
        }
        if (amount <= 0) {
            throw new Exception("Amount of money must be > 0.");
        }

        double newSalary;
        if (status == SalaryStatus.UP) {
            newSalary = worker.getSalary() + amount;
        } else {
            if (worker.getSalary() <= amount) {
                throw new Exception("Cannot cut salary by an amount greater than or equal to current salary.");
            }
            newSalary = worker.getSalary() - amount;
        }

        worker.setSalary(newSalary);
        String currentDate = dateFormat.format(new Date());

        SalaryHistory history = new SalaryHistory(
                worker.getId(),
                worker.getName(),
                worker.getAge(),
                newSalary,
                status,
                currentDate
        );
        salaryHistoryList.add(history);
        return true;
    }

    /**
     * Retrieves all salary adjustment history records sorted ascending by worker code.
     *
     * @return sorted list of SalaryHistory
     */
    public List<SalaryHistory> getInfomationSalary() {
        List<SalaryHistory> sortedList = new ArrayList<SalaryHistory>(salaryHistoryList);
        Collections.sort(sortedList);
        return sortedList;
    }

    /**
     * Finds worker by code.
     *
     * @param code worker code
     * @return Worker or null if not found
     */
    public Worker findWorkerByCode(String code) {
        if (code == null) {
            return null;
        }
        for (Worker w : workerList) {
            if (code.equalsIgnoreCase(w.getId().trim())) {
                return w;
            }
        }
        return null;
    }
}
