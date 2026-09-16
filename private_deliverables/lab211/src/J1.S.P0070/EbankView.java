package ebank.view;

import ebank.controller.EbankController;
import ebank.controller.InputValidator;
import ebank.model.UserAccount;

/**
 * View class handling console UI and user interaction for Ebank Login System.
 */
public class EbankView {

    private final EbankController controller;

    /**
     * Parameterized constructor.
     *
     * @param controller business controller
     */
    public EbankView(EbankController controller) {
        this.controller = controller;
    }

    /**
     * Displays the language selection menu.
     */
    public void displayMenu() {
        System.out.println(controller.getMessage("menu.title"));
        System.out.println(controller.getMessage("menu.opt1"));
        System.out.println(controller.getMessage("menu.opt2"));
        System.out.println(controller.getMessage("menu.opt3"));
    }

    /**
     * Gets user menu choice (1 - 3).
     *
     * @return selected integer choice
     */
    public int getMenuChoice() {
        return InputValidator.getMenuOption(controller.getMessage("menu.choice"), 1, 3);
    }

    /**
     * Executes the login process for the current language.
     */
    public void performLogin() {
        UserAccount account = new UserAccount();

        // 1. Input account number
        while (true) {
            String acc = InputValidator.getString(controller.getMessage("account.prompt"));
            String error = controller.checkAccountNumber(acc);
            if (error == null) {
                account.setAccountNumber(acc);
                break;
            }
            System.out.println(error);
        }

        // 2. Input password
        while (true) {
            String pwd = InputValidator.getString(controller.getMessage("password.prompt"));
            String error = controller.checkPassword(pwd);
            if (error == null) {
                account.setPassword(pwd);
                break;
            }
            System.out.println(error);
        }

        // 3. Captcha verification
        String generatedCaptcha = controller.generateCaptcha();
        System.out.println(controller.getMessage("captcha.display") + generatedCaptcha);

        while (true) {
            String inputCaptcha = InputValidator.getString(controller.getMessage("captcha.prompt"));
            String error = controller.checkCaptcha(inputCaptcha, generatedCaptcha);
            if (error == null) {
                break;
            }
            System.out.println(error);
        }
    }
}
