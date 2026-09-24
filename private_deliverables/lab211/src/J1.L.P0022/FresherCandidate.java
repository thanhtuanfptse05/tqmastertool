package candidatemanagement.model;

/**
 * Model class representing a Fresher Candidate.
 * Extends Candidate with graduation-related attributes.
 */
public class FresherCandidate extends Candidate {

    /** Valid graduation ranks. */
    public static final String[] VALID_RANKS = {"Excellence", "Good", "Fair", "Poor"};

    private String graduationDate;  // e.g. "2024-06"
    private String graduationRank;  // Excellence, Good, Fair, Poor
    private String education;       // university name

    /**
     * Constructs a FresherCandidate.
     *
     * @param candidateId    unique candidate ID
     * @param firstName      first name
     * @param lastName       last name
     * @param birthDate      birth year
     * @param address        address
     * @param phone          phone number
     * @param email          email
     * @param graduationDate graduation date (e.g. "2024-06")
     * @param graduationRank rank: Excellence, Good, Fair, or Poor
     * @param education      university name
     */
    public FresherCandidate(String candidateId, String firstName, String lastName,
                            int birthDate, String address, String phone, String email,
                            String graduationDate, String graduationRank, String education) {
        super(candidateId, firstName, lastName, birthDate, address, phone, email, TYPE_FRESHER);
        this.graduationDate = graduationDate;
        this.graduationRank = graduationRank;
        this.education = education;
    }

    public String getGraduationDate() {
        return graduationDate;
    }

    public void setGraduationDate(String graduationDate) {
        this.graduationDate = graduationDate;
    }

    public String getGraduationRank() {
        return graduationRank;
    }

    public void setGraduationRank(String graduationRank) {
        this.graduationRank = graduationRank;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    @Override
    public String toDetailString() {
        return String.format(
                "  ID: %s | Name: %s | BirthYear: %d | Address: %s | Phone: %s | Email: %s | GradDate: %s | Rank: %s | University: %s",
                getCandidateId(), getFullName(), getBirthDate(),
                getAddress(), getPhone(), getEmail(),
                graduationDate, graduationRank, education);
    }
}
