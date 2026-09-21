package carinsurance.controller;

import carinsurance.model.Car;
import carinsurance.model.InsuranceStatement;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller class coordinating business logic and data persistence
 * for the Car Insurance Management system.
 */
public class CarInsuranceController {

    public static final String CAR_FILE = "carInfo.dat";
    public static final String INSURANCE_FILE = "insurances.dat";

    private final Map<String, Car> carMap = new LinkedHashMap<String, Car>();
    private final Map<String, InsuranceStatement> insuranceMap = new LinkedHashMap<String, InsuranceStatement>();
    private boolean hasChanges = false;

    /**
     * Checks if there are unsaved modifications.
     *
     * @return true if data has changed since last save/load
     */
    public boolean hasChanges() {
        return hasChanges;
    }

    public void setHasChanges(boolean hasChanges) {
        this.hasChanges = hasChanges;
    }

    public Map<String, Car> getCarMap() {
        return carMap;
    }

    public Map<String, InsuranceStatement> getInsuranceMap() {
        return insuranceMap;
    }

    /**
     * Checks if a car license plate already exists (case-insensitive).
     *
     * @param licensePlate plate to check
     * @return true if exists
     */
    public boolean containsCar(String licensePlate) {
        return findCar(licensePlate) != null;
    }

    /**
     * Adds a new car to collection.
     *
     * @param car car object
     * @return true if added successfully
     */
    public boolean addCar(Car car) {
        if (car == null || containsCar(car.getLicensePlate())) {
            return false;
        }
        carMap.put(car.getLicensePlate(), car);
        hasChanges = true;
        return true;
    }

    /**
     * Finds a car by license plate (case-insensitive).
     *
     * @param licensePlate plate to search
     * @return Car object or null
     */
    public Car findCar(String licensePlate) {
        if (licensePlate == null) {
            return null;
        }
        String clean = licensePlate.trim();
        for (Car c : carMap.values()) {
            if (c.getLicensePlate().equalsIgnoreCase(clean)) {
                return c;
            }
        }
        return null;
    }

    /**
     * Updates an existing car's details.
     *
     * @param car updated car object
     * @return true if updated successfully
     */
    public boolean updateCar(Car car) {
        if (car == null) {
            return false;
        }
        Car existing = findCar(car.getLicensePlate());
        if (existing == null) {
            return false;
        }
        carMap.put(existing.getLicensePlate(), car);
        hasChanges = true;
        return true;
    }

    /**
     * Checks if a vehicle is already registered in any insurance statement.
     *
     * @param licensePlate car plate
     * @return true if registered in insurance
     */
    public boolean isCarInsured(String licensePlate) {
        if (licensePlate == null) {
            return false;
        }
        for (InsuranceStatement statement : insuranceMap.values()) {
            if (statement.getLicensePlate().equalsIgnoreCase(licensePlate.trim())) {
                return true;
            }
        }
        return false;
    }

    /**
     * Deletes a car by license plate.
     *
     * @param licensePlate plate of car to delete
     * @return 1 if deleted successfully, 0 if not found, -1 if car is insured and cannot be deleted
     */
    public int deleteCar(String licensePlate) {
        Car car = findCar(licensePlate);
        if (car == null) {
            return 0; // Not found
        }
        if (isCarInsured(car.getLicensePlate())) {
            return -1; // Insured, cannot delete
        }
        carMap.remove(car.getLicensePlate());
        hasChanges = true;
        return 1; // Success
    }

    /**
     * Checks if an insurance ID already exists.
     *
     * @param insuranceId ID to check
     * @return true if exists
     */
    public boolean containsInsurance(String insuranceId) {
        return insuranceMap.containsKey(insuranceId);
    }

    /**
     * Calculates insurance fees based on vehicle value and period.
     * 12 months: 25% of vehicle value
     * 24 months: 20% of vehicle value * 2
     * 36 months: 15% of vehicle value * 3
     *
     * @param vehicleValue vehicle value
     * @param period       12, 24, or 36
     * @return positive integer fee rounded
     */
    public long calculateInsuranceFee(double vehicleValue, int period) {
        double fee = 0;
        if (period == 12) {
            fee = vehicleValue * 0.25;
        } else if (period == 24) {
            fee = vehicleValue * 0.20 * 2.0;
        } else if (period == 36) {
            fee = vehicleValue * 0.15 * 3.0;
        }
        return Math.round(fee);
    }

    /**
     * Adds an insurance statement to the collection.
     *
     * @param statement statement object
     * @return true if added successfully
     */
    public boolean addInsuranceStatement(InsuranceStatement statement) {
        if (statement == null || insuranceMap.containsKey(statement.getInsuranceId())) {
            return false;
        }
        insuranceMap.put(statement.getInsuranceId(), statement);
        hasChanges = true;
        return true;
    }

    /**
     * Gets insurance statements for a specific year and sorts them.
     *
     * @param year      year to filter
     * @param sortField 1: id, 2: established date, 3: plate, 4: period
     * @param isAsc     true for ASC, false for DESC
     * @return sorted list of statements
     */
    public List<InsuranceStatement> getInsuranceStatementsByYear(int year, final int sortField, final boolean isAsc) {
        List<InsuranceStatement> list = new ArrayList<InsuranceStatement>();
        Calendar cal = Calendar.getInstance();
        for (InsuranceStatement stmt : insuranceMap.values()) {
            if (stmt.getEstablishedDate() != null) {
                cal.setTime(stmt.getEstablishedDate());
                if (cal.get(Calendar.YEAR) == year) {
                    list.add(stmt);
                }
            }
        }

        Collections.sort(list, new Comparator<InsuranceStatement>() {
            @Override
            public int compare(InsuranceStatement o1, InsuranceStatement o2) {
                int res = 0;
                switch (sortField) {
                    case 1:
                        res = o1.getInsuranceId().compareToIgnoreCase(o2.getInsuranceId());
                        break;
                    case 2:
                        res = o1.getEstablishedDate().compareTo(o2.getEstablishedDate());
                        break;
                    case 3:
                        res = o1.getLicensePlate().compareToIgnoreCase(o2.getLicensePlate());
                        break;
                    case 4:
                        res = Integer.compare(o1.getInsurancePeriod(), o2.getInsurancePeriod());
                        break;
                    default:
                        res = o1.getInsuranceId().compareToIgnoreCase(o2.getInsuranceId());
                        break;
                }
                return isAsc ? res : -res;
            }
        });

        return list;
    }

    /**
     * Gets uninsured cars and sorts them.
     *
     * @param sortField 1: plate, 2: owner, 3: reg date, 4: type
     * @param isAsc     true for ASC, false for DESC
     * @return sorted list of uninsured cars
     */
    public List<Car> getUninsuredCars(final int sortField, final boolean isAsc) {
        List<Car> list = new ArrayList<Car>();
        for (Car car : carMap.values()) {
            if (!isCarInsured(car.getLicensePlate())) {
                list.add(car);
            }
        }

        Collections.sort(list, new Comparator<Car>() {
            @Override
            public int compare(Car o1, Car o2) {
                int res = 0;
                switch (sortField) {
                    case 1:
                        res = o1.getLicensePlate().compareToIgnoreCase(o2.getLicensePlate());
                        break;
                    case 2:
                        res = o1.getCarOwner().compareToIgnoreCase(o2.getCarOwner());
                        break;
                    case 3:
                        res = o1.getRegistrationDate().compareTo(o2.getRegistrationDate());
                        break;
                    case 4:
                        res = Integer.compare(o1.getVehicleType(), o2.getVehicleType());
                        break;
                    default:
                        res = o1.getLicensePlate().compareToIgnoreCase(o2.getLicensePlate());
                        break;
                }
                return isAsc ? res : -res;
            }
        });

        return list;
    }

    /**
     * Saves vehicles and insurance statements to binary files.
     *
     * @return true if successful
     * @throws IOException on I/O error
     */
    public boolean saveData() throws IOException {
        ObjectOutputStream carOut = null;
        ObjectOutputStream insOut = null;
        try {
            carOut = new ObjectOutputStream(new FileOutputStream(CAR_FILE));
            carOut.writeObject(carMap);

            insOut = new ObjectOutputStream(new FileOutputStream(INSURANCE_FILE));
            insOut.writeObject(insuranceMap);

            hasChanges = false;
            return true;
        } finally {
            if (carOut != null) {
                try {
                    carOut.close();
                } catch (IOException ignored) {
                }
            }
            if (insOut != null) {
                try {
                    insOut.close();
                } catch (IOException ignored) {
                }
            }
        }
    }

    /**
     * Loads vehicles and insurance statements from binary files.
     *
     * @return true if loaded successfully
     * @throws IOException            on I/O error
     * @throws ClassNotFoundException on deserialization error
     */
    public boolean loadData() throws IOException, ClassNotFoundException {
        File carF = new File(CAR_FILE);
        File insF = new File(INSURANCE_FILE);

        if (!carF.exists() && !insF.exists()) {
            return false;
        }
        if (carF.exists()) {
            loadCarsFromFile(carF);
        }
        if (insF.exists()) {
            loadInsurancesFromFile(insF);
        }
        hasChanges = false;
        return true;
    }

    @SuppressWarnings("unchecked")
    private void loadCarsFromFile(File file) throws IOException, ClassNotFoundException {
        ObjectInputStream carIn = null;
        try {
            carIn = new ObjectInputStream(new FileInputStream(file));
            Map<String, Car> loadedCars = (Map<String, Car>) carIn.readObject();
            carMap.clear();
            carMap.putAll(loadedCars);
        } finally {
            if (carIn != null) {
                try {
                    carIn.close();
                } catch (IOException ignored) {
                }
            }
        }
    }

    @SuppressWarnings("unchecked")
    private void loadInsurancesFromFile(File file) throws IOException, ClassNotFoundException {
        ObjectInputStream insIn = null;
        try {
            insIn = new ObjectInputStream(new FileInputStream(file));
            Map<String, InsuranceStatement> loadedIns = (Map<String, InsuranceStatement>) insIn.readObject();
            insuranceMap.clear();
            insuranceMap.putAll(loadedIns);
        } finally {
            if (insIn != null) {
                try {
                    insIn.close();
                } catch (IOException ignored) {
                }
            }
        }
    }
}
