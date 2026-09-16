package shape.model;

/**
 * Model class representing a Rectangle shape.
 */
public class Rectangle extends Shape {

    private double width;
    private double length;

    /**
     * Default constructor.
     */
    public Rectangle() {
    }

    /**
     * Parameterized constructor.
     *
     * @param width the width of the rectangle
     * @param length the length of the rectangle
     */
    public Rectangle(double width, double length) {
        this.width = width;
        this.length = length;
    }

    /**
     * Gets rectangle width.
     *
     * @return width
     */
    public double getWidth() {
        return width;
    }

    /**
     * Sets rectangle width.
     *
     * @param width width
     */
    public void setWidth(double width) {
        this.width = width;
    }

    /**
     * Gets rectangle length.
     *
     * @return length
     */
    public double getLength() {
        return length;
    }

    /**
     * Sets rectangle length.
     *
     * @param length length
     */
    public void setLength(double length) {
        this.length = length;
    }

    @Override
    public double getArea() {
        return width * length;
    }

    @Override
    public double getPerimeter() {
        return (width + length) * 2;
    }

    @Override
    public void printResult() {
        System.out.println("-----Rectangle-----");
        System.out.println("Width: " + width);
        System.out.println("Length: " + length);
        System.out.println("Area: " + getArea());
        System.out.println("Perimeter: " + getPerimeter());
    }
}
