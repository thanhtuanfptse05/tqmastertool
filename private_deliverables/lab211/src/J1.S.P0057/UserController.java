package user.controller;

import user.model.Account;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Controller handling account business logic, collection management,
 * and persistence to user.dat.
 */
public class UserController {
    private static final String FILE_NAME = "user.dat";
    private List<Account> accounts;

    public UserController() {
        this.accounts = new ArrayList<Account>();
        loadAccounts();
    }

    /**
     * Loads user accounts from user.dat into the collection.
     */
    public final void loadAccounts() {
        accounts.clear();
        File file = new File(FILE_NAME);
        if (!file.exists()) {
            return;
        }

        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader(file));
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) {
                    continue;
                }
                String[] parts = line.split(";", 2);
                if (parts.length == 2) {
                    accounts.add(new Account(parts[0], parts[1]));
                }
            }
        } catch (IOException e) {
            System.err.println("Error reading accounts: " + e.getMessage());
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    // Ignore close exception
                }
            }
        }
    }

    /**
     * Checks if a username already exists in the system.
     *
     * @param username username to check
     * @return true if exists, false otherwise
     */
    public boolean checkUsernameExist(String username) {
        if (username == null) {
            return false;
        }
        for (Account acc : accounts) {
            if (acc.getUsername().equalsIgnoreCase(username)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Adds a new account to the collection and appends it to user.dat.
     *
     * @param acc Account to add
     * @throws Exception if username already exists or file write fails
     */
    public void addAccount(Account acc) throws Exception {
        if (acc == null || acc.getUsername() == null || acc.getPassword() == null) {
            throw new Exception("Account information cannot be null!");
        }
        if (checkUsernameExist(acc.getUsername())) {
            throw new Exception("Username already exists in the database!");
        }

        File file = new File(FILE_NAME);
        BufferedWriter writer = null;
        try {
            // Append mode
            writer = new BufferedWriter(new FileWriter(file, true));
            writer.write(acc.getUsername() + ";" + acc.getPassword());
            writer.newLine();
        } catch (IOException e) {
            throw new Exception("Cannot save account to file: " + e.getMessage());
        } finally {
            if (writer != null) {
                try {
                    writer.close();
                } catch (IOException e) {
                    // Ignore close exception
                }
            }
        }

        accounts.add(acc);
    }

    /**
     * Searches for an account with matching username and password.
     *
     * @param acc Account with credentials to find
     * @return Account if found
     * @throws Exception if credentials do not match
     */
    public Account find(Account acc) throws Exception {
        if (acc == null || acc.getUsername() == null || acc.getPassword() == null) {
            throw new Exception("Invalid user name or password");
        }
        for (Account a : accounts) {
            if (a.getUsername().equalsIgnoreCase(acc.getUsername()) && a.getPassword().equals(acc.getPassword())) {
                return a;
            }
        }
        throw new Exception("Invalid user name or password");
    }

    /**
     * Returns the current list of accounts.
     *
     * @return list of accounts
     */
    public List<Account> getAccounts() {
        return accounts;
    }
}
