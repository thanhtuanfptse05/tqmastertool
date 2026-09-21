package studentcourse.model;

/**
 * Model class representing a Student entity.
 * Only manages data, state, constructor, and getter/setter methods.
 */
public class Student {

    private String studentId;
    private String fullName;
    private String major;
    private double gpa;

    /**
     * Default constructor.
     */
    public Student() {
    }

    /**
     * Parameterized constructor.
     *
     * @param studentId student ID (STU0000)
     * @param fullName  student full name
     * @param major     student major
     * @param gpa       student GPA (0.0 - 4.0)
     */
    public Student(String studentId, String fullName, String major, double gpa) {
        this.studentId = studentId;
        this.fullName = fullName;
        this.major = major;
        this.gpa = gpa;
    }

    /**
     * Gets student ID.
     *
     * @return student ID
     */
    public String getStudentId() {
        return studentId;
    }

    /**
     * Sets student ID.
     *
     * @param studentId student ID
     */
    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    /**
     * Gets student full name.
     *
     * @return full name
     */
    public String getFullName() {
        return fullName;
    }

    /**
     * Sets student full name.
     *
     * @param fullName full name
     */
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    /**
     * Gets student major.
     *
     * @return major
     */
    public String getMajor() {
        return major;
    }

    /**
     * Sets student major.
     *
     * @param major major
     */
    public void setMajor(String major) {
        this.major = major;
    }

    /**
     * Gets student GPA.
     *
     * @return GPA
     */
    public double getGpa() {
        return gpa;
    }

    /**
     * Sets student GPA.
     *
     * @param gpa GPA
     */
    public void setGpa(double gpa) {
        this.gpa = gpa;
    }

    @Override
    public String toString() {
        return String.format("%s, %s, %s, %.1f", studentId, fullName, major, gpa);
    }
}
