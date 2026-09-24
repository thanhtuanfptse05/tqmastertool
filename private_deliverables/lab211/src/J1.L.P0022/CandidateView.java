package candidatemanagement.view;

import candidatemanagement.controller.CandidateController;
import candidatemanagement.controller.InputValidator;
import candidatemanagement.model.Candidate;

import java.util.List;

/**
 * CandidateView handles all console display and menu interaction.
 * Calls InputValidator for input, CandidateController for data operations.
 */
public class CandidateView {

    private CandidateController controller;

    /**
     * Constructs a CandidateView with the given controller.
     *
     * @param controller the CandidateController to use
     */
    public CandidateView(CandidateController controller) {
        this.controller = controller;
    }

    /**
     * Displays the main menu and returns user's choice.
     *
     * @return chosen option (1-5)
     */
    public int displayMenu() {
        System.out.println("\n========================================");
        System.out.println("      CANDIDATE MANAGEMENT SYSTEM       ");
        System.out.println("========================================");
        System.out.println("  1. Experience");
        System.out.println("  2. Fresher");
        System.out.println("  3. Internship");
        System.out.println("  4. Searching");
        System.out.println("  5. Exit");
        System.out.println("----------------------------------------");
        return InputValidator.inputInteger(
                "Please choose (1-Experience, 2-Fresher, 3-Internship, 4-Searching, 5-Exit): ",
                1, 5);
    }

    /**
     * Handles creating Experience Candidates in a loop.
     * After each candidate is created, asks Y/N to continue.
     * When done, displays all candidates.
     */
    public void handleCreateExperience() {
        System.out.println("\n--- CREATE EXPERIENCE CANDIDATE ---");
        boolean keepAdding = true;
        while (keepAdding) {
            inputAndCreateExperience();
            boolean cont = InputValidator.inputYesNo("Do you want to continue? (Y/N): ");
            if (!cont) {
                keepAdding = false;
            }
        }
        displayAllCandidates();
    }

    /**
     * Handles creating Fresher Candidates in a loop.
     * After each candidate is created, asks Y/N to continue.
     * When done, displays all candidates.
     */
    public void handleCreateFresher() {
        System.out.println("\n--- CREATE FRESHER CANDIDATE ---");
        boolean keepAdding = true;
        while (keepAdding) {
            inputAndCreateFresher();
            boolean cont = InputValidator.inputYesNo("Do you want to continue? (Y/N): ");
            if (!cont) {
                keepAdding = false;
            }
        }
        displayAllCandidates();
    }

    /**
     * Handles creating Intern Candidates in a loop.
     * After each candidate is created, asks Y/N to continue.
     * When done, displays all candidates.
     */
    public void handleCreateIntern() {
        System.out.println("\n--- CREATE INTERN CANDIDATE ---");
        boolean keepAdding = true;
        while (keepAdding) {
            inputAndCreateIntern();
            boolean cont = InputValidator.inputYesNo("Do you want to continue? (Y/N): ");
            if (!cont) {
                keepAdding = false;
            }
        }
        displayAllCandidates();
    }

    /**
     * Reads fields and creates one ExperienceCandidate via controller.
     */
    private void inputAndCreateExperience() {
        System.out.println("\n-- Enter Experience Candidate information --");
        String id = readUniqueId();
        String firstName  = InputValidator.inputString("First Name: ");
        String lastName   = InputValidator.inputString("Last Name: ");
        int    birthYear  = InputValidator.inputBirthYear("Birth Year (e.g. 1990): ");
        String address    = InputValidator.inputString("Address: ");
        String phone      = InputValidator.inputPhone("Phone (min 10 digits): ");
        String email      = InputValidator.inputEmail("Email (e.g. user@fpt.edu.vn): ");
        int    expInYear  = InputValidator.inputExpInYear("Years of Experience (0-100): ");
        String proSkill   = InputValidator.inputString("Professional Skill: ");

        controller.createExperienceCandidate(id, firstName, lastName, birthYear,
                address, phone, email, expInYear, proSkill);
        System.out.println("Experience Candidate created successfully.");
    }

    /**
     * Reads fields and creates one FresherCandidate via controller.
     */
    private void inputAndCreateFresher() {
        System.out.println("\n-- Enter Fresher Candidate information --");
        String id             = readUniqueId();
        String firstName      = InputValidator.inputString("First Name: ");
        String lastName       = InputValidator.inputString("Last Name: ");
        int    birthYear      = InputValidator.inputBirthYear("Birth Year (e.g. 2002): ");
        String address        = InputValidator.inputString("Address: ");
        String phone          = InputValidator.inputPhone("Phone (min 10 digits): ");
        String email          = InputValidator.inputEmail("Email (e.g. user@fpt.edu.vn): ");
        String graduationDate = InputValidator.inputGraduationDate("Graduation Date (e.g. 2024-06): ");
        String graduationRank = InputValidator.inputGraduationRank("Graduation Rank:");
        String education      = InputValidator.inputString("University Name: ");

        controller.createFresherCandidate(id, firstName, lastName, birthYear,
                address, phone, email, graduationDate, graduationRank, education);
        System.out.println("Fresher Candidate created successfully.");
    }

    /**
     * Reads fields and creates one InternCandidate via controller.
     */
    private void inputAndCreateIntern() {
        System.out.println("\n-- Enter Intern Candidate information --");
        String id         = readUniqueId();
        String firstName  = InputValidator.inputString("First Name: ");
        String lastName   = InputValidator.inputString("Last Name: ");
        int    birthYear  = InputValidator.inputBirthYear("Birth Year (e.g. 2004): ");
        String address    = InputValidator.inputString("Address: ");
        String phone      = InputValidator.inputPhone("Phone (min 10 digits): ");
        String email      = InputValidator.inputEmail("Email (e.g. user@fpt.edu.vn): ");
        String majors     = InputValidator.inputString("Majors (field of study): ");
        int    semester   = InputValidator.inputInteger("Semester (1-12): ", 1, 12);
        String university = InputValidator.inputString("University Name: ");

        controller.createInternCandidate(id, firstName, lastName, birthYear,
                address, phone, email, majors, semester, university);
        System.out.println("Intern Candidate created successfully.");
    }

    /**
     * Reads a candidate ID, re-prompting if the ID already exists.
     *
     * @return a unique, valid candidate ID
     */
    private String readUniqueId() {
        while (true) {
            String id = InputValidator.inputCandidateId("Candidate ID: ");
            if (controller.isIdDuplicate(id)) {
                System.out.println("ID '" + id + "' already exists. Please enter a different ID.");
            } else {
                return id;
            }
        }
    }

    /**
     * Handles the Searching function.
     * Shows all candidates grouped by type, then prompts name + type to search.
     */
    public void handleSearch() {
        System.out.println("\n--- SEARCHING ---");
        displayAllCandidatesByType();

        String nameKeyword = InputValidator.inputString("Input Candidate name (First name or Last name): ");
        int type = InputValidator.inputInteger(
                "Input type of candidate (0=Experience, 1=Fresher, 2=Intern): ", 0, 2);

        List<Candidate> results = controller.searchByNameAndType(nameKeyword, type);

        if (results.isEmpty()) {
            System.out.println("No candidates found matching name '" + nameKeyword
                    + "' with type " + type + ".");
        } else {
            System.out.println("\nThe candidates found:");
            System.out.println("----------------------------------------------------------");
            for (Candidate c : results) {
                System.out.println(c.toSearchResultString());
            }
        }
    }

    /**
     * Displays all candidates, grouped by type (Experience / Fresher / Intern).
     */
    private void displayAllCandidatesByType() {
        System.out.println("\nList of candidate:");

        List<Candidate> expList = controller.getCandidatesByType(Candidate.TYPE_EXPERIENCE);
        System.out.println("===========EXPERIENCE CANDIDATE============");
        if (expList.isEmpty()) {
            System.out.println("  (none)");
        } else {
            for (Candidate c : expList) {
                System.out.println(c.getFullName());
            }
        }

        List<Candidate> fresherList = controller.getCandidatesByType(Candidate.TYPE_FRESHER);
        System.out.println("==========FRESHER CANDIDATE==============");
        if (fresherList.isEmpty()) {
            System.out.println("  (none)");
        } else {
            for (Candidate c : fresherList) {
                System.out.println(c.getFullName());
            }
        }

        List<Candidate> internList = controller.getCandidatesByType(Candidate.TYPE_INTERN);
        System.out.println("===========INTERN CANDIDATE==============");
        if (internList.isEmpty()) {
            System.out.println("  (none)");
        } else {
            for (Candidate c : internList) {
                System.out.println(c.getFullName());
            }
        }
    }

    /**
     * Displays all created candidates with full details grouped by type.
     */
    private void displayAllCandidates() {
        System.out.println("\n========== ALL CANDIDATES (" + controller.getCandidateCount() + " total) ==========");
        displayAllCandidatesByType();
    }

    /**
     * Displays an exit message.
     */
    public void displayExit() {
        System.out.println("\nThank you for using Candidate Management System. Goodbye!");
    }
}
