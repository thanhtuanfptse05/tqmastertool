package linearsearch;

import java.util.Arrays;
import java.util.Random;

/**
 * Encapsulates array management and the Linear Search algorithm.
 * Follows OOP design principles.
 */
public class LinearSearch {

    private int[] array;

    /**
     * Constructs a LinearSearch instance with the specified array size.
     * Generates random integers for each element.
     *
     * @param size the number of elements in the array
     */
    public LinearSearch(int size) {
        generateRandomArray(size);
    }

    /**
     * Generates random integers for an array of the given size.
     *
     * @param size the size of the array
     */
    private void generateRandomArray(int size) {
        this.array = new int[size];
        Random random = new Random();
        for (int i = 0; i < size; i++) {
            // Generate numbers in range [0, size]
            this.array[i] = random.nextInt(size + 1);
        }
    }

    /**
     * Performs linear search sequentially from index 0 to the end of the array.
     *
     * @param target the value to search for
     * @return the first index of target if found; -1 otherwise
     */
    public int search(int target) {
        if (array == null || array.length == 0) {
            return -1;
        }
        return linearSearch(array, target);
    }

    /**
     * Helper method to perform linear search on a given array.
     *
     * @param arr    the array to search in
     * @param target the value to search for
     * @return the index where target is found; -1 if absent
     */
    public int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Returns a string representation of the array.
     *
     * @return formatted string of the array
     */
    public String getArrayString() {
        return Arrays.toString(array);
    }

    public int[] getArray() {
        return array;
    }

    public void setArray(int[] array) {
        this.array = array;
    }
}
