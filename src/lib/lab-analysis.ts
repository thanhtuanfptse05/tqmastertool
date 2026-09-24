// ==========================================================
// LAB211 – PHÂN TÍCH ĐỀ, HƯỚNG DẪN TƯ DUY & CÂU HỎI ÔN TẬP
// Dữ liệu học thuật tĩnh cho từng bài lab
// ==========================================================

export interface LabFaqItem {
  question: string;
  answer: string;
  type: "theory" | "applied";
}

export interface LabAnalysis {
  labCode: string;
  /** Tóm tắt yêu cầu bài bằng tiếng Việt (ngắn gọn, dễ hiểu) */
  summary: string;
  /** Hướng dẫn tư duy từng bước để tiếp cận bài */
  mindset: string[];
  /** Các khái niệm OOP/Java được áp dụng trong bài */
  oopConcepts: string[];
  /** Câu hỏi hay gặp: 3 lý thuyết + 2 thực hành */
  faq: LabFaqItem[];
}

export const LAB_ANALYSIS_MAP: Record<string, LabAnalysis> = {
  // =====================================================================
  // J1.L.P0021 – STUDENT MANAGEMENT SYSTEM
  // =====================================================================
  "J1.L.P0021": {
    labCode: "J1.L.P0021",
    summary:
      "Bài yêu cầu xây dựng ứng dụng console quản lý Sinh viên (Student) bằng Java chuẩn mô hình MVC. Sinh viên có các thuộc tính: ID (chuỗi chữ/số không trùng lặp), Tên sinh viên, Học kỳ (1-9), Tên môn học (chỉ được chọn 1 trong 3 môn: Java, .Net, C/C++). Ứng dụng cung cấp 5 chức năng menu: (1) Tạo sinh viên (bắt buộc nhập tối thiểu 10 bản ghi, sau đó hỏi tiếp tục Y/N); (2) Tìm kiếm theo tên (tìm kiếm một phần, không phân biệt hoa thường) và sắp xếp kết quả tăng dần theo tên; (3) Cập nhật hoặc Xóa theo ID (cho phép chọn U để sửa hoặc D để xóa có xác nhận Y/N); (4) Thống kê Report (gom nhóm theo Tên sinh viên + Tên môn học và đếm tổng số lần học); (5) Thoát chương trình.",
    mindset: [
      "**Bước 1 – Xây dựng Model:** Tạo class `Student` (id, studentName, semester, courseName). Đóng gói toàn bộ thuộc tính `private`, viết constructor đầy đủ, getters/setters và `toString()` định dạng cột rõ ràng.",
      "**Bước 2 – Thiết kế Controller nghiệp vụ:** `StudentController` quản lý `List<Student>`. Viết các phương thức: `addStudent()`, `isIdDuplicate()`, `findById()`, `findAndSortByName()`, `updateStudent()`, `deleteStudent()`, `generateReport()`.",
      "**Bước 3 – Xây dựng tầng Validation (InputValidator):** Đặt trong package `controller`. Xử lý kiểm tra: ID chữ/số không rỗng và không trùng, Tên chuỗi hợp lệ, Học kỳ 1-9, Môn học chỉ thuộc danh sách [Java, .Net, C/C++], xác nhận Y/N và lựa chọn U/D.",
      "**Bước 4 – Logic Sắp xếp & Báo cáo:** Dùng `Collections.sort()` kết hợp `Comparator<Student>` để sắp xếp tăng dần theo tên không phân biệt hoa thường. Với hàm Report: duyệt qua danh sách, tạo key gom nhóm `studentName + '|' + courseName` để đếm số lượng lặp lại của từng môn học.",
      "**Bước 5 – Xây dựng tầng View:** `StudentView` in menu 5 chức năng, tiếp nhận lựa chọn người dùng, gọi `InputValidator` để đọc dữ liệu và ủy quyền cho `StudentController` xử lý, sau đó in kết quả dạng bảng.",
      "**Bước 6 – Vòng lặp Main Loop:** `Main.java` khởi tạo `StudentController` và `StudentView`, điều phối vòng lặp `while(running)` menu 1-5.",
    ],
    oopConcepts: [
      "**MVC Architecture** – Phân tách 3 tầng rành mạch: Model (Student), Controller (StudentController, InputValidator) và View (StudentView, Main).",
      "**Encapsulation** – Toàn bộ thuộc tính sinh viên được bảo vệ với phạm vi `private`, chỉ cho phép truy xuất qua getter/setter hợp lệ.",
      "**Comparator & Custom Sorting** – Triển khai anonymous `Comparator<Student>` để so sánh `s1.getStudentName().compareToIgnoreCase(s2.getStudentName())`.",
      "**Data Aggregation** – Thuật toán gom nhóm dữ liệu theo cặp thuộc tính `(Name, Course)` và đếm tần suất xuất hiện.",
      "**Defensive Input Validation** – Kiểm tra chặt chẽ tính duy nhất của ID, khoảng giá trị học kỳ và danh mục môn học cố định.",
    ],
    faq: [
      {
        type: "theory",
        question:
          "Tại sao logic kiểm tra trùng ID (isIdDuplicate) và validation phải đặt ở Controller thay vì trong Model hay View?",
        answer:
          "Theo quy chuẩn kiến trúc MVC của LAB211, Model chỉ là đối tượng thuần chứa dữ liệu (POJO), không biết về danh sách chung hay ngữ cảnh nhập liệu. View chỉ chịu trách nhiệm hiển thị console. Controller là tầng nắm giữ danh sách dữ liệu sinh viên trong bộ nhớ nên chỉ Controller mới có thể kiểm tra xem ID đã tồn tại trong danh sách hay chưa. Đặt InputValidator ở package controller giúp tái sử dụng và kiểm soát toàn bộ ràng buộc nghiệp vụ.",
      },
      {
        type: "theory",
        question:
          "Thuật toán sắp xếp danh sách sinh viên theo tên hoạt động như thế nào trong bài này?",
        answer:
          "Sử dụng Collections.sort(result, new Comparator<Student>() { ... }). Trong phương thức compare(Student s1, Student s2), ta gọi s1.getStudentName().compareToIgnoreCase(s2.getStudentName()). Phương thức này so sánh chuỗi theo thứ tự từ điển mã ASCII/Unicode không phân biệt hoa thường: trả về số âm nếu s1 đứng trước s2, 0 nếu bằng nhau, và số dương nếu s1 đứng sau s2.",
      },
      {
        type: "theory",
        question:
          "Làm thế nào để thuật toán Report gom nhóm sinh viên theo Tên và Môn học chính xác khi một sinh viên học nhiều môn?",
        answer:
          "Mỗi bản ghi đại diện cho một sinh viên đăng ký môn học trong một học kỳ. Để gom nhóm, ta tạo một chuỗi khóa tổng hợp dạng key = studentName + '|' + courseName. Dùng danh sách processedKeys để ghi nhớ các khóa đã thống kê. Với mỗi khóa mới, duyệt lại toàn bộ danh sách để đếm số lần sinh viên đó học môn đó (count++), sau đó xuất ra bản ghi [Tên, Môn, Số lần] và sắp xếp theo tên.",
      },
      {
        type: "applied",
        question:
          "Nếu giảng viên yêu cầu: 'Khi nhập sinh viên mới, nếu trùng ID với sinh viên đã có thì chỉ cho phép nhập môn học mới chứ không cho đổi tên', bạn sẽ sửa code thế nào?",
        answer:
          "Trong phương thức thêm sinh viên: khi kiểm tra Student existing = controller.findById(id), nếu tồn tại thì tự động lấy lại tên cũ existing.getStudentName() thay vì bắt nhập lại tên mới. Chỉ yêu cầu nhập học kỳ và môn học, sau đó thêm bản ghi mới vào danh sách. Nếu chưa có ID thì mới cho nhập tên mới.",
      },
      {
        type: "applied",
        question:
          "Làm thế nào để tối ưu hóa hàm Report bằng cách sử dụng Map/HashMap thay vì duyệt 2 vòng lặp lồng nhau?",
        answer:
          "Có thể dùng Map<String, Integer> countMap = new LinkedHashMap<>(). Khi duyệt qua danh sách sinh viên: String key = s.getStudentName() + '|' + s.getCourseName(); countMap.put(key, countMap.getOrDefault(key, 0) + 1);. Sau đó duyệt qua countMap.entrySet() để chuyển thành mảng kết quả. Cách này giảm độ phức tạp thời gian từ O(n^2) xuống còn O(n).",
      },
    ],
  },

  // =====================================================================
  // J1.L.P0022 – CANDIDATE MANAGEMENT SYSTEM
  // =====================================================================
  "J1.L.P0022": {
    labCode: "J1.L.P0022",
    summary:
      "Bài yêu cầu xây dựng hệ thống quản lý ứng viên tuyển dụng (Candidate Management) ứng dụng sâu sắc nguyên lý Kế thừa (Inheritance) và Đa hình (Polymorphism) trong Java OOP. Hệ thống phân loại thành 3 nhóm ứng viên kế thừa từ lớp cha trừu tượng Candidate: (1) ExperienceCandidate (số năm kinh nghiệm, kỹ năng chuyên môn); (2) FresherCandidate (thời gian tốt nghiệp, xếp loại tốt nghiệp: Excellence/Good/Fair/Poor, trường đại học); (3) InternCandidate (chuyên ngành, học kỳ đang học, trường đại học). Menu gồm 5 chức năng: 1. Tạo Experience, 2. Tạo Fresher, 3. Tạo Intern, 4. Tìm kiếm ứng viên (hiển thị danh sách gom nhóm theo 3 loại, sau đó tìm theo tên và loại ứng viên), 5. Thoát.",
    mindset: [
      "**Bước 1 – Thiết kế phân cấp Kế thừa (Inheritance Hierarchy):** Tạo abstract class `Candidate` chứa các trường dùng chung: candidateId, firstName, lastName, birthDate (năm sinh 1900..năm hiện tại), address, phone (>=10 số), email, candidateType. Khai báo abstract method `toDetailString()`.",
      "**Bước 2 – Thiết kế 3 lớp con:** `ExperienceCandidate`, `FresherCandidate`, `InternCandidate` kế thừa `Candidate`. Gọi constructor lớp cha `super(...)`, bổ sung các trường chuyên biệt và override `toDetailString()`.",
      "**Bước 3 – Xây dựng Controller Đa hình:** `CandidateController` lưu trữ duy nhất một danh sách đa hình `List<Candidate>`. Cung cấp các hàm tạo đối tượng cụ thể, lấy danh sách theo loại (`getCandidatesByType(type)`), và tìm kiếm theo tên + loại.",
      "**Bước 4 – Validation dữ liệu đầu vào nghiêm ngặt:** `InputValidator` kiểm tra: ID duy nhất không rỗng, năm sinh 4 chữ số từ 1900 đến năm hiện tại, số điện thoại ít nhất 10 số (regex `\\d{10,}`), email đúng định dạng `account@domain`, năm kinh nghiệm 0-100, rank thuộc [Excellence, Good, Fair, Poor].",
      "**Bước 5 – Thiết kế View hiển thị phân loại:** `CandidateView` hiển thị danh sách ứng viên chia thành 3 khối tiêu đề rõ ràng: EXPERIENCE CANDIDATE, FRESHER CANDIDATE, INTERN CANDIDATE. Sau đó cho phép người dùng nhập từ khóa tên và chọn loại để tra cứu.",
      "**Bước 6 – Main Loop:** `Main.java` chạy menu 1-5, điều phối luồng gọi sang View tương ứng.",
    ],
    oopConcepts: [
      "**Inheritance (Kế thừa)** – 3 lớp con kế thừa lớp cha `Candidate`, tái sử dụng mã nguồn và giảm trùng lặp thuộc tính/phương thức.",
      "**Polymorphism (Đa hình)** – Danh sách `List<Candidate>` lưu trữ cả 3 đối tượng con. Phương thức `toDetailString()` được override ở từng lớp con để tự hiển thị chi tiết phù hợp khi gọi đa hình.",
      "**Abstraction (Trừu tượng hóa)** – `Candidate` là abstract class không thể khởi tạo trực tiếp, đóng vai trò khuôn mẫu thiết kế chung cho toàn bộ ứng viên.",
      "**Encapsulation (Đóng gói)** – Thuộc tính lớp cha `protected` hoặc `private`, getter/setter và constructor dùng `super()` chuẩn mực.",
      "**Polymorphic Filtering** – Lọc và tìm kiếm danh sách dựa trên thuộc tính `candidateType` và từ khóa tên mà không cần ép kiểu thủ công nếu dùng phương thức đa hình.",
    ],
    faq: [
      {
        type: "theory",
        question:
          "Tại sao lớp Candidate nên được khai báo là abstract class mà không phải là một class thông thường?",
        answer:
          "Trong thực tế tuyển dụng, một ứng viên luôn thuộc một vị trí cụ thể (Experience, Fresher hoặc Intern), không bao giờ tồn tại một ứng viên chung chung. Khai báo abstract class Candidate ngăn ngừa việc vô tình khởi tạo trực tiếp new Candidate(), đồng thời cho phép định nghĩa các phương thức trừu tượng như toDetailString() bắt buộc các lớp con phải triển khai cụ thể.",
      },
      {
        type: "theory",
        question:
          "Từ khóa super trong constructor của các lớp con (ExperienceCandidate, FresherCandidate, InternCandidate) có tác dụng gì?",
        answer:
          "Câu lệnh super(...) gọi trực tiếp constructor của lớp cha Candidate. Do các thuộc tính chung (candidateId, firstName, lastName, birthDate, address, phone, email, candidateType) được quản lý ở lớp cha, lớp con bắt buộc phải gọi super ở dòng đầu tiên của constructor để khởi tạo phần dữ liệu thừa kế trước khi khởi tạo các thuộc tính riêng của mình.",
      },
      {
        type: "theory",
        question:
          "Tính Đa hình (Polymorphism) được thể hiện như thế nào trong danh sách List<Candidate> của CandidateController?",
        answer:
          "List<Candidate> có kiểu dữ liệu là lớp cha, nhưng có thể chứa các đối tượng cụ thể của cả 3 lớp con (ExperienceCandidate, FresherCandidate, InternCandidate). Khi duyệt danh sách và gọi phương thức trừu tượng candidate.toDetailString(), Java Virtual Machine sẽ tự động gọi phiên bản phương thức của đúng lớp con tại thời điểm chạy (dynamic binding/late binding) mà không cần dùng if-else hay instanceof.",
      },
      {
        type: "applied",
        question:
          "Nếu muốn thêm một loại ứng viên thứ 4 là PartTimeCandidate (có thêm thuộc tính hoursPerWeek), hệ thống cần mở rộng những gì?",
        answer:
          "Rất dễ dàng nhờ tuân thủ nguyên lý Open/Closed: (1) Tạo class PartTimeCandidate extends Candidate với thuộc tính hoursPerWeek, gọi super với candidateType = 3 và override toDetailString(). (2) Thêm hằng số TYPE_PARTTIME = 3 trong Candidate. (3) Trong CandidateController thêm hàm createPartTimeCandidate(). (4) Thêm lựa chọn vào menu nhập và hiển thị trong CandidateView.",
      },
      {
        type: "applied",
        question:
          "Làm thế nào để viết biểu thức chính quy (Regex) kiểm tra số điện thoại (ít nhất 10 chữ số) và email hợp lệ trong InputValidator?",
        answer:
          "Với số điện thoại: phone.matches(\"\\\\d{10,}\") đảm bảo chuỗi chỉ gồm các chữ số và có tối thiểu 10 ký tự. Với email: email.matches(\"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\\.[A-Za-z]{2,}$\") đảm bảo có phần tên người dùng, ký tự @, tên miền và đuôi tên miền hợp lệ từ 2 ký tự trở lên.",
      },
    ],
  },

  // =====================================================================
  // J1.L.P0023 – FRUIT SHOP
  // =====================================================================
  "J1.L.P0023": {
    labCode: "J1.L.P0023",
    summary:
      "Bài này yêu cầu bạn xây dựng chương trình quản lý cửa hàng trái cây trên console. Chương trình gồm 3 chức năng chính: (1) Người chủ shop tạo sản phẩm (trái cây) với các thuộc tính như ID, tên, giá, số lượng, xuất xứ; (2) Khách hàng có thể chọn mua và thêm vào giỏ; (3) Xem danh sách đơn hàng tổng hợp. Đặc biệt bài yêu cầu dùng ArrayList lưu sản phẩm và Hashtable (key = tên khách, value = list OrderItem) để lưu đơn hàng.",
    mindset: [
      "**Bước 1 – Phân tích dữ liệu (Model):** Cần 2 thực thể chính: `Fruit` (fruitId, fruitName, price, quantity, origin) và `OrderItem` (fruitId, fruitName, quantity, price). Viết 2 class này trước với đầy đủ constructor, getter/setter.",
      "**Bước 2 – Thiết kế Controller:** `FruitController` giữ `ArrayList<Fruit>` và `Hashtable<String, ArrayList<OrderItem>>`. Đây là trái tim của logic: thêm fruit, trừ kho khi mua, ghi đơn vào Hashtable.",
      "**Bước 3 – Validation:** Tách `InputValidator` vào package `controller`. Cần validate: số nguyên dương (ID, số lượng), số thực dương (giá), chuỗi không rỗng (tên, xuất xứ), lựa chọn Y/N, lựa chọn menu trong khoảng [min, max].",
      "**Bước 4 – Xây dựng View:** `FruitView` hiển thị menu chính, gọi các phương thức từ Controller. Quy tắc: View KHÔNG xử lý logic, chỉ in/nhập và gọi Controller/InputValidator.",
      "**Bước 5 – Main loop:** Vòng lặp `while(true)` trong `Main.java`, đọc lựa chọn rồi gọi đúng phương thức của View. Khi chọn Exit thì `return`.",
      "**Bước 6 – Test edge cases:** Mua quá số lượng tồn kho → thông báo lỗi. Xem đơn hàng khi chưa có ai mua → in thông báo thích hợp. Nhập sai menu → bắt lại.",
    ],
    oopConcepts: [
      "**Encapsulation** – Toàn bộ thuộc tính của `Fruit`, `OrderItem` là `private`, truy cập qua getter/setter.",
      "**Single Responsibility** – `Fruit` chỉ chứa data, `FruitController` chỉ xử lý nghiệp vụ, `FruitView` chỉ hiển thị.",
      "**ArrayList** – Lưu danh sách sản phẩm và danh sách item trong giỏ của khách.",
      "**Hashtable** – Lưu đơn hàng với key là tên khách hàng, cho phép tra cứu O(1) theo tên.",
      "**MVC Pattern** – Model (Fruit, OrderItem) → Controller (FruitController, InputValidator) → View (FruitView, Main).",
    ],
    faq: [
      {
        type: "theory",
        question:
          "Tại sao bài này dùng `Hashtable` thay vì `HashMap` để lưu đơn hàng?",
        answer:
          "`Hashtable` là lớp cũ hơn (legacy), synchronized (thread-safe), không cho phép key hay value là null. `HashMap` hiện đại hơn, không đồng bộ hoặc null. Bài lab yêu cầu `Hashtable` theo đúng spec, và đây cũng là điểm để phân biệt 2 cấu trúc. Trong thực tế dự án mới người ta dùng `HashMap` vì hiệu năng tốt hơn khi không cần thread-safe.",
      },
      {
        type: "theory",
        question:
          "Giải thích sự khác nhau giữa `ArrayList` và mảng thông thường (`int[]`, `String[]`) trong Java.",
        answer:
          "`ArrayList` là dynamic array có thể thay đổi kích thước tự động, cung cấp nhiều phương thức tiện lợi như `add()`, `remove()`, `contains()`, `size()`. Mảng thông thường có kích thước cố định sau khi khởi tạo, truy cập nhanh hơn (cache-friendly) nhưng không linh hoạt. Trong bài Fruit Shop, số lượng sản phẩm và đơn hàng không biết trước → `ArrayList` phù hợp hơn.",
      },
      {
        type: "theory",
        question:
          "Nguyên tắc MVC yêu cầu gì về nơi đặt logic validation trong bài này?",
        answer:
          "Theo chuẩn LAB211, toàn bộ code validation (kiểm tra đầu vào, nhập lại khi sai) phải nằm trong package `controller`, cụ thể trong class `InputValidator.java`. View chỉ được gọi các phương thức validate từ `InputValidator`, tuyệt đối không viết vòng lặp `while (true)` kiểm tra input ngay trong View hay trong Main.",
      },
      {
        type: "applied",
        question:
          "Thêm tính năng: cho phép khách xóa sản phẩm khỏi giỏ trước khi xác nhận đặt hàng. Bạn sẽ sửa ở đâu?",
        answer:
          "Cần sửa 2 nơi: (1) Trong `FruitController`: thêm phương thức `removeFromCart(ArrayList<OrderItem> cart, int index)` nhận vào giỏ tạm và vị trí cần xóa. (2) Trong `FruitView`: trong luồng `runShopping()`, sau khi khách thêm item, hiển thị menu phụ 'Tiếp tục mua / Xóa item / Xác nhận đặt' và gọi phương thức Controller tương ứng. View không tự xóa khỏi list mà phải qua Controller.",
      },
      {
        type: "applied",
        question:
          "Làm thế nào để sửa chương trình lưu đơn hàng vào file `.txt` để dữ liệu không mất khi tắt chương trình?",
        answer:
          "Thêm class `FileManager.java` trong package `controller`. Viết phương thức `saveOrders(Hashtable<String, ArrayList<OrderItem>> orders)` dùng `FileWriter`/`BufferedWriter` để ghi từng dòng theo format CSV hoặc custom. Viết phương thức `loadOrders()` dùng `FileReader`/`BufferedReader` để đọc và parse lại khi khởi động. Gọi `loadOrders()` trong constructor `FruitController` và gọi `saveOrders()` sau mỗi lần đặt hàng thành công.",
      },
    ],
  },

  // =====================================================================
  // J1.S.P0006 – BINARY SEARCH
  // =====================================================================
  "J1.S.P0006": {
    labCode: "J1.S.P0006",
    summary:
      "Bài yêu cầu implement thuật toán tìm kiếm nhị phân (Binary Search) trên mảng số nguyên đã được sắp xếp. Chương trình cho phép người dùng nhập mảng, nhập giá trị cần tìm, và in ra vị trí (index) của phần tử hoặc thông báo không tìm thấy. Cần áp dụng chuẩn OOP: tách class thuật toán, class validation và class main riêng biệt.",
    mindset: [
      "**Bước 1 – Hiểu thuật toán:** Binary Search chỉ hoạt động trên mảng ĐÃ SẮP XẾP. Mỗi bước: tính `mid = (low + high) / 2`. Nếu `arr[mid] == target` → tìm thấy. Nếu `arr[mid] < target` → tìm nửa phải (`low = mid + 1`). Nếu `arr[mid] > target` → tìm nửa trái (`high = mid - 1`). Dừng khi `low > high`.",
      "**Bước 2 – Thiết kế class BinarySearch:** Phương thức `search(int[] arr, int target): int` trả về index tìm thấy hoặc `-1` nếu không có.",
      "**Bước 3 – Kiểm tra mảng hợp lệ:** Mảng phải được sắp xếp tăng dần trước khi tìm kiếm. Validation: số phần tử > 0, phần tử nhập vào là số nguyên.",
      "**Bước 4 – Class Main:** Nhập n phần tử, sort mảng (nếu chưa sort), nhập target, gọi `BinarySearch.search()`, in kết quả.",
      "**Bước 5 – Test:** Thử target ở giữa, đầu, cuối mảng và giá trị không tồn tại.",
    ],
    oopConcepts: [
      "**OOP Single Responsibility** – `BinarySearch` chỉ chứa logic tìm kiếm, không in kết quả.",
      "**Static method** – Phương thức `search()` nên là `static` vì không cần trạng thái đối tượng.",
      "**Array manipulation** – Dùng `Arrays.sort()` để sort trước khi search.",
      "**Exception handling** – Bắt `NumberFormatException` khi nhập phần tử mảng.",
    ],
    faq: [
      {
        type: "theory",
        question:
          "Binary Search có độ phức tạp thời gian (time complexity) là bao nhiêu, tại sao lại hiệu quả hơn Linear Search?",
        answer:
          "Binary Search có độ phức tạp **O(log n)** vì mỗi bước loại bỏ một nửa phần tử còn lại. Linear Search có **O(n)** vì duyệt tuần tự từng phần tử. Với n=1,000,000 phần tử: Linear cần tối đa 1,000,000 bước, Binary chỉ cần khoảng 20 bước (log₂1,000,000 ≈ 20). Đánh đổi: Binary Search yêu cầu mảng phải sắp xếp trước.",
      },
      {
        type: "theory",
        question:
          "Tại sao cách tính `mid = (low + high) / 2` có thể gây lỗi tràn số (integer overflow) trong Java?",
        answer:
          "Nếu `low` và `high` đều rất lớn (gần `Integer.MAX_VALUE = 2,147,483,647`), tổng `low + high` sẽ vượt quá giới hạn int, gây ra tràn số và kết quả âm. Cách an toàn hơn: `mid = low + (high - low) / 2`. Cách này đảm bảo phép tính không bao giờ vượt giới hạn.",
      },
      {
        type: "theory",
        question:
          "Khi nào nên dùng Binary Search đệ quy và khi nào nên dùng vòng lặp (iterative)?",
        answer:
          "Đệ quy dễ đọc và gần với định nghĩa toán học hơn, nhưng tốn thêm stack memory (stack frame) cho mỗi lần gọi đệ quy. Với mảng rất lớn, đệ quy có thể gây `StackOverflowError`. Vòng lặp iterative hiệu quả hơn về bộ nhớ (O(1) space) và luôn an toàn. Trong LAB211, nên dùng iterative là chuẩn.",
      },
      {
        type: "applied",
        question:
          "Sửa chương trình để tìm kiếm trên mảng String (tìm tên sinh viên) thay vì số nguyên. Cần thay đổi gì?",
        answer:
          "Đổi kiểu dữ liệu từ `int[]` sang `String[]`. Thay thế phép so sánh `arr[mid] == target` bằng `arr[mid].equalsIgnoreCase(target)` và `arr[mid].compareTo(target)` để so sánh thứ tự từ điển. Dùng `Arrays.sort()` vẫn hoạt động với String (so sánh từ điển mặc định). Cập nhật lại InputValidator để chấp nhận chuỗi không rỗng thay vì số.",
      },
      {
        type: "applied",
        question:
          "Thêm tính năng tìm kiếm tất cả vị trí của phần tử trùng lặp (nếu có nhiều phần tử cùng giá trị) thay vì chỉ trả về 1 vị trí.",
        answer:
          "Sau khi tìm được `mid` (vị trí một phần tử), mở rộng sang trái và phải: dùng 2 pointer `left = mid - 1` và `right = mid + 1`, tiếp tục so sánh với target để thu thập tất cả các index bằng nhau. Lưu vào `ArrayList<Integer> result`. Phương thức mới có signature: `ArrayList<Integer> searchAll(int[] arr, int target)`. Độ phức tạp trở thành O(log n + k) với k là số lần xuất hiện.",
      },
    ],
  },

  // =====================================================================
  // J1.S.P0009 – FIBONACCI
  // =====================================================================
  "J1.S.P0009": {
    labCode: "J1.S.P0009",
    summary:
      "Bài yêu cầu tính và in dãy Fibonacci. Dãy Fibonacci: F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2). Chương trình nhận số nguyên dương n từ người dùng và in n phần tử đầu tiên của dãy. Cần tách rõ class tính toán Fibonacci, class validation và class main.",
    mindset: [
      "**Bước 1 – Hiểu dãy:** Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ... Mỗi số bằng tổng 2 số trước. Dạng vòng lặp: dùng 2 biến `prev` và `curr`, cộng và hoán vị.",
      "**Bước 2 – Chọn cách implement:** Dùng vòng lặp (iterative) cho n phần tử đầu tiên, đơn giản và hiệu quả. Tránh đệ quy vì độ phức tạp O(2^n) quá chậm với n lớn.",
      "**Bước 3 – Class Fibonacci:** Phương thức `generate(int n): long[]` trả về mảng n phần tử đầu. Dùng `long` vì Fibonacci tăng nhanh, `int` có thể tràn số tại n≈46.",
      "**Bước 4 – Validation:** n phải là số nguyên dương (n > 0). Bắt lỗi định dạng số.",
      "**Bước 5 – In kết quả:** In từng phần tử cách nhau dấu phẩy hoặc theo định dạng yêu cầu của đề.",
    ],
    oopConcepts: [
      "**Static method** – `generate()` là static vì không cần state đối tượng.",
      "**OOP Separation** – Tách class Fibonacci (logic) khỏi InputValidator (validation) và Main (điều khiển).",
      "**Primitive types** – Hiểu giới hạn `int` và lý do dùng `long`.",
      "**Array** – Trả về kết quả dạng `long[]` để dễ in và test.",
    ],
    faq: [
      {
        type: "theory",
        question:
          "Tại sao nên dùng kiểu `long` thay vì `int` khi lưu số Fibonacci?",
        answer:
          "`int` tối đa khoảng 2.1 tỷ (2^31 - 1). Fibonacci(46) = 1,836,311,903 (gần giới hạn int), Fibonacci(47) = 2,971,215,073 (vượt giới hạn int). `long` có thể lưu tới khoảng 9.2 × 10^18 (đủ cho Fibonacci(92)). Nếu dùng `int`, chương trình sẽ cho kết quả sai mà không báo lỗi khi n lớn.",
      },
      {
        type: "theory",
        question:
          "So sánh cách tính Fibonacci đệ quy vs. vòng lặp về độ phức tạp và khi nào nên dùng cái nào?",
        answer:
          "Đệ quy đơn giản `fib(n) = fib(n-1) + fib(n-2)` có độ phức tạp **O(2^n)** vì tính lại nhiều giá trị trùng nhau. Vòng lặp iterative có **O(n)** thời gian và **O(1)** bộ nhớ. Đệ quy có Memoization đạt O(n) nhưng dùng O(n) bộ nhớ. Trong bài lab: dùng vòng lặp. Đệ quy chỉ nên dùng trong học thuật hoặc khi n nhỏ (< 30).",
      },
      {
        type: "theory",
        question:
          "Giải thích khái niệm `static method` trong Java và tại sao phương thức `generate()` của Fibonacci được đặt là `static`.",
        answer:
          "`static method` thuộc về class, không thuộc instance (đối tượng cụ thể). Có thể gọi trực tiếp qua tên class: `Fibonacci.generate(10)` mà không cần `new Fibonacci()`. `generate()` là static vì không cần truy cập bất kỳ thuộc tính instance nào – nó chỉ dùng input n để tính toán. Quy tắc: nếu phương thức không dùng `this.field`, hãy cân nhắc đặt nó là `static`.",
      },
      {
        type: "applied",
        question:
          "Sửa chương trình để cho phép người dùng chọn in dãy Fibonacci theo thứ tự ngược (từ F(n) về F(0)).",
        answer:
          "Sau khi tính `long[] fibs = Fibonacci.generate(n)`, thêm một hàm `reverse(long[] arr)` trong Fibonacci class để đảo ngược mảng (dùng 2 pointer). In mảng đã đảo ngược. Không cần tính lại – chỉ đảo thứ tự in. Nếu không muốn sửa mảng gốc: duyệt from `n-1` xuống `0` và in `fibs[i]`.",
      },
      {
        type: "applied",
        question:
          "Thêm tính năng kiểm tra một số có thuộc dãy Fibonacci không (isPerfectSquare check).",
        answer:
          "Số n là Fibonacci khi và chỉ khi `5n² + 4` hoặc `5n² - 4` là số chính phương. Thêm phương thức `static boolean isFibonacci(long n)` vào class Fibonacci: tính `5*n*n + 4` và `5*n*n - 4`, kiểm tra xem có phải số chính phương không bằng cách tính `sqrt` rồi kiểm tra `(long)sqrt * (long)sqrt == value`. Gọi phương thức này từ Main sau khi nhập số cần kiểm tra.",
      },
    ],
  },

  // =====================================================================
  // J1.S.P0010 – LINEAR SEARCH
  // =====================================================================
  "J1.S.P0010": {
    labCode: "J1.S.P0010",
    summary:
      "Bài yêu cầu implement thuật toán tìm kiếm tuyến tính (Linear Search) – duyệt tuần tự từng phần tử mảng từ đầu đến cuối để tìm giá trị cần tìm. Chương trình cho phép nhập mảng, nhập target, in ra vị trí tìm thấy hoặc -1. Không yêu cầu mảng phải sắp xếp.",
    mindset: [
      "**Bước 1 – Hiểu Linear Search:** Duyệt từ `i=0` đến `arr.length-1`. Nếu `arr[i] == target` → trả về `i` và dừng. Nếu duyệt hết mà không tìm → trả về `-1`.",
      "**Bước 2 – Design class LinearSearch:** Phương thức `search(int[] arr, int target): int` trả về index đầu tiên tìm thấy hoặc `-1`.",
      "**Bước 3 – Mở rộng:** Phương thức `searchAll(int[] arr, int target): int[]` trả về tất cả các vị trí nếu có trùng lặp.",
      "**Bước 4 – Validation:** Mảng phải có ít nhất 1 phần tử. Input là số nguyên.",
      "**Bước 5 – So sánh với Binary Search:** Hiểu tại sao Linear Search dùng được với mảng chưa sort trong khi Binary Search thì không.",
    ],
    oopConcepts: [
      "**OOP Separation** – Class LinearSearch chỉ chứa logic, không in kết quả.",
      "**Static methods** – `search()` là static vì không cần state.",
      "**Array traversal** – Duyệt mảng bằng vòng lặp for.",
      "**Early return** – Trả về ngay khi tìm thấy giúp tối ưu thời gian trung bình.",
    ],
    faq: [
      {
        type: "theory",
        question:
          "So sánh Linear Search và Binary Search về điều kiện sử dụng và độ phức tạp.",
        answer:
          "Linear Search: O(n) thời gian, O(1) bộ nhớ, KHÔNG yêu cầu mảng sắp xếp, phù hợp mảng nhỏ hoặc chưa sort. Binary Search: O(log n) thời gian, O(1) bộ nhớ (iterative), YÊU CẦU mảng đã sắp xếp. Nếu tìm kiếm nhiều lần trên cùng mảng lớn → nên sort 1 lần rồi dùng Binary Search nhiều lần. Nếu chỉ tìm 1 lần → Linear Search đơn giản hơn.",
      },
      {
        type: "theory",
        question: "Giải thích khái niệm `early return` và tại sao nó quan trọng trong Linear Search?",
        answer:
          "`Early return` là kỹ thuật trả về kết quả ngay khi điều kiện thỏa mãn, không cần duyệt hết. Trong Linear Search, khi `arr[i] == target`, trả về `i` ngay lập tức thay vì tiếp tục duyệt các phần tử sau. Điều này tối ưu **average case**: nếu target ở vị trí giữa mảng, chỉ duyệt n/2 phần tử thay vì n. Worst case vẫn là O(n) khi target ở cuối hoặc không tồn tại.",
      },
      {
        type: "theory",
        question:
          "Tại sao Linear Search thường phù hợp hơn với `LinkedList` còn Binary Search không thể dùng trực tiếp với `LinkedList`?",
        answer:
          "Binary Search cần truy cập phần tử ở vị trí bất kỳ (index-based access) trong O(1). `LinkedList` không hỗ trợ random access – để đến phần tử thứ k cần duyệt qua k node, mất O(k). Vì thế Binary Search trên LinkedList tổng thể là O(n log n) – không còn hiệu quả. Linear Search chỉ cần duyệt tuần tự, phù hợp với LinkedList.",
      },
      {
        type: "applied",
        question:
          "Sửa chương trình để tìm kiếm không phân biệt hoa thường trên mảng String (tên sản phẩm).",
        answer:
          "Đổi kiểu từ `int[]` sang `String[]`. Thay điều kiện `arr[i] == target` bằng `arr[i].equalsIgnoreCase(target)`. Cập nhật InputValidator để nhận chuỗi. Khi nhập mảng, đọc từng chuỗi và lưu vào `String[]`. Print index tìm thấy kèm cả giá trị tìm được để người dùng xác nhận.",
      },
      {
        type: "applied",
        question:
          "Thêm tính năng đếm số lần xuất hiện của target trong mảng, không chỉ in vị trí đầu tiên.",
        answer:
          "Thêm phương thức `static int countOccurrences(int[] arr, int target)` trong class LinearSearch: dùng biến `count = 0`, duyệt toàn bộ mảng, mỗi khi `arr[i] == target` thì `count++`. Trả về `count`. Cũng có thể thêm `static int[] findAll(int[] arr, int target)`: thu thập tất cả index vào `ArrayList<Integer>` rồi convert sang `int[]` để trả về.",
      },
    ],
  },

  // =====================================================================
  // J1.S.P0011 – WORKER MANAGEMENT
  // =====================================================================
  "J1.S.P0011": {
    labCode: "J1.S.P0011",
    summary:
      "Bài yêu cầu xây dựng chương trình quản lý nhân viên (Worker). Worker có các thuộc tính: ID, tên, lương (salary). Chương trình cần có các chức năng: thêm worker, xem danh sách, tìm theo tên, sắp xếp theo lương, tìm worker có lương cao nhất/thấp nhất. Áp dụng MVC pattern đầy đủ.",
    mindset: [
      "**Bước 1 – Model:** Class `Worker` với `workerId` (int), `workerName` (String), `salary` (double). Constructor, getter/setter, `toString()`.",
      "**Bước 2 – Controller:** `WorkerController` chứa `ArrayList<Worker>`. Các phương thức: `addWorker()`, `getAllWorkers()`, `findByName(String)`, `sortBySalary()`, `getHighestSalary()`, `getLowestSalary()`.",
      "**Bước 3 – Validation:** `InputValidator` trong controller: validate ID (số nguyên > 0, không trùng), tên (không rỗng), lương (số thực > 0).",
      "**Bước 4 – View:** `WorkerView` in menu, nhập liệu từ người dùng qua InputValidator, gọi Controller và hiển thị kết quả.",
      "**Bước 5 – Sắp xếp:** Implement Bubble Sort hoặc dùng `Collections.sort()` với `Comparator`. Đề thường yêu cầu tự viết sort để thể hiện hiểu thuật toán.",
      "**Bước 6 – Test:** Thêm nhiều worker cùng tên, tìm kiếm không phân biệt hoa thường, sắp xếp với lương bằng nhau.",
    ],
    oopConcepts: [
      "**MVC Pattern** – Phân tách rõ Model, View, Controller.",
      "**Encapsulation** – Tất cả field trong `Worker` là `private`.",
      "**ArrayList CRUD** – Thêm, xóa, tìm kiếm, sắp xếp trên `ArrayList<Worker>`.",
      "**Comparator/Comparable** – Sắp xếp đối tượng theo tiêu chí tùy chỉnh (salary).",
      "**String.equalsIgnoreCase()** – Tìm kiếm tên không phân biệt hoa thường.",
    ],
    faq: [
      {
        type: "theory",
        question:
          "Giải thích sự khác nhau giữa `Comparable` và `Comparator` trong Java khi sắp xếp đối tượng.",
        answer:
          "`Comparable` (interface trong class chính): class tự định nghĩa thứ tự so sánh mặc định qua `compareTo()`. Phù hợp khi có 1 cách sort duy nhất (ví dụ Worker sort theo salary mặc định). `Comparator` (interface bên ngoài): định nghĩa nhiều cách sort khác nhau mà không sửa class gốc. Ví dụ: `Comparator.comparingDouble(Worker::getSalary)` để sort theo salary, hoặc `Comparator.comparing(Worker::getWorkerName)` để sort theo tên. Trong LAB, thường dùng `Collections.sort(list, comparator)` hoặc tự viết Bubble Sort.",
      },
      {
        type: "theory",
        question:
          "Trong bài Worker, tại sao `salary` nên dùng kiểu `double` thay vì `int`?",
        answer:
          "Lương (salary) thường có phần thập phân (ví dụ 15.5 triệu, 20.75 triệu). Kiểu `int` chỉ lưu số nguyên, sẽ cắt phần thập phân. `double` lưu được số thực nhưng có sai số dấu phẩy động (floating point). Nếu cần tính toán tài chính chính xác tuyệt đối (ví dụ: tính lãi suất, thuế), người ta dùng `BigDecimal`. Trong LAB211, `double` là đủ dùng.",
      },
      {
        type: "theory",
        question:
          "Bubble Sort hoạt động như thế nào? Độ phức tạp của nó là bao nhiêu?",
        answer:
          "Bubble Sort so sánh 2 phần tử liền kề và hoán vị nếu sai thứ tự, lặp lại nhiều lần cho đến khi không còn hoán vị nào. Độ phức tạp: **O(n²)** thời gian trong worst/average case, **O(n)** trong best case (mảng đã sort, với tối ưu early termination). Bộ nhớ: **O(1)** (in-place). Tuy chậm hơn QuickSort/MergeSort với n lớn, nhưng đơn giản để viết và thường được yêu cầu trong LAB vì mục đích giảng dạy.",
      },
      {
        type: "applied",
        question:
          "Thêm tính năng tính tổng lương và lương trung bình của tất cả worker. Sửa ở lớp nào?",
        answer:
          "Thêm 2 phương thức vào `WorkerController`: `double getTotalSalary()` – duyệt ArrayList và cộng dồn salary; `double getAverageSalary()` – gọi `getTotalSalary() / workers.size()` (kiểm tra size > 0 trước khi chia). View sẽ gọi 2 phương thức này và hiển thị kết quả. Không tính trực tiếp trong View.",
      },
      {
        type: "applied",
        question:
          "Thêm tính năng cập nhật (update) lương của một worker theo ID. Quy trình xử lý ra sao?",
        answer:
          "Thêm phương thức `boolean updateSalary(int workerId, double newSalary)` trong Controller: tìm worker có `workerId` tương ứng trong ArrayList, nếu tìm thấy thì gọi `worker.setSalary(newSalary)` và trả về `true`, nếu không tìm thấy trả về `false`. Trong View: nhập ID từ người dùng (validate là số nguyên dương), nhập lương mới (validate > 0), gọi Controller, thông báo kết quả.",
      },
    ],
  },

  // =====================================================================
  // J1.S.P0051 – TASK MANAGEMENT
  // =====================================================================
  "J1.S.P0051": {
    labCode: "J1.S.P0051",
    summary:
      "Bài yêu cầu xây dựng hệ thống quản lý công việc (Task Management). Task có: taskId, taskName, description, status (TODO/IN_PROGRESS/DONE), assignedTo, deadline. Chương trình cần: thêm task, cập nhật trạng thái, xem task theo trạng thái, tìm task theo người được giao, xóa task. Áp dụng MVC đầy đủ.",
    mindset: [
      "**Bước 1 – Phân tích Model:** `Task` cần có status. Tốt nhất dùng enum hoặc constant String: `TODO`, `IN_PROGRESS`, `DONE`. Validate status khi nhập.",
      "**Bước 2 – Controller:** `TaskController` với `ArrayList<Task>`. Phương thức: CRUD cơ bản + `filterByStatus(String status)` + `filterByAssignee(String name)` + `sortByDeadline()`.",
      "**Bước 3 – Validation:** ID không trùng, tên không rỗng, status phải thuộc tập hợp hợp lệ, deadline theo format đúng (nếu yêu cầu).",
      "**Bước 4 – View:** Menu chính → các chức năng → nhập liệu → hiển thị kết quả. Tách biệt rõ ràng với Controller.",
      "**Bước 5 – Tìm kiếm và lọc:** Duyệt ArrayList, so sánh field, collect vào List kết quả rồi in.",
    ],
    oopConcepts: [
      "**MVC** – Full separation of concerns.",
      "**Enum** – Dùng enum cho Task status để tránh sai sót string.",
      "**ArrayList filtering** – Lọc dựa trên điều kiện field.",
      "**String comparison** – `equalsIgnoreCase()` khi so sánh tên.",
      "**Encapsulation** – Private fields, public getters/setters.",
    ],
    faq: [
      {
        type: "theory",
        question:
          "Tại sao nên dùng `enum` cho Task status thay vì dùng `String` bình thường?",
        answer:
          "`enum` giới hạn tập hợp giá trị hợp lệ tại compile time – tránh typo như `'DONE'` vs `'Done'` vs `'done'`. IDE hỗ trợ autocomplete và refactor tốt hơn. Khi cần thêm trạng thái mới, chỉ sửa enum ở 1 chỗ. `String` có thể nhận bất kỳ giá trị nào, dễ gây bug. Trong LAB211, nếu đề cho phép dùng enum thì nên dùng; nếu đề dùng String thì validate chặt.",
      },
      {
        type: "theory",
        question:
          "Giải thích nguyên tắc `Single Responsibility Principle (SRP)` và cách áp dụng trong bài Task Management.",
        answer:
          "SRP: mỗi class chỉ có 1 lý do để thay đổi. Trong bài: `Task` chỉ thay đổi khi cấu trúc dữ liệu task thay đổi; `TaskController` chỉ thay đổi khi logic nghiệp vụ thay đổi; `TaskView` chỉ thay đổi khi UI/UX thay đổi; `InputValidator` chỉ thay đổi khi quy tắc nhập liệu thay đổi. Vi phạm SRP: viết cả logic và UI trong Main.java.",
      },
      {
        type: "theory",
        question:
          "Khi nào nên dùng `ArrayList` và khi nào nên dùng `LinkedList` trong Java?",
        answer:
          "`ArrayList`: truy cập ngẫu nhiên O(1) (get by index), thêm vào cuối O(1) amortized, thêm/xóa ở giữa O(n). Phù hợp đọc nhiều, ít insert/delete ở giữa. `LinkedList`: thêm/xóa ở đầu/cuối O(1), truy cập ngẫu nhiên O(n). Phù hợp khi insert/delete thường xuyên ở vị trí bất kỳ. Trong LAB211, hầu hết bài dùng ArrayList vì đề yêu cầu hoặc pattern chủ yếu là read + append.",
      },
      {
        type: "applied",
        question:
          "Sửa chương trình để hỗ trợ đặt priority (LOW/MEDIUM/HIGH) cho task và sort theo priority.",
        answer:
          "Thêm field `priority` vào class `Task` (dùng enum `Priority {LOW, MEDIUM, HIGH}`). Cập nhật constructor, getter/setter, toString. Thêm phương thức `sortByPriority()` trong Controller: dùng Bubble Sort so sánh `task.getPriority().ordinal()` (LOW=0, MEDIUM=1, HIGH=2). Cập nhật View để hiển thị và nhập priority (validate là 1 trong 3 giá trị). Thêm menu option 'Sort by priority'.",
      },
      {
        type: "applied",
        question:
          "Thêm tính năng thống kê: hiển thị số lượng task theo từng trạng thái (bao nhiêu TODO, IN_PROGRESS, DONE).",
        answer:
          "Thêm phương thức `Map<String, Integer> getStatusSummary()` trong Controller: tạo `HashMap<String, Integer>`, duyệt ArrayList, với mỗi task `count.merge(task.getStatus(), 1, Integer::sum)`. Trong View: gọi Controller, in kết quả dạng bảng: `[TODO: 5] [IN_PROGRESS: 3] [DONE: 8]`. Đây cũng là cơ hội áp dụng `HashMap` trong bài không yêu cầu Hashtable.",
      },
    ],
  },

  // =====================================================================
  // J1.S.P0056 – EBANK
  // =====================================================================
  "J1.S.P0056": {
    labCode: "J1.S.P0056",
    summary:
      "Bài yêu cầu xây dựng hệ thống ngân hàng điện tử đơn giản (EBank). Account có: accountId, accountHolder, balance. Chương trình cần: tạo tài khoản, nạp tiền (deposit), rút tiền (withdraw), chuyển khoản (transfer), xem số dư, xem lịch sử giao dịch. Đây là bài phức tạp nhất về logic nghiệp vụ – cần validate rất kỹ.",
    mindset: [
      "**Bước 1 – Model:** `Account` (accountId, holderName, balance). `Transaction` (transactionId, fromAccount, toAccount, amount, type, timestamp). Lưu lịch sử giao dịch trong `ArrayList<Transaction>`.",
      "**Bước 2 – Controller:** `BankController` quản lý `ArrayList<Account>` và `ArrayList<Transaction>`. Phương thức: `createAccount()`, `deposit()`, `withdraw()`, `transfer()`, `getBalance()`, `getHistory()`.",
      "**Bước 3 – Validation chặt chẽ:** Deposit/Withdraw: amount > 0. Withdraw: balance >= amount (không cho rút quá số dư). Transfer: tài khoản nguồn phải tồn tại, tài khoản đích phải tồn tại, không transfer cho chính mình.",
      "**Bước 4 – Atomic transfer:** Rút từ account nguồn TRƯỚC, cộng vào account đích SAU. Nếu rút thất bại thì không cộng. Ghi log giao dịch.",
      "**Bước 5 – View:** Menu ngân hàng chuẩn – nhập ID tài khoản, số tiền, xem kết quả.",
    ],
    oopConcepts: [
      "**MVC** – Business logic (deposit/withdraw/transfer) hoàn toàn trong Controller.",
      "**Data integrity** – Không bao giờ để balance âm.",
      "**Transaction logging** – Mỗi thao tác ghi lại lịch sử.",
      "**Defensive programming** – Validate mọi input trước khi xử lý.",
      "**Encapsulation** – Balance chỉ thay đổi qua deposit/withdraw methods.",
    ],
    faq: [
      {
        type: "theory",
        question:
          "Tại sao trong hệ thống ngân hàng, balance nên được encapsulate chặt chẽ và không để `public`?",
        answer:
          "Nếu `balance` là `public`, bất kỳ code nào cũng có thể sửa `account.balance = -999` mà không qua kiểm tra. Encapsulation đảm bảo balance chỉ thay đổi qua các phương thức có kiểm soát như `deposit(amount)` và `withdraw(amount)`, nơi validate amount > 0 và balance >= amount. Đây là áp dụng thực tế của nguyên tắc Encapsulation trong OOP.",
      },
      {
        type: "theory",
        question:
          "Giải thích khái niệm 'atomicity' trong giao dịch transfer và tại sao quan trọng.",
        answer:
          "Atomicity (nguyên tử): một giao dịch phải xảy ra hoàn toàn hoặc không xảy ra gì cả. Trong transfer, nếu rút tiền thành công từ account A nhưng cộng vào account B thất bại, tiền bị mất. Giải pháp: kiểm tra đủ điều kiện TẤT CẢ trước, sau đó mới thực hiện. Trong cơ sở dữ liệu thực tế, dùng database transaction với ROLLBACK. Trong bài lab: validate balance đủ trước, không bao giờ để giao dịch nửa vời.",
      },
      {
        type: "theory",
        question:
          "Tại sao nên dùng `double` thay vì `int` cho balance, và khi nào nên dùng `BigDecimal`?",
        answer:
          "`double` đủ dùng cho bài lab với số tiền thông thường. Tuy nhiên, `double` có vấn đề sai số: `0.1 + 0.2 = 0.30000000000000004` trong Java (floating point issue). Trong hệ thống tài chính thực tế, luôn dùng `BigDecimal` với `scale` phù hợp (2 chữ số thập phân cho VNĐ). LAB211 chấp nhận `double`, nhưng hiểu nguyên nhân sai số là điểm cộng khi báo cáo.",
      },
      {
        type: "applied",
        question:
          "Thêm tính năng giới hạn số tiền rút tối đa trong 1 ngày (daily withdrawal limit). Thiết kế ra sao?",
        answer:
          "Thêm field `dailyWithdrawnAmount` vào `Account` để track số tiền đã rút trong ngày. Thêm constant `DAILY_LIMIT = 50_000_000.0`. Trong `withdraw()`: kiểm tra `dailyWithdrawnAmount + amount <= DAILY_LIMIT` trước khi cho rút. Nếu vượt limit → báo lỗi. Nếu hợp lệ → trừ balance và cộng `dailyWithdrawnAmount += amount`. Để reset daily limit mỗi ngày: cần lưu `lastWithdrawDate`, so sánh với ngày hiện tại, nếu khác ngày thì reset `dailyWithdrawnAmount = 0`.",
      },
      {
        type: "applied",
        question:
          "Thêm tính năng lọc lịch sử giao dịch theo khoảng thời gian. Cần sửa những lớp nào?",
        answer:
          "Sửa class `Transaction`: thêm field `java.util.Date timestamp` hoặc lưu dạng String theo format `dd/MM/yyyy`. Thêm phương thức `List<Transaction> getHistoryByDateRange(String fromDate, String toDate)` trong Controller: parse chuỗi ngày thành `Date`, duyệt `transactionList` và lọc những giao dịch có timestamp trong khoảng. Thêm `InputValidator` để parse và validate format ngày. View: thêm menu option 'Lịch sử theo ngày', nhập from/to date.",
      },
    ],
  },

  // =====================================================================
  // J1.S.P0057 – MATRIX CALCULATOR
  // =====================================================================
  "J1.S.P0057": {
    labCode: "J1.S.P0057",
    summary:
      "Bài yêu cầu xây dựng máy tính ma trận (Matrix Calculator) hỗ trợ 3 phép tính: Cộng (+), Trừ (-) và Nhân (×) 2 ma trận số nguyên. Người dùng nhập kích thước và phần tử từng ma trận, chọn phép tính, chương trình in kết quả dạng [val][val]. Cần kiểm tra điều kiện kích thước hợp lệ cho từng phép tính.",
    mindset: [
      "**Bước 1 – Hiểu điều kiện ma trận:** Cộng/Trừ: 2 ma trận cùng số hàng VÀ cùng số cột. Nhân: số cột ma trận 1 phải bằng số hàng ma trận 2 (m×n) × (n×p) = (m×p).",
      "**Bước 2 – Model:** Class `Matrix` bọc `int[][] data` với `rows` và `cols`. Cung cấp `get(r,c)`, `set(r,c,val)`.",
      "**Bước 3 – Controller:** `MatrixController` với 3 phương thức: `add(Matrix, Matrix)`, `subtract(Matrix, Matrix)`, `multiply(Matrix, Matrix)`. Mỗi phương thức validate kích thước rồi tính toán và trả về Matrix kết quả.",
      "**Bước 4 – View:** `MatrixView` hiển thị menu, nhập ma trận (nhập từng phần tử `M[i][j]`), gọi Controller, in kết quả dạng `[val][val]`.",
      "**Bước 5 – Phép nhân ma trận:** Công thức `result[i][j] = Σ (m1[i][k] * m2[k][j])` với k từ 0 đến n-1. Cần 3 vòng lặp lồng nhau (i, j, k).",
    ],
    oopConcepts: [
      "**MVC** – Controller xử lý toán học, View chỉ in và nhập.",
      "**2D Array** – `int[][]` làm nền tảng lưu trữ ma trận.",
      "**Encapsulation** – Matrix bọc `int[][]` và cung cấp interface an toàn.",
      "**Exception handling** – Ném `IllegalArgumentException` khi kích thước không hợp lệ.",
      "**Nested loops** – 3 vòng lặp lồng cho phép nhân ma trận.",
    ],
    faq: [
      {
        type: "theory",
        question:
          "Giải thích điều kiện kích thước cho phép cộng/trừ và phép nhân ma trận.",
        answer:
          "**Cộng/Trừ:** Cần 2 ma trận có cùng số hàng (rows) VÀ cùng số cột (cols). Ví dụ: (3×4) + (3×4) = (3×4). Nếu khác kích thước → không thể tính. **Nhân:** Ma trận (m×n) × (n×p) = (m×p). Điều kiện: số cột của ma trận 1 phải bằng số hàng của ma trận 2. Ví dụ: (2×3) × (3×4) = (2×4). (2×3) × (4×3) → KHÔNG HỢP LỆ.",
      },
      {
        type: "theory",
        question:
          "Tại sao phép nhân ma trận KHÔNG có tính giao hoán (A×B ≠ B×A)?",
        answer:
          "Về mặt toán học, thứ tự nhân ma trận ảnh hưởng đến kết quả vì công thức `result[i][j] = Σ(A[i][k] * B[k][j])` phụ thuộc vào vị trí hàng/cột. Ví dụ đơn giản: A=(2×3), B=(3×2) → A×B = (2×2) nhưng B×A = (3×3). Kích thước khác nhau, kết quả hoàn toàn khác. Điều này khác với nhân số (3×4 = 4×3). Đây là điểm đặc thù của đại số tuyến tính.",
      },
      {
        type: "theory",
        question:
          "Giải thích ý nghĩa của phép nhân ma trận trong thực tế (ứng dụng).",
        answer:
          "Ma trận dùng để biểu diễn phép biến đổi tuyến tính (linear transformation). Nhân ma trận tương đương với áp dụng nhiều phép biến đổi liên tiếp: xoay ảnh, scale, shear trong đồ họa máy tính; tính toán neural network layer trong AI (weight matrix × input vector); giải hệ phương trình tuyến tính; mã hóa/giải mã trong mật mã học. Đây là lý do ma trận cực kỳ quan trọng trong lập trình.",
      },
      {
        type: "applied",
        question:
          "Thêm tính năng tính ma trận chuyển vị (Transpose). Matrix (m×n) → (n×m), phần tử [i][j] → [j][i].",
        answer:
          "Thêm phương thức `Matrix transpose(Matrix m)` trong `MatrixController`: tạo `int[m.getCols()][m.getRows()]` mới. Vòng lặp: `for i=0..rows: for j=0..cols: result[j][i] = m.get(i,j)`. Trả về `new Matrix(result)`. Cập nhật View: thêm option 'Transpose' vào menu, nhập 1 ma trận, gọi Controller, in kết quả. Cập nhật phương thức `inputMatrix()` để nhập 1 ma trận thay vì 2.",
      },
      {
        type: "applied",
        question:
          "Thêm tính năng kiểm tra ma trận vuông (square matrix) và tính đường chéo chính (trace = tổng A[i][i]).",
        answer:
          "Thêm phương thức `boolean isSquare(Matrix m)`: trả về `m.getRows() == m.getCols()`. Thêm `int trace(Matrix m)`: throw `IllegalArgumentException` nếu `!isSquare(m)`, rồi `int sum = 0; for(int i=0; i<m.getRows(); i++) sum += m.get(i,i); return sum`. Trong View: thêm menu option 'Kiểm tra ma trận vuông & tính trace', nhập 1 ma trận, kiểm tra isSquare, nếu đúng in trace, nếu sai thông báo lỗi.",
      },
    ],
  },

  // =====================================================================
  // J1.L.P0028 – TRADITIONAL FEAST ORDER MANAGEMENT (Campus HCM)
  // =====================================================================
  "J1.L.P0028": {
    labCode: "J1.L.P0028",
    summary:
      "Bài toán quản lý dịch vụ đặt tiệc truyền thống (đám cưới, kỷ niệm, lễ hội). Hệ thống gồm 8 chức năng cốt lõi: Đăng ký khách hàng (mã C/G/K + 4 số, tên 2-25 ký tự, SĐT VN 10 số, email), Cập nhật thông tin khách hàng, Tìm kiếm khách theo tên, Đọc và hiển thị thực đơn từ file CSV (feastMenu.csv), Đặt tiệc với ngày tổ chức trong tương lai, Cập nhật đơn đặt tiệc, Lưu trữ dữ liệu an toàn ra file nhị phân (feast_order_service.dat) và Hiển thị danh sách khách hàng/đơn tiệc.",
    mindset: [
      "**Bước 1 – Phân tích Model:** Cần các thực thể `Customer` (customerCode, name, phone, email), `FeastMenu` (code, name, price, ingredients), `Order` (orderId, customerCode, menuCode, tables, eventDate, totalCost). Viết đầy đủ encapsulation.",
      "**Bước 2 – Thiết kế Controller:** `FeastOrderController` quản lý `ArrayList<Customer>`, `ArrayList<FeastMenu>`, `ArrayList<Order>`. Đọc menu từ CSV khi khởi động và đọc/ghi file nhị phân với `ObjectInputStream`/`ObjectOutputStream`.",
      "**Bước 3 – Xử lý Validation:** `InputValidator` đặt tại tầng `controller`. Kiểm tra chặt chẽ: mã khách hàng (Regex `^[CGK]\\d{4}$`), ngày tổ chức phải sau ngày hiện tại, số lượng bàn nguyên dương.",
      "**Bước 4 – Thiết kế View:** `FeastOrderView` xử lý in menu console, giao tiếp người dùng và phân luồng gọi Controller.",
      "**Bước 5 – File I/O an toàn:** Xử lý ngoại lệ file không tồn tại, kiểm tra ghi đè và lưu trạng thái đồng bộ.",
    ],
    oopConcepts: [
      "**MVC Architecture** – Phân tách rõ ràng Model (POJO), View (Console UI) và Controller (Nghiệp vụ & Validation).",
      "**File I/O (CSV & Binary)** – Đọc CSV danh mục thực đơn và tuần tự hóa đối tượng (Serialization) ra file .dat.",
      "**Encapsulation & Data Hiding** – Mọi thuộc tính private, cung cấp getter/setter chuẩn JDK 8.",
      "**Input Validation** – Toàn bộ logic validate đặt tại package controller, bảo đảm ứng dụng không bao giờ crash.",
    ],
    faq: [
      {
        type: "theory",
        question: "Tại sao cần lưu file dưới dạng nhị phân (.dat) thay vì file text (.txt)?",
        answer: "File nhị phân thông qua Java Object Serialization (implements Serializable) giúp lưu trữ trực tiếp cấu trúc đối tượng hoàn chỉnh vào bộ nhớ ngoài mà không cần chuyển đổi thủ công sang chuỗi ký tự, tăng tốc độ đọc ghi và bảo vệ tính toàn vẹn dữ liệu.",
      },
      {
        type: "applied",
        question: "Làm thế nào để kiểm tra tính hợp lệ của ngày đặt tiệc phải là một ngày trong tương lai?",
        answer: "Sử dụng `SimpleDateFormat` với `setLenient(false)` để parse chuỗi dd/MM/yyyy. So sánh đối tượng `Date` nhập vào với `new Date()` bằng phương thức `eventDate.after(new Date())`.",
      },
    ],
  },

  // =====================================================================
  // J1.L.P0038 – CAR INSURANCE MANAGEMENT (Campus HCM)
  // =====================================================================
  "J1.L.P0038": {
    labCode: "J1.L.P0038",
    summary:
      "Chương trình quản lý bảo hiểm xe hơi ứng dụng mô hình OOP và cấu trúc dữ liệu `Map<Key, Value>`. Bao gồm 9 chức năng: Thêm xe (biển số duy nhất, chủ xe 2-35 ký tự, giá trị > 999, ngày đăng ký, loại 5/7/9 chỗ), Tìm kiếm xe, Cập nhật thông tin xe, Xóa xe (ràng buộc không được xóa nếu xe đã tham gia bảo hiểm), Thêm hợp đồng bảo hiểm (Insurance Statement), Liệt kê danh sách hợp đồng, Báo cáo xe chưa có bảo hiểm, Lưu và Tải dữ liệu từ file.",
    mindset: [
      "**Bước 1 – Khai thác Map<Key, Value>:** Dùng `HashMap<String, Car>` với key là biển số xe (licensePlate). Giúp thao tác tìm kiếm, kiểm tra tồn tại đạt độ phức tạp O(1).",
      "**Bước 2 – Thiết kế Model:** `Car` (licensePlate, owner, brand, value, regDate, regPlace, vehicleType) và `InsuranceStatement` (statementId, licensePlate, period, fee, establishedDate).",
      "**Bước 3 – Ràng buộc nghiệp vụ xóa:** Trong Controller, trước khi xóa xe phải duyệt danh sách hợp đồng bảo hiểm. Nếu xe đang có hợp đồng thì chặn xóa và trả thông báo lỗi.",
      "**Bước 4 – Báo cáo xe chưa bảo hiểm:** Lọc tập các xe trong `Map<String, Car>` mà biển số không xuất hiện trong bất kỳ hợp đồng bảo hiểm nào.",
    ],
    oopConcepts: [
      "**Map Collection** – Sử dụng `Map<Key, Value>` để định danh duy nhất xe hơi theo biển số xe.",
      "**Business Logic Validation** – Kiểm tra ràng buộc toàn vẹn quan hệ giữa Xe và Hợp đồng bảo hiểm trước khi xóa.",
      "**Date Validation** – Xử lý định dạng ngày tháng chuẩn và tính toán thời hạn bảo hiểm hợp lệ.",
    ],
    faq: [
      {
        type: "theory",
        question: "Lợi ích của việc sử dụng cấu trúc `Map<Key, Value>` so với `List` trong bài toán quản lý xe?",
        answer: "Khi số lượng xe lớn, việc tìm kiếm theo biển số trong `List` mất thời gian O(n), trong khi `Map` (cụ thể là `HashMap`) tra cứu O(1) dựa trên bảng băm và mã hash của biển số xe.",
      },
      {
        type: "applied",
        question: "Làm thế nào để ngăn chặn xóa xe khi xe đã tham gia bảo hiểm?",
        answer: "Trong phương thức `deleteCar(String licensePlate)` của Controller, kiểm tra trước: `for (InsuranceStatement st : statements) if (st.getLicensePlate().equalsIgnoreCase(licensePlate)) return false;`. Chỉ thực hiện `carsMap.remove(licensePlate)` khi không có liên kết nào tồn tại.",
      },
    ],
  },

  // =====================================================================
  // J1.L.P0039 – STUDENT & SHORT COURSE MANAGEMENT (Campus HCM)
  // =====================================================================
  "J1.L.P0039": {
    labCode: "J1.L.P0039",
    summary:
      "Hệ thống quản lý sinh viên và các khóa học ngắn hạn tại trường đại học (quy mô 500 LOC). Dữ liệu được đồng bộ và lưu trữ trong hai file văn bản: `Students.txt` (ID format STU0000, Họ tên >= 2 từ, Chuyên ngành, GPA 0.0 - 4.0) và `Courses.txt` (Mã khóa học, Mã sinh viên ngoại khóa, Tên khóa, Thời lượng >= 1 tuần, Ngày bắt đầu trong tương lai). Chương trình cung cấp các chức năng CRUD sinh viên, đăng ký khóa học, tìm kiếm theo sinh viên và lưu trữ file.",
    mindset: [
      "**Bước 1 – Thiết kế thực thể:** `Student` (studentId, fullName, major, gpa) và `Course` (courseId, studentId, courseName, durationWeeks, startDate).",
      "**Bước 2 – Khóa ngoại logic:** Khi thêm khóa học mới cho sinh viên, mã `studentId` bắt buộc phải tồn tại trong danh sách sinh viên hiện có.",
      "**Bước 3 – Xử lý File Text:** Viết hàm đọc ghi `BufferedReader`/`BufferedWriter` phân tách dữ liệu theo dấu phẩy (comma-separated format) chuẩn xác.",
      "**Bước 4 – Validation đa điều kiện:** Kiểm tra Regex mã sinh viên `^STU\\d{4}$`, họ tên phải chứa ít nhất 1 khoảng trắng (>= 2 từ), GPA trong khoảng [0.0, 4.0].",
    ],
    oopConcepts: [
      "**Relational Integrity in OOP** – Quản lý mối liên kết giữa 2 thực thể Sinh viên và Khóa học thông qua ID.",
      "**Text File Persistence** – Đọc và phân tích cú pháp dòng dữ liệu văn bản thành đối tượng Java và ngược lại.",
      "**Strict Input Constraints** – Kiểm tra định dạng ID, GPA biên và ngày bắt đầu trong tương lai.",
    ],
    faq: [
      {
        type: "theory",
        question: "Làm thế nào để kiểm tra tên sinh viên phải chứa ít nhất hai từ?",
        answer: "Sử dụng phương thức `name.trim().split(\"\\\\s+\").length >= 2`. Regex `\\s+` giúp xử lý mọi khoảng trắng dư thừa giữa các từ.",
      },
      {
        type: "applied",
        question: "Khi sinh viên bị xóa, các khóa học của sinh viên đó có nên bị ảnh hưởng?",
        answer: "Tùy theo nghiệp vụ: Có thể chặn xóa sinh viên nếu sinh viên đang theo học các khóa học hoạt động, hoặc thực hiện xóa dây chuyền (cascade delete) các bản ghi khóa học liên quan trong danh sách trước khi lưu file.",
      },
    ],
  },
};

/**
 * Lấy thông tin phân tích cho bài lab theo mã code.
 * @param labCode Mã bài lab (vd: "J1.L.P0023")
 * @returns LabAnalysis hoặc undefined nếu không có dữ liệu
 */
export function getLabAnalysis(labCode: string): LabAnalysis | undefined {
  // Normalize: loại bỏ khoảng trắng, so sánh không phân biệt hoa thường
  const normalized = labCode.trim().toUpperCase().replace(/\s+/g, "");
  const key = Object.keys(LAB_ANALYSIS_MAP).find(
    (k) => k.toUpperCase().replace(/\s+/g, "") === normalized
  );
  return key ? LAB_ANALYSIS_MAP[key] : undefined;
}
