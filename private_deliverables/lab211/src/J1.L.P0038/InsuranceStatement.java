package carinsurance.model;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Model class representing an Insurance Statement entity.
 * Only manages data, state, constructor, and getter/setter methods.
 */
public class InsuranceStatement implements Serializable {

    private static final long serialVersionUID = 1L;

    private String insuranceId;
    private Date establishedDate;
    private String licensePlate;
    private String customerName;
    private int insurancePeriod; // 12, 24, or 36 months
    private long insuranceFees;

    /**
     * Default constructor.
     */
    public InsuranceStatement() {
    }

    /**
     * Parameterized constructor.
     *
     * @param insuranceId     unique insurance id
     * @param establishedDate date when statement is established
     * @param licensePlate    car's license plate
     * @param customerName    name of customer
     * @param insurancePeriod 12, 24, or 36
     * @param insuranceFees   calculated positive integer fees
     */
    public InsuranceStatement(String insuranceId, Date establishedDate, String licensePlate,
                              String customerName, int insurancePeriod, long insuranceFees) {
        this.insuranceId = insuranceId;
        this.establishedDate = establishedDate;
        this.licensePlate = licensePlate;
        this.customerName = customerName;
        this.insurancePeriod = insurancePeriod;
        this.insuranceFees = insuranceFees;
    }

    /**
     * Gets insurance ID.
     *
     * @return insurance ID
     */
    public String getInsuranceId() {
        return insuranceId;
    }

    /**
     * Sets insurance ID.
     *
     * @param insuranceId insurance ID
     */
    public void setInsuranceId(String insuranceId) {
        this.insuranceId = insuranceId;
    }

    /**
     * Gets established date.
     *
     * @return established date
     */
    public Date getEstablishedDate() {
        return establishedDate;
    }

    /**
     * Sets established date.
     *
     * @param establishedDate established date
     */
    public void setEstablishedDate(Date establishedDate) {
        this.establishedDate = establishedDate;
    }

    /**
     * Gets vehicle license plate.
     *
     * @return license plate
     */
    public String getLicensePlate() {
        return licensePlate;
    }

    /**
     * Sets vehicle license plate.
     *
     * @param licensePlate license plate
     */
    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    /**
     * Gets customer name.
     *
     * @return customer name
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
     * Gets insurance period in months.
     *
     * @return insurance period (12, 24, 36)
     */
    public int getInsurancePeriod() {
        return insurancePeriod;
    }

    /**
     * Sets insurance period in months.
     *
     * @param insurancePeriod insurance period
     */
    public void setInsurancePeriod(int insurancePeriod) {
        this.insurancePeriod = insurancePeriod;
    }

    /**
     * Gets calculated insurance fees.
     *
     * @return insurance fees
     */
    public long getInsuranceFees() {
        return insuranceFees;
    }

    /**
     * Sets calculated insurance fees.
     *
     * @param insuranceFees insurance fees
     */
    public void setInsuranceFees(long insuranceFees) {
        this.insuranceFees = insuranceFees;
    }

    /**
     * Returns formatted established date string in MM/dd/yyyy.
     *
     * @return formatted date string
     */
    public String getFormattedEstablishedDate() {
        if (establishedDate == null) {
            return "";
        }
        SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy");
        return sdf.format(establishedDate);
    }

    @Override
    public String toString() {
        return String.format("Insurance ID: %s | Date: %s | Plate: %s | Customer: %s | Period: %d months | Fees: $ %,d",
                insuranceId, getFormattedEstablishedDate(), licensePlate, customerName, insurancePeriod, insuranceFees);
    }
}
