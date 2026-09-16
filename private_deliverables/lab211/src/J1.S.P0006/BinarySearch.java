package binarysearch;

import java.util.Arrays;
import java.util.Random;

/**
 * Encapsulates array management and the Binary Search algorithm.
 * Follows OOP design principles with proper encapsulation.
 */
public class BinarySearch {

    private int[] array;

    /**
     * Constructs a BinarySearch instance with the specified array size.
     * Generates random integers for each element.
     *
     * @param size the number of elements in the array
     */
    public BinarySearch(int size) {
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
     * Sorts the internal array in ascending order using Bubble Sort algorithm.
     */
    public void sort() {
        if (array == null || array.length <= 1) {
            return;
        }
        for (int i = 0; i < array.length - 1; i++) {
            for (int j = 0; j < array.length - 1 - i; j++) {
                if (array[j] > array[j + 1]) {
                    int temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                }
            }
        }
    }

    /**
     * Performs recursive Binary Search on the sorted array.
     *
     * @param target the value to search for
     * @return the index of target if found; -1 otherwise
     */
    public int search(int target) {
        if (array == null || array.length == 0) {
            return -1;
        }
        return binarySearch(array, target, 0, array.length - 1);
    }

    /**
     * Recursive helper method for Binary Search.
     *
     * @param arr    the sorted array
     * @param target the search target
     * @param left   starting index of search range
     * @param right  ending index of search range
     * @return index of target or -1 if not found
     */
    public int binarySearch(int[] arr, int target, int left, int right) {
        if (left > right) {
            return -1;
        }

        int mid = left + (right - left) / 2;

        if (arr[mid] == target) {
            return mid;
        }
        if (target < arr[mid]) {
            return binarySearch(arr, target, left, mid - 1);
        }
        return binarySearch(arr, target, mid + 1, right);
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
