package ebank.model;

/**
 * Model class representing an Ebank user account.
 */
public class UserAccount {

    private String accountNumber;
    private String password;

    /**
     * Default constructor.
     */
    public UserAccount() {
    }

    /**
     * Parameterized constructor.
     *
     * @param accountNumber 10-digit account number
     * @param password account password
     */
    public UserAccount(String accountNumber, String password) {
        this.accountNumber = accountNumber;
        this.password = password;
    }

    /**
     * Gets account number.
     *
     * @return account number
     */
    public String getAccountNumber() {
        return accountNumber;
    }

    /**
     * Sets account number.
     *
     * @param accountNumber account number
     */
    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    /**
     * Gets password.
     *
     * @return password
     */
    public String getPassword() {
        return password;
    }

    /**
     * Sets password.
     *
     * @param password password
     */
    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "UserAccount{"
                + "accountNumber='" + accountNumber + '\''
                + '}';
    }
}
