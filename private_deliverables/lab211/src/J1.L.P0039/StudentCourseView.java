package studentcourse.view;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import studentcourse.controller.InputValidator;
import studentcourse.controller.StudentCourseController;
import studentcourse.model.Course;
import studentcourse.model.Student;

/**
 * View class handling console user interaction, menus, and table rendering
 * for Student and Short Course Management System.
 */
public class StudentCourseView {

    private final StudentCourseController controller;

    public StudentCourseView(StudentCourseController controller) {
        this.controller = controller;
    }

    /**
     * Displays main menu and returns user choice (1 - 12).
     *
     * @return selected option
     */
    public int displayMenu() {
        System.out.println("\n===== STUDENT AND SHORT COURSE MANAGEMENT =====");
        System.out.println("1- List all students");
        System.out.println("2- Add a new student");
        System.out.println("3- Search for a student by ID");
        System.out.println("4- Update a student by ID");
        System.out.println("5- List all students by major");
        System.out.println("6- Add a new course");
        System.out.println("7- List all courses by student (grouped)");
        System.out.println("8- Calculate total study duration by student ID");
        System.out.println("9- Remove a student by ID");
        System.out.println("10- Sort students by GPA");
        System.out.println("11- Save data to files");
        System.out.println("12- Quit program");
        return InputValidator.inputInteger("Please choose an option (1-12): ", 1, 12);
    }

    /**
     * Prints a formatted table of students.
     *
     * @param list list of students to print
     */
    public void printStudentTable(List<Student> list) {
        if (list == null || list.isEmpty()) {
            System.out.println("No students found.");
            return;
        }
        System.out.println("----------------------------------------------------------------------");
        System.out.printf("%-10s | %-24s | %-22s | %-5s\n", "ID", "Name", "Major", "GPA");
        System.out.println("----------------------------------------------------------------------");
        for (Student s : list) {
            System.out.printf("%-10s | %-24s | %-22s | %-5.1f\n",
                    s.getStudentId(), s.getFullName(), s.getMajor(), s.getGpa());
        }
        System.out.println("----------------------------------------------------------------------");
    }

    /**
     * Handles Function 1: List of all students.
     */
    public void handleListAllStudents() {
        System.out.println("\n--- List of all Students ---");
        printStudentTable(controller.getStudentList());
    }

    /**
     * Handles Function 2: Add a new student.
     */
    public void handleAddStudent() {
        System.out.println("\n--- Add a new Student ---");
        String id;
        while (true) {
            id = InputValidator.inputStudentId("Enter Student ID (STU0000): ");
            if (controller.containsStudent(id)) {
                System.out.println("Student ID already exists! Please enter a unique ID.");
                continue;
            }
            break;
        }

        String name = InputValidator.inputFullName("Enter Full Name (at least two words): ");
        String major = InputValidator.inputNonEmptyString("Enter Major: ");
        double gpa = InputValidator.inputGpa("Enter GPA (0.0 to 4.0): ");

        Student s = new Student(id, name, major, gpa);
        if (controller.addStudent(s)) {
            System.out.println("Student added successfully!");
        } else {
            System.out.println("Failed to add student.");
        }
    }

    /**
     * Handles Function 3: Search for a student by ID.
     */
    public void handleSearchStudent() {
        System.out.println("\n--- Search for a Student by ID ---");
        String id = InputValidator.inputNonEmptyString("Enter Student ID to search: ");
        Student s = controller.findStudent(id);
        if (s == null) {
            System.out.println("Student ID does not exist!");
        } else {
            System.out.println("Student Information Found:");
            System.out.println("--------------------------------------------------");
            System.out.printf("%-12s: %s\n", "Student ID", s.getStudentId());
            System.out.printf("%-12s: %s\n", "Full Name", s.getFullName());
            System.out.printf("%-12s: %s\n", "Major", s.getMajor());
            System.out.printf("%-12s: %.1f\n", "GPA", s.getGpa());
            System.out.println("--------------------------------------------------");
        }
    }

    /**
     * Handles Function 4: Update a student's GPA by ID.
     */
    public void handleUpdateGpa() {
        System.out.println("\n--- Update a Student's GPA by ID ---");
        String id = InputValidator.inputNonEmptyString("Enter Student ID: ");
        Student s = controller.findStudent(id);
        if (s == null) {
            System.out.println("Student ID does not exist!");
            return;
        }

        System.out.printf("Current GPA of student %s (%s) is: %.1f\n", s.getStudentId(), s.getFullName(), s.getGpa());
        double newGpa = InputValidator.inputGpa("Enter new GPA (0.0 to 4.0): ");

        if (controller.updateStudentGpa(id, newGpa)) {
            System.out.println("Student GPA updated successfully!");
        } else {
            System.out.println("Failed to update GPA.");
        }
    }

    /**
     * Handles Function 5: List all students by major.
     */
    public void handleListByMajor() {
        System.out.println("\n--- List all Students by Major ---");
        String major = InputValidator.inputNonEmptyString("Enter Major to filter (e.g., Software Engineering): ");
        List<Student> list = controller.getStudentsByMajor(major);
        if (list.isEmpty()) {
            System.out.println("No students found matching major: " + major);
        } else {
            System.out.println("Students matching major [" + major + "]:");
            printStudentTable(list);
        }
    }

    /**
     * Handles Function 6: Add a new course.
     * Requirement: Student ID must be selected from a menu of existing Students.
     */
    public void handleAddCourse() {
        System.out.println("\n--- Add a new Course ---");
        if (controller.getStudentList().isEmpty()) {
            System.out.println("Cannot add course: No students exist in the system yet. Please add students first.");
            return;
        }

        String courseId;
        while (true) {
            courseId = InputValidator.inputNonEmptyString("Enter Course ID (e.g., CSE201): ");
            if (controller.containsCourse(courseId)) {
                System.out.println("Course ID already exists! Please enter a unique Course ID.");
                continue;
            }
            break;
        }

        String studentId = selectStudentId(controller.getStudentList());
        String courseName = InputValidator.inputNonEmptyString("Enter Course Name: ");
        int duration = InputValidator.inputDurationWeeks("Enter Duration in weeks (>= 1): ");
        Date startDate = InputValidator.inputFutureDate("Enter Start Date (dd/MM/yyyy): ");

        Course course = new Course(courseId, studentId, courseName, duration, startDate);
        if (controller.addCourse(course)) {
            System.out.println("Course added successfully!");
        } else {
            System.out.println("Failed to add course.");
        }
    }

    private String selectStudentId(List<Student> students) {
        System.out.println("\nSelect a Student from the existing students list:");
        for (int i = 0; i < students.size(); i++) {
            Student st = students.get(i);
            System.out.printf("%d. %s - %s (%s)\n", (i + 1), st.getStudentId(), st.getFullName(), st.getMajor());
        }
        int studentChoice = InputValidator.inputInteger("Choose student (1-" + students.size() + "): ", 1, students.size());
        return students.get(studentChoice - 1).getStudentId();
    }

    /**
     * Handles Function 7: List all courses by student (grouped).
     */
    public void handleListCoursesByStudentGrouped() {
        System.out.println("\n--- List all Courses by Student (Grouped) ---");
        List<Student> students = controller.getStudentList();
        if (students.isEmpty()) {
            System.out.println("No students in the system.");
            return;
        }

        for (Student s : students) {
            System.out.println("======================================================================");
            System.out.printf("Student: %s - %s | Major: %s | GPA: %.1f\n",
                    s.getStudentId(), s.getFullName(), s.getMajor(), s.getGpa());
            List<Course> courses = controller.getCoursesByStudent(s.getStudentId());
            if (courses.isEmpty()) {
                System.out.println("  (No registered courses)");
            } else {
                System.out.println("  Assigned Courses:");
                System.out.printf("  %-10s | %-25s | %-15s | %-12s\n", "Course ID", "Course Name", "Duration", "Start Date");
                System.out.println("  --------------------------------------------------------------------");
                for (Course c : courses) {
                    System.out.printf("  %-10s | %-25s | %-2d weeks       | %-12s\n",
                            c.getCourseId(), c.getCourseName(), c.getDurationWeeks(), c.getFormattedStartDate());
                }
            }
        }
        System.out.println("======================================================================");
    }

    /**
     * Handles Function 8: Calculate total study duration by student ID.
     */
    public void handleCalculateTotalDuration() {
        System.out.println("\n--- Calculate Total Study Duration by Student ID ---");
        String id = InputValidator.inputNonEmptyString("Enter Student ID: ");
        Student s = controller.findStudent(id);
        if (s == null) {
            System.out.println("Student ID does not exist!");
            return;
        }

        int totalWeeks = controller.calculateTotalDuration(id);
        System.out.printf("Total duration spent by student %s (%s) on all registered courses: %d weeks.\n",
                s.getStudentId(), s.getFullName(), totalWeeks);
    }

    /**
     * Handles Function 9: Remove a student by ID.
     */
    public void handleRemoveStudent() {
        System.out.println("\n--- Remove a Student by ID ---");
        String id = InputValidator.inputNonEmptyString("Enter Student ID to remove: ");
        int res = controller.removeStudent(id);
        if (res == 0) {
            System.out.println("Student ID does not exist!");
        } else if (res == -1) {
            System.out.println("Cannot delete: Student is assigned to Courses.");
        } else {
            System.out.println("Student removed successfully!");
        }
    }

    /**
     * Handles Function 10: Sort students by GPA.
     */
    public void handleSortStudentsByGpa() {
        System.out.println("\n--- Students Sorted by GPA (Ascending) ---");
        List<Student> list = controller.getStudentsSortedByGpaAsc();
        printStudentTable(list);
    }

    /**
     * Handles Function 11: Save data to files.
     */
    public void handleSaveData() {
        try {
            controller.saveData();
            System.out.println("Successfully saved data to Students.txt and Courses.txt.");
        } catch (IOException e) {
            System.out.println("Failed to save data: " + e.getMessage());
        }
    }

    /**
     * Handles Function 12: Quit program.
     * Check for unsaved changes. If changes exist, prompt:
     * "Do you want to save the changes before exiting? (Y/N)"
     *
     * @return true if confirmed to quit
     */
    public boolean handleQuit() {
        if (controller.hasChanges()) {
            boolean save = InputValidator.inputYesNo("Do you want to save the changes before exiting? (Y/N): ");
            if (save) {
                handleSaveData();
            }
        }
        System.out.println("Exiting program. Goodbye!");
        return true;
    }
}
