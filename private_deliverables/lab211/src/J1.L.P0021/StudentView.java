package studentmanagement.view;

import studentmanagement.controller.InputValidator;
import studentmanagement.controller.StudentController;
import studentmanagement.model.Student;

import java.util.List;

/**
 * StudentView handles all console display and menu interaction.
 * Communicates with the controller for data and validation.
 */
public class StudentView {

    private static final int MIN_STUDENTS = 10;

    private StudentController controller;

    /**
     * Constructs a StudentView with the given controller.
     *
     * @param controller the StudentController to use
     */
    public StudentView(StudentController controller) {
        this.controller = controller;
    }

    /**
     * Displays the main menu and returns user's menu choice.
     *
     * @return chosen menu option (1-5)
     */
    public int displayMenu() {
        System.out.println("\n========================================");
        System.out.println("     WELCOME TO STUDENT MANAGEMENT      ");
        System.out.println("========================================");
        System.out.println("  1. Create");
        System.out.println("  2. Find and Sort");
        System.out.println("  3. Update/Delete");
        System.out.println("  4. Report");
        System.out.println("  5. Exit");
        System.out.println("----------------------------------------");
        return InputValidator.inputInteger(
                "Please choose (1-Create, 2-Find&Sort, 3-Update/Delete, 4-Report, 5-Exit): ",
                1, 5);
    }

    /**
     * Handles the Create function.
     * Must create at least 10 students; asks to continue after reaching 10.
     */
    public void handleCreate() {
        System.out.println("\n--- CREATE STUDENTS ---");
        System.out.println("You must enter at least " + MIN_STUDENTS + " students.");

        boolean keepAdding = true;
        while (keepAdding) {
            addOneStudent();
            int count = controller.getStudentCount();
            if (count >= MIN_STUDENTS) {
                System.out.println("\nTotal students: " + count);
                boolean continueAdding = InputValidator.inputYesNo(
                        "Do you want to continue adding? (Y/N): ");
                if (!continueAdding) {
                    keepAdding = false;
                }
            }
        }
        System.out.println("Students created successfully. Total: " + controller.getStudentCount());
    }

    /**
     * Prompts the user to input one student's details and adds them via the controller.
     */
    private void addOneStudent() {
        System.out.println("\n-- Enter student information --");

        String id;
        while (true) {
            id = InputValidator.inputStudentId("Student ID: ");
            if (controller.isIdDuplicate(id)) {
                System.out.println("ID '" + id + "' already exists. Please enter a different ID.");
            } else {
                break;
            }
        }

        String name = InputValidator.inputString("Student Name: ");
        int semester = InputValidator.inputInteger("Semester (1-9): ", 1, 9);
        String course = InputValidator.inputCourseName("Select Course:");

        controller.addStudent(new Student(id, name, semester, course));
        System.out.println("Student added successfully.");
    }

    /**
     * Handles the Find and Sort function.
     * Searches by student name (partial match) and displays sorted results.
     */
    public void handleFindAndSort() {
        System.out.println("\n--- FIND AND SORT ---");
        String keyword = InputValidator.inputString("Enter student name or part of name to search: ");

        List<Student> results = controller.findAndSortByName(keyword);

        if (results.isEmpty()) {
            System.out.println("No students found with name containing: '" + keyword + "'");
        } else {
            System.out.println("\nSearch results (sorted by name):");
            System.out.println(String.format("%-25s | %8s | %s",
                    "Student Name", "Semester", "Course Name"));
            System.out.println("-------------------------------------------");
            for (Student s : results) {
                System.out.println(String.format("%-25s | %8d | %s",
                        s.getStudentName(), s.getSemester(), s.getCourseName()));
            }
        }
    }

    /**
     * Handles the Update/Delete function.
     * Finds student by ID and prompts user to update or delete.
     */
    public void handleUpdateDelete() {
        System.out.println("\n--- UPDATE / DELETE ---");
        String id = InputValidator.inputStudentId("Enter Student ID to find: ");

        Student found = controller.findById(id);
        if (found == null) {
            System.out.println("No student found with ID: " + id);
            return;
        }

        System.out.println("\nFound student:");
        printStudentHeader();
        System.out.println(found.toString());

        char choice = InputValidator.inputUpdateOrDelete(
                "\nDo you want to Update (U) or Delete (D) this student? (U/D): ");

        if (choice == 'U') {
            performUpdate(found);
        } else {
            performDelete(id);
        }
    }

    /**
     * Performs the update operation on a given student.
     *
     * @param student the student to update
     */
    private void performUpdate(Student student) {
        System.out.println("\n-- Update student (ID: " + student.getId() + ") --");
        System.out.println("(Press Enter with current value or type new value)");

        String newName = InputValidator.inputString(
                "New Name [" + student.getStudentName() + "]: ");
        int newSemester = InputValidator.inputInteger(
                "New Semester (1-9) [" + student.getSemester() + "]: ", 1, 9);
        String newCourse = InputValidator.inputCourseName("Select New Course:");

        boolean success = controller.updateStudent(student.getId(), newName, newSemester, newCourse);
        if (success) {
            System.out.println("Student updated successfully.");
        } else {
            System.out.println("Update failed.");
        }
    }

    /**
     * Performs the delete operation for a student by ID.
     *
     * @param id the ID of the student to delete
     */
    private void performDelete(String id) {
        boolean confirm = InputValidator.inputYesNo(
                "Are you sure you want to delete student ID '" + id + "'? (Y/N): ");
        if (confirm) {
            boolean success = controller.deleteStudent(id);
            if (success) {
                System.out.println("Student deleted successfully.");
            } else {
                System.out.println("Delete failed.");
            }
        } else {
            System.out.println("Delete cancelled.");
        }
    }

    /**
     * Handles the Report function.
     * Displays student name, course, and total count of that course for the student.
     */
    public void handleReport() {
        System.out.println("\n--- REPORT ---");
        List<String[]> report = controller.generateReport();

        if (report.isEmpty()) {
            System.out.println("No students to report.");
            return;
        }

        System.out.println(String.format("%-25s | %-10s | %s",
                "Student Name", "Course", "Total"));
        System.out.println("--------------------------------------------------");
        for (String[] row : report) {
            System.out.println(String.format("%-25s | %-10s | %s",
                    row[0], row[1], row[2]));
        }
    }

    /**
     * Prints the student table header.
     */
    private void printStudentHeader() {
        System.out.println(String.format("%-10s | %-25s | %8s | %s",
                "ID", "Student Name", "Semester", "Course"));
        System.out.println("----------------------------------------------------------");
    }

    /**
     * Displays an exit message.
     */
    public void displayExit() {
        System.out.println("\nThank you for using Student Management. Goodbye!");
    }
}
