package shape.controller;

import shape.model.Circle;
import shape.model.Rectangle;
import shape.model.Triangle;

/**
 * Controller class coordinating shape creation and geometric validations.
 */
public class ShapeController {

    /**
     * Checks if three given side lengths can form a valid triangle.
     * Must be positive and satisfy the triangle inequality theorem.
     *
     * @param a length of side A
     * @param b length of side B
     * @param c length of side C
     * @return true if sides form a valid triangle, false otherwise
     */
    public boolean isValidTriangle(double a, double b, double c) {
        return (a > 0 && b > 0 && c > 0)
                && (a + b > c)
                && (a + c > b)
                && (b + c > a);
    }

    /**
     * Creates a validated Rectangle.
     *
     * @param width width (> 0)
     * @param length length (> 0)
     * @return new Rectangle
     */
    public Rectangle createRectangle(double width, double length) {
        if (width <= 0 || length <= 0) {
            throw new IllegalArgumentException("Width and length must be greater than 0.");
        }
        return new Rectangle(width, length);
    }

    /**
     * Creates a validated Circle.
     *
     * @param radius radius (> 0)
     * @return new Circle
     */
    public Circle createCircle(double radius) {
        if (radius <= 0) {
            throw new IllegalArgumentException("Radius must be greater than 0.");
        }
        return new Circle(radius);
    }

    /**
     * Creates a validated Triangle.
     *
     * @param a side A
     * @param b side B
     * @param c side C
     * @return new Triangle
     */
    public Triangle createTriangle(double a, double b, double c) {
        if (!isValidTriangle(a, b, c)) {
            throw new IllegalArgumentException("Invalid triangle sides: must satisfy triangle inequality.");
        }
        return new Triangle(a, b, c);
    }
}
