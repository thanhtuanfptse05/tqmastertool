package worker.model;

/**
 * Model class representing a Worker.
 */
public class Worker {

    private String id;
    private String name;
    private int age;
    private double salary;
    private String workLocation;

    /**
     * Default constructor.
     */
    public Worker() {
    }

    /**
     * Parameterized constructor.
     *
     * @param id worker id / code
     * @param name worker name
     * @param age worker age (18 - 50)
     * @param salary monthly salary (> 0)
     * @param workLocation workplace location
     */
    public Worker(String id, String name, int age, double salary, String workLocation) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.salary = salary;
        this.workLocation = workLocation;
    }

    /**
     * Gets worker id/code.
     *
     * @return id
     */
    public String getId() {
        return id;
    }

    /**
     * Sets worker id/code.
     *
     * @param id worker id
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
     * @param name worker name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets worker age.
     *
     * @return age
     */
    public int getAge() {
        return age;
    }

    /**
     * Sets worker age.
     *
     * @param age age (18 - 50)
     */
    public void setAge(int age) {
        this.age = age;
    }

    /**
     * Gets worker current salary.
     *
     * @return salary
     */
    public double getSalary() {
        return salary;
    }

    /**
     * Sets worker salary.
     *
     * @param salary salary (> 0)
     */
    public void setSalary(double salary) {
        this.salary = salary;
    }

    /**
     * Gets work location.
     *
     * @return workLocation
     */
    public String getWorkLocation() {
        return workLocation;
    }

    /**
     * Sets work location.
     *
     * @param workLocation work location
     */
    public void setWorkLocation(String workLocation) {
        this.workLocation = workLocation;
    }
}
