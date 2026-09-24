package candidatemanagement.controller;

import candidatemanagement.model.Candidate;
import candidatemanagement.model.ExperienceCandidate;
import candidatemanagement.model.FresherCandidate;
import candidatemanagement.model.InternCandidate;

import java.util.ArrayList;
import java.util.List;

/**
 * CandidateController handles all business logic for candidate management.
 * Acts as the bridge between View and Model layers.
 */
public class CandidateController {

    private List<Candidate> candidateList;

    /**
     * Constructs a new CandidateController with an empty candidate list.
     */
    public CandidateController() {
        this.candidateList = new ArrayList<Candidate>();
    }

    /**
     * Checks whether a candidate ID already exists.
     *
     * @param id the ID to check
     * @return true if ID is already taken
     */
    public boolean isIdDuplicate(String id) {
        for (Candidate c : candidateList) {
            if (c.getCandidateId().equalsIgnoreCase(id)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Adds a candidate to the list.
     *
     * @param candidate the Candidate object to add
     */
    public void addCandidate(Candidate candidate) {
        candidateList.add(candidate);
    }

    /**
     * Returns all candidates of a specific type.
     *
     * @param type 0=Experience, 1=Fresher, 2=Intern
     * @return filtered list of candidates
     */
    public List<Candidate> getCandidatesByType(int type) {
        List<Candidate> result = new ArrayList<Candidate>();
        for (Candidate c : candidateList) {
            if (c.getCandidateType() == type) {
                result.add(c);
            }
        }
        return result;
    }

    /**
     * Returns all candidates in the system.
     *
     * @return complete candidate list
     */
    public List<Candidate> getAllCandidates() {
        return candidateList;
    }

    /**
     * Returns total number of candidates.
     *
     * @return size of candidate list
     */
    public int getCandidateCount() {
        return candidateList.size();
    }

    /**
     * Searches candidates by name (first or last) and candidate type.
     * Name search is case-insensitive partial match.
     *
     * @param nameKeyword part of first name or last name to search
     * @param type        candidate type (0, 1, or 2)
     * @return list of matching candidates
     */
    public List<Candidate> searchByNameAndType(String nameKeyword, int type) {
        List<Candidate> result = new ArrayList<Candidate>();
        String keyword = nameKeyword.toLowerCase();
        for (Candidate c : candidateList) {
            boolean nameMatch = c.getFirstName().toLowerCase().contains(keyword)
                    || c.getLastName().toLowerCase().contains(keyword);
            boolean typeMatch = c.getCandidateType() == type;
            if (nameMatch && typeMatch) {
                result.add(c);
            }
        }
        return result;
    }

    /**
     * Creates and adds an ExperienceCandidate from validated field values.
     *
     * @param id        candidate ID
     * @param firstName first name
     * @param lastName  last name
     * @param birthYear birth year
     * @param address   address
     * @param phone     phone
     * @param email     email
     * @param expInYear years of experience
     * @param proSkill  professional skill
     */
    public void createExperienceCandidate(String id, String firstName, String lastName,
                                          int birthYear, String address, String phone,
                                          String email, int expInYear, String proSkill) {
        addCandidate(new ExperienceCandidate(id, firstName, lastName, birthYear,
                address, phone, email, expInYear, proSkill));
    }

    /**
     * Creates and adds a FresherCandidate from validated field values.
     *
     * @param id             candidate ID
     * @param firstName      first name
     * @param lastName       last name
     * @param birthYear      birth year
     * @param address        address
     * @param phone          phone
     * @param email          email
     * @param graduationDate graduation date string
     * @param graduationRank graduation rank
     * @param education      university name
     */
    public void createFresherCandidate(String id, String firstName, String lastName,
                                       int birthYear, String address, String phone,
                                       String email, String graduationDate,
                                       String graduationRank, String education) {
        addCandidate(new FresherCandidate(id, firstName, lastName, birthYear,
                address, phone, email, graduationDate, graduationRank, education));
    }

    /**
     * Creates and adds an InternCandidate from validated field values.
     *
     * @param id         candidate ID
     * @param firstName  first name
     * @param lastName   last name
     * @param birthYear  birth year
     * @param address    address
     * @param phone      phone
     * @param email      email
     * @param majors     field of study
     * @param semester   current semester
     * @param university university name
     */
    public void createInternCandidate(String id, String firstName, String lastName,
                                      int birthYear, String address, String phone,
                                      String email, String majors, int semester,
                                      String university) {
        addCandidate(new InternCandidate(id, firstName, lastName, birthYear,
                address, phone, email, majors, semester, university));
    }
}
