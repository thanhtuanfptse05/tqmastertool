package calculator.model;

/**
 * Enum representing body status based on BMI score.
 */
public enum BMIStatus {
    UNDER_STANDARD("Under-standard"),
    STANDARD("STANDARD"),
    OVERWEIGHT("Overweight"),
    FAT("Fat - should lose weight"),
    VERY_FAT("Very fat - should lose weight immediately");

    private final String description;

    BMIStatus(String description) {
        this.description = description;
    }

    /**
     * Gets description label of the status.
     *
     * @return status description string
     */
    public String getDescription() {
        return description;
    }
}
