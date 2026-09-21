package studentcourse;

import studentcourse.controller.StudentCourseController;
import studentcourse.view.StudentCourseView;

/**
 * Application Entry Point for Student and Short Course Management System.
 */
public class Main {

    public static void main(String[] args) {
        StudentCourseController controller = new StudentCourseController();
        StudentCourseView view = new StudentCourseView(controller);

        // Load data on startup
        try {
            controller.loadData();
        } catch (Exception e) {
            System.out.println("Notice: Could not load initial data: " + e.getMessage());
        }

        boolean running = true;
        while (running) {
            int choice = view.displayMenu();
            switch (choice) {
                case 1:
                    view.handleListAllStudents();
                    break;
                case 2:
                    view.handleAddStudent();
                    break;
                case 3:
                    view.handleSearchStudent();
                    break;
                case 4:
                    view.handleUpdateGpa();
                    break;
                case 5:
                    view.handleListByMajor();
                    break;
                case 6:
                    view.handleAddCourse();
                    break;
                case 7:
                    view.handleListCoursesByStudentGrouped();
                    break;
                case 8:
                    view.handleCalculateTotalDuration();
                    break;
                case 9:
                    view.handleRemoveStudent();
                    break;
                case 10:
                    view.handleSortStudentsByGpa();
                    break;
                case 11:
                    view.handleSaveData();
                    break;
                case 12:
                    if (view.handleQuit()) {
                        running = false;
                    }
                    break;
                default:
                    break;
            }
        }
    }
}
