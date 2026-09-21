package feastorder.model;

/**
 * Model class representing a Set Menu entity loaded from CSV.
 */
public class FeastMenu {

    private String code;
    private String name;
    private double price;
    private String ingredients;

    public FeastMenu() {
    }

    public FeastMenu(String code, String name, double price, String ingredients) {
        this.code = code;
        this.name = name;
        this.price = price;
        this.ingredients = ingredients;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getIngredients() {
        return ingredients;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    /**
     * Returns ingredients formatted with '+ ' per line.
     *
     * @return formatted ingredients string
     */
    public String getFormattedIngredients() {
        if (ingredients == null || ingredients.isEmpty()) {
            return "";
        }
        String[] parts = ingredients.split("#");
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < parts.length; i++) {
            sb.append("+ ").append(parts[i].trim());
            if (i < parts.length - 1) {
                sb.append("\n");
            }
        }
        return sb.toString();
    }
}
