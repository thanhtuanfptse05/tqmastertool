package calculator.controller;

import calculator.model.BMIData;
import calculator.model.BMIStatus;
import calculator.model.Operator;

/**
 * Controller class executing arithmetic and BMI calculations.
 */
public class CalculatorController {

    /**
     * Calculates the result of an arithmetic operation between two numbers.
     *
     * @param a first operand
     * @param operator arithmetic operator
     * @param b second operand
     * @return result of the operation
     * @throws ArithmeticException if division by zero is attempted
     */
    public double calculate(double a, Operator operator, double b) {
        if (operator == null) {
            throw new IllegalArgumentException("Operator cannot be null.");
        }
        switch (operator) {
            case ADD:
                return a + b;
            case SUBTRACT:
                return a - b;
            case MULTIPLY:
                return a * b;
            case DIVIDE:
                if (b == 0) {
                    throw new ArithmeticException("Divide by zero.");
                }
                return a / b;
            case EXPONENT:
                return Math.pow(a, b);
            default:
                throw new UnsupportedOperationException("Unsupported operator: " + operator);
        }
    }

    /**
     * Calculates the BMI index and determines the body status.
     *
     * @param weight body weight in kilograms
     * @param height height in centimeters
     * @return BMIStatus classification
     */
    public BMIStatus calculateBMI(double weight, double height) {
        double bmi = calculateBMIScore(weight, height);

        if (bmi < 19) {
            return BMIStatus.UNDER_STANDARD;
        } else if (bmi <= 25) {
            return BMIStatus.STANDARD;
        } else if (bmi <= 30) {
            return BMIStatus.OVERWEIGHT;
        } else if (bmi <= 40) {
            return BMIStatus.FAT;
        } else {
            return BMIStatus.VERY_FAT;
        }
    }

    /**
     * Calculates the raw BMI score: weight / (heightInMeters ^ 2).
     *
     * @param weight weight in kg
     * @param height height in cm
     * @return numeric BMI score
     */
    public double calculateBMIScore(double weight, double height) {
        if (height <= 0 || weight <= 0) {
            throw new IllegalArgumentException("Weight and height must be positive values.");
        }
        double heightInM = height / 100.0;
        return weight / (heightInM * heightInM);
    }

    /**
     * Processes BMI calculation and updates BMIData model.
     *
     * @param data BMIData model containing weight and height
     * @return populated BMIData
     */
    public BMIData processBMI(BMIData data) {
        double score = calculateBMIScore(data.getWeight(), data.getHeight());
        BMIStatus status = calculateBMI(data.getWeight(), data.getHeight());
        data.setBmiScore(score);
        data.setStatus(status);
        return data;
    }
}
