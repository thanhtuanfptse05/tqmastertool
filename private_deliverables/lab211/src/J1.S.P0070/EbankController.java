package ebank.controller;

import java.util.Locale;
import java.util.Random;
import java.util.ResourceBundle;

/**
 * Controller class managing Ebank business logic:
 * language switching, validation of account number, password, and captcha.
 */
public class EbankController {

    private static final String CAPTCHA_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final int CAPTCHA_LENGTH = 5;
    private static final Random RANDOM = new Random();

    private ResourceBundle bundle;
    private Locale currentLocale;

    /**
     * Default constructor initializing with Vietnamese locale.
     */
    public EbankController() {
        setLocate(new Locale("vi", "VN"));
    }

    /**
     * Sets the active locale and loads the corresponding ResourceBundle.
     * Method name matches assignment specification (setLocate).
     *
     * @param locate the target Locale
     */
    public void setLocate(Locale locate) {
        this.currentLocale = locate;
        this.bundle = ResourceBundle.getBundle("ebank.resources.Language", locate);
    }

    /**
     * Gets current locale.
     *
     * @return current locale
     */
    public Locale getCurrentLocale() {
        return currentLocale;
    }

    /**
     * Retrieves localized string by key from current ResourceBundle.
     *
     * @param key the message key
     * @return localized message
     */
    public String getMessage(String key) {
        return bundle.getString(key);
    }

    /**
     * Validates account number: must be numeric and exactly 10 digits.
     *
     * @param accountNumber input account number
     * @return error message if invalid, or null if valid
     */
    public String checkAccountNumber(String accountNumber) {
        if (accountNumber == null || !accountNumber.matches("^[0-9]{10}$")) {
            return bundle.getString("account.error");
        }
        return null;
    }

    /**
     * Validates password: 8-31 characters, must contain both letters and digits.
     *
     * @param password input password
     * @return error message if invalid, or null if valid
     */
    public String checkPassword(String password) {
        if (password == null || !password.matches("^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,31}$")) {
            return bundle.getString("password.error");
        }
        return null;
    }

    /**
     * Generates a random alphanumeric Captcha code.
     *
     * @return random captcha string
     */
    public String generateCaptcha() {
        StringBuilder sb = new StringBuilder(CAPTCHA_LENGTH);
        for (int i = 0; i < CAPTCHA_LENGTH; i++) {
            int index = RANDOM.nextInt(CAPTCHA_CHARS.length());
            sb.append(CAPTCHA_CHARS.charAt(index));
        }
        return sb.toString();
    }

    /**
     * Checks if input captcha characters exist in the generated captcha using contains().
     *
     * @param captchaInput the user input
     * @param captchaGenerate the generated captcha code
     * @return error message if invalid, or null if valid
     */
    public String checkCaptcha(String captchaInput, String captchaGenerate) {
        if (captchaInput == null || captchaInput.trim().isEmpty()) {
            return bundle.getString("captcha.error");
        }
        if (captchaGenerate != null && captchaGenerate.contains(captchaInput.trim())) {
            return null;
        }
        return bundle.getString("captcha.error");
    }
}
