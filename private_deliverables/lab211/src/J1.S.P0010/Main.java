package linearsearch;

/**
 * Main application entry point for J1.S.P0010 (Linear Search).
 */
public class Main {

    public static void main(String[] args) {
        // Step 1: Prompt user to enter number of elements in array
        int size = InputValidator.getPositiveInteger("Enter number of array:");

        // Step 2: Prompt user to enter search value
        int searchValue = InputValidator.getInteger("Enter search value:");

        // Step 3: Initialize LinearSearch object and generate random array
        LinearSearch linearSearch = new LinearSearch(size);

        // Step 4: Display the array
        System.out.println("The array: " + linearSearch.getArrayString());

        // Step 5: Perform linear search
        int index = linearSearch.search(searchValue);

        // Step 6: Display search result
        if (index != -1) {
            System.out.println("Found " + searchValue + " at index: " + index);
        } else {
            System.out.println("Value " + searchValue + " is not found in array.");
        }
    }
}
