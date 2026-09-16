package worker.model;

/**
 * Model class recording a history event of worker salary adjustment.
 * Implements Comparable to enable sorting by worker ID.
 */
public class SalaryHistory implements Comparable<SalaryHistory> {

    private String id;
    private String name;
    private int age;
    private double salary;
    private SalaryStatus status;
    private String date;

    /**
     * Default constructor.
     */
    public SalaryHistory() {
    }

    /**
     * Parameterized constructor.
     *
     * @param id worker code
     * @param name worker name
     * @param age worker age
     * @param salary adjusted salary
     * @param status adjustment type (UP or DOWN)
     * @param date formatted date string (dd/MM/yyyy)
     */
    public SalaryHistory(String id, String name, int age, double salary, SalaryStatus status, String date) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.salary = salary;
        this.status = status;
        this.date = date;
    }

    /**
     * Gets worker id.
     *
     * @return id
     */
    public String getId() {
        return id;
    }

    /**
     * Sets worker id.
     *
     * @param id id
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * Gets worker name.
     *
     * @return name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets worker name.
     *
     * @param name name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets age.
     *
     * @return age
     */
    public int getAge() {
        return age;
    }

    /**
     * Sets age.
     *
     * @param age age
     */
    public void setAge(int age) {
        this.age = age;
    }

    /**
     * Gets adjusted salary.
     *
     * @return salary
     */
    public double getSalary() {
        return salary;
    }

    /**
     * Sets adjusted salary.
     *
     * @param salary salary
     */
    public void setSalary(double salary) {
        this.salary = salary;
    }

    /**
     * Gets adjustment status.
     *
     * @return status (UP or DOWN)
     */
    public SalaryStatus getStatus() {
        return status;
    }

    /**
     * Sets adjustment status.
     *
     * @param status status
     */
    public void setStatus(SalaryStatus status) {
        this.status = status;
    }

    /**
     * Gets adjustment date.
     *
     * @return date string
     */
    public String getDate() {
        return date;
    }

    /**
     * Sets adjustment date.
     *
     * @param date date string
     */
    public void setDate(String date) {
        this.date = date;
    }

    @Override
    public int compareTo(SalaryHistory other) {
        if (other == null || other.id == null) {
            return 1;
        }
        if (this.id == null) {
            return -1;
        }
        return this.id.compareTo(other.id);
    }
}
