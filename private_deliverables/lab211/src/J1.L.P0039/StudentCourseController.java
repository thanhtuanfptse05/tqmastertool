package studentcourse.controller;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import studentcourse.model.Course;
import studentcourse.model.Student;

/**
 * Controller managing students and courses, business rules, and file persistence.
 */
public class StudentCourseController {

    public static final String STUDENT_FILE = "Students.txt";
    public static final String COURSE_FILE = "Courses.txt";
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("dd/MM/yyyy");

    static {
        DATE_FORMAT.setLenient(false);
    }

    private final List<Student> studentList = new ArrayList<Student>();
    private final List<Course> courseList = new ArrayList<Course>();
    private boolean hasChanges = false;

    public List<Student> getStudentList() {
        return studentList;
    }

    public List<Course> getCourseList() {
        return courseList;
    }

    public boolean hasChanges() {
        return hasChanges;
    }

    public void setHasChanges(boolean hasChanges) {
        this.hasChanges = hasChanges;
    }

    /**
     * Checks if a student ID already exists.
     *
     * @param id student ID
     * @return true if exists
     */
    public boolean containsStudent(String id) {
        return findStudent(id) != null;
    }

    /**
     * Finds a student by ID.
     *
     * @param id student ID
     * @return Student or null
     */
    public Student findStudent(String id) {
        for (Student s : studentList) {
            if (s.getStudentId().equalsIgnoreCase(id)) {
                return s;
            }
        }
        return null;
    }

    /**
     * Adds a new student.
     *
     * @param student student to add
     * @return true if added
     */
    public boolean addStudent(Student student) {
        if (student == null || containsStudent(student.getStudentId())) {
            return false;
        }
        studentList.add(student);
        hasChanges = true;
        return true;
    }

    /**
     * Updates student GPA.
     *
     * @param id     student ID
     * @param newGpa new GPA [0.0 - 4.0]
     * @return true if updated
     */
    public boolean updateStudentGpa(String id, double newGpa) {
        Student s = findStudent(id);
        if (s == null) {
            return false;
        }
        s.setGpa(newGpa);
        hasChanges = true;
        return true;
    }

    /**
     * Finds all students matching a major (case-insensitive).
     *
     * @param major major name
     * @return list of matching students
     */
    public List<Student> getStudentsByMajor(String major) {
        List<Student> result = new ArrayList<Student>();
        String query = major.toLowerCase().trim();
        for (Student s : studentList) {
            if (s.getMajor().toLowerCase().contains(query)) {
                result.add(s);
            }
        }
        return result;
    }

    /**
     * Checks if a course ID already exists.
     *
     * @param courseId course ID
     * @return true if exists
     */
    public boolean containsCourse(String courseId) {
        return findCourse(courseId) != null;
    }

    /**
     * Finds a course by ID.
     *
     * @param courseId course ID
     * @return Course or null
     */
    public Course findCourse(String courseId) {
        for (Course c : courseList) {
            if (c.getCourseId().equalsIgnoreCase(courseId)) {
                return c;
            }
        }
        return null;
    }

    /**
     * Adds a new course.
     *
     * @param course course to add
     * @return true if added
     */
    public boolean addCourse(Course course) {
        if (course == null || containsCourse(course.getCourseId())) {
            return false;
        }
        if (!containsStudent(course.getStudentId())) {
            return false;
        }
        courseList.add(course);
        hasChanges = true;
        return true;
    }

    /**
     * Gets all courses registered to a student.
     *
     * @param studentId student ID
     * @return list of courses
     */
    public List<Course> getCoursesByStudent(String studentId) {
        List<Course> result = new ArrayList<Course>();
        for (Course c : courseList) {
            if (c.getStudentId().equalsIgnoreCase(studentId)) {
                result.add(c);
            }
        }
        return result;
    }

    /**
     * Calculates total study duration (in weeks) for a student.
     *
     * @param studentId student ID
     * @return total weeks
     */
    public int calculateTotalDuration(String studentId) {
        int total = 0;
        for (Course c : courseList) {
            if (c.getStudentId().equalsIgnoreCase(studentId)) {
                total += c.getDurationWeeks();
            }
        }
        return total;
    }

    /**
     * Removes a student by ID.
     *
     * @param studentId student ID
     * @return 1 if removed, 0 if not exist, -1 if student is assigned to courses
     */
    public int removeStudent(String studentId) {
        Student s = findStudent(studentId);
        if (s == null) {
            return 0; // Not exist
        }
        List<Course> assignedCourses = getCoursesByStudent(studentId);
        if (!assignedCourses.isEmpty()) {
            return -1; // Cannot delete: Student is assigned to Courses.
        }
        studentList.remove(s);
        hasChanges = true;
        return 1; // Removed successfully
    }

    /**
     * Returns student list sorted by GPA in ascending order.
     *
     * @return sorted list
     */
    public List<Student> getStudentsSortedByGpaAsc() {
        List<Student> list = new ArrayList<Student>(studentList);
        Collections.sort(list, new Comparator<Student>() {
            @Override
            public int compare(Student o1, Student o2) {
                return Double.compare(o1.getGpa(), o2.getGpa());
            }
        });
        return list;
    }

    /**
     * Loads student and course data from text files.
     *
     * @throws IOException on I/O error
     */
    public void loadData() throws IOException {
        loadStudentsFromFile(STUDENT_FILE);
        loadCoursesFromFile(COURSE_FILE);
        hasChanges = false;
    }

    private void loadStudentsFromFile(String fileName) throws IOException {
        File file = new File(fileName);
        if (!file.exists()) {
            return;
        }
        studentList.clear();
        BufferedReader br = null;
        try {
            br = new BufferedReader(new InputStreamReader(new FileInputStream(file), "UTF-8"));
            String line;
            while ((line = br.readLine()) != null) {
                Student s = parseStudentLine(line);
                if (s != null) {
                    studentList.add(s);
                }
            }
        } finally {
            if (br != null) {
                try {
                    br.close();
                } catch (IOException ignored) {
                }
            }
        }
    }

    private Student parseStudentLine(String line) {
        line = line.trim();
        if (line.isEmpty()) {
            return null;
        }
        String[] tokens = line.split(",");
        if (tokens.length >= 4) {
            String id = tokens[0].trim();
            String name = tokens[1].trim();
            String major = tokens[2].trim();
            try {
                double gpa = Double.parseDouble(tokens[3].trim());
                return new Student(id, name, major, gpa);
            } catch (NumberFormatException ignored) {
            }
        }
        return null;
    }

    private void loadCoursesFromFile(String fileName) throws IOException {
        File file = new File(fileName);
        if (!file.exists()) {
            return;
        }
        courseList.clear();
        BufferedReader br = null;
        try {
            br = new BufferedReader(new InputStreamReader(new FileInputStream(file), "UTF-8"));
            String line;
            while ((line = br.readLine()) != null) {
                Course c = parseCourseLine(line);
                if (c != null) {
                    courseList.add(c);
                }
            }
        } finally {
            if (br != null) {
                try {
                    br.close();
                } catch (IOException ignored) {
                }
            }
        }
    }

    private Course parseCourseLine(String line) {
        line = line.trim();
        if (line.isEmpty()) {
            return null;
        }
        String[] tokens = line.split(",");
        if (tokens.length >= 5) {
            String courseId = tokens[0].trim();
            String studentId = tokens[1].trim();
            String courseName = tokens[2].trim();
            try {
                int duration = Integer.parseInt(tokens[3].trim());
                Date startDate = DATE_FORMAT.parse(tokens[4].trim());
                return new Course(courseId, studentId, courseName, duration, startDate);
            } catch (Exception ignored) {
            }
        }
        return null;
    }

    /**
     * Saves students and courses to text files.
     *
     * @throws IOException on I/O error
     */
    public void saveData() throws IOException {
        saveStudentsToFile(STUDENT_FILE);
        saveCoursesToFile(COURSE_FILE);
        hasChanges = false;
    }

    private void saveStudentsToFile(String fileName) throws IOException {
        BufferedWriter bw = null;
        try {
            bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(fileName), "UTF-8"));
            for (Student s : studentList) {
                bw.write(String.format("%s, %s, %s, %.1f\n",
                        s.getStudentId(), s.getFullName(), s.getMajor(), s.getGpa()));
            }
        } finally {
            if (bw != null) {
                try {
                    bw.close();
                } catch (IOException ignored) {
                }
            }
        }
    }

    private void saveCoursesToFile(String fileName) throws IOException {
        BufferedWriter bw = null;
        try {
            bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(fileName), "UTF-8"));
            for (Course c : courseList) {
                bw.write(String.format("%s, %s, %s, %d, %s\n",
                        c.getCourseId(), c.getStudentId(), c.getCourseName(),
                        c.getDurationWeeks(), c.getFormattedStartDate()));
            }
        } finally {
            if (bw != null) {
                try {
                    bw.close();
                } catch (IOException ignored) {
                }
            }
        }
    }
}
