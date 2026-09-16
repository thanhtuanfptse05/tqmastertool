package fruit.model;

/**
 * Model class representing an individual item inside an order cart.
 */
public class OrderItem {

    private int fruitId;
    private String fruitName;
    private int quantity;
    private double price;

    /**
     * Default constructor.
     */
    public OrderItem() {
    }

    /**
     * Parameterized constructor.
     *
     * @param fruitId fruit id
     * @param fruitName fruit name
     * @param quantity quantity purchased
     * @param price price per item
     */
    public OrderItem(int fruitId, String fruitName, int quantity, double price) {
        this.fruitId = fruitId;
        this.fruitName = fruitName;
        this.quantity = quantity;
        this.price = price;
    }

    /**
     * Gets fruit id.
     *
     * @return fruitId
     */
    public int getFruitId() {
        return fruitId;
    }

    /**
     * Sets fruit id.
     *
     * @param fruitId fruitId
     */
    public void setFruitId(int fruitId) {
        this.fruitId = fruitId;
    }

    /**
     * Gets fruit name.
     *
     * @return fruitName
     */
    public String getFruitName() {
        return fruitName;
    }

    /**
     * Sets fruit name.
     *
     * @param fruitName fruitName
     */
    public void setFruitName(String fruitName) {
        this.fruitName = fruitName;
    }

    /**
     * Gets quantity purchased.
     *
     * @return quantity
     */
    public int getQuantity() {
        return quantity;
    }

    /**
     * Sets quantity purchased.
     *
     * @param quantity quantity
     */
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    /**
     * Gets price per unit.
     *
     * @return price
     */
    public double getPrice() {
        return price;
    }

    /**
     * Sets price per unit.
     *
     * @param price price
     */
    public void setPrice(double price) {
        this.price = price;
    }

    /**
     * Calculates total amount for this order item.
     *
     * @return amount (quantity * price)
     */
    public double getAmount() {
        return quantity * price;
    }
}
