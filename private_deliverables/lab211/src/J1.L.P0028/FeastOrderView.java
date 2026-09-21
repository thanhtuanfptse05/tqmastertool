package feastorder.view;

import feastorder.controller.FeastOrderController;
import feastorder.controller.InputValidator;
import feastorder.model.Customer;
import feastorder.model.FeastMenu;
import feastorder.model.Order;
import java.io.IOException;
import java.util.Date;
import java.util.List;

/**
 * View class handling console user interaction, menus, and table rendering
 * for Traditional Feast Order Management.
 */
public class FeastOrderView {

    private final FeastOrderController controller;

    public FeastOrderView(FeastOrderController controller) {
        this.controller = controller;
    }

    /**
     * Displays main menu and gets user choice.
     *
     * @return selected menu item (1 - 8, or 9 for Quit)
     */
    public int displayMenu() {
        System.out.println("\n===== TRADITIONAL FEAST ORDER MANAGEMENT =====");
        System.out.println("1. Register customers.");
        System.out.println("2. Update customer information.");
        System.out.println("3. Search for customer information by name.");
        System.out.println("4. Display feast menus.");
        System.out.println("5. Place a feast order.");
        System.out.println("6. Update order information.");
        System.out.println("7. Save data to file.");
        System.out.println("8. Display Customer or Order lists.");
        System.out.println("9. Quit.");
        return InputValidator.inputInteger("Please choose an option (1-9): ", 1, 9);
    }

    /**
     * Handles Function 1: Register customers.
     */
    public void handleRegisterCustomer() {
        System.out.println("\n--- Register Customers ---");
        boolean continueEntering = true;
        while (continueEntering) {
            String code;
            while (true) {
                code = InputValidator.inputCustomerCode("Enter customer code (e.g. C0102, G0171, K0310): ");
                if (controller.containsCustomer(code)) {
                    System.out.println("Customer code already exists. Please choose another code.");
                    continue;
                }
                break;
            }

            String name = InputValidator.inputCustomerName("Enter customer name (2-25 characters): ");
            String phone = InputValidator.inputPhoneNumber("Enter phone number (10 digits Vietnamese carrier): ");
            String email = InputValidator.inputEmail("Enter email address: ");

            Customer customer = new Customer(code, name, phone, email);
            if (controller.registerCustomer(customer)) {
                System.out.println("Customer registered successfully!");
            } else {
                System.out.println("Registration failed.");
            }

            continueEntering = InputValidator.inputYesNo("Do you want to continue entering new customers? (Y/N): ");
        }
    }

    /**
     * Handles Function 2: Update customer information.
     */
    public void handleUpdateCustomer() {
        System.out.println("\n--- Update Customer Information ---");
        boolean continueUpdating = true;
        while (continueUpdating) {
            String code = InputValidator.inputNonEmptyString("Enter customer code: ");
            Customer customer = controller.findCustomer(code);
            if (customer == null) {
                System.out.println("This customer does not exist.");
            } else {
                System.out.println("Customer found! Enter new values (leave empty to keep existing value):");
                String newName = InputValidator.inputUpdateCustomerName("Name (" + customer.getName() + "): ", customer.getName());
                String newPhone = InputValidator.inputUpdatePhoneNumber("Phone (" + customer.getPhone() + "): ", customer.getPhone());
                String newEmail = InputValidator.inputUpdateEmail("Email (" + customer.getEmail() + "): ", customer.getEmail());

                customer.setName(newName);
                customer.setPhone(newPhone);
                customer.setEmail(newEmail);

                if (controller.updateCustomer(customer)) {
                    System.out.println("Customer information updated successfully!");
                } else {
                    System.out.println("Update failed.");
                }
            }

            continueUpdating = InputValidator.inputYesNo("Do you want to continue with another update? (Y/N): ");
        }
    }

    /**
     * Handles Function 3: Search for customer information by name.
     */
    public void handleSearchCustomer() {
        System.out.println("\n--- Search for Customer by Name ---");
        String nameQuery = InputValidator.inputNonEmptyString("Enter name or partial name to search: ");
        List<Customer> list = controller.searchCustomersByName(nameQuery);

        if (list.isEmpty()) {
            System.out.println("No one matches the search criteria!");
        } else {
            System.out.println("\nMatching Customers: " + nameQuery);
            System.out.println("----------------------------------------------------------------------------------");
            System.out.printf("%-6s | %-25s | %-12s | %s\n", "Code", "Customer Name", "Phone", "Email");
            System.out.println("----------------------------------------------------------------------------------");
            for (Customer c : list) {
                System.out.printf("%-6s | %-25s | %-12s | %s\n", c.getCode(), c.getName(), c.getPhone(), c.getEmail());
            }
            System.out.println("----------------------------------------------------------------------------------");
        }
    }

    /**
     * Handles Function 4: Display feast menus.
     */
    public void handleDisplayFeastMenus() {
        System.out.println("\n--- Display Feast Menus ---");
        boolean exists = controller.loadMenus(FeastOrderController.MENU_FILE);
        if (!exists || controller.getMenuList().isEmpty()) {
            System.out.println("Cannot read data from feastMenu.csv. Please check it.");
            return;
        }

        System.out.println("List of Set Menus for ordering party:");
        System.out.println("------------------------------------------------------------");
        for (FeastMenu menu : controller.getMenuList()) {
            System.out.printf("Code        : %s\n", menu.getCode());
            System.out.printf("Name        : %s\n", menu.getName());
            System.out.printf("Price       : %,.0f Vnd\n", menu.getPrice());
            System.out.println("Ingredients :");
            System.out.println(menu.getFormattedIngredients());
            System.out.println("------------------------------------------------------------");
        }
    }

    /**
     * Handles Function 5: Place a feast order.
     */
    public void handlePlaceFeastOrder() {
        System.out.println("\n--- Place a Feast Order ---");
        boolean continuePlacing = true;
        while (continuePlacing) {
            String custCode;
            while (true) {
                custCode = InputValidator.inputNonEmptyString("Enter Customer Code: ");
                if (!controller.containsCustomer(custCode)) {
                    System.out.println("Customer code is only valid if it is in the list of registered customers.");
                    continue;
                }
                break;
            }

            String menuCode;
            FeastMenu menu;
            while (true) {
                menuCode = InputValidator.inputNonEmptyString("Enter Code of SetMenu: ");
                menu = controller.findMenu(menuCode);
                if (menu == null) {
                    System.out.println("Set menu code is only valid if it is in the provided list. Please check Feast Menus.");
                    continue;
                }
                break;
            }

            int tables = InputValidator.inputPositiveInteger("Enter number of tables: ");
            Date eventDate = InputValidator.inputFutureDate("Enter preferred event date (dd/MM/yyyy): ");

            if (controller.isDuplicateOrder(custCode, menuCode, eventDate)) {
                System.out.println("Dupplicate data!");
            } else {
                Order order = controller.placeOrder(custCode, menuCode, tables, eventDate);
                if (order != null) {
                    Customer cust = controller.findCustomer(custCode);
                    displayPlacedOrder(order, cust, menu);
                } else {
                    System.out.println("Failed to place order.");
                }
            }

            continuePlacing = InputValidator.inputYesNo("Do you want to continue placing another order? (Y/N): ");
        }
    }

    private void displayPlacedOrder(Order order, Customer cust, FeastMenu menu) {
        System.out.println("\nCustomer order information [Order ID: " + order.getId() + "]");
        System.out.printf("Code            : %s\n", cust.getCode());
        System.out.printf("Customer name   : %s\n", cust.getName());
        System.out.printf("Phone number    : %s\n", cust.getPhone());
        System.out.printf("Email           : %s\n", cust.getEmail());
        System.out.printf("Code of Set Menu: %s\n", menu.getCode());
        System.out.printf("Set menu name   : %s\n", menu.getName());
        System.out.printf("Event date      : %s\n", order.getFormattedEventDate());
        System.out.printf("Number of tables: %d\n", order.getNumberOfTables());
        System.out.printf("Price           : %,.0f Vnd\n", order.getPrice());
        System.out.println("Ingredients     :");
        System.out.println(menu.getFormattedIngredients());
        System.out.printf("Total cost      : %,.0f Vnd\n", order.getTotalCost());
    }

    /**
     * Handles Function 6: Update order information.
     */
    public void handleUpdateOrder() {
        System.out.println("\n--- Update Order Information ---");
        boolean continueUpdating = true;
        while (continueUpdating) {
            String orderId = InputValidator.inputNonEmptyString("Enter Order ID: ");
            Order order = controller.findOrder(orderId);
            if (order == null) {
                System.out.println("This Order does not exist.");
            } else if (!controller.canUpdateOrder(order)) {
                System.out.println("Cannot update: order event date occurred before the current date.");
            } else {
                System.out.println("Order found! Enter updated fields (leave empty to keep current value):");

                String newMenuCode = InputValidator.inputUpdateSetMenuCode("Code of set menu (" + order.getSetMenuCode() + "): ", order.getSetMenuCode());
                FeastMenu menu = controller.findMenu(newMenuCode);
                while (menu == null) {
                    System.out.println("Invalid set menu code. Please enter an existing menu code or leave empty.");
                    newMenuCode = InputValidator.inputUpdateSetMenuCode("Code of set menu (" + order.getSetMenuCode() + "): ", order.getSetMenuCode());
                    menu = controller.findMenu(newMenuCode);
                }

                int newTables = InputValidator.inputUpdatePositiveInteger("Number of tables (" + order.getNumberOfTables() + "): ", order.getNumberOfTables());
                Date newEventDate = InputValidator.inputUpdateFutureDate("Preferred event date (" + order.getFormattedEventDate() + "): ", order.getEventDate());

                order.setSetMenuCode(menu.getCode());
                order.setNumberOfTables(newTables);
                order.setEventDate(newEventDate);
                order.setPrice(menu.getPrice());
                order.setTotalCost(menu.getPrice() * newTables);

                if (controller.updateOrder(order)) {
                    System.out.println("Order information updated successfully!");
                } else {
                    System.out.println("Failed to update order.");
                }
            }

            continueUpdating = InputValidator.inputYesNo("Do you want to continue with another order update? (Y/N): ");
        }
    }

    /**
     * Handles Function 7: Save data to file.
     */
    public void handleSaveData() {
        try {
            controller.saveData();
            System.out.println("- Customer data has been successfully saved to \"" + FeastOrderController.CUSTOMER_FILE + "\".");
            System.out.println("- Order data has been successfully saved to \"" + FeastOrderController.ORDER_FILE + "\".");
        } catch (IOException e) {
            System.out.println("Failed to save data: " + e.getMessage());
        }
    }

    /**
     * Handles Function 8: Display Customer or Order lists.
     */
    public void handleDisplayLists() {
        System.out.println("\n--- Display Customer or Order Lists ---");
        System.out.println("1. Display Customers list");
        System.out.println("2. Display Orders list");
        int subChoice = InputValidator.inputInteger("Choose list to display (1-2): ", 1, 2);

        if (subChoice == 1) {
            displayCustomerList();
        } else {
            displayOrderList();
        }
    }

    private void displayCustomerList() {
        List<Customer> list = controller.getSortedCustomers();
        if (list.isEmpty()) {
            System.out.println("Does not have any customer information.");
            return;
        }
        System.out.println("\nCustomers information:");
        System.out.println("----------------------------------------------------------------------------------");
        System.out.printf("%-6s | %-25s | %-12s | %s\n", "Code", "Customer Name", "Phone", "Email");
        System.out.println("----------------------------------------------------------------------------------");
        for (Customer c : list) {
            System.out.printf("%-6s | %-25s | %-12s | %s\n", c.getCode(), c.getName(), c.getPhone(), c.getEmail());
        }
        System.out.println("----------------------------------------------------------------------------------");
    }

    private void displayOrderList() {
        List<Order> list = controller.getSortedOrders();
        if (list.isEmpty()) {
            System.out.println("No data in the system.");
            return;
        }
        System.out.println("----------------------------------------------------------------------------------");
        System.out.printf("%-4s | %-12s | %-12s | %-9s | %-12s | %-6s | %s\n",
                "ID", "Event date", "Customer ID", "Set Menu", "Price", "Tables", "Cost");
        System.out.println("----------------------------------------------------------------------------------");
        for (Order o : list) {
            System.out.printf("%-4s | %-12s | %-12s | %-9s | %,10.0f | %-6d | %,.0f\n",
                    o.getId(),
                    o.getFormattedEventDate(),
                    o.getCustomerCode(),
                    o.getSetMenuCode(),
                    o.getPrice(),
                    o.getNumberOfTables(),
                    o.getTotalCost());
        }
        System.out.println("----------------------------------------------------------------------------------");
    }

    /**
     * Handles program termination.
     *
     * @return true if confirmed to quit
     */
    public boolean handleQuit() {
        boolean confirm = InputValidator.inputYesNo("Are you sure you want to quit? (Y/N): ");
        if (!confirm) {
            return false;
        }
        if (controller.hasChanges()) {
            System.out.println("Saving pending changes before exiting...");
            handleSaveData();
        }
        System.out.println("Goodbye!");
        return true;
    }
}
