package candidatemanagement.model;

/**
 * Model class representing an Experience Candidate.
 * Extends Candidate with experience-specific attributes.
 */
public class ExperienceCandidate extends Candidate {

    private int expInYear;      // years of experience (0-100)
    private String proSkill;    // professional skill

    /**
     * Constructs an ExperienceCandidate.
     *
     * @param candidateId unique candidate ID
     * @param firstName   first name
     * @param lastName    last name
     * @param birthDate   birth year
     * @param address     address
     * @param phone       phone number
     * @param email       email
     * @param expInYear   years of experience (0-100)
     * @param proSkill    professional skill description
     */
    public ExperienceCandidate(String candidateId, String firstName, String lastName,
                               int birthDate, String address, String phone, String email,
                               int expInYear, String proSkill) {
        super(candidateId, firstName, lastName, birthDate, address, phone, email, TYPE_EXPERIENCE);
        this.expInYear = expInYear;
        this.proSkill = proSkill;
    }

    public int getExpInYear() {
        return expInYear;
    }

    public void setExpInYear(int expInYear) {
        this.expInYear = expInYear;
    }

    public String getProSkill() {
        return proSkill;
    }

    public void setProSkill(String proSkill) {
        this.proSkill = proSkill;
    }

    @Override
    public String toDetailString() {
        return String.format(
                "  ID: %s | Name: %s | BirthYear: %d | Address: %s | Phone: %s | Email: %s | ExpInYear: %d | ProSkill: %s",
                getCandidateId(), getFullName(), getBirthDate(),
                getAddress(), getPhone(), getEmail(),
                expInYear, proSkill);
    }
}
