package fruit.controller;

import fruit.model.Fruit;
import fruit.model.OrderItem;
import java.util.ArrayList;
import java.util.Hashtable;

/**
 * Controller managing Fruit inventory and Customer Orders.
 * Uses only ArrayList and Hashtable as required by assignment specification.
 */
public class FruitController {

    private final ArrayList<Fruit> fruitList;
    private final Hashtable<String, ArrayList<OrderItem>> ordersTable;

    /**
     * Default constructor initializing data collections.
     */
    public FruitController() {
        this.fruitList = new ArrayList<Fruit>();
        this.ordersTable = new Hashtable<String, ArrayList<OrderItem>>();
    }

    /**
     * Adds a new fruit or updates quantity if id already exists.
     *
     * @param fruit fruit to add
     */
    public void addFruit(Fruit fruit) {
        Fruit existing = getFruitById(fruit.getFruitId());
        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + fruit.getQuantity());
            existing.setPrice(fruit.getPrice());
        } else {
            fruitList.add(fruit);
        }
    }

    /**
     * Finds fruit by its unique integer id.
     *
     * @param id fruit id
     * @return Fruit or null if not found
     */
    public Fruit getFruitById(int id) {
        for (Fruit f : fruitList) {
            if (f.getFruitId() == id) {
                return f;
            }
        }
        return null;
    }

    /**
     * Retrieves list of all fruits.
     *
     * @return list of fruits
     */
    public ArrayList<Fruit> getFruitList() {
        return fruitList;
    }

    /**
     * Retrieves list of fruits currently available in stock (quantity > 0).
     *
     * @return available fruits list
     */
    public ArrayList<Fruit> getAvailableFruits() {
        ArrayList<Fruit> available = new ArrayList<Fruit>();
        for (Fruit f : fruitList) {
            if (f.getQuantity() > 0) {
                available.add(f);
            }
        }
        return available;
    }

    /**
     * Deducts purchased quantity from fruit stock.
     *
     * @param fruitId fruit id
     * @param qty purchased quantity
     * @return true if deduction succeeded, false if insufficient stock
     */
    public boolean deductStock(int fruitId, int qty) {
        Fruit f = getFruitById(fruitId);
        if (f != null && f.getQuantity() >= qty) {
            f.setQuantity(f.getQuantity() - qty);
            return true;
        }
        return false;
    }

    /**
     * Records a customer order in the Hashtable.
     *
     * @param customerName name of buyer
     * @param items purchased items list
     */
    public void addOrder(String customerName, ArrayList<OrderItem> items) {
        if (ordersTable.containsKey(customerName)) {
            ordersTable.get(customerName).addAll(items);
        } else {
            ordersTable.put(customerName, new ArrayList<OrderItem>(items));
        }
    }

    /**
     * Gets all registered orders stored in the Hashtable.
     *
     * @return Hashtable mapping customer names to lists of OrderItem
     */
    public Hashtable<String, ArrayList<OrderItem>> getOrdersTable() {
        return ordersTable;
    }
}
