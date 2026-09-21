package feastorder.controller;

import feastorder.model.Customer;
import feastorder.model.FeastMenu;
import feastorder.model.Order;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

/**
 * Controller class managing customer registrations, feast menus, and party orders.
 */
public class FeastOrderController {

    public static final String CUSTOMER_FILE = "customers.dat";
    public static final String ORDER_FILE = "feast_order_service.dat";
    public static final String MENU_FILE = "feastMenu.csv";

    private final List<Customer> customerList = new ArrayList<Customer>();
    private final List<FeastMenu> menuList = new ArrayList<FeastMenu>();
    private final List<Order> orderList = new ArrayList<Order>();
    private int nextOrderId = 1;
    private boolean hasChanges = false;

    public List<Customer> getCustomerList() {
        return customerList;
    }

    public List<FeastMenu> getMenuList() {
        return menuList;
    }

    public List<Order> getOrderList() {
        return orderList;
    }

    public boolean hasChanges() {
        return hasChanges;
    }

    /**
     * Reads set menus from feastMenu.csv.
     *
     * @param filePath path to CSV file
     * @return true if successfully read
     */
    public boolean loadMenus(String filePath) {
        File file = new File(filePath);
        if (!file.exists()) {
            return false;
        }

        menuList.clear();
        BufferedReader br = null;
        try {
            br = new BufferedReader(new InputStreamReader(new FileInputStream(file), "UTF-8"));
            String line = br.readLine(); // header
            while ((line = br.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) {
                    continue;
                }
                FeastMenu menu = parseMenuLine(line);
                if (menu != null) {
                    menuList.add(menu);
                }
            }
            // Sort ascending based on price attribute
            Collections.sort(menuList, new Comparator<FeastMenu>() {
                @Override
                public int compare(FeastMenu o1, FeastMenu o2) {
                    return Double.compare(o1.getPrice(), o2.getPrice());
                }
            });
            return true;
        } catch (Exception e) {
            return false;
        } finally {
            if (br != null) {
                try {
                    br.close();
                } catch (IOException ignored) {
                }
            }
        }
    }

    private FeastMenu parseMenuLine(String line) {
        String code = "";
        String name = "";
        double price = 0;
        String ingredients = "";
        try {
            if (line.contains("\"")) {
                int firstQuote = line.indexOf('"');
                int lastQuote = line.lastIndexOf('"');
                ingredients = line.substring(firstQuote + 1, lastQuote);
                String beforeQuote = line.substring(0, firstQuote);
                String[] tokens = beforeQuote.split(",");
                if (tokens.length >= 3) {
                    code = tokens[0].trim();
                    name = tokens[1].trim();
                    price = Double.parseDouble(tokens[2].trim());
                }
            } else {
                String[] tokens = line.split(",", 4);
                if (tokens.length >= 4) {
                    code = tokens[0].trim();
                    name = tokens[1].trim();
                    price = Double.parseDouble(tokens[2].trim());
                    ingredients = tokens[3].trim();
                }
            }
            if (!code.isEmpty()) {
                return new FeastMenu(code, name, price, ingredients);
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    /**
     * Checks if a customer code already exists.
     *
     * @param code customer code
     * @return true if exists
     */
    public boolean containsCustomer(String code) {
        return findCustomer(code) != null;
    }

    /**
     * Finds customer by code.
     *
     * @param code customer code
     * @return Customer or null
     */
    public Customer findCustomer(String code) {
        for (Customer c : customerList) {
            if (c.getCode().equalsIgnoreCase(code)) {
                return c;
            }
        }
        return null;
    }

    /**
     * Registers a new customer.
     *
     * @param customer customer to register
     * @return true if successful
     */
    public boolean registerCustomer(Customer customer) {
        if (customer == null || containsCustomer(customer.getCode())) {
            return false;
        }
        customerList.add(customer);
        hasChanges = true;
        return true;
    }

    /**
     * Updates an existing customer.
     *
     * @param customer customer to update
     * @return true if updated
     */
    public boolean updateCustomer(Customer customer) {
        Customer existing = findCustomer(customer.getCode());
        if (existing == null) {
            return false;
        }
        existing.setName(customer.getName());
        existing.setPhone(customer.getPhone());
        existing.setEmail(customer.getEmail());
        hasChanges = true;
        return true;
    }

    /**
     * Searches for customers by name (partial match, case-insensitive).
     * Results sorted in alphabetical order by name.
     *
     * @param name search query
     * @return list of matching customers
     */
    public List<Customer> searchCustomersByName(String name) {
        List<Customer> result = new ArrayList<Customer>();
        String query = name.toLowerCase().trim();
        for (Customer c : customerList) {
            if (c.getName().toLowerCase().contains(query)) {
                result.add(c);
            }
        }

        Collections.sort(result, new Comparator<Customer>() {
            @Override
            public int compare(Customer o1, Customer o2) {
                return o1.getName().compareToIgnoreCase(o2.getName());
            }
        });
        return result;
    }

    /**
     * Finds FeastMenu by code.
     *
     * @param code menu code
     * @return FeastMenu or null
     */
    public FeastMenu findMenu(String code) {
        for (FeastMenu m : menuList) {
            if (m.getCode().equalsIgnoreCase(code)) {
                return m;
            }
        }
        return null;
    }

    /**
     * Checks if an identical order already exists based on
     * Customer Code, Set Menu Code, and Event Date.
     *
     * @param customerCode customer code
     * @param menuCode     menu code
     * @param eventDate    event date
     * @return true if duplicate
     */
    public boolean isDuplicateOrder(String customerCode, String menuCode, Date eventDate) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        String dateStr = sdf.format(eventDate);
        for (Order o : orderList) {
            if (o.getCustomerCode().equalsIgnoreCase(customerCode)
                    && o.getSetMenuCode().equalsIgnoreCase(menuCode)
                    && o.getFormattedEventDate().equals(dateStr)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Places a new feast order.
     *
     * @param customerCode customer code
     * @param menuCode     menu code
     * @param tables       number of tables
     * @param eventDate    event date
     * @return created Order or null if invalid/duplicate
     */
    public Order placeOrder(String customerCode, String menuCode, int tables, Date eventDate) {
        if (!containsCustomer(customerCode)) {
            return null;
        }
        FeastMenu menu = findMenu(menuCode);
        if (menu == null) {
            return null;
        }
        if (isDuplicateOrder(customerCode, menuCode, eventDate)) {
            return null;
        }

        String orderId = String.format("%02d", nextOrderId++);
        double totalCost = menu.getPrice() * tables;

        Order order = new Order(orderId, customerCode, menu.getCode(), tables, eventDate, menu.getPrice(), totalCost);
        orderList.add(order);
        hasChanges = true;
        return order;
    }

    /**
     * Finds order by ID.
     *
     * @param id order id
     * @return Order or null
     */
    public Order findOrder(String id) {
        for (Order o : orderList) {
            if (o.getId().equalsIgnoreCase(id)) {
                return o;
            }
        }
        return null;
    }

    /**
     * Checks if an order can be updated.
     * "Do not allow updating an order whose event date occurred before the current date"
     *
     * @param order order to check
     * @return true if allowed to update
     */
    public boolean canUpdateOrder(Order order) {
        if (order == null || order.getEventDate() == null) {
            return false;
        }
        Calendar todayCal = Calendar.getInstance();
        todayCal.set(Calendar.HOUR_OF_DAY, 0);
        todayCal.set(Calendar.MINUTE, 0);
        todayCal.set(Calendar.SECOND, 0);
        todayCal.set(Calendar.MILLISECOND, 0);

        Calendar eventCal = Calendar.getInstance();
        eventCal.setTime(order.getEventDate());
        eventCal.set(Calendar.HOUR_OF_DAY, 0);
        eventCal.set(Calendar.MINUTE, 0);
        eventCal.set(Calendar.SECOND, 0);
        eventCal.set(Calendar.MILLISECOND, 0);

        return !eventCal.before(todayCal);
    }

    /**
     * Updates an existing order.
     *
     * @param order order with updated fields
     * @return true if updated
     */
    public boolean updateOrder(Order order) {
        Order existing = findOrder(order.getId());
        if (existing == null) {
            return false;
        }
        existing.setSetMenuCode(order.getSetMenuCode());
        existing.setNumberOfTables(order.getNumberOfTables());
        existing.setEventDate(order.getEventDate());
        existing.setPrice(order.getPrice());
        existing.setTotalCost(order.getTotalCost());
        hasChanges = true;
        return true;
    }

    /**
     * Gets customer list sorted by customer name in alphabetical order.
     *
     * @return sorted customer list
     */
    public List<Customer> getSortedCustomers() {
        List<Customer> list = new ArrayList<Customer>(customerList);
        Collections.sort(list, new Comparator<Customer>() {
            @Override
            public int compare(Customer o1, Customer o2) {
                return o1.getName().compareToIgnoreCase(o2.getName());
            }
        });
        return list;
    }

    /**
     * Gets order list sorted by event date in ascending order.
     *
     * @return sorted order list
     */
    public List<Order> getSortedOrders() {
        List<Order> list = new ArrayList<Order>(orderList);
        Collections.sort(list, new Comparator<Order>() {
            @Override
            public int compare(Order o1, Order o2) {
                if (o1.getEventDate() == null || o2.getEventDate() == null) {
                    return 0;
                }
                return o1.getEventDate().compareTo(o2.getEventDate());
            }
        });
        return list;
    }

    /**
     * Saves customer and order data to binary files.
     *
     * @throws IOException on I/O error
     */
    public void saveData() throws IOException {
        ObjectOutputStream custOut = null;
        ObjectOutputStream orderOut = null;
        try {
            custOut = new ObjectOutputStream(new FileOutputStream(CUSTOMER_FILE));
            custOut.writeObject(customerList);

            orderOut = new ObjectOutputStream(new FileOutputStream(ORDER_FILE));
            orderOut.writeObject(orderList);

            hasChanges = false;
        } finally {
            if (custOut != null) {
                try {
                    custOut.close();
                } catch (IOException ignored) {
                }
            }
            if (orderOut != null) {
                try {
                    orderOut.close();
                } catch (IOException ignored) {
                }
            }
        }
    }

    /**
     * Loads customer and order data from binary files.
     *
     * @throws IOException            on I/O error
     * @throws ClassNotFoundException on deserialization error
     */
    public void loadData() throws IOException, ClassNotFoundException {
        File cFile = new File(CUSTOMER_FILE);
        File oFile = new File(ORDER_FILE);

        if (cFile.exists()) {
            loadCustomersFromFile(cFile);
        }
        if (oFile.exists()) {
            loadOrdersFromFile(oFile);
        }
        hasChanges = false;
    }

    @SuppressWarnings("unchecked")
    private void loadCustomersFromFile(File file) throws IOException, ClassNotFoundException {
        ObjectInputStream cin = null;
        try {
            cin = new ObjectInputStream(new FileInputStream(file));
            List<Customer> loaded = (List<Customer>) cin.readObject();
            customerList.clear();
            customerList.addAll(loaded);
        } finally {
            if (cin != null) {
                try {
                    cin.close();
                } catch (IOException ignored) {
                }
            }
        }
    }

    @SuppressWarnings("unchecked")
    private void loadOrdersFromFile(File file) throws IOException, ClassNotFoundException {
        ObjectInputStream oin = null;
        try {
            oin = new ObjectInputStream(new FileInputStream(file));
            List<Order> loaded = (List<Order>) oin.readObject();
            orderList.clear();
            orderList.addAll(loaded);
            for (Order o : orderList) {
                try {
                    int idNum = Integer.parseInt(o.getId());
                    if (idNum >= nextOrderId) {
                        nextOrderId = idNum + 1;
                    }
                } catch (NumberFormatException ignored) {
                }
            }
        } finally {
            if (oin != null) {
                try {
                    oin.close();
                } catch (IOException ignored) {
                }
            }
        }
    }
}
