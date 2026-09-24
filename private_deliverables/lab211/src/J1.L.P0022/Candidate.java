package candidatemanagement.model;

/**
 * Abstract superclass representing a Candidate.
 * Contains common attributes shared by all candidate types.
 */
public abstract class Candidate {

    /** Candidate type constant for Experience. */
    public static final int TYPE_EXPERIENCE = 0;
    /** Candidate type constant for Fresher. */
    public static final int TYPE_FRESHER = 1;
    /** Candidate type constant for Intern. */
    public static final int TYPE_INTERN = 2;

    private String candidateId;
    private String firstName;
    private String lastName;
    private int birthDate;       // year only, e.g. 1995
    private String address;
    private String phone;
    private String email;
    private int candidateType;   // 0=Experience, 1=Fresher, 2=Intern

    /**
     * Constructs a Candidate with all common fields.
     *
     * @param candidateId   unique candidate ID
     * @param firstName     first name
     * @param lastName      last name
     * @param birthDate     birth year (1900..current year)
     * @param address       home address
     * @param phone         phone number (min 10 digits)
     * @param email         email address
     * @param candidateType 0=Experience, 1=Fresher, 2=Intern
     */
    public Candidate(String candidateId, String firstName, String lastName,
                     int birthDate, String address, String phone,
                     String email, int candidateType) {
        this.candidateId = candidateId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.candidateType = candidateType;
    }

    public String getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(String candidateId) {
        this.candidateId = candidateId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public int getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(int birthDate) {
        this.birthDate = birthDate;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public int getCandidateType() {
        return candidateType;
    }

    public void setCandidateType(int candidateType) {
        this.candidateType = candidateType;
    }

    /**
     * Returns the full name (First + Last).
     *
     * @return full name string
     */
    public String getFullName() {
        return firstName + " " + lastName;
    }

    /**
     * Returns a string label for the candidate type.
     *
     * @return "Experience", "Fresher", or "Intern"
     */
    public String getCandidateTypeLabel() {
        switch (candidateType) {
            case TYPE_EXPERIENCE: return "Experience";
            case TYPE_FRESHER:    return "Fresher";
            case TYPE_INTERN:     return "Intern";
            default:              return "Unknown";
        }
    }

    /**
     * Returns a formatted summary line for search results.
     *
     * @return formatted display string
     */
    public String toSearchResultString() {
        return String.format("%s | %d | %s | %s | %s | %d",
                getFullName(), birthDate, address, phone, email, candidateType);
    }

    /**
     * Abstract method for displaying full candidate details.
     *
     * @return detailed string representation
     */
    public abstract String toDetailString();
}
