package fruit.model;

import java.util.ArrayList;

/**
 * Model class representing a completed customer order.
 */
public class Order {

    private String customerName;
    private ArrayList<OrderItem> items;

    /**
     * Default constructor.
     */
    public Order() {
        this.items = new ArrayList<OrderItem>();
    }

    /**
     * Parameterized constructor.
     *
     * @param customerName name of customer
     * @param items list of ordered items
     */
    public Order(String customerName, ArrayList<OrderItem> items) {
        this.customerName = customerName;
        this.items = items != null ? items : new ArrayList<OrderItem>();
    }

    /**
     * Gets customer name.
     *
     * @return customerName
     */
    public String getCustomerName() {
        return customerName;
    }

    /**
     * Sets customer name.
     *
     * @param customerName customer name
     */
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    /**
     * Gets ordered items list.
     *
     * @return list of items
     */
    public ArrayList<OrderItem> getItems() {
        return items;
    }

    /**
     * Sets ordered items list.
     *
     * @param items list of items
     */
    public void setItems(ArrayList<OrderItem> items) {
        this.items = items;
    }

    /**
     * Computes the total monetary sum of all items in this order.
     *
     * @return total order amount
     */
    public double getTotalAmount() {
        double total = 0;
        if (items != null) {
            for (OrderItem item : items) {
                total += item.getAmount();
            }
        }
        return total;
    }
}
