package carinsurance.view;

import carinsurance.controller.CarInsuranceController;
import carinsurance.controller.InputValidator;
import carinsurance.model.Car;
import carinsurance.model.InsuranceStatement;
import java.io.IOException;
import java.util.Date;
import java.util.List;

/**
 * View class handling console user interaction, menus, and reports
 * for the Car Insurance Management system.
 */
public class CarInsuranceView {

    private final CarInsuranceController controller;

    /**
     * Constructor injecting the controller.
     *
     * @param controller CarInsuranceController instance
     */
    public CarInsuranceView(CarInsuranceController controller) {
        this.controller = controller;
    }

    /**
     * Displays the main menu and returns user choice.
     *
     * @return selected menu item (1 - 10)
     */
    public int displayMenu() {
        System.out.println("\n===== CAR INSURANCE MANAGEMENT =====");
        System.out.println("1. Add car information");
        System.out.println("2. Find a car");
        System.out.println("3. Update a car");
        System.out.println("4. Delete a car");
        System.out.println("5. Add an insurance statement");
        System.out.println("6. List of insurance statements");
        System.out.println("7. Report on uninsured cars");
        System.out.println("8. Save data");
        System.out.println("9. Load data");
        System.out.println("10. Quit");
        return InputValidator.inputInteger("Please choose an option (1-10): ", 1, 10);
    }

    /**
     * Handles Function 1: Add car information.
     */
    public void handleAddCar() {
        System.out.println("\n--- Add Car Information ---");
        boolean continueAdding = true;
        while (continueAdding) {
            String plate;
            while (true) {
                plate = InputValidator.inputNonEmptyString("Enter license plate: ");
                if (controller.containsCar(plate)) {
                    System.out.println("License plate already exists. Must be unique!");
                    continue;
                }
                break;
            }

            String owner = InputValidator.inputCarOwner("Enter car owner (2-35 characters): ");
            String brand = InputValidator.inputNonEmptyString("Enter car brand: ");
            double value = InputValidator.inputVehicleValue("Enter the value of the vehicle (> 999): ");
            Date regDate = InputValidator.inputDate("Enter registration date (MM/dd/yyyy): ");
            String regPlace = InputValidator.inputNonEmptyString("Enter registration place: ");
            int vehicleType = InputValidator.inputVehicleType("Enter vehicle type (5, 7, or 9 seats): ");

            Car car = new Car(plate, owner, brand, value, regDate, regPlace, vehicleType);
            if (controller.addCar(car)) {
                System.out.println("Vehicle added successfully!");
            } else {
                System.out.println("Failed to add vehicle.");
            }

            continueAdding = InputValidator.inputYesNo("Do you want to continue adding new vehicle? (Y/N): ");
        }
    }

    /**
     * Handles Function 2: Find a car.
     */
    public void handleFindCar() {
        System.out.println("\n--- Find a Car ---");
        String plate = InputValidator.inputNonEmptyString("Enter license plate: ");
        Car car = controller.findCar(plate);
        if (car == null) {
            System.out.println("Unregistered vehicle");
        } else {
            System.out.println("Car Information Found:");
            System.out.println("------------------------------------------------------------------------------------------------");
            System.out.printf("%-15s: %s\n", "License Plate", car.getLicensePlate());
            System.out.printf("%-15s: %s\n", "Car Owner", car.getCarOwner());
            System.out.printf("%-15s: %s\n", "Brand", car.getBrand());
            System.out.printf("%-15s: $ %,.0f\n", "Vehicle Value", car.getValue());
            System.out.printf("%-15s: %s\n", "Reg Date", car.getFormattedRegistrationDate());
            System.out.printf("%-15s: %s\n", "Reg Place", car.getRegistrationPlace());
            System.out.printf("%-15s: %d seats\n", "Vehicle Type", car.getVehicleType());
            System.out.println("------------------------------------------------------------------------------------------------");
        }
    }

    /**
     * Handles Function 3: Update a car.
     */
    public void handleUpdateCar() {
        System.out.println("\n--- Update a Car ---");
        String plate = InputValidator.inputNonEmptyString("Enter license plate: ");
        Car car = controller.findCar(plate);
        if (car == null) {
            System.out.println("Unregistered vehicle");
            return;
        }

        System.out.println("Car found! Enter new values (leave empty to keep existing value):");
        String newOwner = InputValidator.inputUpdateCarOwner("Car Owner (" + car.getCarOwner() + "): ", car.getCarOwner());
        String newBrand = InputValidator.inputUpdateString("Brand (" + car.getBrand() + "): ", car.getBrand());
        double newValue = InputValidator.inputUpdateVehicleValue("Vehicle Value ($ " + String.format("%,.0f", car.getValue()) + "): ", car.getValue());
        Date newRegDate = InputValidator.inputUpdateDate("Registration Date (" + car.getFormattedRegistrationDate() + "): ", car.getRegistrationDate());
        String newRegPlace = InputValidator.inputUpdateString("Registration Place (" + car.getRegistrationPlace() + "): ", car.getRegistrationPlace());
        int newType = InputValidator.inputUpdateVehicleType("Vehicle Type (" + car.getVehicleType() + " seats): ", car.getVehicleType());

        car.setCarOwner(newOwner);
        car.setBrand(newBrand);
        car.setValue(newValue);
        car.setRegistrationDate(newRegDate);
        car.setRegistrationPlace(newRegPlace);
        car.setVehicleType(newType);

        if (controller.updateCar(car)) {
            System.out.println("Car update successful!");
        } else {
            System.out.println("Car update failed!");
        }
    }

    /**
     * Handles Function 4: Delete a car.
     */
    public void handleDeleteCar() {
        System.out.println("\n--- Delete a Car ---");
        String plate = InputValidator.inputNonEmptyString("Enter license plate: ");
        Car car = controller.findCar(plate);
        if (car == null) {
            System.out.println("Unregistered vehicle");
            return;
        }

        if (controller.isCarInsured(plate)) {
            System.out.println("The car information cannot be deleted if it is already registered in insurance");
            return;
        }

        boolean confirm = InputValidator.inputYesNo("Are you sure you want to delete this car? (Y/N): ");
        if (!confirm) {
            System.out.println("Deletion cancelled.");
            return;
        }

        int res = controller.deleteCar(plate);
        if (res == 1) {
            System.out.println("Car deleted successfully!");
        } else {
            System.out.println("Failed to delete car.");
        }
    }

    /**
     * Handles Function 5: Add an insurance statement.
     */
    public void handleAddInsurance() {
        System.out.println("\n--- Add Insurance Statement ---");
        boolean continueAdding = true;
        while (continueAdding) {
            String insId;
            while (true) {
                insId = InputValidator.inputNonEmptyString("Enter insurance ID: ");
                if (controller.containsInsurance(insId)) {
                    System.out.println("Insurance ID already exists. Must be unique!");
                    continue;
                }
                break;
            }

            Date establishedDate = InputValidator.inputDate("Enter established date (MM/dd/yyyy): ");

            String plate;
            Car car;
            while (true) {
                plate = InputValidator.inputNonEmptyString("Enter license plate: ");
                car = controller.findCar(plate);
                if (car == null) {
                    System.out.println("Unregistered vehicle. Please enter an existing vehicle license plate.");
                    continue;
                }
                break;
            }

            String customer = InputValidator.inputNonEmptyString("Enter customer name: ");
            int period = InputValidator.inputInsurancePeriod("Enter insurance period (12, 24, or 36 months): ");
            long fees = controller.calculateInsuranceFee(car.getValue(), period);

            InsuranceStatement stmt = new InsuranceStatement(insId, establishedDate, plate, customer, period, fees);
            if (controller.addInsuranceStatement(stmt)) {
                System.out.printf("Insurance statement created successfully! Calculated Fee: $ %,d\n", fees);
            } else {
                System.out.println("Failed to add insurance statement.");
            }

            continueAdding = InputValidator.inputYesNo("Do you want to continue adding a new insurance statement? (Y/N): ");
        }
    }

    /**
     * Handles Function 6: List of insurance statements.
     */
    public void handleListInsuranceStatements() {
        System.out.println("\n--- List of Insurance Statements ---");
        int year = InputValidator.inputInteger("Enter year value to display insurance statements (e.g., 2023): ", 1900, 2100);

        System.out.println("Select sort field:");
        System.out.println("1. Insurance ID");
        System.out.println("2. Established Date");
        System.out.println("3. License Plate");
        System.out.println("4. Insurance Period");
        int fieldChoice = InputValidator.inputInteger("Enter sort field (1-4): ", 1, 4);

        System.out.println("Select sort type:");
        System.out.println("1. ASC");
        System.out.println("2. DESC");
        int sortTypeChoice = InputValidator.inputInteger("Enter sort type (1-2): ", 1, 2);
        boolean isAsc = (sortTypeChoice == 1);

        List<InsuranceStatement> list = controller.getInsuranceStatementsByYear(year, fieldChoice, isAsc);
        if (list.isEmpty()) {
            System.out.println("No insurance statements found for year " + year + ".");
            return;
        }

        String fieldName = (fieldChoice == 1) ? "Insurance ID" :
                (fieldChoice == 2) ? "Established Date" :
                        (fieldChoice == 3) ? "License Plate" : "Insurance Period";

        printInsuranceTable(list, year, fieldName, isAsc);
    }

    private void printInsuranceTable(List<InsuranceStatement> list, int year, String fieldName, boolean isAsc) {
        System.out.println("\nReport : INSURANCE STATEMENTS");
        System.out.printf("From  :   01/01/%04d  To: 12/31/%04d\n", year, year);
        System.out.println("Sorted by: " + fieldName);
        System.out.println("Sort type : " + (isAsc ? "ASC" : "DESC"));
        System.out.println();
        System.out.printf("%-4s | %-12s | %-16s | %-14s | %-16s | %-16s | %-14s\n",
                "No.", "Insurance Id", "Established Date", "License plate", "Customer", "Insurance period", "Insurance fees");
        System.out.println("----------------------------------------------------------------------------------------------------------");
        int count = 1;
        for (InsuranceStatement s : list) {
            System.out.printf("%-4d | %-12s | %-16s | %-14s | %-16s | %-16d | $ %,d\n",
                    count++,
                    s.getInsuranceId(),
                    s.getFormattedEstablishedDate(),
                    s.getLicensePlate(),
                    s.getCustomerName(),
                    s.getInsurancePeriod(),
                    s.getInsuranceFees());
        }
        System.out.println("----------------------------------------------------------------------------------------------------------");
    }

    /**
     * Handles Function 7: Report on uninsured cars.
     */
    public void handleReportUninsuredCars() {
        System.out.println("\n--- Report on Uninsured Cars ---");
        System.out.println("Select sort field:");
        System.out.println("1. License Plate\n2. Vehicle Owner\n3. Registration Date\n4. Vehicle Type");
        int fieldChoice = InputValidator.inputInteger("Enter sort field (1-4): ", 1, 4);

        System.out.println("Select sort type:\n1. ASC\n2. DESC");
        int sortTypeChoice = InputValidator.inputInteger("Enter sort type (1-2): ", 1, 2);
        boolean isAsc = (sortTypeChoice == 1);

        List<Car> list = controller.getUninsuredCars(fieldChoice, isAsc);
        if (list.isEmpty()) {
            System.out.println("All vehicles currently have insurance statements.");
            return;
        }

        String fieldName = (fieldChoice == 1) ? "License plate" :
                (fieldChoice == 2) ? "Vehicle Owner" :
                        (fieldChoice == 3) ? "Registration Date" : "Vehicle type";

        printUninsuredTable(list, fieldName, isAsc);
    }

    private void printUninsuredTable(List<Car> list, String fieldName, boolean isAsc) {
        System.out.println("\nReport: UNINSURED CARS");
        System.out.println("Sorted by : " + fieldName);
        System.out.println("Sort type : " + (isAsc ? "ASC" : "DESC"));
        System.out.println();
        System.out.printf("%-4s | %-14s | %-17s | %-16s | %-12s | %-12s | %-12s\n",
                "No.", "License plate", "Registration Date", "Vehicle Owner", "Brand", "Vehicle type", "Value");
        System.out.println("------------------------------------------------------------------------------------------------------");
        int count = 1;
        for (Car c : list) {
            System.out.printf("%-4d | %-14s | %-17s | %-16s | %-12s | %-12d | $ %,.0f\n",
                    count++,
                    c.getLicensePlate(),
                    c.getFormattedRegistrationDate(),
                    c.getCarOwner(),
                    c.getBrand(),
                    c.getVehicleType(),
                    c.getValue());
        }
        System.out.println("------------------------------------------------------------------------------------------------------");
    }

    /**
     * Handles Function 8: Save data.
     */
    public void handleSaveData() {
        try {
            controller.saveData();
            System.out.println("Saved vehicles to binary file " + CarInsuranceController.CAR_FILE + " successfully.");
            System.out.println("Saved insurance statements to binary file " + CarInsuranceController.INSURANCE_FILE + " successfully.");
        } catch (IOException e) {
            System.out.println("Failed to save data: " + e.getMessage());
        }
    }

    /**
     * Handles Function 9: Load data.
     */
    public void handleLoadData() {
        try {
            boolean loaded = controller.loadData();
            if (loaded) {
                System.out.printf("Loaded %d cars and %d insurance statements from binary files.\n",
                        controller.getCarMap().size(), controller.getInsuranceMap().size());
            } else {
                System.out.println("Binary data files do not exist yet. Starting with empty dataset.");
            }
        } catch (Exception e) {
            System.out.println("Failed to load data: " + e.getMessage());
        }
    }

    /**
     * Handles Function 10: Quit.
     *
     * @return true if confirmed to quit, false otherwise
     */
    public boolean handleQuit() {
        boolean confirm = InputValidator.inputYesNo("Are you sure you want to exit? (Y/N): ");
        if (!confirm) {
            return false;
        }
        if (controller.hasChanges()) {
            System.out.println("Unsaved data detected. Saving data before exiting...");
            handleSaveData();
        }
        System.out.println("Goodbye!");
        return true;
    }
}
