package user.view;

import user.controller.InputValidator;
import user.controller.UserController;
import user.model.Account;

/**
 * UserView handles the console presentation layer and menu options.
 */
public class UserView {
    private UserController userController;

    public UserView(UserController userController) {
        this.userController = userController;
    }

    /**
     * Displays the main menu.
     */
    public void displayMenu() {
        System.out.println("====== USER MANAGEMENT SYSTEM ======");
        System.out.println("1. Create a new account");
        System.out.println("2. Login system");
        System.out.println("3. Exit");
    }

    /**
     * Main application loop.
     */
    public void run() {
        while (true) {
            displayMenu();
            int choice = InputValidator.getInt("> Choose: ", 1, 3);
            switch (choice) {
                case 1:
                    createAccount();
                    break;
                case 2:
                    login();
                    break;
                case 3:
                    System.out.println("Exiting program.");
                    return;
            }
            System.out.println();
        }
    }

    /**
     * Handles account creation workflow.
     */
    private void createAccount() {
        String username;
        while (true) {
            username = InputValidator.getUsername("Enter Username: ");
            if (userController.checkUsernameExist(username)) {
                System.out.println("Username already exists. Please choose another username!");
            } else {
                break;
            }
        }

        String password = InputValidator.getPassword("Enter Password: ");
        try {
            userController.addAccount(new Account(username, password));
            System.out.println("Account created successfully!");
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    /**
     * Handles login workflow.
     */
    private void login() {
        String username = InputValidator.getUsername("Enter Username: ");
        String password = InputValidator.getPassword("Enter Password: ");

        try {
            Account account = userController.find(new Account(username, password));
            if (account != null) {
                System.out.println("Login successful!");
            }
        } catch (Exception e) {
            System.out.println("Invalid user name or password");
        }
    }
}
