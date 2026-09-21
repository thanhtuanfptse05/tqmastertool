package feastorder.model;

import java.io.Serializable;

/**
 * Model class representing a Customer entity.
 * Only manages data, state, constructor, and getter/setter methods.
 */
public class Customer implements Serializable {

    private static final long serialVersionUID = 1L;

    private String code;
    private String name;
    private String phone;
    private String email;

    public Customer() {
    }

    public Customer(String code, String name, String phone, String email) {
        this.code = code;
        this.name = name;
        this.phone = phone;
        this.email = email;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return String.format("%s | %s | %s | %s", code, name, phone, email);
    }
}
