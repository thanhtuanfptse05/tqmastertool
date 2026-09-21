package studentcourse.model;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Model class representing a Course entity.
 * Only manages data, state, constructor, and getter/setter methods.
 */
public class Course {

    private String courseId;
    private String studentId;
    private String courseName;
    private int durationWeeks;
    private Date startDate;

    /**
     * Default constructor.
     */
    public Course() {
    }

    /**
     * Parameterized constructor.
     *
     * @param courseId      unique course ID
     * @param studentId     assigned student ID
     * @param courseName    course name
     * @param durationWeeks duration in weeks (>= 1)
     * @param startDate     future start date
     */
    public Course(String courseId, String studentId, String courseName, int durationWeeks, Date startDate) {
        this.courseId = courseId;
        this.studentId = studentId;
        this.courseName = courseName;
        this.durationWeeks = durationWeeks;
        this.startDate = startDate;
    }

    /**
     * Gets course ID.
     *
     * @return course ID
     */
    public String getCourseId() {
        return courseId;
    }

    /**
     * Sets course ID.
     *
     * @param courseId course ID
     */
    public void setCourseId(String courseId) {
        this.courseId = courseId;
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
     * Gets course name.
     *
     * @return course name
     */
    public String getCourseName() {
        return courseName;
    }

    /**
     * Sets course name.
     *
     * @param courseName course name
     */
    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    /**
     * Gets duration in weeks.
     *
     * @return duration in weeks
     */
    public int getDurationWeeks() {
        return durationWeeks;
    }

    /**
     * Sets duration in weeks.
     *
     * @param durationWeeks duration in weeks
     */
    public void setDurationWeeks(int durationWeeks) {
        this.durationWeeks = durationWeeks;
    }

    /**
     * Gets start date.
     *
     * @return start date
     */
    public Date getStartDate() {
        return startDate;
    }

    /**
     * Sets start date.
     *
     * @param startDate start date
     */
    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    /**
     * Formats start date as dd/MM/yyyy.
     *
     * @return formatted date string
     */
    public String getFormattedStartDate() {
        if (startDate == null) {
            return "";
        }
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        return sdf.format(startDate);
    }

    @Override
    public String toString() {
        return String.format("%s, %s, %s, %d, %s", courseId, studentId, courseName, durationWeeks, getFormattedStartDate());
    }
}
