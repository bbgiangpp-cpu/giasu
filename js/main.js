(function(){
  // ---- Progress tracking (localStorage; scoped per logged-in user if auth.js has set one) ----
  function progressKey(subject, chapterName){
    var uid = window.__currentUid || "guest";
    return "progress_" + uid + "_" + subject + "::" + chapterName;
  }
  function isChapterDone(subject, chapterName){
    try { return localStorage.getItem(progressKey(subject, chapterName)) === "1"; } catch(e){ return false; }
  }
  function markChapterDone(subject, chapterName){
    try { localStorage.setItem(progressKey(subject, chapterName), "1"); } catch(e){}
  }

  var COLOR_TOKENS = {
    gold:   {accent:"var(--gold)",   tint:"var(--gold-tint)"},
    rose:   {accent:"var(--rose)",   tint:"var(--rose-tint)"},
    sage:   {accent:"var(--sage)",   tint:"var(--sage-tint)"},
    coral:  {accent:"var(--coral)",  tint:"var(--coral-tint)"},
    sky:    {accent:"var(--sky)",    tint:"var(--sky-tint)"},
    teal:   {accent:"var(--teal)",   tint:"var(--teal-tint)"},
    accent: {accent:"var(--accent-strong)", tint:"var(--accent-tint)"}
  };

  // Khung chương theo Chương trình GDPT 2018 (tham khảo chung 3 bộ SGK hiện hành:
  // Kết nối tri thức / Chân trời sáng tạo / Cánh diều). Tên chương có thể lệch nhẹ
  // theo từng bộ sách cụ thể — nên đối chiếu lại với SGK trung tâm đang dùng.
  var SUBJECT_CONTENT = {
    "Toán": {short:"T", format:"Trắc nghiệm, 3 dạng câu hỏi: nhiều lựa chọn, đúng/sai (mỗi câu 4 ý), trả lời ngắn (tự điền đáp số) — không còn phần tự luận.", duration:"90 phút", parts:["Phần I – Nhiều lựa chọn: 12 câu","Phần II – Đúng/Sai: 4 câu (16 ý)","Phần III – Trả lời ngắn: 6 câu"], grades:{
      "10":["Mệnh đề và tập hợp","Bất phương trình và hệ bất phương trình bậc nhất hai ẩn","Hàm số bậc hai và đồ thị","Bất phương trình bậc hai một ẩn","Đại số tổ hợp","Hệ thức lượng trong tam giác","Vectơ","Phương pháp tọa độ trong mặt phẳng","Thống kê","Xác suất"],
      "11":["Hàm số lượng giác và phương trình lượng giác","Dãy số – Cấp số cộng – Cấp số nhân","Giới hạn – Hàm số liên tục","Hàm số mũ và hàm số lôgarit","Đạo hàm","Đường thẳng và mặt phẳng – Quan hệ song song trong không gian","Quan hệ vuông góc trong không gian","Các số đặc trưng đo xu thế trung tâm (mẫu số liệu ghép nhóm)","Xác suất (biến cố giao, biến cố hợp)","Chuyên đề: Lý thuyết đồ thị"],
      "12":["Ứng dụng đạo hàm để khảo sát hàm số","Nguyên hàm – Tích phân","Vectơ và hệ tọa độ trong không gian","Phương trình mặt phẳng, đường thẳng, mặt cầu","Các số đặc trưng đo mức độ phân tán (mẫu số liệu ghép nhóm)","Xác suất có điều kiện"]
    }},
    "Ngữ Văn": {short:"Văn", format:"Tự luận, 2 phần: Đọc hiểu (ngữ liệu hoàn toàn ngoài SGK) và Viết (đoạn văn nghị luận xã hội + bài văn nghị luận văn học).", duration:"120 phút", parts:["Phần I – Đọc hiểu: 5 câu hỏi","Phần II – Viết đoạn văn nghị luận xã hội (~200 chữ)","Phần II – Viết bài văn nghị luận văn học"], grades:{
      "10":["Thần thoại và sử thi","Thơ trung đại Việt Nam","Kịch bản chèo – tuồng","Văn bản nghị luận","Truyện ngắn hiện đại"],
      "11":["Truyện thơ dân gian và thơ hiện đại","Bi kịch","Truyện ngắn hiện đại Việt Nam và nước ngoài","Văn bản nghị luận – tùy bút – tản văn","Phóng sự, nhật ký"],
      "12":["Truyện truyền kỳ, truyện ngắn hiện đại","Hài kịch","Nhật ký, hồi ký, phóng sự","Thơ hiện đại","Văn bản nghị luận – luyện đề"]
    }},
    "Vật Lý": {short:"Lý", format:"Trắc nghiệm, 3 dạng câu hỏi: nhiều lựa chọn, đúng/sai (mỗi câu 4 ý), trả lời ngắn — tăng câu hỏi gắn với thí nghiệm, tình huống thực tế.", duration:"50 phút", parts:["Phần I – Nhiều lựa chọn: 18 câu","Phần II – Đúng/Sai: 4 câu (16 ý)","Phần III – Trả lời ngắn: 6 câu"], grades:{
      "10":["Mở đầu Vật lý","Động học","Động lực học","Công – Năng lượng – Công suất","Động lượng","Chuyển động tròn","Biến dạng của vật rắn"],
      "11":["Dao động","Sóng","Trường điện (Điện trường)","Dòng điện, mạch điện"],
      "12":["Vật lý nhiệt","Khí lý tưởng","Trường từ (Từ trường)","Dòng điện xoay chiều"]
    }},
    "Hóa Học": {short:"Hóa", format:"Trắc nghiệm, 3 dạng câu hỏi: nhiều lựa chọn, đúng/sai (mỗi câu 4 ý), trả lời ngắn — chú trọng câu hỏi ứng dụng thực tiễn, thí nghiệm.", duration:"50 phút", parts:["Phần I – Nhiều lựa chọn: 18 câu","Phần II – Đúng/Sai: 4 câu (16 ý)","Phần III – Trả lời ngắn: 6 câu"], grades:{
      "10":["Cấu tạo nguyên tử","Bảng tuần hoàn các nguyên tố hóa học","Liên kết hóa học","Phản ứng oxi hóa – khử","Năng lượng hóa học","Tốc độ phản ứng hóa học","Nguyên tố nhóm VIIA (Halogen)"],
      "11":["Cân bằng hóa học","Pin điện và điện phân","Nitrogen – Sulfur","Đại cương về kim loại","Đại cương hóa học hữu cơ","Hydrocarbon","Dẫn xuất halogen – Alcohol – Phenol","Hợp chất carbonyl – Carboxylic acid"],
      "12":["Ester – Lipid","Carbohydrate","Hợp chất chứa nitrogen (Amine – Amino acid – Protein)","Polymer","Nguyên tố nhóm IA – IIA","Dãy kim loại chuyển tiếp thứ nhất và phức chất"]
    }},
    "Sinh Học": {short:"Sinh", format:"Trắc nghiệm, 3 dạng câu hỏi: nhiều lựa chọn, đúng/sai (mỗi câu 4 ý), trả lời ngắn — tăng câu hỏi liên hệ thực tiễn, sức khỏe, môi trường.", duration:"50 phút", parts:["Phần I – Nhiều lựa chọn: 18 câu","Phần II – Đúng/Sai: 4 câu (16 ý)","Phần III – Trả lời ngắn: 6 câu"], grades:{
      "10":["Giới thiệu chương trình Sinh học & các cấp độ tổ chức của thế giới sống","Thành phần hóa học của tế bào","Cấu trúc tế bào","Trao đổi chất và chuyển hóa năng lượng ở tế bào","Chu kỳ tế bào và phân bào","Vi sinh vật và virus"],
      "11":["Trao đổi chất và chuyển hóa năng lượng ở sinh vật","Cảm ứng ở sinh vật","Sinh trưởng và phát triển ở sinh vật","Sinh sản ở sinh vật"],
      "12":["Di truyền học phân tử (Gene – DNA – RNA)","Di truyền học nhiễm sắc thể","Di truyền học quần thể","Ứng dụng di truyền học","Di truyền học người","Tiến hóa","Sinh thái học và môi trường"]
    }},
    "Lịch Sử": {short:"Sử", format:"Trắc nghiệm, 3 dạng câu hỏi: nhiều lựa chọn, đúng/sai (mỗi câu 4 ý), trả lời ngắn — khai thác tư liệu, hình ảnh, bản đồ lịch sử.", duration:"50 phút", parts:["Phần I – Nhiều lựa chọn: 18 câu","Phần II – Đúng/Sai: 4 câu (16 ý)","Phần III – Trả lời ngắn: 4 câu"], grades:{
      "10":["Lịch sử và Sử học – vai trò của Sử học","Một số nền văn minh thế giới thời cổ – trung đại","Các cuộc cách mạng công nghiệp trong lịch sử thế giới","Văn minh Đông Nam Á cổ – trung đại","Văn minh Đại Việt","Cộng đồng các dân tộc Việt Nam"],
      "11":["Cách mạng tư sản và sự phát triển CNTB","Chủ nghĩa xã hội từ 1917 đến nay","Quá trình giành độc lập của các quốc gia Đông Nam Á","Chiến tranh bảo vệ Tổ quốc trong lịch sử Việt Nam","Công cuộc cải cách trong lịch sử Việt Nam"],
      "12":["Thế giới trong và sau Chiến tranh lạnh","ASEAN – Những chặng đường lịch sử","Cách mạng tháng Tám, chiến tranh giải phóng dân tộc và bảo vệ Tổ quốc (1945 – nay)","Công cuộc Đổi mới ở Việt Nam từ 1986","Lịch sử đối ngoại Việt Nam","Hồ Chí Minh trong lịch sử Việt Nam"]
    }},
    "Địa Lý": {short:"Địa", format:"Trắc nghiệm, 3 dạng câu hỏi: nhiều lựa chọn, đúng/sai (mỗi câu 4 ý), trả lời ngắn — kết hợp khai thác Atlat, biểu đồ, bảng số liệu.", duration:"50 phút", parts:["Phần I – Nhiều lựa chọn: 18 câu","Phần II – Đúng/Sai: 4 câu (16 ý)","Phần III – Trả lời ngắn: 4 câu"], grades:{
      "10":["Bản đồ và kỹ năng địa lý","Trái Đất","Thạch quyển – Khí quyển – Thủy quyển","Sinh quyển","Địa lý dân cư đại cương","Địa lý các ngành kinh tế và phát triển bền vững"],
      "11":["Sự khác biệt về trình độ phát triển kinh tế – xã hội, toàn cầu hóa và khu vực hóa","Địa lý khu vực và một số quốc gia (Mỹ Latinh, EU, Hoa Kỳ, Nga, Nhật Bản, Trung Quốc, Đông Nam Á, Australia)"],
      "12":["Địa lý tự nhiên Việt Nam","Địa lý dân cư Việt Nam","Địa lý các ngành kinh tế","Địa lý các vùng kinh tế","Kỹ năng biểu đồ – Atlat – bảng số liệu","Biển đảo Việt Nam"]
    }},
    "Tiếng Anh": {short:"Anh", format:"Trắc nghiệm nhiều lựa chọn (giữ định dạng quen thuộc), xây dựng theo Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam.", duration:"60 phút", parts:["Ngữ âm – Trọng âm: 2 câu","Ngữ pháp – Từ vựng: 18 câu","Đọc hiểu (2-3 bài): 15 câu","Chức năng giao tiếp – Viết lại câu: 5 câu"], grades:{
      "10":["Ngữ âm – Trọng âm cơ bản","Thì và cấu trúc câu cơ bản","Từ vựng chủ đề đời sống – học đường"],
      "11":["Ngữ pháp nâng cao (câu điều kiện, câu bị động, mệnh đề quan hệ)","Từ vựng chủ đề xã hội – môi trường","Kỹ năng đọc hiểu đoạn văn"],
      "12":["Ôn tập tổng hợp ngữ pháp trọng tâm","Từ vựng theo chủ đề đề thi THPT","Kỹ năng đọc hiểu nâng cao","Viết lại câu – viết đoạn văn","Luyện đề thi THPT Quốc gia"]
    }},
    "Giáo Dục KT&PL": {short:"KTPL", format:"Trắc nghiệm, 3 dạng câu hỏi: nhiều lựa chọn, đúng/sai (mỗi câu 4 ý), trả lời ngắn — gắn với tình huống pháp luật, kinh tế đời sống.", duration:"50 phút", parts:["Phần I – Nhiều lựa chọn: 18 câu","Phần II – Đúng/Sai: 4 câu (16 ý)","Phần III – Trả lời ngắn: 4 câu"], grades:{
      "10":["Nền kinh tế và các chủ thể kinh tế","Thị trường và cơ chế thị trường","Ngân sách nhà nước và thuế","Sản xuất kinh doanh và các mô hình sản xuất kinh doanh","Tín dụng và dịch vụ tín dụng","Lập kế hoạch tài chính cá nhân","Pháp luật nước Cộng hòa xã hội chủ nghĩa Việt Nam","Hiến pháp nước Cộng hòa xã hội chủ nghĩa Việt Nam","Hệ thống chính trị nước Cộng hòa xã hội chủ nghĩa Việt Nam"],
      "11":["Cạnh tranh, cung cầu trong nền kinh tế thị trường","Lạm phát, thất nghiệp","Ý tưởng và kế hoạch kinh doanh","Quyền bình đẳng của công dân"],
      "12":["Tăng trưởng và phát triển kinh tế","Hội nhập kinh tế quốc tế","Bảo hiểm và an sinh xã hội","Quản lý thu – chi trong gia đình","Trách nhiệm xã hội của doanh nghiệp","Quyền và nghĩa vụ công dân về pháp luật"]
    }},
    "Tin Học": {short:"Tin", format:"Trắc nghiệm, 3 dạng câu hỏi: nhiều lựa chọn, đúng/sai (mỗi câu 4 ý), trả lời ngắn — có câu hỏi thực hành tư duy lập trình.", duration:"50 phút", parts:["Phần I – Nhiều lựa chọn: 18 câu","Phần II – Đúng/Sai: 4 câu (16 ý)","Phần III – Trả lời ngắn: 4 câu"], grades:{
      "10":["Máy tính và xã hội tri thức","Mạng máy tính và Internet","Tổ chức lưu trữ, tìm kiếm, trao đổi thông tin","Đạo đức, pháp luật, văn hóa trong môi trường số","Giải quyết vấn đề với sự trợ giúp của máy tính"],
      "11":["Lập trình cơ bản (Python)","Cấu trúc dữ liệu và giải thuật cơ bản","Mạng máy tính nâng cao","Ứng dụng tin học chuyên ngành"],
      "12":["Quản lý và khai thác dữ liệu","Lập trình nâng cao","An toàn và bảo mật thông tin","Định hướng nghề nghiệp Tin học"]
    }},
    "Công Nghệ": {short:"CN", format:"Trắc nghiệm, 3 dạng câu hỏi: nhiều lựa chọn, đúng/sai (mỗi câu 4 ý), trả lời ngắn — theo đúng định hướng Công nghiệp hoặc Nông nghiệp đã học.", duration:"50 phút", parts:["Phần I – Nhiều lựa chọn: 18 câu","Phần II – Đúng/Sai: 4 câu (16 ý)","Phần III – Trả lời ngắn: 4 câu"], grades:{
      "10":["Công nghệ và đời sống","Thiết kế kỹ thuật","Một số công nghệ phổ biến","Ngành nghề kỹ thuật – công nghệ"],
      "11":["Định hướng Công nghiệp: Vẽ kỹ thuật, Cơ khí chế tạo — hoặc Định hướng Nông nghiệp: Trồng trọt, chăn nuôi cơ bản (tùy nhà trường)"],
      "12":["Định hướng Công nghiệp: Kỹ thuật điện – điện tử — hoặc Định hướng Nông nghiệp: Lâm nghiệp – Thủy sản (tùy nhà trường)"]
    }}
  };

  // Bài giảng tóm tắt do gia sư tự biên soạn (không sao chép từ tài liệu có bản quyền).
  // Đang làm dần từng chương — chương chưa có sẽ hiện thông báo "sắp cập nhật".
  var LESSON_CONTENT = {
    "Toán::Mệnh đề và tập hợp": {
      objectives: "Thiết lập và xét được tính đúng/sai của mệnh đề toán học; thực hiện được các phép toán trên tập hợp.",
      requirements: [
        "Thiết lập và phát biểu được các mệnh đề toán học, bao gồm: mệnh đề phủ định; mệnh đề đảo; mệnh đề tương đương; mệnh đề chứa kí hiệu ∀, ∃; điều kiện cần, điều kiện đủ, điều kiện cần và đủ.",
        "Xác định được tính đúng/sai của một mệnh đề toán học trong những trường hợp đơn giản.",
        "Nhận biết được các khái niệm cơ bản về tập hợp (tập con, hai tập hợp bằng nhau, tập rỗng) và biết sử dụng các kí hiệu ⊂, ⊃, ∅.",
        "Thực hiện được phép toán trên các tập hợp (hợp, giao, hiệu của hai tập hợp, phần bù của một tập con) và biết dùng biểu đồ Ven để biểu diễn.",
        "Giải quyết được một số vấn đề thực tiễn gắn với phép toán trên tập hợp (ví dụ: đếm số phần tử của hợp các tập hợp)."
      ],
      theory: [
        "Mệnh đề là câu khẳng định đúng hoặc sai, không thể vừa đúng vừa sai.",
        "Mệnh đề kéo theo P⇒Q; mệnh đề đảo là Q⇒P; hai mệnh đề tương đương P⇔Q khi cả P⇒Q và Q⇒P đều đúng.",
        "Phủ định của mệnh đề P kí hiệu P̄; P và P̄ luôn trái ngược giá trị đúng/sai.",
        "Mệnh đề chứa kí hiệu ∀ (\"với mọi\"), ∃ (\"tồn tại\"); phủ định của ∀x, P(x) là ∃x, P̄(x) và ngược lại.",
        "Các phép toán tập hợp: hợp A∪B, giao A∩B, hiệu A\\B, phần bù C_R(A)=R\\A; A=B khi A⊂B và B⊂A.",
        "Các tập con thường gặp của R: khoảng (a;b), đoạn [a;b], nửa khoảng (a;b], [a;b)."
      ],
      examples: [
        { problem: "Cho mệnh đề P: \"∀x∈R, x²≥0\". Xét tính đúng/sai và viết mệnh đề phủ định của P.",
          solution: "P đúng vì bình phương của mọi số thực đều không âm.\nPhủ định: P̄: \"∃x∈R, x²<0\" — mệnh đề P̄ này sai." },
        { problem: "Cho A=[−3;5], B=(0;7]. Tìm A∪B, A∩B, A\\B và phần bù của A trong R.",
          solution: "A∪B = [−3;7]\nA∩B = (0;5]\nA\\B = [−3;0]\nC_R(A) = (−∞;−3) ∪ (5;+∞)" }
      ],
      practice: [
        { level: "nhan-biet", question: "Cho mệnh đề Q: \"5 là số chẵn\". Xét tính đúng/sai của Q và viết mệnh đề phủ định.",
          answer: "Q sai (vì 5 là số lẻ). Phủ định Q̄: \"5 không phải là số chẵn\" — Q̄ đúng." },
        { level: "thong-hieu", question: "Viết mệnh đề đảo của: \"Nếu tứ giác là hình vuông thì nó là hình chữ nhật\". Mệnh đề đảo đó đúng hay sai?",
          answer: "Đảo: \"Nếu tứ giác là hình chữ nhật thì nó là hình vuông\" — mệnh đề này SAI (không phải hình chữ nhật nào cũng là hình vuông), nên không thể ghép thành mệnh đề tương đương." },
        { level: "van-dung", question: "Cho A={x∈N | x≤10, x chẵn}, B={x∈N | x≤10, x chia hết cho 3}. Tìm A∩B và số phần tử của A∪B.",
          answer: "A={0,2,4,6,8,10}, B={0,3,6,9}. A∩B={0,6}.\n|A∪B| = |A|+|B|−|A∩B| = 6+4−2 = 8." }
      ]
    },
    "Toán::Bất phương trình và hệ bất phương trình bậc nhất hai ẩn": {
      objectives: "Biểu diễn được miền nghiệm của bất phương trình, hệ bất phương trình bậc nhất hai ẩn và vận dụng vào bài toán tối ưu.",
      requirements: [
        "Nhận biết được bất phương trình và hệ bất phương trình bậc nhất hai ẩn.",
        "Biểu diễn được miền nghiệm của bất phương trình và hệ bất phương trình bậc nhất hai ẩn trên mặt phẳng tọa độ.",
        "Vận dụng được kiến thức về bất phương trình, hệ bất phương trình bậc nhất hai ẩn vào giải quyết bài toán thực tiễn (ví dụ: bài toán tìm cực trị của biểu thức F=ax+by trên một miền đa giác)."
      ],
      theory: [
        "Bất phương trình bậc nhất hai ẩn có dạng ax+by ≤ c (hoặc <, ≥, >).",
        "Miền nghiệm là một nửa mặt phẳng — xác định bằng cách thay tọa độ một điểm (thường là gốc O) vào bất phương trình.",
        "Hệ bất phương trình có miền nghiệm là giao các nửa mặt phẳng, thường là một đa giác lồi.",
        "Giá trị lớn nhất/nhỏ nhất của F=ax+by trên miền nghiệm luôn đạt tại một đỉnh của đa giác đó."
      ],
      examples: [
        { problem: "Biểu diễn miền nghiệm của bất phương trình x−2y≤2.",
          solution: "Vẽ đường thẳng x−2y=2 (đi qua (2;0) và (0;−1)).\nThay tọa độ O(0;0) vào: 0−0=0≤2 (đúng) → miền nghiệm là nửa mặt phẳng chứa gốc O, kể cả đường biên." },
        { problem: "Tìm giá trị lớn nhất của F=3x+2y trên miền nghiệm của hệ: x+y≤5; x≥0; y≥0.",
          solution: "Miền nghiệm là tam giác có 3 đỉnh (0;0), (5;0), (0;5).\nTính F tại từng đỉnh: (0;0)→0; (5;0)→15; (0;5)→10.\nVậy Max F = 15, đạt tại (5;0)." }
      ],
      practice: [
        { level: "nhan-biet", question: "Trong hai bất phương trình sau, bất phương trình nào là bậc nhất hai ẩn: a) 2x+3y≤6  b) x²+y≤4?",
          answer: "a) Là bất phương trình bậc nhất hai ẩn.\nb) Không phải, vì chứa x² (bậc hai)." },
        { level: "thong-hieu", question: "Biểu diễn miền nghiệm của hệ: x+y≤4; x≥0; y≥0.",
          answer: "Miền nghiệm là tam giác có 3 đỉnh (0;0), (4;0), (0;4), tính cả phần biên." },
        { level: "van-dung", question: "Tìm giá trị lớn nhất của F=x+2y trên miền nghiệm của hệ ở câu trên.",
          answer: "Tính F tại 3 đỉnh: (0;0)→0; (4;0)→4; (0;4)→8.\nVậy Max F = 8, đạt tại (0;4)." }
      ]
    },
    "Toán::Hàm số bậc hai và đồ thị": {
      objectives: "Mô tả được khái niệm hàm số, khảo sát và vẽ được đồ thị hàm số bậc hai, vận dụng vào bài toán thực tiễn.",
      requirements: [
        "Nhận biết được những mô hình thực tế (dạng bảng, biểu đồ, công thức) dẫn đến khái niệm hàm số.",
        "Mô tả được các khái niệm cơ bản về hàm số: định nghĩa, tập xác định, tập giá trị, hàm số đồng biến, hàm số nghịch biến, đồ thị của hàm số.",
        "Thiết lập được bảng giá trị và vẽ được Parabol là đồ thị của hàm số bậc hai; nhận biết được đỉnh, trục đối xứng.",
        "Nhận biết và giải thích được các tính chất của hàm số bậc hai thông qua đồ thị.",
        "Vận dụng được kiến thức về hàm số bậc hai và đồ thị vào giải quyết bài toán thực tiễn (ví dụ: xác định độ cao của cầu, cổng có hình dạng Parabol)."
      ],
      theory: [
        "Đồ thị hàm số y=ax²+bx+c là một parabol có đỉnh I(−b/2a; −Δ/4a), trục đối xứng x=−b/2a.",
        "Nếu a>0: parabol quay bề lõm lên trên, hàm đạt giá trị nhỏ nhất tại đỉnh; a<0 thì ngược lại (giá trị lớn nhất).",
        "Hàm đồng biến/nghịch biến tùy theo x nằm bên nào so với hoành độ đỉnh.",
        "Δ=b²−4ac quyết định số giao điểm với trục hoành: Δ>0 (2 điểm), Δ=0 (1 điểm), Δ<0 (không cắt)."
      ],
      examples: [
        { problem: "Khảo sát và tìm giao điểm với trục hoành của y=x²−4x+3.",
          solution: "Đỉnh: x=−b/2a=2, y(2)=4−8+3=−1 → I(2;−1).\nΔ=16−12=4>0 → 2 nghiệm x=1, x=3 → đồ thị cắt Ox tại (1;0) và (3;0)." },
        { problem: "Một quả bóng được ném lên theo quỹ đạo h(t)=−5t²+20t (h: mét, t: giây). Tìm độ cao lớn nhất và thời điểm đạt được.",
          solution: "Đỉnh tại t=−b/2a=−20/(2·(−5))=2 (giây).\nh(2)=−5·4+40=20 (mét).\nVậy độ cao lớn nhất là 20m, đạt tại t=2 giây." }
      ],
      practice: [
        { level: "nhan-biet", question: "Tìm tọa độ đỉnh và trục đối xứng của y=−2x²+4x+1.",
          answer: "x=−b/2a=−4/(2·(−2))=1; y(1)=−2+4+1=3 → đỉnh (1;3), trục đối xứng x=1." },
        { level: "thong-hieu", question: "Xét sự biến thiên của y=x²−2x trên khoảng (−∞;1) và (1;+∞).",
          answer: "a=1>0, đỉnh tại x=1 → hàm nghịch biến trên (−∞;1), đồng biến trên (1;+∞)." },
        { level: "van-dung", question: "Một cổng chào hình Parabol cao 6m tại đỉnh, hai chân cổng cách nhau 8m. Viết hàm số biểu diễn hình dạng cổng (chọn trục tung đi qua đỉnh).",
          answer: "Đỉnh (0;6), hai chân tại (±4;0). Dạng y=ax²+6; thay (4;0): 0=16a+6 → a=−3/8.\nVậy y = −(3/8)x² + 6." }
      ]
    },
    "Toán::Bất phương trình bậc hai một ẩn": {
      objectives: "Giải thích được dấu tam thức bậc hai, giải được bất phương trình bậc hai và phương trình quy về bậc hai.",
      requirements: [
        "Giải thích được định lí về dấu của tam thức bậc hai từ việc quan sát đồ thị của hàm bậc hai.",
        "Giải được bất phương trình bậc hai.",
        "Vận dụng được bất phương trình bậc hai một ẩn vào giải quyết bài toán thực tiễn (ví dụ: xác định chiều cao tối đa để xe qua hầm có hình dạng Parabol).",
        "Giải được phương trình chứa căn thức dạng √(ax²+bx+c)=√(dx²+ex+f) và √(ax²+bx+c)=dx+e."
      ],
      theory: [
        "Nếu Δ>0: f(x)=ax²+bx+c cùng dấu a khi x ở ngoài khoảng hai nghiệm, trái dấu a khi x ở giữa hai nghiệm.",
        "Nếu Δ=0: f(x) cùng dấu a với mọi x khác nghiệm kép; nếu Δ<0: f(x) cùng dấu a với mọi giá trị x.",
        "Quy trình giải bất phương trình bậc hai: tìm nghiệm (nếu có) → lập bảng xét dấu → kết luận theo yêu cầu đề bài.",
        "Giải phương trình chứa căn: đặt điều kiện cho vế phải (nếu có) không âm, bình phương hai vế, giải phương trình thu được rồi thử lại điều kiện."
      ],
      examples: [
        { problem: "Giải bất phương trình x²−5x+6≤0.",
          solution: "Δ=25−24=1>0 → hai nghiệm x=2, x=3.\nVì a=1>0, tam thức âm (trái dấu a) giữa hai nghiệm → nghiệm bất phương trình là x∈[2;3]." },
        { problem: "Giải phương trình √(2x²−3x−1) = √(x²+x−1).",
          solution: "Bình phương hai vế: 2x²−3x−1 = x²+x−1 ⟺ x²−4x=0 ⟺ x=0 hoặc x=4.\nThử điều kiện x²+x−1≥0: x=0 → −1<0 (loại); x=4 → 19≥0 (nhận).\nVậy nghiệm x=4." }
      ],
      practice: [
        { level: "nhan-biet", question: "Giải bất phương trình −x²+3x−2>0.",
          answer: "Δ=9−8=1>0 → nghiệm x=1, x=2. Vì a=−1<0, tam thức dương giữa hai nghiệm → nghiệm 1<x<2." },
        { level: "thong-hieu", question: "Tìm m để x²−2x+m>0 đúng với mọi x.",
          answer: "Cần a>0 (đã có) và Δ<0: 4−4m<0 ⟺ m>1." },
        { level: "van-dung", question: "Giải phương trình √(x²−x−4) = x−2.",
          answer: "Điều kiện x−2≥0 ⟺ x≥2. Bình phương: x²−x−4 = x²−4x+4 ⟺ 3x=8 ⟺ x=8/3 (thỏa x≥2).\nVậy nghiệm x=8/3." }
      ]
    },
    "Toán::Đại số tổ hợp": {
      objectives: "Vận dụng quy tắc đếm, hoán vị, chỉnh hợp, tổ hợp và khai triển được nhị thức Newton với số mũ thấp.",
      requirements: [
        "Vận dụng được quy tắc cộng và quy tắc nhân trong một số tình huống đơn giản.",
        "Vận dụng được sơ đồ hình cây trong các bài toán đếm đơn giản.",
        "Tính được số các hoán vị, chỉnh hợp, tổ hợp (kể cả bằng máy tính cầm tay).",
        "Khai triển được nhị thức Newton (a+b)ⁿ với số mũ thấp (n=4 hoặc n=5) bằng cách vận dụng tổ hợp."
      ],
      theory: [
        "Quy tắc cộng: hai phương án không trùng nhau, có m và n cách chọn thì có m+n cách.",
        "Quy tắc nhân: hai công đoạn liên tiếp có m và n cách thì có m×n cách.",
        "Hoán vị n phần tử: n!; Chỉnh hợp chập k của n: A(n,k)=n!/(n−k)!; Tổ hợp chập k: C(n,k)=n!/(k!(n−k)!).",
        "Chỉnh hợp quan tâm thứ tự, tổ hợp thì không.",
        "Nhị thức Newton: (a+b)ⁿ = ΣC(n,k)·a^(n−k)·b^k, các hệ số C(n,k) lấy từ tam giác Pascal."
      ],
      examples: [
        { problem: "Có bao nhiêu cách xếp 5 học sinh vào 5 ghế khác nhau?",
          solution: "Đây là hoán vị của 5 phần tử: 5! = 120 cách." },
        { problem: "Khai triển (x+2)⁴.",
          solution: "Hệ số Pascal hàng 4: 1, 4, 6, 4, 1.\n(x+2)⁴ = x⁴ + 4x³·2 + 6x²·4 + 4x·8 + 16 = x⁴+8x³+24x²+32x+16." }
      ],
      practice: [
        { level: "nhan-biet", question: "Tính C(6,2) và A(6,2).",
          answer: "C(6,2) = 6!/(2!4!) = 15. A(6,2) = 6!/4! = 30." },
        { level: "thong-hieu", question: "Có bao nhiêu số tự nhiên có 3 chữ số khác nhau lập từ tập {1,2,3,4,5}?",
          answer: "Đây là chỉnh hợp chập 3 của 5: A(5,3) = 5!/2! = 60 số." },
        { level: "van-dung", question: "Khai triển (2x−1)⁴ và tìm hệ số của x².",
          answer: "Số hạng chứa x²: C(4,2)·(2x)²·(−1)² = 6·4x²·1 = 24x². Vậy hệ số của x² là 24." }
      ]
    },
    "Toán::Hệ thức lượng trong tam giác": {
      objectives: "Vận dụng định lý sin, cosin, công thức diện tích để giải tam giác và bài toán thực tiễn.",
      requirements: [
        "Nhận biết và tính được giá trị lượng giác của một góc từ 0° đến 180° (kể cả bằng máy tính cầm tay).",
        "Giải thích được hệ thức liên hệ giữa giá trị lượng giác của các góc phụ nhau, bù nhau.",
        "Giải thích được các hệ thức lượng cơ bản trong tam giác: định lí côsin, định lí sin, công thức tính diện tích tam giác.",
        "Mô tả được cách giải tam giác và vận dụng vào bài toán thực tiễn (ví dụ: xác định khoảng cách giữa hai địa điểm khi gặp vật cản, xác định chiều cao khi không thể đo trực tiếp)."
      ],
      theory: [
        "Định lý cosin: a² = b² + c² − 2bc·cosA (và các hoán vị tương ứng cho b², c²).",
        "Định lý sin: a/sinA = b/sinB = c/sinC = 2R, với R là bán kính đường tròn ngoại tiếp.",
        "Diện tích tam giác: S = (1/2)ab·sinC, hoặc theo công thức Heron: S = √(p(p−a)(p−b)(p−c)) với p là nửa chu vi.",
        "Góc bù nhau: sin(180°−α)=sinα, cos(180°−α)=−cosα."
      ],
      examples: [
        { problem: "Tam giác có a=7, b=8, góc C=60°. Tính cạnh c.",
          solution: "c² = a²+b²−2ab·cosC = 49+64−2·7·8·0,5 = 57 → c = √57 ≈ 7,55." },
        { problem: "Tam giác ABC có a=6, B=45°, C=60°. Tính góc A và các cạnh còn lại.",
          solution: "A = 180°−45°−60° = 75°.\nTheo định lý sin: b = a·sinB/sinA = 6·sin45°/sin75° ≈ 4,39.\nc = a·sinC/sinA = 6·sin60°/sin75° ≈ 5,38." }
      ],
      practice: [
        { level: "nhan-biet", question: "Tính sin150° bằng công thức góc bù.",
          answer: "sin150° = sin(180°−150°) = sin30° = 0,5." },
        { level: "thong-hieu", question: "Tam giác ABC có A=45°, B=60°, cạnh a=4. Tính cạnh b.",
          answer: "b = a·sinB/sinA = 4·sin60°/sin45° ≈ 4·0,866/0,707 ≈ 4,90." },
        { level: "van-dung", question: "Hai người đứng cách nhau 50m ở hai phía đối diện một tòa tháp, cùng nhìn thấy đỉnh tháp với góc nâng 30° và 45°. Tính chiều cao tháp.",
          answer: "Gọi h là chiều cao tháp. Khoảng cách từ mỗi người tới chân tháp là h/tan30° và h/tan45°.\nTổng hai khoảng cách = 50 ⟹ h(√3+1) = 50 ⟹ h = 50/(√3+1) ≈ 18,3 m." }
      ]
    },
    "Toán::Vectơ": {
      objectives: "Thực hiện được các phép toán vectơ và vận dụng vào bài toán hình học, thực tiễn.",
      requirements: [
        "Nhận biết được khái niệm vectơ, vectơ bằng nhau, vectơ-không; biểu thị được một số đại lượng thực tiễn bằng vectơ.",
        "Thực hiện được các phép toán trên vectơ (tổng, hiệu, tích của một số với vectơ, tích vô hướng) và mô tả được tính chất hình học (ba điểm thẳng hàng, trung điểm, trọng tâm tam giác) bằng vectơ.",
        "Sử dụng được vectơ để giải thích một số hiện tượng liên quan đến Vật lí, Hóa học (lực, chuyển động).",
        "Vận dụng được kiến thức về vectơ để giải một số bài toán hình học và bài toán thực tiễn."
      ],
      theory: [
        "Hai vectơ bằng nhau khi cùng hướng và cùng độ dài.",
        "Quy tắc ba điểm: vectơ AB + vectơ BC = vectơ AC.",
        "Tích vô hướng: a⃗·b⃗ = |a⃗|·|b⃗|·cosθ; hai vectơ vuông góc khi tích vô hướng bằng 0.",
        "Tọa độ trung điểm M của AB: M=((x_A+x_B)/2; (y_A+y_B)/2). Tọa độ trọng tâm G của tam giác ABC: G=((x_A+x_B+x_C)/3; (y_A+y_B+y_C)/3)."
      ],
      examples: [
        { problem: "Cho A(1;2), B(3;4). Tìm tọa độ và độ dài vectơ AB.",
          solution: "Vectơ AB = (3−1; 4−2) = (2;2). Độ dài |AB| = √(4+4) = 2√2." },
        { problem: "Cho A(1;1), B(4;1), C(1;5). Tìm tọa độ trọng tâm G của tam giác ABC.",
          solution: "G = ((1+4+1)/3; (1+1+5)/3) = (2; 7/3)." }
      ],
      practice: [
        { level: "nhan-biet", question: "Cho vectơ a⃗=(3;−4). Tính độ dài |a⃗|.",
          answer: "|a⃗| = √(3²+(−4)²) = √25 = 5." },
        { level: "thong-hieu", question: "Cho A(0;0), B(4;0), C(0;3). Tính vectơ AB·vectơ AC.",
          answer: "Vectơ AB=(4;0), vectơ AC=(0;3). Tích vô hướng = 4·0+0·3 = 0." },
        { level: "van-dung", question: "Từ kết quả câu trên, hãy kết luận về tam giác ABC.",
          answer: "Vì vectơ AB·vectơ AC = 0 nên AB⊥AC, suy ra tam giác ABC vuông tại A." }
      ]
    },
    "Toán::Phương pháp tọa độ trong mặt phẳng": {
      objectives: "Thiết lập được phương trình đường thẳng, đường tròn trong mặt phẳng tọa độ và vận dụng vào bài toán thực tiễn.",
      requirements: [
        "Nhận biết được tọa độ của vectơ đối với một hệ trục tọa độ; tìm được tọa độ, độ dài vectơ khi biết tọa độ hai đầu mút.",
        "Thiết lập được phương trình đường thẳng khi biết: một điểm và vectơ pháp tuyến; một điểm và vectơ chỉ phương; hoặc hai điểm.",
        "Nhận biết được vị trí tương đối của hai đường thẳng; tính được góc giữa hai đường thẳng và khoảng cách từ một điểm đến một đường thẳng.",
        "Thiết lập được phương trình đường tròn khi biết tâm và bán kính, hoặc biết ba điểm mà đường tròn đi qua; thiết lập được phương trình tiếp tuyến của đường tròn.",
        "Nhận biết được ba đường conic (elip, hypebol, parabol) và phương trình chính tắc của chúng."
      ],
      theory: [
        "Phương trình tổng quát đường thẳng: ax+by+c=0, với vectơ pháp tuyến (a;b).",
        "Khoảng cách từ điểm M(x₀;y₀) đến đường thẳng ax+by+c=0: d = |ax₀+by₀+c| / √(a²+b²).",
        "Góc giữa hai đường thẳng có vectơ pháp tuyến (a₁;b₁), (a₂;b₂): cosθ = |a₁a₂+b₁b₂| / (√(a₁²+b₁²)·√(a₂²+b₂²)).",
        "Phương trình đường tròn tâm I(a;b), bán kính R: (x−a)²+(y−b)²=R²."
      ],
      examples: [
        { problem: "Viết phương trình đường thẳng qua A(1;2) có vectơ pháp tuyến (2;−1).",
          solution: "Phương trình: 2(x−1) − 1(y−2) = 0 ⟺ 2x−y = 0." },
        { problem: "Viết phương trình đường tròn tâm I(1;2) đi qua điểm A(4;6).",
          solution: "Bán kính R = IA = √((4−1)²+(6−2)²) = √(9+16) = 5.\nPhương trình: (x−1)²+(y−2)² = 25." }
      ],
      practice: [
        { level: "nhan-biet", question: "Viết phương trình đường tròn tâm I(2;−1), bán kính 3.",
          answer: "(x−2)² + (y+1)² = 9." },
        { level: "thong-hieu", question: "Tính khoảng cách từ điểm (0;0) đến đường thẳng 3x+4y−5=0.",
          answer: "d = |3·0+4·0−5| / √(3²+4²) = 5/5 = 1." },
        { level: "van-dung", question: "Viết phương trình tiếp tuyến của đường tròn (x−1)²+(y−2)²=25 tại điểm A(4;6).",
          answer: "Vectơ pháp tuyến của tiếp tuyến là IA=(3;4).\nPhương trình: 3(x−4)+4(y−6)=0 ⟺ 3x+4y−36=0." }
      ]
    },
    "Toán::Thống kê": {
      objectives: "Tính được các số đặc trưng đo xu thế trung tâm và mức độ phân tán cho mẫu số liệu không ghép nhóm.",
      requirements: [
        "Hiểu được khái niệm số gần đúng, sai số tuyệt đối; xác định được sai số tương đối và số quy tròn.",
        "Phát hiện và lí giải được số liệu không chính xác dựa trên mối liên hệ toán học đơn giản giữa các số liệu.",
        "Tính được số đặc trưng đo xu thế trung tâm: số trung bình, trung vị, tứ phân vị, mốt — và giải thích được ý nghĩa của chúng.",
        "Tính được số đặc trưng đo mức độ phân tán: khoảng biến thiên, khoảng tứ phân vị, phương sai, độ lệch chuẩn — và giải thích được ý nghĩa của chúng."
      ],
      theory: [
        "Số trung bình: cộng tất cả giá trị rồi chia cho số lượng phần tử.",
        "Trung vị: giá trị ở giữa dãy số đã sắp xếp (hoặc trung bình cộng của 2 giá trị giữa nếu số phần tử chẵn); tứ phân vị Q1, Q2(=trung vị), Q3 chia dãy thành 4 phần bằng nhau.",
        "Mốt: giá trị xuất hiện nhiều nhất trong mẫu số liệu.",
        "Khoảng biến thiên = giá trị lớn nhất − giá trị nhỏ nhất; phương sai đo độ phân tán quanh trung bình; độ lệch chuẩn là căn bậc hai của phương sai."
      ],
      examples: [
        { problem: "Tính số trung bình và trung vị của dãy: 2, 4, 4, 6.",
          solution: "Trung bình = (2+4+4+6)/4 = 4.\nDãy đã sắp xếp có 4 giá trị (chẵn) → trung vị = (4+4)/2 = 4." },
        { problem: "Tính tứ phân vị của dãy đã sắp xếp: 1, 3, 4, 5, 7, 8, 9, 10.",
          solution: "Trung vị Q2 = (5+7)/2 = 6.\nNửa dưới {1,3,4,5} → Q1 = (3+4)/2 = 3,5.\nNửa trên {7,8,9,10} → Q3 = (8+9)/2 = 8,5." }
      ],
      practice: [
        { level: "nhan-biet", question: "Tính số trung bình và trung vị của dãy: 3, 7, 7, 9, 10.",
          answer: "Trung bình = (3+7+7+9+10)/5 = 7,2. Trung vị (giá trị giữa của dãy đã sắp xếp) = 7." },
        { level: "thong-hieu", question: "Tính phương sai và độ lệch chuẩn của mẫu 2, 4, 4, 6 (biết trung bình = 4).",
          answer: "Phương sai = [(2−4)²+(4−4)²+(4−4)²+(6−4)²]/4 = (4+0+0+4)/4 = 2.\nĐộ lệch chuẩn = √2 ≈ 1,41." },
        { level: "van-dung", question: "Giải thích vì sao độ lệch chuẩn nhỏ nghĩa là dữ liệu ít phân tán, cho ví dụ so sánh hai lớp học có cùng điểm trung bình.",
          answer: "Độ lệch chuẩn nhỏ nghĩa là các giá trị trong mẫu gần với số trung bình. Ví dụ hai lớp cùng điểm trung bình 7, nhưng lớp A có độ lệch chuẩn 0,5 (điểm đồng đều quanh 7) còn lớp B có độ lệch chuẩn 2 (điểm rất phân tán, có em giỏi hẳn, có em kém hẳn) — lớp A học lực đồng đều hơn." }
      ]
    },
    "Toán::Xác suất": {
      objectives: "Mô tả được không gian mẫu, biến cố và tính được xác suất trong các phép thử đơn giản.",
      requirements: [
        "Nhận biết được các khái niệm: phép thử ngẫu nhiên, không gian mẫu, biến cố (là tập con của không gian mẫu), biến cố đối, định nghĩa cổ điển của xác suất.",
        "Mô tả được không gian mẫu, biến cố trong một số thí nghiệm đơn giản (tung đồng xu hai/ba lần, tung xúc xắc hai lần).",
        "Tính được xác suất của biến cố bằng phương pháp tổ hợp (trường hợp xác suất phân bố đều).",
        "Tính được xác suất trong một số thí nghiệm lặp bằng cách sử dụng sơ đồ hình cây.",
        "Mô tả được các tính chất cơ bản của xác suất; tính được xác suất của biến cố đối."
      ],
      theory: [
        "Không gian mẫu là tập hợp tất cả kết quả có thể của một phép thử; biến cố là một tập con của không gian mẫu.",
        "Xác suất của biến cố A: P(A) = số kết quả thuận lợi / tổng số kết quả có thể (khi các kết quả đồng khả năng).",
        "Luôn có 0 ≤ P(A) ≤ 1; P(biến cố chắc chắn)=1; P(biến cố không thể)=0.",
        "Biến cố đối: P(Ā) = 1 − P(A)."
      ],
      examples: [
        { problem: "Gieo một con xúc xắc, tính xác suất ra mặt chẵn.",
          solution: "Không gian mẫu có 6 kết quả {1,2,3,4,5,6}. Biến cố \"ra mặt chẵn\" = {2,4,6} có 3 kết quả.\nP = 3/6 = 1/2." },
        { problem: "Tung một đồng xu 2 lần, tính xác suất được đúng 1 lần mặt ngửa.",
          solution: "Không gian mẫu: {SS, SN, NS, NN} (4 kết quả, S=sấp, N=ngửa).\nBiến cố \"đúng 1 lần ngửa\" = {SN, NS} → P = 2/4 = 1/2." }
      ],
      practice: [
        { level: "nhan-biet", question: "Rút ngẫu nhiên 1 lá bài từ bộ 52 lá, tính xác suất rút được lá cơ (♥).",
          answer: "Bộ bài có 13 lá cơ trong 52 lá → P = 13/52 = 1/4." },
        { level: "thong-hieu", question: "Tính xác suất không ra mặt 6 khi gieo xúc xắc một lần.",
          answer: "Biến cố đối của \"ra mặt 6\" (xác suất 1/6) là \"không ra mặt 6\" → P = 1 − 1/6 = 5/6." },
        { level: "van-dung", question: "Tung xúc xắc 2 lần, tính xác suất tổng số chấm của hai lần tung bằng 7.",
          answer: "Các cặp có tổng 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) — 6 kết quả thuận lợi trên 36 kết quả có thể.\nP = 6/36 = 1/6." }
      ]
    }
  };

  // Đề kiểm tra cuối lớp (90 phút), theo đúng sườn Phần I/II/III của định dạng thi 2025.
  // Đề + đáp án do trang tự soạn để luyện tập — KHÔNG phải đề thi chính thức của Bộ GD&ĐT.
  var EXAM_CONTENT = {
    "Toán::10": {
      partI: [
        { q: "Mệnh đề nào sau đây đúng?", options: ["∀x∈R, x²>0", "∃x∈R, x²<0", "∀x∈R, x²≥0", "∃x∈R, x+1=x"], correct: 2 },
        { q: "Cho A=(1;6], B=[3;8). Tập A∩B là:", options: ["[3;6]", "(3;6)", "[3;6)", "(3;8)"], correct: 0 },
        { q: "Miền nghiệm của hệ x≥0, y≥0, x+y≤5 là tam giác có diện tích bằng:", options: ["12,5", "25", "5", "10"], correct: 0 },
        { q: "Parabol y=2x²−8x+5 có hoành độ đỉnh bằng:", options: ["2", "−2", "4", "1"], correct: 0 },
        { q: "Tập nghiệm của x²−6x+8<0 là:", options: ["(2;4)", "(−∞;2)∪(4;+∞)", "[2;4]", "R"], correct: 0 },
        { q: "Số cách chọn 4 học sinh từ 12 học sinh (không phân biệt vai trò) là:", options: ["495", "11880", "48", "1980"], correct: 0 },
        { q: "Hệ số của x³ trong khai triển (x+3)⁵ là:", options: ["90", "10", "270", "15"], correct: 0 },
        { q: "Tam giác đều cạnh a có diện tích là:", options: ["a²√3/4", "a²/2", "a²√2/4", "a²√3/2"], correct: 0 },
        { q: "Cho A(2;1), B(5;5). Độ dài đoạn AB là:", options: ["5", "7", "25", "3"], correct: 0 },
        { q: "Khoảng cách từ điểm (1;2) đến đường thẳng 3x−4y+5=0 là:", options: ["0", "1", "2", "5"], correct: 0 },
        { q: "Mẫu số liệu 5, 7, 7, 9, 12 có trung vị bằng:", options: ["7", "8", "9", "6"], correct: 0 },
        { q: "Gieo hai con xúc xắc, xác suất để tổng số chấm bằng 10 là:", options: ["1/12", "1/6", "1/9", "5/36"], correct: 0 }
      ],
      partII: [
        { q: "Cho hàm số y=x²−4x+3.", statements: [
            "Đỉnh của đồ thị hàm số là I(2;−1).",
            "Hàm số nghịch biến trên khoảng (2;+∞).",
            "Đồ thị cắt trục hoành tại hai điểm phân biệt.",
            "Giá trị nhỏ nhất của hàm số trên R bằng −1."
          ], correct: [true, false, true, true] },
        { q: "Cho hai tập hợp A=[−2;4], B=(1;6).", statements: [
            "A∩B = (1;4].",
            "A∪B = [−2;6).",
            "A\\B = [−2;1].",
            "B\\A = [4;6)."
          ], correct: [true, true, true, false] },
        { q: "Cho hai vectơ a⃗=(3;4), b⃗=(−1;2).", statements: [
            "|a⃗| = 5.",
            "a⃗·b⃗ = 5.",
            "a⃗ và b⃗ vuông góc với nhau.",
            "a⃗+b⃗ = (2;6)."
          ], correct: [true, true, false, true] },
        { q: "Một hộp có 5 viên bi đỏ và 3 viên bi xanh. Lấy ngẫu nhiên đồng thời 2 viên.", statements: [
            "Số cách lấy 2 viên bất kỳ là C(8,2) = 28.",
            "Số cách lấy được 2 viên cùng màu đỏ là C(5,2) = 10.",
            "Xác suất lấy được 2 viên khác màu là 15/28.",
            "Xác suất lấy được 2 viên đều màu xanh là 1/28."
          ], correct: [true, true, true, false] }
      ],
      partIII: [
        { q: "Có bao nhiêu số tự nhiên có 4 chữ số đôi một khác nhau lập từ các chữ số 1, 2, 3, 4, 5, 6?", answers: ["360"] },
        { q: "Tìm giá trị nhỏ nhất của hàm số y=x²−6x+11 trên R.", answers: ["2"] },
        { q: "Tìm số nghiệm nguyên của bất phương trình x²−5x+4≤0.", answers: ["4"] },
        { q: "Một túi có 4 bi trắng và 6 bi đen. Lấy ngẫu nhiên 1 bi. Tính xác suất lấy được bi trắng (nhập dạng phân số tối giản a/b).", answers: ["2/5", "0.4", "0,4"] },
        { q: "Trong mặt phẳng Oxy, cho tam giác ABC với A(1;2), B(4;6), C(7;2). Tính diện tích tam giác ABC.", answers: ["12"], requiresImage: true },
        { q: "Một cột đèn cao 6m tạo bóng dài 8m trên mặt đất. Tính góc tạo bởi tia nắng với mặt đất (làm tròn đến độ, nhập số nguyên độ).", range: [36, 38], requiresImage: true }
      ]
    }
  };

  // Ngân hàng câu hỏi trắc nghiệm (mỗi chương 8 câu, mỗi lần làm bài chọn ngẫu nhiên 5 câu
  // + xáo trộn thứ tự đáp án — nên mỗi lượt làm lại sẽ ra một đề khác).
  var QUIZ_CONTENT = {
    "Toán::Mệnh đề và tập hợp": [
      { q: "Mệnh đề nào sau đây là mệnh đề chứa biến?", options: ["3 + 5 = 8", "Hà Nội là thủ đô Việt Nam", "x + 2 = 5", "2 là số nguyên tố"], correct: 2 },
      { q: "Phủ định của mệnh đề \"∀x∈R, x²≥0\" là:", options: ["∀x∈R, x²<0", "∃x∈R, x²<0", "∃x∈R, x²≥0", "∀x∈R, x²>0"], correct: 1 },
      { q: "Cho A=[1;5], B=(3;7). Tập A∩B là:", options: ["(3;5]", "[1;7)", "(1;3)", "[5;7)"], correct: 0 },
      { q: "Tập hợp nào sau đây là tập rỗng?", options: ["{x∈R | x²=1}", "{x∈N | x<0}", "{x∈R | x≥0}", "{0}"], correct: 1 },
      { q: "Mệnh đề đảo của \"Nếu a=b thì a²=b²\" là:", options: ["Nếu a²=b² thì a=b", "Nếu a≠b thì a²≠b²", "Nếu a²≠b² thì a≠b", "a=b khi và chỉ khi a²=b²"], correct: 0 },
      { q: "(Khó) Cho mệnh đề P⇒Q đúng và Q sai. Kết luận nào đúng về P?", options: ["P đúng", "P sai", "Không xác định được", "P và Q đều sai"], correct: 1 },
      { q: "Cho A={1,2,3}, B={2,3,4}. Số phần tử của A∪B là:", options: ["3", "4", "5", "6"], correct: 1 },
      { q: "(Khó) Cho |A|=10, |B|=7, |A∩B|=4. Tính |A∪B|.", options: ["13", "17", "11", "21"], correct: 0 }
    ],
    "Toán::Bất phương trình và hệ bất phương trình bậc nhất hai ẩn": [
      { q: "Bất phương trình nào là bậc nhất hai ẩn?", options: ["x²+y≤3", "2x−3y>5", "xy≤4", "x+y²≥0"], correct: 1 },
      { q: "Miền nghiệm của x+y≤0 chứa điểm nào?", options: ["(1;1)", "(0;0)", "(2;3)", "(5;1)"], correct: 1 },
      { q: "Đường thẳng nào là biên của miền nghiệm 2x−y≤4?", options: ["2x−y=4", "2x+y=4", "x−2y=4", "x+y=4"], correct: 0 },
      { q: "Hệ x≥0, y≥0, x+y≤6 có miền nghiệm là hình gì?", options: ["Đường thẳng", "Tam giác", "Hình tròn", "Nửa mặt phẳng không giới hạn"], correct: 1 },
      { q: "Với hệ ở câu trên, giá trị lớn nhất của F=x+y trên miền nghiệm là:", options: ["0", "3", "6", "Không xác định"], correct: 2 },
      { q: "(Khó) Miền nghiệm là tam giác đỉnh (0;0), (4;0), (0;6). Giá trị lớn nhất của F=2x+3y là:", options: ["8", "18", "24", "0"], correct: 1 },
      { q: "Bất phương trình x−y>0 có miền nghiệm là:", options: ["Phía trên đường thẳng y=x", "Phía dưới đường thẳng y=x", "Toàn mặt phẳng", "Chính đường thẳng y=x"], correct: 1 },
      { q: "(Khó) Miền nghiệm hệ 2x+y≤10, x+3y≤15, x,y≥0 có các đỉnh (0,0),(5,0),(3,4),(0,5). F=4x+3y đạt max tại đỉnh nào?", options: ["(0,0)", "(5,0)", "(3,4)", "(0,5)"], correct: 2 }
    ],
    "Toán::Hàm số bậc hai và đồ thị": [
      { q: "Tập xác định của hàm số y=√(x−2) là:", options: ["R", "[2;+∞)", "(2;+∞)", "(−∞;2]"], correct: 1 },
      { q: "Đỉnh của parabol y=x²−6x+8 là:", options: ["(3;−1)", "(3;1)", "(−3;−1)", "(6;8)"], correct: 0 },
      { q: "Parabol y=−x²+4x−3 quay bề lõm về hướng nào?", options: ["Lên trên", "Xuống dưới", "Sang trái", "Sang phải"], correct: 1 },
      { q: "Số giao điểm của y=x²−2x+5 với trục hoành là:", options: ["0", "1", "2", "Vô số"], correct: 0 },
      { q: "Hàm số y=2x²−4x+1 đồng biến trên khoảng nào?", options: ["(−∞;1)", "(1;+∞)", "(−∞;+∞)", "(−1;1)"], correct: 1 },
      { q: "(Khó) Quỹ đạo h(t)=−4,9t²+30t. Thời điểm vật đạt độ cao lớn nhất là:", options: ["≈1,5s", "≈3,06s", "≈6,12s", "≈9s"], correct: 1 },
      { q: "Trục đối xứng của y=3x²+6x−2 là:", options: ["x=1", "x=−1", "x=2", "x=−2"], correct: 1 },
      { q: "(Khó) Giá trị nhỏ nhất của y=x²−4x+7 trên R là:", options: ["3", "7", "−3", "4"], correct: 0 }
    ],
    "Toán::Bất phương trình bậc hai một ẩn": [
      { q: "Tập nghiệm của x²−9≤0 là:", options: ["[−3;3]", "(−3;3)", "(−∞;−3]∪[3;+∞)", "[3;+∞)"], correct: 0 },
      { q: "Tam thức f(x)=x²−4x+4 có dấu như thế nào với x≠2?", options: ["Luôn dương", "Luôn âm", "Luôn dương với x≠2, bằng 0 tại x=2", "Đổi dấu"], correct: 2 },
      { q: "Bất phương trình x²+x+1>0 có tập nghiệm là:", options: ["R", "∅", "(−1;1)", "(0;+∞)"], correct: 0 },
      { q: "Nghiệm của −2x²+3x+2≥0 là:", options: ["[−0,5;2]", "(−∞;−0,5]∪[2;+∞)", "(−0,5;2)", "R"], correct: 0 },
      { q: "Điều kiện xác định của √(x²+2x−3)=√(2x+5) là:", options: ["x≥−2,5", "x≥0", "x≤−2,5", "x≥3"], correct: 0 },
      { q: "(Khó) Giải phương trình ở câu trên, nghiệm là:", options: ["x=2√2", "x=±2√2", "x=−2√2", "Vô nghiệm"], correct: 0 },
      { q: "Với giá trị nào của m thì x²−2x+m=0 vô nghiệm?", options: ["m>1", "m<1", "m=1", "m≥1"], correct: 0 },
      { q: "(Khó) Tìm m để x²−2mx+m+2≥0 với mọi x.", options: ["−1≤m≤2", "m≤−1", "m≥2", "−2≤m≤1"], correct: 0 }
    ],
    "Toán::Đại số tổ hợp": [
      { q: "Giá trị của 5! là:", options: ["60", "100", "120", "24"], correct: 2 },
      { q: "Số cách chọn 3 người từ 8 người (không phân biệt vai trò) là:", options: ["336", "56", "24", "512"], correct: 1 },
      { q: "Số cách xếp thứ tự 4 người vào 4 ghế là:", options: ["12", "16", "24", "256"], correct: 2 },
      { q: "A(5,2) bằng:", options: ["10", "20", "25", "60"], correct: 1 },
      { q: "Hệ số của x³ trong khai triển (x+1)⁵ là:", options: ["5", "10", "15", "20"], correct: 1 },
      { q: "(Khó) Có bao nhiêu cách chọn 2 táo và 3 cam từ 5 táo và 6 cam khác nhau?", options: ["60", "200", "30", "15"], correct: 1 },
      { q: "Số hạng tổng quát trong khai triển (a+b)ⁿ là:", options: ["C(n,k)aᵏb^(n−k)", "n!·aᵏ", "aⁿ+bⁿ", "n·a·b"], correct: 0 },
      { q: "(Khó) Hệ số của x² trong khai triển (2x−1)⁴ là:", options: ["24", "−24", "8", "16"], correct: 0 }
    ],
    "Toán::Hệ thức lượng trong tam giác": [
      { q: "Định lý cosin cho cạnh a là:", options: ["a²=b²+c²−2bc·cosA", "a²=b²+c²+2bc·cosA", "a=b+c−2bc·cosA", "a²=b²−c²"], correct: 0 },
      { q: "Theo định lý sin, a/sinA bằng:", options: ["R", "2R", "R/2", "4R"], correct: 1 },
      { q: "sin150° bằng:", options: ["0,5", "−0,5", "√3/2", "1"], correct: 0 },
      { q: "Diện tích tam giác với 2 cạnh b, c và góc xen giữa A là:", options: ["(1/2)bc·sinA", "bc·sinA", "(1/2)bc·cosA", "bc"], correct: 0 },
      { q: "Tam giác có a=5, b=5, C=60° thì cạnh c bằng:", options: ["5", "25", "√50", "10"], correct: 0 },
      { q: "(Khó) Tam giác có a=8, b=5, c=7. Tính cosA.", options: ["1/7", "7", "−1/7", "1/2"], correct: 0 },
      { q: "Hai góc phụ nhau có tổng bằng:", options: ["90°", "180°", "360°", "45°"], correct: 0 },
      { q: "(Khó) Tam giác có A=30°, b=10, c=10√3. Tính a.", options: ["10", "20", "10√3", "100"], correct: 0 }
    ],
    "Toán::Vectơ": [
      { q: "Hai vectơ bằng nhau khi:", options: ["Cùng phương", "Cùng hướng và cùng độ dài", "Cùng độ dài", "Ngược hướng"], correct: 1 },
      { q: "Vectơ AB + vectơ BA bằng:", options: ["Vectơ AB", "2 vectơ AB", "Vectơ-không", "Vectơ BA"], correct: 2 },
      { q: "Cho A(2;3), B(5;7). Tọa độ vectơ AB là:", options: ["(3;4)", "(7;10)", "(−3;−4)", "(2;3)"], correct: 0 },
      { q: "Tích vô hướng của hai vectơ vuông góc bằng:", options: ["1", "0", "−1", "|a||b|"], correct: 1 },
      { q: "Độ dài vectơ a=(6;8) là:", options: ["10", "14", "100", "48"], correct: 0 },
      { q: "(Khó) Cho A(1;1), B(4;5). Tính |AB|.", options: ["5", "7", "3", "25"], correct: 0 },
      { q: "Trọng tâm tam giác A(0;0), B(6;0), C(0;6) là:", options: ["(3;3)", "(2;2)", "(6;6)", "(0;0)"], correct: 1 },
      { q: "(Khó) Cho a=(1;2), b=(3;−1). Tính a·b.", options: ["1", "−1", "5", "3"], correct: 0 }
    ],
    "Toán::Phương pháp tọa độ trong mặt phẳng": [
      { q: "Đường thẳng ax+by+c=0 có vectơ pháp tuyến là:", options: ["(a;b)", "(b;a)", "(−a;b)", "(a;c)"], correct: 0 },
      { q: "Khoảng cách từ O(0;0) đến đường thẳng 3x+4y−10=0 là:", options: ["2", "10", "5", "0,5"], correct: 0 },
      { q: "Phương trình đường tròn tâm (0;0) bán kính 4 là:", options: ["x²+y²=16", "x²+y²=4", "x²+y²=8", "(x−4)²+y²=0"], correct: 0 },
      { q: "Hai đường thẳng có vectơ pháp tuyến (1;2) và (2;4) thì:", options: ["Vuông góc", "Song song hoặc trùng nhau", "Cắt nhau", "Không liên quan"], correct: 1 },
      { q: "Đường tròn (x−2)²+(y+3)²=25 có tâm và bán kính là:", options: ["Tâm (2;−3), R=5", "Tâm (−2;3), R=25", "Tâm (2;3), R=5", "Tâm (2;−3), R=25"], correct: 0 },
      { q: "(Khó) Đường thẳng vuông góc với 2x+y−1=0 và đi qua (1;1) là:", options: ["x−2y+1=0", "2x+y−3=0", "x+2y−3=0", "2x−y−1=0"], correct: 0 },
      { q: "Khoảng cách giữa A(1;1), B(4;5) là:", options: ["5", "7", "3", "4"], correct: 0 },
      { q: "(Khó) Đường tròn qua O(0;0), A(2;0), B(0;2) có tâm là:", options: ["(1;1)", "(0;0)", "(2;2)", "(1;0)"], correct: 0 }
    ],
    "Toán::Thống kê": [
      { q: "Số trung bình của dãy 2,4,6,8 là:", options: ["5", "4", "6", "20"], correct: 0 },
      { q: "Trung vị của dãy 1,2,3,4,5 là:", options: ["3", "2,5", "4", "15"], correct: 0 },
      { q: "Mốt là:", options: ["Giá trị xuất hiện nhiều nhất", "Giá trị trung bình", "Giá trị lớn nhất", "Giá trị nhỏ nhất"], correct: 0 },
      { q: "Khoảng biến thiên của dãy 3,7,2,9,5 là:", options: ["7", "9", "2", "5"], correct: 0 },
      { q: "Độ lệch chuẩn là:", options: ["Căn bậc hai của phương sai", "Bình phương phương sai", "Trung bình cộng", "Trung vị"], correct: 0 },
      { q: "(Khó) Phương sai của mẫu 1,3,5 (trung bình=3) là:", options: ["8/3", "4", "2", "8"], correct: 0 },
      { q: "Tứ phân vị Q2 chính là:", options: ["Trung vị", "Số trung bình", "Mốt", "Khoảng biến thiên"], correct: 0 },
      { q: "(Khó) Dãy đã sắp xếp 2,4,6,8,10,12. Tìm Q1.", options: ["4", "3", "6", "5"], correct: 0 }
    ],
    "Toán::Xác suất": [
      { q: "Không gian mẫu khi tung 1 đồng xu là:", options: ["{S,N}", "{S}", "{N}", "{S,N,SN}"], correct: 0 },
      { q: "Xác suất của biến cố chắc chắn là:", options: ["1", "0", "0,5", "Không xác định"], correct: 0 },
      { q: "Gieo 1 xúc xắc, xác suất ra mặt 5 là:", options: ["1/6", "1/2", "5/6", "1/3"], correct: 0 },
      { q: "Biến cố đối của A có xác suất là:", options: ["1−P(A)", "P(A)", "1+P(A)", "0"], correct: 0 },
      { q: "Tung 2 đồng xu, số phần tử không gian mẫu là:", options: ["4", "2", "8", "6"], correct: 0 },
      { q: "(Khó) Tung 2 xúc xắc, xác suất tổng bằng 8 là:", options: ["5/36", "6/36", "4/36", "1/6"], correct: 0 },
      { q: "Rút 1 lá từ bộ 52 lá, xác suất được lá Át (A) là:", options: ["1/13", "1/4", "4/13", "1/52"], correct: 0 },
      { q: "(Khó) Tung xúc xắc 2 lần, xác suất được ít nhất 1 lần mặt 6 là:", options: ["11/36", "1/6", "2/6", "25/36"], correct: 0 }
    ]
  };

  var modal = document.getElementById("subject-modal");
  var modalBadge = document.getElementById("modal-badge");
  var modalTitle = document.getElementById("modal-title");
  var modalSub = document.getElementById("modal-sub");
  var chapterList = document.getElementById("chapter-list");
  var examFormatText = document.getElementById("exam-format-text");
  var examDetailBox = document.getElementById("exam-detail");
  var modalClose = document.getElementById("modal-close");
  var modalNote = document.getElementById("modal-note");
  var examFormatBox = document.getElementById("exam-format");
  var lessonView = document.getElementById("lesson-view");
  var lessonBack = document.getElementById("lesson-back");
  var lessonTitle = document.getElementById("lesson-title");
  var lessonObjectives = document.getElementById("lesson-objectives");
  var lessonRequirementsBlock = document.getElementById("lesson-requirements-block");
  var lessonRequirements = document.getElementById("lesson-requirements");
  var lessonTheoryBlock = document.getElementById("lesson-theory-block");
  var lessonTheory = document.getElementById("lesson-theory");
  var lessonExampleBlock = document.getElementById("lesson-example-block");
  var lessonExamples = document.getElementById("lesson-examples");
  var lessonPracticeBlock = document.getElementById("lesson-practice-block");
  var lessonPractice = document.getElementById("lesson-practice");
  var lessonSoon = document.getElementById("lesson-soon");
  var LEVEL_LABELS = { "nhan-biet": "Nhận biết", "thong-hieu": "Thông hiểu", "van-dung": "Vận dụng" };
  var lessonCompleteRow = document.getElementById("lesson-complete-row");
  var lessonCompleteBtn = document.getElementById("lesson-complete-btn");
  var completeToast = document.getElementById("complete-toast");
  var modalProgress = document.getElementById("modal-progress");
  var lessonQuizBlock = document.getElementById("lesson-quiz-block");
  var quizQuestions = document.getElementById("quiz-questions");
  var quizSubmitBtn = document.getElementById("quiz-submit-btn");
  var quizRetryBtn = document.getElementById("quiz-retry-btn");
  var quizResult = document.getElementById("quiz-result");

  var currentSubject = null;
  var currentSubjectData = null;
  var currentChapter = null;
  var currentChapterRow = null;
  var currentFlatChapters = []; // [{name, row}] in display order, rebuilt per subject
  var currentQuizSet = [];
  var toastTimer = null;
  var PASS_SCORE = 7;
  var QUIZ_QUESTION_COUNT = 5;
  var QUIZ_POINTS_PER_Q = 10 / QUIZ_QUESTION_COUNT;

  function shuffle(arr){
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function isChapterLocked(subject, index){
    if (index <= 0) return false;
    var prevName = currentFlatChapters[index - 1] && currentFlatChapters[index - 1].name;
    if (!prevName) return false;
    var prevHasQuiz = !!QUIZ_CONTENT[subject + "::" + prevName];
    return prevHasQuiz && !isChapterDone(subject, prevName);
  }

  function chapterMetaLabel(subject, chapterName, hasLesson, locked){
    if (locked) return "🔒 Khóa";
    if (isChapterDone(subject, chapterName)) return "✓ Hoàn thành";
    return hasLesson ? "Xem bài giảng →" : "Chưa học";
  }

  function updateModalProgress(){
    if (!currentSubjectData) return;
    var total = 0, done = 0;
    Object.keys(currentSubjectData.grades).forEach(function(grade){
      currentSubjectData.grades[grade].forEach(function(ch){
        total++;
        if (isChapterDone(currentSubject, ch)) done++;
      });
    });
    modalProgress.textContent = done > 0
      ? "Đã hoàn thành " + done + "/" + total + " chương"
      : "Chưa bắt đầu học chương nào";
  }

  function showChapterListView(){
    lessonView.hidden = true;
    chapterList.hidden = false;
    examFormatBox.hidden = false;
    modalNote.hidden = false;
  }

  function openLesson(subject, chapterName, row){
    var lesson = LESSON_CONTENT[subject + "::" + chapterName];
    currentSubject = subject;
    currentChapter = chapterName;
    currentChapterRow = row || null;
    lessonTitle.textContent = chapterName;
    chapterList.hidden = true;
    examFormatBox.hidden = true;
    modalNote.hidden = true;
    lessonView.hidden = false;

    if (lesson) {
      lessonSoon.hidden = true;
      lessonCompleteRow.hidden = false;
      lessonObjectives.textContent = lesson.objectives;

      if (lesson.requirements && lesson.requirements.length) {
        lessonRequirementsBlock.hidden = false;
        lessonRequirements.innerHTML = "";
        lesson.requirements.forEach(function(point){
          var li = document.createElement("li");
          li.textContent = point;
          lessonRequirements.appendChild(li);
        });
      } else {
        lessonRequirementsBlock.hidden = true;
      }

      lessonTheoryBlock.hidden = false;
      lessonTheory.innerHTML = "";
      lesson.theory.forEach(function(point){
        var li = document.createElement("li");
        li.textContent = point;
        lessonTheory.appendChild(li);
      });

      lessonExampleBlock.hidden = false;
      lessonExamples.innerHTML = "";
      (lesson.examples || []).forEach(function(ex, i){
        var item = document.createElement("div");
        item.className = "example-item";
        item.innerHTML =
          '<span class="ex-label">Ví dụ ' + (i + 1) + '</span>' +
          '<p class="ex-problem"></p>' +
          '<p class="ex-solution"></p>';
        item.querySelector(".ex-problem").textContent = ex.problem;
        item.querySelector(".ex-solution").textContent = ex.solution;
        lessonExamples.appendChild(item);
      });

      lessonPracticeBlock.hidden = false;
      lessonPractice.innerHTML = "";
      (lesson.practice || []).forEach(function(item, i){
        var wrap = document.createElement("div");
        wrap.className = "practice-item";
        var levelClass = item.level || "";
        var levelText = LEVEL_LABELS[item.level] || "Tự luyện";
        wrap.innerHTML =
          '<span class="pr-tag ' + levelClass + '">' + levelText + '</span>' +
          '<p class="pr-question"></p>' +
          '<button type="button" class="pr-answer-toggle">Xem đáp án</button>' +
          '<p class="pr-answer"></p>';
        wrap.querySelector(".pr-question").textContent = (i + 1) + ". " + item.question;
        wrap.querySelector(".pr-answer").textContent = item.answer;
        var toggleBtn = wrap.querySelector(".pr-answer-toggle");
        var answerEl = wrap.querySelector(".pr-answer");
        toggleBtn.addEventListener("click", function(){
          var open = answerEl.classList.toggle("open");
          toggleBtn.textContent = open ? "Ẩn đáp án" : "Xem đáp án";
        });
        lessonPractice.appendChild(wrap);
      });

      var done = isChapterDone(subject, chapterName);
      var hasQuiz = !!QUIZ_CONTENT[subject + "::" + chapterName];
      if (hasQuiz) {
        lessonCompleteRow.hidden = true;
        lessonQuizBlock.hidden = false;
        renderQuiz(subject, chapterName);
      } else {
        lessonQuizBlock.hidden = true;
        lessonCompleteRow.hidden = false;
        lessonCompleteBtn.disabled = done;
        lessonCompleteBtn.textContent = done ? "✓ Đã hoàn thành" : "✓ Đánh dấu đã hoàn thành";
      }
    } else {
      lessonObjectives.textContent = "";
      lessonRequirementsBlock.hidden = true;
      lessonTheoryBlock.hidden = true;
      lessonExampleBlock.hidden = true;
      lessonPracticeBlock.hidden = true;
      lessonQuizBlock.hidden = true;
      lessonCompleteRow.hidden = true;
      lessonSoon.hidden = false;
    }
  }

  lessonBack.addEventListener("click", showChapterListView);

  function unlockNextChapterRow(){
    var idx = -1;
    for (var i = 0; i < currentFlatChapters.length; i++){
      if (currentFlatChapters[i].name === currentChapter) { idx = i; break; }
    }
    if (idx === -1) return;
    var next = currentFlatChapters[idx + 1];
    if (!next || !next.row) return;
    if (!isChapterLocked(currentSubject, idx + 1)) {
      next.row.classList.remove("locked");
      var meta = next.row.querySelector(".chapter-meta");
      if (meta) {
        var hasLesson = !!LESSON_CONTENT[currentSubject + "::" + next.name];
        meta.textContent = chapterMetaLabel(currentSubject, next.name, hasLesson, false);
        meta.classList.remove("locked-label");
      }
    }
  }

  function celebrateCompletion(){
    if (currentChapterRow) {
      var meta = currentChapterRow.querySelector(".chapter-meta");
      if (meta) { meta.textContent = "✓ Hoàn thành"; meta.classList.add("done"); meta.classList.remove("locked-label"); }
      currentChapterRow.classList.remove("locked");
    }
    updateModalProgress();
    unlockNextChapterRow();

    completeToast.hidden = false;
    completeToast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){
      completeToast.classList.remove("show");
      setTimeout(function(){ completeToast.hidden = true; }, 250);
    }, 1800);
  }

  lessonCompleteBtn.addEventListener("click", function(){
    if (!currentSubject || !currentChapter) return;
    markChapterDone(currentSubject, currentChapter);
    lessonCompleteBtn.disabled = true;
    lessonCompleteBtn.textContent = "✓ Đã hoàn thành";
    celebrateCompletion();
  });

  // ---- Quiz: random 5-question set per attempt, shuffled options ----
  function renderQuiz(subject, chapterName){
    var pool = QUIZ_CONTENT[subject + "::" + chapterName] || [];
    var picked = shuffle(pool).slice(0, QUIZ_QUESTION_COUNT);
    currentQuizSet = picked.map(function(item){
      var order = shuffle(item.options.map(function(_, i){ return i; }));
      return {
        q: item.q,
        options: order.map(function(i){ return item.options[i]; }),
        correct: order.indexOf(item.correct)
      };
    });

    quizQuestions.innerHTML = "";
    currentQuizSet.forEach(function(item, qi){
      var block = document.createElement("div");
      block.className = "quiz-question";
      var optionsHtml = item.options.map(function(opt, oi){
        return '<label class="quiz-option"><input type="radio" name="quiz-q' + qi + '" value="' + oi + '" />' + opt + '</label>';
      }).join("");
      block.innerHTML =
        '<span class="quiz-question-text">Câu ' + (qi + 1) + '. ' + item.q + '</span>' +
        '<div class="quiz-options">' + optionsHtml + '</div>';
      quizQuestions.appendChild(block);
    });

    quizResult.hidden = true;
    quizResult.className = "quiz-result";
    quizSubmitBtn.hidden = false;
    quizRetryBtn.hidden = true;
  }

  quizSubmitBtn.addEventListener("click", function(){
    if (!currentQuizSet.length) return;
    var correctCount = 0;
    currentQuizSet.forEach(function(item, qi){
      var block = quizQuestions.children[qi];
      var checked = block.querySelector('input[name="quiz-q' + qi + '"]:checked');
      var options = block.querySelectorAll(".quiz-option");
      if (checked && Number(checked.value) === item.correct) {
        correctCount++;
        block.classList.add("correct");
      } else {
        block.classList.add("incorrect");
        if (checked) options[Number(checked.value)].classList.add("wrong-answer");
      }
      options[item.correct].classList.add("right-answer");
      Array.prototype.forEach.call(block.querySelectorAll("input"), function(inp){ inp.disabled = true; });
    });

    var score = Math.round(correctCount * QUIZ_POINTS_PER_Q * 10) / 10;
    var passed = score > PASS_SCORE;

    quizResult.hidden = false;
    quizResult.className = "quiz-result " + (passed ? "pass" : "fail");
    quizResult.innerHTML = passed
      ? "🎉 Đạt " + score + "/10 điểm — đã mở khóa chương tiếp theo!"
      : "😕 Chỉ đạt " + score + "/10 điểm (cần trên " + PASS_SCORE + " điểm để qua). Xem lại bài giảng rồi làm lại với đề khác nhé.";

    quizSubmitBtn.hidden = true;
    quizRetryBtn.hidden = passed;

    if (passed) {
      if (!isChapterDone(currentSubject, currentChapter)) markChapterDone(currentSubject, currentChapter);
      celebrateCompletion();
    }
  });

  quizRetryBtn.addEventListener("click", function(){
    renderQuiz(currentSubject, currentChapter);
  });

  // ---- Full grade-end exam (90 phút) ----
  var examModal = document.getElementById("exam-modal");
  var examClose = document.getElementById("exam-close");
  var examTitle = document.getElementById("exam-title");
  var examTimerEl = document.getElementById("exam-timer");
  var examBody = document.getElementById("exam-body");
  var examSubmitBtn = document.getElementById("exam-submit-btn");
  var examFootNote = document.getElementById("exam-foot-note");
  var examResult = document.getElementById("exam-result");
  var examTimerInterval = null;
  var examSecondsLeft = 0;
  var examImages = {}; // in-memory only, cleared when the exam modal closes

  function normalizeAnswer(str){
    return String(str || "").trim().toLowerCase().replace(/,/g, ".").replace(/\s+/g, "");
  }

  function formatTime(totalSeconds){
    var m = Math.floor(totalSeconds / 60);
    var s = totalSeconds % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  function tickExamTimer(){
    examSecondsLeft--;
    examTimerEl.textContent = formatTime(Math.max(0, examSecondsLeft));
    examTimerEl.classList.toggle("low", examSecondsLeft <= 300);
    if (examSecondsLeft <= 0) {
      clearInterval(examTimerInterval);
      submitExam(true);
    }
  }

  function openExam(subject, grade, color){
    var exam = EXAM_CONTENT[subject + "::" + grade];
    if (!exam) return;
    currentExamData = exam;
    modal.close();
    examModal.style.setProperty("--modal-accent", color.accent);
    examModal.style.setProperty("--modal-accent-tint", color.tint);
    examTitle.textContent = "Bài kiểm tra cuối Lớp " + grade + " — " + subject;
    examImages = {};
    examResult.hidden = true;
    examResult.className = "exam-result";
    examSubmitBtn.hidden = false;
    examSubmitBtn.disabled = false;
    examFootNote.textContent = "Làm hết các câu rồi bấm Nộp bài";

    examBody.innerHTML = "";

    var titleI = document.createElement("div");
    titleI.className = "exam-section-title";
    titleI.textContent = "PHẦN I — Trắc nghiệm nhiều lựa chọn (mỗi câu 0,25 điểm)";
    examBody.appendChild(titleI);
    exam.partI.forEach(function(item, qi){
      var block = document.createElement("div");
      block.className = "exam-q";
      block.dataset.part = "1";
      block.dataset.index = qi;
      var optionsHtml = item.options.map(function(opt, oi){
        return '<label class="quiz-option"><input type="radio" name="exam1-' + qi + '" value="' + oi + '" />' + opt + '</label>';
      }).join("");
      block.innerHTML =
        '<span class="exam-q-text">Câu ' + (qi + 1) + '. ' + item.q + '</span>' +
        '<div class="quiz-options">' + optionsHtml + '</div>';
      examBody.appendChild(block);
    });

    var titleII = document.createElement("div");
    titleII.className = "exam-section-title";
    titleII.textContent = "PHẦN II — Đúng/Sai (đúng 1 ý: 0,1đ · 2 ý: 0,25đ · 3 ý: 0,5đ · cả 4 ý: 1đ)";
    examBody.appendChild(titleII);
    exam.partII.forEach(function(item, qi){
      var block = document.createElement("div");
      block.className = "exam-q";
      block.dataset.part = "2";
      block.dataset.index = qi;
      var statementsHtml = item.statements.map(function(st, si){
        var letter = String.fromCharCode(97 + si);
        return '<div class="exam-statement">' +
          '<span>' + letter + ') ' + st + '</span>' +
          '<span class="exam-statement-choice">' +
            '<label><input type="radio" name="exam2-' + qi + '-' + si + '" value="true" /> Đúng</label>' +
            '<label><input type="radio" name="exam2-' + qi + '-' + si + '" value="false" /> Sai</label>' +
          '</span>' +
        '</div>';
      }).join("");
      block.innerHTML = '<span class="exam-q-text">Câu ' + (qi + 1) + '. ' + item.q + '</span>' + statementsHtml;
      examBody.appendChild(block);
    });

    var titleIII = document.createElement("div");
    titleIII.className = "exam-section-title";
    titleIII.textContent = "PHẦN III — Trả lời ngắn (mỗi câu 0,5 điểm)";
    examBody.appendChild(titleIII);
    exam.partIII.forEach(function(item, qi){
      var block = document.createElement("div");
      block.className = "exam-q";
      block.dataset.part = "3";
      block.dataset.index = qi;
      block.innerHTML =
        '<span class="exam-q-text">Câu ' + (qi + 1) + '. ' + item.q + '</span>' +
        '<input type="text" class="exam-short-input" placeholder="Nhập đáp án..." />';
      if (item.requiresImage) {
        var imgRow = document.createElement("div");
        imgRow.className = "exam-image-row";
        imgRow.innerHTML =
          '<label class="exam-image-btn">📷 Tải ảnh lời giải<input type="file" accept="image/*" hidden /></label>' +
          '<span class="exam-image-hint">Không tính vào điểm tự động — gia sư sẽ xem phần trình bày.</span>';
        var fileInput = imgRow.querySelector('input[type="file"]');
        fileInput.addEventListener("change", function(){
          var file = fileInput.files[0];
          if (!file) return;
          var reader = new FileReader();
          reader.onload = function(){
            examImages[qi] = reader.result;
            var existingPreview = imgRow.querySelector(".exam-image-preview");
            if (existingPreview) existingPreview.remove();
            var img = document.createElement("img");
            img.className = "exam-image-preview";
            img.src = reader.result;
            imgRow.appendChild(img);
          };
          reader.readAsDataURL(file);
        });
        block.appendChild(imgRow);
      }
      examBody.appendChild(block);
    });

    examSecondsLeft = (exam.duration || 90) * 60;
    examTimerEl.textContent = formatTime(examSecondsLeft);
    examTimerEl.classList.remove("low");
    clearInterval(examTimerInterval);
    examTimerInterval = setInterval(tickExamTimer, 1000);

    examModal.showModal();
  }

  function submitExam(auto){
    clearInterval(examTimerInterval);
    examSubmitBtn.hidden = true;

    var totalPoints = 0;

    Array.prototype.forEach.call(examBody.querySelectorAll('.exam-q[data-part="1"]'), function(block){
      var qi = Number(block.dataset.index);
      var item = currentExamData.partI[qi];
      var checked = block.querySelector('input[name="exam1-' + qi + '"]:checked');
      var isCorrect = checked && Number(checked.value) === item.correct;
      if (isCorrect) totalPoints += 0.25;
      block.classList.add(isCorrect ? "graded-correct" : "graded-wrong");
      var options = block.querySelectorAll(".quiz-option");
      options[item.correct].classList.add("right-answer");
      if (checked && !isCorrect) options[Number(checked.value)].classList.add("wrong-answer");
      Array.prototype.forEach.call(block.querySelectorAll("input"), function(inp){ inp.disabled = true; });
    });

    Array.prototype.forEach.call(examBody.querySelectorAll('.exam-q[data-part="2"]'), function(block){
      var qi = Number(block.dataset.index);
      var item = currentExamData.partII[qi];
      var correctCount = 0;
      item.correct.forEach(function(ans, si){
        var checked = block.querySelector('input[name="exam2-' + qi + '-' + si + '"]:checked');
        if (checked && (checked.value === "true") === ans) correctCount++;
        Array.prototype.forEach.call(block.querySelectorAll('input[name="exam2-' + qi + '-' + si + '"]'), function(inp){ inp.disabled = true; });
      });
      var pts = correctCount === 1 ? 0.1 : correctCount === 2 ? 0.25 : correctCount === 3 ? 0.5 : correctCount === 4 ? 1 : 0;
      totalPoints += pts;
      if (correctCount === 4) block.classList.add("graded-correct");
      else if (correctCount === 0) block.classList.add("graded-wrong");
    });

    Array.prototype.forEach.call(examBody.querySelectorAll('.exam-q[data-part="3"]'), function(block){
      var qi = Number(block.dataset.index);
      var item = currentExamData.partIII[qi];
      var input = block.querySelector(".exam-short-input");
      input.disabled = true;
      var given = normalizeAnswer(input.value);
      var isCorrect = false;
      if (item.range) {
        var num = parseFloat(given);
        isCorrect = !isNaN(num) && num >= item.range[0] && num <= item.range[1];
      } else {
        isCorrect = item.answers.some(function(a){ return normalizeAnswer(a) === given; });
      }
      if (isCorrect) totalPoints += 0.5;
      block.classList.add(isCorrect ? "graded-correct" : "graded-wrong");
    });

    var score = Math.round(totalPoints * 100) / 100;
    var passed = score > PASS_SCORE;
    examResult.hidden = false;
    examResult.className = "exam-result " + (passed ? "pass" : "fail");
    examResult.innerHTML =
      (auto ? "⏰ Hết giờ — bài đã được nộp tự động.<br>" : "") +
      "Điểm: <b>" + score + "/10</b>" +
      "<p>" + (passed
        ? "🎉 Đạt yêu cầu (trên " + PASS_SCORE + " điểm)! Ô đúng được tô xanh, ô bạn chọn sai được tô đỏ."
        : "Chưa đạt (cần trên " + PASS_SCORE + " điểm). Xem lại phần tô đỏ rồi ôn tập thêm nhé.") + "</p>";
    examFootNote.textContent = "Đã nộp bài";
  }

  examSubmitBtn.addEventListener("click", function(){ submitExam(false); });
  examClose.addEventListener("click", function(){
    clearInterval(examTimerInterval);
    examImages = {};
    examModal.close();
  });
  examModal.addEventListener("click", function(e){
    var box = examModal.getBoundingClientRect();
    var inside = e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom;
    if (!inside) { clearInterval(examTimerInterval); examImages = {}; examModal.close(); }
  });

  var currentExamData = null;

  function openSubjectModal(subject, tagLabel, color){
    var data = SUBJECT_CONTENT[subject] || {short:subject.slice(0,2), grades:{"12":["Nội dung đang được cập nhật"]}};
    currentSubject = subject;
    currentSubjectData = data;
    var gradeKeys = Object.keys(data.grades).sort();
    var totalChapters = gradeKeys.reduce(function(sum, g){ return sum + data.grades[g].length; }, 0);

    modal.style.setProperty("--modal-accent", color.accent);
    modal.style.setProperty("--modal-accent-tint", color.tint);
    modalBadge.textContent = data.short;
    modalTitle.textContent = subject;
    modalSub.textContent = tagLabel + " · " + totalChapters + " chương theo GDPT 2018";
    examFormatText.textContent = data.format || "Đang cập nhật theo cấu trúc đề thi tốt nghiệp THPT 2025.";

    examDetailBox.innerHTML = "";
    if (data.duration || data.parts) {
      var durationLine = document.createElement("p");
      durationLine.innerHTML = "<b>Thời gian làm bài:</b> " + (data.duration || "—");
      examDetailBox.appendChild(durationLine);
      if (data.parts) {
        var ul = document.createElement("ul");
        data.parts.forEach(function(part){
          var li = document.createElement("li");
          li.textContent = part;
          ul.appendChild(li);
        });
        examDetailBox.appendChild(ul);
      }
    }

    chapterList.innerHTML = "";
    showChapterListView();
    currentFlatChapters = [];

    gradeKeys.forEach(function(grade){
      var group = document.createElement("div");
      group.className = "grade-group";
      var label = document.createElement("span");
      label.className = "grade-label";
      label.textContent = "Lớp " + grade;
      group.appendChild(label);
      data.grades[grade].forEach(function(ch, i){
        var index = currentFlatChapters.length;
        var locked = isChapterLocked(subject, index);
        var row = document.createElement("button");
        row.type = "button";
        row.className = "chapter-item" + (locked ? " locked" : "");
        var hasLesson = !!LESSON_CONTENT[subject + "::" + ch];
        var metaLabel = chapterMetaLabel(subject, ch, hasLesson, locked);
        row.innerHTML =
          '<span class="chapter-num">' + String(i + 1).padStart(2, "0") + '</span>' +
          '<span class="chapter-name">' + ch + '</span>' +
          '<span class="chapter-meta' + (metaLabel === "✓ Hoàn thành" ? " done" : "") + (locked ? " locked-label" : "") + '">' + metaLabel + '</span>';
        row.addEventListener("click", function(){
          if (isChapterLocked(subject, index)) {
            alert("🔒 Hãy đạt bài kiểm tra của chương trước (trên " + PASS_SCORE + "/10 điểm) để mở khóa chương này.");
            return;
          }
          openLesson(subject, ch, row);
        });
        group.appendChild(row);
        currentFlatChapters.push({ name: ch, row: row });
      });
      if (EXAM_CONTENT[subject + "::" + grade]) {
        var examBtn = document.createElement("button");
        examBtn.type = "button";
        examBtn.className = "grade-exam-btn";
        examBtn.textContent = "📝 Bài kiểm tra cuối Lớp " + grade + " (90 phút)";
        examBtn.addEventListener("click", function(){ openExam(subject, grade, color); });
        group.appendChild(examBtn);
      }
      chapterList.appendChild(group);
    });

    updateModalProgress();
    modal.showModal();
  }

  modalClose.addEventListener("click", function(){ modal.close(); });
  modal.addEventListener("click", function(e){
    var box = modal.getBoundingClientRect();
    var inside = e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom;
    if (!inside) modal.close();
  });

  Array.prototype.forEach.call(document.querySelectorAll(".subj-register-btn"), function(btn){
    btn.addEventListener("click", function(){
      var card = btn.closest(".subj-card[data-subject]");
      if (!card) return;
      var subject = card.getAttribute("data-subject");
      var tag = card.getAttribute("data-tag") === "required" ? "Môn bắt buộc" : "Môn tự chọn";
      var color = COLOR_TOKENS[card.getAttribute("data-color")];
      openSubjectModal(subject, tag, color);
    });
  });

  // Scroll-reveal: fade + slide up each card/section as it enters the viewport.
  var reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealTargets = document.querySelectorAll(".subj-card, .assess-card, .reform-banner, .cta-banner");
  if (!reduceMotion && "IntersectionObserver" in window) {
    revealTargets.forEach(function(el){ el.classList.add("reveal"); });
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-in");
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.15, rootMargin: "0px 0px -40px 0px"});
    revealTargets.forEach(function(el){ observer.observe(el); });
  }
})();
