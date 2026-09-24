package studentmanagement.controller;

import studentmanagement.model.Student;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * StudentController handles all business logic for student management.
 * Acts as the bridge between View and Model.
 */
public class StudentController {

    private List<Student> studentList;

    /**
     * Constructs a new StudentController with an empty student list.
     */
    public StudentController() {
        this.studentList = new ArrayList<Student>();
    }

    /**
     * Returns the number of students in the list.
     *
     * @return size of student list
     */
    public int getStudentCount() {
        return studentList.size();
    }

    /**
     * Checks whether a student ID already exists in the list.
     *
     * @param id the ID to check
     * @return true if ID is already taken
     */
    public boolean isIdDuplicate(String id) {
        for (Student s : studentList) {
            if (s.getId().equalsIgnoreCase(id)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Adds a new student to the list.
     *
     * @param student the Student object to add
     */
    public void addStudent(Student student) {
        studentList.add(student);
    }

    /**
     * Finds a student by exact ID (case-insensitive).
     *
     * @param id the ID to search
     * @return the Student if found, null otherwise
     */
    public Student findById(String id) {
        for (Student s : studentList) {
            if (s.getId().equalsIgnoreCase(id)) {
                return s;
            }
        }
        return null;
    }

    /**
     * Finds all students whose name contains the search keyword (case-insensitive).
     *
     * @param keyword part of or full student name
     * @return list of matching students sorted by name
     */
    public List<Student> findAndSortByName(String keyword) {
        List<Student> result = new ArrayList<Student>();
        for (Student s : studentList) {
            if (s.getStudentName().toLowerCase().contains(keyword.toLowerCase())) {
                result.add(s);
            }
        }
        Collections.sort(result, new Comparator<Student>() {
            @Override
            public int compare(Student s1, Student s2) {
                return s1.getStudentName().compareToIgnoreCase(s2.getStudentName());
            }
        });
        return result;
    }

    /**
     * Updates a student's information (name, semester, courseName).
     *
     * @param id          the ID of the student to update
     * @param newName     new student name
     * @param newSemester new semester number
     * @param newCourse   new course name
     * @return true if update succeeded, false if student not found
     */
    public boolean updateStudent(String id, String newName, int newSemester, String newCourse) {
        Student s = findById(id);
        if (s == null) {
            return false;
        }
        s.setStudentName(newName);
        s.setSemester(newSemester);
        s.setCourseName(newCourse);
        return true;
    }

    /**
     * Deletes a student by ID.
     *
     * @param id the ID of the student to delete
     * @return true if deletion succeeded, false if student not found
     */
    public boolean deleteStudent(String id) {
        Student s = findById(id);
        if (s == null) {
            return false;
        }
        studentList.remove(s);
        return true;
    }

    /**
     * Returns the full student list (unmodified).
     *
     * @return list of all students
     */
    public List<Student> getAllStudents() {
        return studentList;
    }

    /**
     * Builds a report grouping students by name+course,
     * counting how many times each student has a course.
     *
     * @return list of String arrays: [studentName, courseName, count]
     */
    public List<String[]> generateReport() {
        // Build grouped report: key = studentName + "|" + courseName -> count
        List<String[]> report = new ArrayList<String[]>();
        List<String> processedKeys = new ArrayList<String>();

        for (Student s : studentList) {
            String key = s.getStudentName() + "|" + s.getCourseName();
            if (!processedKeys.contains(key)) {
                processedKeys.add(key);
                int count = 0;
                for (Student other : studentList) {
                    if (other.getStudentName().equals(s.getStudentName())
                            && other.getCourseName().equals(s.getCourseName())) {
                        count++;
                    }
                }
                report.add(new String[]{s.getStudentName(), s.getCourseName(), String.valueOf(count)});
            }
        }

        // Sort report by student name
        Collections.sort(report, new Comparator<String[]>() {
            @Override
            public int compare(String[] a, String[] b) {
                return a[0].compareToIgnoreCase(b[0]);
            }
        });

        return report;
    }
}
