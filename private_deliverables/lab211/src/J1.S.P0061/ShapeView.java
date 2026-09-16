package shape.view;

import shape.controller.InputValidator;
import shape.controller.ShapeController;
import shape.model.Circle;
import shape.model.Rectangle;
import shape.model.Triangle;

/**
 * View class handling console UI and interaction for Shape calculations.
 */
public class ShapeView {

    private final ShapeController controller;

    /**
     * Parameterized constructor.
     *
     * @param controller the shape business controller
     */
    public ShapeView(ShapeController controller) {
        this.controller = controller;
    }

    /**
     * Displays header of the program.
     */
    public void displayHeader() {
        System.out.println("=====Calculator Shape Program=====");
    }

    /**
     * Inputs data and creates a Rectangle.
     *
     * @return valid Rectangle
     */
    public Rectangle inputRectangle() {
        double width = InputValidator.getPositiveDouble("Please input side width of Rectangle:");
        double length = InputValidator.getPositiveDouble("Please input length of Rectangle:");
        return controller.createRectangle(width, length);
    }

    /**
     * Inputs data and creates a Circle.
     *
     * @return valid Circle
     */
    public Circle inputCircle() {
        double radius = InputValidator.getPositiveDouble("Please input radius of Circle:");
        return controller.createCircle(radius);
    }

    /**
     * Inputs data and creates a Triangle, verifying triangle inequality.
     *
     * @return valid Triangle
     */
    public Triangle inputTriangle() {
        while (true) {
            double a = InputValidator.getPositiveDouble("Please input side A of Triangle:");
            double b = InputValidator.getPositiveDouble("Please input side B of Triangle:");
            double c = InputValidator.getPositiveDouble("Please input side C of Triangle:");

            if (controller.isValidTriangle(a, b, c)) {
                return controller.createTriangle(a, b, c);
            }
            System.out.println("These 3 sides do not form a valid triangle (sum of two sides must be greater than the third). Please re-enter.");
        }
    }
}
