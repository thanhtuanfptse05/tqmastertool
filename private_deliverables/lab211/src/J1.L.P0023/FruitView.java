package fruit.view;

import fruit.controller.FruitController;
import fruit.controller.InputValidator;
import fruit.model.Fruit;
import fruit.model.OrderItem;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Hashtable;

/**
 * View class managing the user interface and console interaction for Fruit Shop System.
 */
public class FruitView {

    private final FruitController controller;

    /**
     * Parameterized constructor injecting FruitController.
     *
     * @param controller the business controller
     */
    public FruitView(FruitController controller) {
        this.controller = controller;
    }

    /**
     * Displays main menu.
     */
    public void displayMenu() {
        System.out.println("FRUIT SHOP SYSTEM");
        System.out.println("1. Create Fruit");
        System.out.println("2. View orders");
        System.out.println("3. Shopping (for buyer)");
        System.out.println("4. Exit");
    }

    /**
     * Handles the flow of creating new Fruit products.
     */
    public void runCreateFruit() {
        while (true) {
            int id = InputValidator.getPositiveInt("Enter Fruit Id: ");
            String name = InputValidator.getNonEmptyString("Enter Fruit Name: ");
            double price = InputValidator.getPositiveDouble("Enter Price: ");
            int quantity = InputValidator.getPositiveInt("Enter Quantity: ");
            String origin = InputValidator.getNonEmptyString("Enter Origin: ");

            Fruit fruit = new Fruit(id, name, price, quantity, origin);
            controller.addFruit(fruit);

            boolean cont = InputValidator.getYesNo("Do you want to continue (Y/N)? ");
            if (!cont) {
                displayAllFruits();
                break;
            }
        }
    }

    /**
     * Displays all existing fruits in the system.
     */
    public void displayAllFruits() {
        ArrayList<Fruit> list = controller.getFruitList();
        if (list.isEmpty()) {
            System.out.println("No fruits in system yet.");
            return;
        }
        System.out.println("List of Fruit:");
        System.out.println("| ++ Item ++ | ++ Fruit Name ++ | ++ Origin ++ | ++ Price ++ |");
        for (int i = 0; i < list.size(); i++) {
            Fruit f = list.get(i);
            System.out.printf("%8d     %-18s %-15s %.0f$\n", (i + 1), f.getFruitName(), f.getOrigin(), f.getPrice());
        }
        System.out.println();
    }

    /**
     * Displays all orders stored in the system.
     */
    public void viewOrders() {
        Hashtable<String, ArrayList<OrderItem>> orders = controller.getOrdersTable();
        if (orders.isEmpty()) {
            System.out.println("No orders have been placed yet.");
            return;
        }

        Enumeration<String> customers = orders.keys();
        while (customers.hasMoreElements()) {
            String customer = customers.nextElement();
            ArrayList<OrderItem> items = orders.get(customer);

            System.out.println("Customer: " + customer);
            System.out.println("Product | Quantity | Price | Amount");
            double total = 0;
            int idx = 1;
            for (OrderItem item : items) {
                System.out.printf("%-12s %-9d %-7s %s\n",
                        (idx++) + ". " + item.getFruitName(),
                        item.getQuantity(),
                        (int) item.getPrice() + "$",
                        (int) item.getAmount() + "$");
                total += item.getAmount();
            }
            System.out.printf("Total: %.0f$\n\n", total);
        }
    }

    /**
     * Handles shopping flow for customers.
     */
    public void runShopping() {
        ArrayList<Fruit> available = controller.getAvailableFruits();
        if (available.isEmpty()) {
            System.out.println("Sorry, there are no fruits available in stock right now.");
            return;
        }

        ArrayList<OrderItem> cart = new ArrayList<OrderItem>();

        while (true) {
            available = controller.getAvailableFruits();
            if (available.isEmpty()) {
                System.out.println("All available fruits have been selected into your cart!");
                break;
            }

            System.out.println("List of Fruit:");
            System.out.println("| ++ Item ++ | ++ Fruit Name ++ | ++ Origin ++ | ++ Price ++ |");
            for (int i = 0; i < available.size(); i++) {
                Fruit f = available.get(i);
                System.out.printf("%8d     %-18s %-15s %.0f$\n", (i + 1), f.getFruitName(), f.getOrigin(), f.getPrice());
            }

            int itemIndex = InputValidator.getMenuChoice("Please select an item: ", 1, available.size());
            Fruit selectedFruit = available.get(itemIndex - 1);
            System.out.println("You selected: " + selectedFruit.getFruitName());

            int qty;
            while (true) {
                qty = InputValidator.getPositiveInt("Please input quantity: ");
                if (qty <= selectedFruit.getQuantity()) {
                    break;
                }
                System.out.println("Only " + selectedFruit.getQuantity() + " items available in stock. Please enter smaller quantity.");
            }

            // Deduct stock and add to cart
            controller.deductStock(selectedFruit.getFruitId(), qty);
            cart.add(new OrderItem(selectedFruit.getFruitId(), selectedFruit.getFruitName(), qty, selectedFruit.getPrice()));

            boolean orderNow = InputValidator.getYesNo("Do you want to order now (Y/N)? ");
            if (orderNow) {
                break;
            }
        }

        if (cart.isEmpty()) {
            return;
        }

        // Print bill
        System.out.println("Product | Quantity | Price | Amount");
        double total = 0;
        for (OrderItem item : cart) {
            System.out.printf("%-12s %-9d %-7s %s\n",
                    item.getFruitName(),
                    item.getQuantity(),
                    (int) item.getPrice() + "$",
                    (int) item.getAmount() + "$");
            total += item.getAmount();
        }
        System.out.printf("Total: %.0f$\n", total);

        String name = InputValidator.getNonEmptyString("Input your name: ");
        controller.addOrder(name, cart);
        System.out.println("Order successfully created! Thank you.");
    }
}
