package shape.model;

/**
 * Model class representing a Triangle shape.
 */
public class Triangle extends Shape {

    private double sideA;
    private double sideB;
    private double sideC;

    /**
     * Default constructor.
     */
    public Triangle() {
    }

    /**
     * Parameterized constructor.
     *
     * @param sideA length of side A
     * @param sideB length of side B
     * @param sideC length of side C
     */
    public Triangle(double sideA, double sideB, double sideC) {
        this.sideA = sideA;
        this.sideB = sideB;
        this.sideC = sideC;
    }

    /**
     * Gets length of side A.
     *
     * @return side A
     */
    public double getSideA() {
        return sideA;
    }

    /**
     * Sets length of side A.
     *
     * @param sideA side A length
     */
    public void setSideA(double sideA) {
        this.sideA = sideA;
    }

    /**
     * Gets length of side B.
     *
     * @return side B
     */
    public double getSideB() {
        return sideB;
    }

    /**
     * Sets length of side B.
     *
     * @param sideB side B length
     */
    public void setSideB(double sideB) {
        this.sideB = sideB;
    }

    /**
     * Gets length of side C.
     *
     * @return side C
     */
    public double getSideC() {
        return sideC;
    }

    /**
     * Sets length of side C.
     *
     * @param sideC side C length
     */
    public void setSideC(double sideC) {
        this.sideC = sideC;
    }

    @Override
    public double getPerimeter() {
        return sideA + sideB + sideC;
    }

    @Override
    public double getArea() {
        double p = getPerimeter() / 2.0;
        return Math.sqrt(p * (p - sideA) * (p - sideB) * (p - sideC));
    }

    @Override
    public void printResult() {
        System.out.println("-----Triangle-----");
        System.out.println("Side A: " + sideA);
        System.out.println("Side B: " + sideB);
        System.out.println("Side C: " + sideC);
        System.out.println("Area:" + getArea());
        System.out.println("Perimeter:" + getPerimeter());
    }
}
