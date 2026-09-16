package fruit.model;

/**
 * Model class representing a Fruit product.
 */
public class Fruit {

    private int fruitId;
    private String fruitName;
    private double price;
    private int quantity;
    private String origin;

    /**
     * Default constructor.
     */
    public Fruit() {
    }

    /**
     * Parameterized constructor.
     *
     * @param fruitId unique id of the fruit
     * @param fruitName name of the fruit
     * @param price price per item
     * @param quantity available stock quantity
     * @param origin origin country
     */
    public Fruit(int fruitId, String fruitName, double price, int quantity, String origin) {
        this.fruitId = fruitId;
        this.fruitName = fruitName;
        this.price = price;
        this.quantity = quantity;
        this.origin = origin;
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
     * Gets price.
     *
     * @return price
     */
    public double getPrice() {
        return price;
    }

    /**
     * Sets price.
     *
     * @param price price
     */
    public void setPrice(double price) {
        this.price = price;
    }

    /**
     * Gets stock quantity.
     *
     * @return quantity
     */
    public int getQuantity() {
        return quantity;
    }

    /**
     * Sets stock quantity.
     *
     * @param quantity quantity
     */
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    /**
     * Gets origin.
     *
     * @return origin
     */
    public String getOrigin() {
        return origin;
    }

    /**
     * Sets origin.
     *
     * @param origin origin
     */
    public void setOrigin(String origin) {
        this.origin = origin;
    }

    @Override
    public String toString() {
        return "Fruit{"
                + "fruitId=" + fruitId
                + ", fruitName='" + fruitName + '\''
                + ", price=" + price
                + ", quantity=" + quantity
                + ", origin='" + origin + '\''
                + '}';
    }
}
