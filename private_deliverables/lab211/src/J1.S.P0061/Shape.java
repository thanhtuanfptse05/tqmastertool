package shape.model;

/**
 * Abstract class representing a geometric shape.
 * Mandates perimeter calculation, area calculation, and result printing.
 */
public abstract class Shape {

    /**
     * Calculates and returns the perimeter of the shape.
     *
     * @return perimeter value
     */
    public abstract double getPerimeter();

    /**
     * Calculates and returns the area of the shape.
     *
     * @return area value
     */
    public abstract double getArea();

    /**
     * Prints the shape's dimensions and calculation results to the console.
     */
    public abstract void printResult();
}
