package feastorder.model;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Model class representing a Feast Order entity.
 * Implements Serializable for binary persistence.
 */
public class Order implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;
    private String customerCode;
    private String setMenuCode;
    private int numberOfTables;
    private Date eventDate;
    private double price;
    private double totalCost;

    public Order() {
    }

    public Order(String id, String customerCode, String setMenuCode,
                 int numberOfTables, Date eventDate, double price, double totalCost) {
        this.id = id;
        this.customerCode = customerCode;
        this.setMenuCode = setMenuCode;
        this.numberOfTables = numberOfTables;
        this.eventDate = eventDate;
        this.price = price;
        this.totalCost = totalCost;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCustomerCode() {
        return customerCode;
    }

    public void setCustomerCode(String customerCode) {
        this.customerCode = customerCode;
    }

    public String getSetMenuCode() {
        return setMenuCode;
    }

    public void setSetMenuCode(String setMenuCode) {
        this.setMenuCode = setMenuCode;
    }

    public int getNumberOfTables() {
        return numberOfTables;
    }

    public void setNumberOfTables(int numberOfTables) {
        this.numberOfTables = numberOfTables;
    }

    public Date getEventDate() {
        return eventDate;
    }

    public void setEventDate(Date eventDate) {
        this.eventDate = eventDate;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(double totalCost) {
        this.totalCost = totalCost;
    }

    /**
     * Returns formatted event date string in dd/MM/yyyy.
     *
     * @return formatted date
     */
    public String getFormattedEventDate() {
        if (eventDate == null) {
            return "";
        }
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        return sdf.format(eventDate);
    }
}
