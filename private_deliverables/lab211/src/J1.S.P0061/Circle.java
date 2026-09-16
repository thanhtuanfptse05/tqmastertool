package shape.model;

/**
 * Model class representing a Circle shape.
 */
public class Circle extends Shape {

    private double radius;

    /**
     * Default constructor.
     */
    public Circle() {
    }

    /**
     * Parameterized constructor.
     *
     * @param radius radius of the circle
     */
    public Circle(double radius) {
        this.radius = radius;
    }

    /**
     * Gets circle radius.
     *
     * @return radius
     */
    public double getRadius() {
        return radius;
    }

    /**
     * Sets circle radius.
     *
     * @param radius radius
     */
    public void setRadius(double radius) {
        this.radius = radius;
    }

    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }

    @Override
    public double getPerimeter() {
        return 2 * Math.PI * radius;
    }

    @Override
    public void printResult() {
        System.out.println("-----Circle-----");
        System.out.println("Radius: " + radius);
        System.out.println("Area:" + getArea());
        System.out.println("Perimeter:" + getPerimeter());
    }
}
