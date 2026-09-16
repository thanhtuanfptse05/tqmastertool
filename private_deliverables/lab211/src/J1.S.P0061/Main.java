package shape;

import shape.controller.ShapeController;
import shape.model.Circle;
import shape.model.Rectangle;
import shape.model.Triangle;
import shape.view.ShapeView;

/**
 * Main application entry point for J1.S.P0061 (Calculator Shape Program).
 */
public class Main {

    /**
     * Program main method.
     *
     * @param args command line arguments
     */
    public static void main(String[] args) {
        ShapeController controller = new ShapeController();
        ShapeView view = new ShapeView(controller);

        view.displayHeader();

        Rectangle rectangle = view.inputRectangle();
        Circle circle = view.inputCircle();
        Triangle triangle = view.inputTriangle();

        rectangle.printResult();
        circle.printResult();
        triangle.printResult();
    }
}
