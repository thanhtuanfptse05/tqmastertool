package calculator.model;

/**
 * Model representing BMI input data and calculation results.
 */
public class BMIData {

    private double weight;
    private double height;
    private double bmiScore;
    private BMIStatus status;

    /**
     * Default constructor.
     */
    public BMIData() {
    }

    /**
     * Parameterized constructor.
     *
     * @param weight body weight in kg
     * @param height height in cm
     */
    public BMIData(double weight, double height) {
        this.weight = weight;
        this.height = height;
    }

    /**
     * Gets weight in kg.
     *
     * @return weight
     */
    public double getWeight() {
        return weight;
    }

    /**
     * Sets weight in kg.
     *
     * @param weight body weight
     */
    public void setWeight(double weight) {
        this.weight = weight;
    }

    /**
     * Gets height in cm.
     *
     * @return height
     */
    public double getHeight() {
        return height;
    }

    /**
     * Sets height in cm.
     *
     * @param height body height
     */
    public void setHeight(double height) {
        this.height = height;
    }

    /**
     * Gets calculated BMI score.
     *
     * @return BMI score
     */
    public double getBmiScore() {
        return bmiScore;
    }

    /**
     * Sets calculated BMI score.
     *
     * @param bmiScore BMI score
     */
    public void setBmiScore(double bmiScore) {
        this.bmiScore = bmiScore;
    }

    /**
     * Gets BMI status.
     *
     * @return BMI status
     */
    public BMIStatus getStatus() {
        return status;
    }

    /**
     * Sets BMI status.
     *
     * @param status BMI status
     */
    public void setStatus(BMIStatus status) {
        this.status = status;
    }
}
