package user;

import user.controller.UserController;
import user.view.UserView;

/**
 * Entry point for J1.S.P0057 User Management System.
 */
public class Main {
    public static void main(String[] args) {
        UserController controller = new UserController();
        UserView view = new UserView(controller);
        view.run();
    }
}
