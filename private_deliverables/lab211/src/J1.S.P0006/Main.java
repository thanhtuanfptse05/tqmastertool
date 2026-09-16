package binarysearch;

/**
 * Main application entry point for J1.S.P0006 (Binary Search).
 */
public class Main {

    public static void main(String[] args) {
        // Step 1: Prompt user to enter number of elements in array
        int size = InputValidator.getPositiveInteger("Enter number of array:");

        // Step 2: Prompt user to enter search value
        int searchValue = InputValidator.getInteger("Enter search value:");

        // Step 3: Initialize BinarySearch object and generate random array
        BinarySearch binarySearch = new BinarySearch(size);

        // Step 4: Sort array in ascending order
        binarySearch.sort();

        // Step 5: Display sorted array
        System.out.println("Sorted array: " + binarySearch.getArrayString());

        // Step 6: Perform binary search
        int index = binarySearch.search(searchValue);

        // Step 7: Display search result
        if (index != -1) {
            System.out.println("Found " + searchValue + " at index: " + index);
        } else {
            System.out.println("Value " + searchValue + " is not found in array.");
        }
    }
}
