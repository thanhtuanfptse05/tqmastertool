package carinsurance.model;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Model class representing a Car entity.
 * Only manages data, state, constructor, and getter/setter methods.
 */
public class Car implements Serializable {

    private static final long serialVersionUID = 1L;

    private String licensePlate;
    private String carOwner;
    private String brand;
    private double value;
    private Date registrationDate;
    private String registrationPlace;
    private int vehicleType; // 5, 7, or 9 seats

    /**
     * Default constructor.
     */
    public Car() {
    }

    /**
     * Parameterized constructor.
     *
     * @param licensePlate      license plate of the car (unique)
     * @param carOwner          name of the car owner (2 to 35 characters)
     * @param brand             car brand
     * @param value             the value of the vehicle (> 999)
     * @param registrationDate  registration date
     * @param registrationPlace registration place
     * @param vehicleType       vehicle type (5, 7, or 9)
     */
    public Car(String licensePlate, String carOwner, String brand, double value,
               Date registrationDate, String registrationPlace, int vehicleType) {
        this.licensePlate = licensePlate;
        this.carOwner = carOwner;
        this.brand = brand;
        this.value = value;
        this.registrationDate = registrationDate;
        this.registrationPlace = registrationPlace;
        this.vehicleType = vehicleType;
    }

    /**
     * Gets the license plate.
     *
     * @return license plate
     */
    public String getLicensePlate() {
        return licensePlate;
    }

    /**
     * Sets the license plate.
     *
     * @param licensePlate license plate
     */
    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    /**
     * Gets the car owner name.
     *
     * @return car owner
     */
    public String getCarOwner() {
        return carOwner;
    }

    /**
     * Sets the car owner name.
     *
     * @param carOwner car owner
     */
    public void setCarOwner(String carOwner) {
        this.carOwner = carOwner;
    }

    /**
     * Gets the car brand.
     *
     * @return brand
     */
    public String getBrand() {
        return brand;
    }

    /**
     * Sets the car brand.
     *
     * @param brand brand
     */
    public void setBrand(String brand) {
        this.brand = brand;
    }

    /**
     * Gets the vehicle value.
     *
     * @return vehicle value
     */
    public double getValue() {
        return value;
    }

    /**
     * Sets the vehicle value.
     *
     * @param value vehicle value
     */
    public void setValue(double value) {
        this.value = value;
    }

    /**
     * Gets the registration date.
     *
     * @return registration date
     */
    public Date getRegistrationDate() {
        return registrationDate;
    }

    /**
     * Sets the registration date.
     *
     * @param registrationDate registration date
     */
    public void setRegistrationDate(Date registrationDate) {
        this.registrationDate = registrationDate;
    }

    /**
     * Gets the registration place.
     *
     * @return registration place
     */
    public String getRegistrationPlace() {
        return registrationPlace;
    }

    /**
     * Sets the registration place.
     *
     * @param registrationPlace registration place
     */
    public void setRegistrationPlace(String registrationPlace) {
        this.registrationPlace = registrationPlace;
    }

    /**
     * Gets the vehicle type.
     *
     * @return vehicle type (5, 7, or 9)
     */
    public int getVehicleType() {
        return vehicleType;
    }

    /**
     * Sets the vehicle type.
     *
     * @param vehicleType vehicle type (5, 7, or 9)
     */
    public void setVehicleType(int vehicleType) {
        this.vehicleType = vehicleType;
    }

    /**
     * Returns formatted registration date string in MM/dd/yyyy.
     *
     * @return formatted date string
     */
    public String getFormattedRegistrationDate() {
        if (registrationDate == null) {
            return "";
        }
        SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy");
        return sdf.format(registrationDate);
    }

    @Override
    public String toString() {
        return String.format("License Plate: %s | Owner: %s | Brand: %s | Value: $ %,.0f | Reg Date: %s | Place: %s | Type: %d seats",
                licensePlate, carOwner, brand, value, getFormattedRegistrationDate(), registrationPlace, vehicleType);
    }
}
