package studentmanagement.model;

/**
 * Model class representing a Student entity.
 * Contains only data attributes, constructors, getters and setters.
 */
public class Student {

    private String id;
    private String studentName;
    private int semester;
    private String courseName;

    /**
     * Default constructor.
     */
    public Student() {
    }

    /**
     * Parameterized constructor.
     *
     * @param id         student ID
     * @param studentName student name
     * @param semester   semester number
     * @param courseName course name (Java, .Net, C/C++)
     */
    public Student(String id, String studentName, int semester, String courseName) {
        this.id = id;
        this.studentName = studentName;
        this.semester = semester;
        this.courseName = courseName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public int getSemester() {
        return semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    @Override
    public String toString() {
        return String.format("%-10s | %-25s | %8d | %s",
                id, studentName, semester, courseName);
    }
}
