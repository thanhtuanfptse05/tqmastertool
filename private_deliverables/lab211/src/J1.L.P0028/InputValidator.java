package feastorder.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Scanner;
import java.util.regex.Pattern;

/**
 * Utility class for validating console user inputs for Traditional Feast Order Management.
 * Strictly placed in package controller as mandated by rule.md.
 */
public class InputValidator {

    private static final Scanner SCANNER = new Scanner(System.in);
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("dd/MM/yyyy");

    // Vietnamese telecom network prefixes (Viettel, Vina, Mobi, Vietnamobile, Gmobile, Itelecom, Wintel)
    private static final Pattern VN_PHONE_PATTERN = Pattern.compile(
            "^(086|096|097|098|032|033|034|035|036|037|038|039|" +
            "088|091|094|081|082|083|084|085|" +
            "089|090|093|070|079|077|076|078|" +
            "092|056|058|052|099|059|087|055)\\d{7}$"
    );

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$"
    );

    private static final Pattern CUSTOMER_CODE_PATTERN = Pattern.compile(
            "^[CGK]\\d{4}$"
    );

    static {
        DATE_FORMAT.setLenient(false);
    }

    private InputValidator() {
    }

    /**
     * Prompts user for an integer within [min, max].
     *
     * @param msg prompt message
     * @param min minimum value
     * @param max maximum value
     * @return valid integer
     */
    public static int inputInteger(String msg, int min, int max) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.isEmpty()) {
                System.out.println("Input cannot be empty. Please enter a number between " + min + " and " + max + ".");
                continue;
            }
            try {
                int value = Integer.parseInt(input);
                if (value < min || value > max) {
                    System.out.println("Value out of range. Please enter an integer from " + min + " to " + max + ".");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("Invalid number format. Please re-enter.");
            }
        }
    }

    /**
     * Prompts user for a positive integer (> 0).
     *
     * @param msg prompt message
     * @return integer > 0
     */
    public static int inputPositiveInteger(String msg) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.isEmpty()) {
                System.out.println("Input cannot be empty.");
                continue;
            }
            try {
                int value = Integer.parseInt(input);
                if (value <= 0) {
                    System.out.println("Value must be greater than zero. Please re-enter.");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("Invalid number format. Please enter an integer.");
            }
        }
    }

    /**
     * Prompts user for customer code (starts with C, G, or K, followed by 4 digits).
     *
     * @param msg prompt message
     * @return valid customer code
     */
    public static String inputCustomerCode(String msg) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim().toUpperCase();
            if (CUSTOMER_CODE_PATTERN.matcher(input).matches()) {
                return input;
            }
            System.out.println("Customer code must be a 5-character string starting with C, G, or K followed by 4 digits (e.g., C0102, K0310).");
        }
    }

    /**
     * Prompts user for customer name (2 to 25 characters).
     *
     * @param msg prompt message
     * @return valid name
     */
    public static String inputCustomerName(String msg) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.length() >= 2 && input.length() <= 25) {
                return input;
            }
            System.out.println("Name must be a non-empty string between 2 and 25 characters long.");
        }
    }

    /**
     * Prompts user for a 10-digit Vietnamese phone number.
     *
     * @param msg prompt message
     * @return valid phone number
     */
    public static String inputPhoneNumber(String msg) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (VN_PHONE_PATTERN.matcher(input).matches()) {
                return input;
            }
            System.out.println("Phone number must contain exactly 10 digits and belong to a valid Vietnamese network operator.");
        }
    }

    /**
     * Prompts user for standard email address.
     *
     * @param msg prompt message
     * @return valid email
     */
    public static String inputEmail(String msg) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (EMAIL_PATTERN.matcher(input).matches()) {
                return input;
            }
            System.out.println("Invalid email format (e.g., example@domain.com). Please re-enter.");
        }
    }

    /**
     * Prompts user for a non-empty string.
     *
     * @param msg prompt message
     * @return non-empty string
     */
    public static String inputNonEmptyString(String msg) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (!input.isEmpty()) {
                return input;
            }
            System.out.println("This field cannot be empty. Please re-enter.");
        }
    }

    /**
     * Checks if a date is strictly in the future (after today).
     *
     * @param date date to check
     * @return true if date is after today
     */
    public static boolean isFutureDate(Date date) {
        if (date == null) {
            return false;
        }
        Calendar todayCal = Calendar.getInstance();
        todayCal.set(Calendar.HOUR_OF_DAY, 0);
        todayCal.set(Calendar.MINUTE, 0);
        todayCal.set(Calendar.SECOND, 0);
        todayCal.set(Calendar.MILLISECOND, 0);

        Calendar inputCal = Calendar.getInstance();
        inputCal.setTime(date);
        inputCal.set(Calendar.HOUR_OF_DAY, 0);
        inputCal.set(Calendar.MINUTE, 0);
        inputCal.set(Calendar.SECOND, 0);
        inputCal.set(Calendar.MILLISECOND, 0);

        return inputCal.after(todayCal);
    }

    /**
     * Prompts user for a future date (dd/MM/yyyy).
     *
     * @param msg prompt message
     * @return Date object strictly in the future
     */
    public static Date inputFutureDate(String msg) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.isEmpty()) {
                System.out.println("Date cannot be empty.");
                continue;
            }
            try {
                Date date = DATE_FORMAT.parse(input);
                if (isFutureDate(date)) {
                    return date;
                }
                System.out.println("The preferred event date must be in the future (after today).");
            } catch (ParseException e) {
                System.out.println("Invalid date format. Please use dd/MM/yyyy (e.g., 14/02/2025).");
            }
        }
    }

    /**
     * Prompts user for confirmation (Y/N).
     *
     * @param msg prompt message
     * @return true if Y/y, false if N/n
     */
    public static boolean inputYesNo(String msg) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.equalsIgnoreCase("Y")) {
                return true;
            }
            if (input.equalsIgnoreCase("N")) {
                return false;
            }
            System.out.println("Please enter Y or N.");
        }
    }

    // --- Optional / Update helpers (keeps old value if empty) ---

    public static String inputUpdateCustomerName(String msg, String oldName) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.isEmpty()) {
                return oldName;
            }
            if (input.length() >= 2 && input.length() <= 25) {
                return input;
            }
            System.out.println("Name must be between 2 and 25 characters long.");
        }
    }

    public static String inputUpdatePhoneNumber(String msg, String oldPhone) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.isEmpty()) {
                return oldPhone;
            }
            if (VN_PHONE_PATTERN.matcher(input).matches()) {
                return input;
            }
            System.out.println("Phone number must contain exactly 10 digits and belong to a Vietnamese network operator.");
        }
    }

    public static String inputUpdateEmail(String msg, String oldEmail) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.isEmpty()) {
                return oldEmail;
            }
            if (EMAIL_PATTERN.matcher(input).matches()) {
                return input;
            }
            System.out.println("Invalid email format (e.g., example@domain.com).");
        }
    }

    public static String inputUpdateSetMenuCode(String msg, String oldCode) {
        System.out.print(msg);
        String input = SCANNER.nextLine().trim();
        if (input.isEmpty()) {
            return oldCode;
        }
        return input;
    }

    public static int inputUpdatePositiveInteger(String msg, int oldValue) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.isEmpty()) {
                return oldValue;
            }
            try {
                int val = Integer.parseInt(input);
                if (val > 0) {
                    return val;
                }
                System.out.println("Number of tables must be greater than zero.");
            } catch (NumberFormatException e) {
                System.out.println("Invalid number format.");
            }
        }
    }

    public static Date inputUpdateFutureDate(String msg, Date oldDate) {
        while (true) {
            System.out.print(msg);
            String input = SCANNER.nextLine().trim();
            if (input.isEmpty()) {
                return oldDate;
            }
            try {
                Date date = DATE_FORMAT.parse(input);
                if (isFutureDate(date)) {
                    return date;
                }
                System.out.println("The preferred event date must be in the future.");
            } catch (ParseException e) {
                System.out.println("Invalid date format (dd/MM/yyyy).");
            }
        }
    }
}
