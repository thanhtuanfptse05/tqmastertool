package candidatemanagement.model;

/**
 * Model class representing an Intern Candidate.
 * Extends Candidate with internship-specific attributes.
 */
public class InternCandidate extends Candidate {

    private String majors;       // field of study / major
    private int semester;        // current semester
    private String university;   // university name

    /**
     * Constructs an InternCandidate.
     *
     * @param candidateId unique candidate ID
     * @param firstName   first name
     * @param lastName    last name
     * @param birthDate   birth year
     * @param address     address
     * @param phone       phone number
     * @param email       email
     * @param majors      field of study
     * @param semester    current semester number
     * @param university  university name
     */
    public InternCandidate(String candidateId, String firstName, String lastName,
                           int birthDate, String address, String phone, String email,
                           String majors, int semester, String university) {
        super(candidateId, firstName, lastName, birthDate, address, phone, email, TYPE_INTERN);
        this.majors = majors;
        this.semester = semester;
        this.university = university;
    }

    public String getMajors() {
        return majors;
    }

    public void setMajors(String majors) {
        this.majors = majors;
    }

    public int getSemester() {
        return semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    @Override
    public String toDetailString() {
        return String.format(
                "  ID: %s | Name: %s | BirthYear: %d | Address: %s | Phone: %s | Email: %s | Majors: %s | Semester: %d | University: %s",
                getCandidateId(), getFullName(), getBirthDate(),
                getAddress(), getPhone(), getEmail(),
                majors, semester, university);
    }
}
