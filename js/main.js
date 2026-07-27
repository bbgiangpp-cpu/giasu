(function(){
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
      objectives: "Nắm khái niệm mệnh đề, mệnh đề phủ định và các phép toán trên tập hợp.",
      theory: [
        "Mệnh đề là câu khẳng định đúng hoặc sai, không thể vừa đúng vừa sai.",
        "Phủ định của mệnh đề P kí hiệu P̄; P và P̄ luôn trái ngược giá trị đúng/sai.",
        "Các phép toán tập hợp: hợp A∪B, giao A∩B, hiệu A\\B; A=B khi A⊂B và B⊂A.",
        "Các tập con thường gặp của R: khoảng (a;b), đoạn [a;b], nửa khoảng (a;b], [a;b)."
      ],
      example: "Cho A = {x ∈ R | −2 ≤ x < 3} và B = (0;5). Lấy phần chung của hai khoảng ta được A∩B = [0;3).",
      practice: [
        "Xác định A∪B và A\\B với A = [1;4], B = (2;6).",
        "Viết mệnh đề phủ định của: \"Mọi số nguyên tố lớn hơn 2 đều là số lẻ.\""
      ]
    },
    "Toán::Bất phương trình và hệ bất phương trình bậc nhất hai ẩn": {
      objectives: "Biểu diễn được miền nghiệm của bất phương trình bậc nhất hai ẩn và áp dụng vào bài toán tối ưu đơn giản.",
      theory: [
        "Bất phương trình bậc nhất hai ẩn có dạng ax+by ≤ c (hoặc <, ≥, >).",
        "Miền nghiệm là một nửa mặt phẳng — xác định bằng cách thay tọa độ một điểm (thường là gốc O) vào bất phương trình.",
        "Hệ bất phương trình có miền nghiệm là giao các nửa mặt phẳng, thường là một đa giác lồi.",
        "Giá trị lớn nhất/nhỏ nhất của F=ax+by trên miền nghiệm luôn đạt tại một đỉnh của đa giác đó."
      ],
      example: "Miền nghiệm của hệ x+y ≤ 4, x≥0, y≥0 là tam giác có 3 đỉnh (0;0), (4;0), (0;4).",
      practice: [
        "Tìm miền nghiệm của hệ: x+2y≤6; x≥0; y≥0.",
        "Tìm giá trị lớn nhất của F=2x+3y trên miền nghiệm ở ví dụ trên."
      ]
    },
    "Toán::Hàm số bậc hai và đồ thị": {
      objectives: "Khảo sát được sự biến thiên và vẽ được đồ thị hàm số bậc hai y=ax²+bx+c.",
      theory: [
        "Đồ thị là một parabol có đỉnh I(−b/2a; −Δ/4a), trục đối xứng x=−b/2a.",
        "Nếu a>0: parabol quay bề lõm lên trên, hàm đạt giá trị nhỏ nhất tại đỉnh; a<0 thì ngược lại.",
        "Hàm đồng biến/nghịch biến tùy theo x nằm bên nào so với hoành độ đỉnh.",
        "Δ=b²−4ac quyết định số giao điểm với trục hoành: Δ>0 (2 điểm), Δ=0 (1 điểm), Δ<0 (không cắt)."
      ],
      example: "Với y=x²−4x+3: đỉnh I(2;−1), đồ thị cắt Ox tại x=1 và x=3.",
      practice: [
        "Tìm tọa độ đỉnh và trục đối xứng của y=−2x²+4x+1.",
        "Xét sự biến thiên của y=x²−2x trên khoảng (−∞;1) và (1;+∞)."
      ]
    },
    "Toán::Bất phương trình bậc hai một ẩn": {
      objectives: "Giải được bất phương trình bậc hai bằng cách xét dấu tam thức.",
      theory: [
        "Nếu Δ>0: f(x)=ax²+bx+c cùng dấu a khi x ở ngoài khoảng hai nghiệm, trái dấu a khi x ở giữa hai nghiệm.",
        "Nếu Δ=0: f(x) cùng dấu a với mọi x khác nghiệm kép.",
        "Nếu Δ<0: f(x) cùng dấu a với mọi giá trị x.",
        "Quy trình giải: tìm nghiệm (nếu có) → lập bảng xét dấu → kết luận theo yêu cầu đề bài."
      ],
      example: "Giải x²−5x+6≤0: hai nghiệm x=2, x=3, tam thức trái dấu a giữa hai nghiệm nên nghiệm là x∈[2;3].",
      practice: [
        "Giải bất phương trình −x²+3x−2>0.",
        "Tìm m để x²−2x+m>0 đúng với mọi x (gợi ý: xét Δ<0)."
      ]
    },
    "Toán::Đại số tổ hợp": {
      objectives: "Vận dụng quy tắc đếm, hoán vị, chỉnh hợp, tổ hợp để giải bài toán đếm.",
      theory: [
        "Quy tắc cộng: hai phương án không trùng nhau, có m và n cách chọn thì có m+n cách.",
        "Quy tắc nhân: hai công đoạn liên tiếp có m và n cách thì có m×n cách.",
        "Hoán vị n phần tử: n!; Chỉnh hợp chập k của n: A(n,k)=n!/(n−k)!; Tổ hợp chập k: C(n,k)=n!/(k!(n−k)!).",
        "Chỉnh hợp quan tâm thứ tự, tổ hợp thì không."
      ],
      example: "Xếp 5 học sinh vào 5 ghế khác nhau: 5! = 120 cách.",
      practice: [
        "Từ 10 người chọn 3 người giữ 3 chức vụ khác nhau — hỏi có bao nhiêu cách?",
        "Hộp có 6 bi đỏ, 4 bi xanh. Chọn ngẫu nhiên 3 bi, hỏi có bao nhiêu cách chọn được đúng 2 bi đỏ?"
      ]
    },
    "Toán::Hệ thức lượng trong tam giác": {
      objectives: "Áp dụng định lý sin, định lý cosin để tính cạnh và góc trong tam giác.",
      theory: [
        "Định lý cosin: a² = b² + c² − 2bc·cosA (và các hoán vị tương ứng cho b², c²).",
        "Định lý sin: a/sinA = b/sinB = c/sinC = 2R, với R là bán kính đường tròn ngoại tiếp.",
        "Diện tích tam giác: S = (1/2)ab·sinC, hoặc theo công thức Heron: S = √(p(p−a)(p−b)(p−c))."
      ],
      example: "Tam giác có a=7, b=8, góc C=60°: c² = 49+64−2·7·8·0,5 = 57, nên c = √57.",
      practice: [
        "Tam giác ABC có A=45°, B=60°, cạnh a=4. Tính cạnh b.",
        "Tính diện tích tam giác có ba cạnh 5, 6, 7 bằng công thức Heron."
      ]
    },
    "Toán::Vectơ": {
      objectives: "Thực hiện được các phép toán vectơ và tích vô hướng của hai vectơ.",
      theory: [
        "Hai vectơ bằng nhau khi cùng hướng và cùng độ dài.",
        "Quy tắc ba điểm: vectơ AB + vectơ BC = vectơ AC.",
        "Tích vô hướng: a⃗·b⃗ = |a⃗|·|b⃗|·cosθ; hai vectơ vuông góc khi tích vô hướng bằng 0.",
        "Tọa độ trung điểm, trọng tâm tam giác tính trực tiếp từ tọa độ các điểm."
      ],
      example: "Cho A(1;2), B(3;4): vectơ AB có tọa độ (2;2), độ dài |AB| = 2√2.",
      practice: [
        "Cho A(0;0), B(4;0), C(0;3). Tính vectơ AB·vectơ AC.",
        "Chứng minh tam giác ABC vuông tại A khi vectơ AB vuông góc vectơ AC."
      ]
    },
    "Toán::Phương pháp tọa độ trong mặt phẳng": {
      objectives: "Viết được phương trình đường thẳng, đường tròn trong mặt phẳng tọa độ.",
      theory: [
        "Phương trình tổng quát đường thẳng: ax+by+c=0, với vectơ pháp tuyến (a;b).",
        "Phương trình đường tròn tâm I(a;b), bán kính R: (x−a)²+(y−b)²=R².",
        "Khoảng cách từ điểm M(x₀;y₀) đến đường thẳng ax+by+c=0: d = |ax₀+by₀+c| / √(a²+b²)."
      ],
      example: "Đường thẳng qua A(1;2) có vectơ pháp tuyến (2;−1): 2(x−1)−1(y−2)=0, tức 2x−y=0.",
      practice: [
        "Viết phương trình đường tròn tâm I(2;−1), bán kính 3.",
        "Tính khoảng cách từ điểm (0;0) đến đường thẳng 3x+4y−5=0."
      ]
    },
    "Toán::Thống kê": {
      objectives: "Tính được các số đặc trưng đo xu thế trung tâm và độ phân tán của mẫu số liệu.",
      theory: [
        "Số trung bình: cộng tất cả giá trị rồi chia cho số lượng phần tử.",
        "Trung vị: giá trị ở giữa dãy số đã sắp xếp (hoặc trung bình cộng của 2 giá trị giữa nếu số phần tử chẵn).",
        "Phương sai đo độ phân tán quanh giá trị trung bình; độ lệch chuẩn là căn bậc hai của phương sai."
      ],
      example: "Dãy số 2, 4, 4, 6 có trung bình = 4 và trung vị = 4.",
      practice: [
        "Tính số trung bình và trung vị của dãy: 3, 7, 7, 9, 10.",
        "Giải thích vì sao độ lệch chuẩn nhỏ nghĩa là dữ liệu ít phân tán."
      ]
    },
    "Toán::Xác suất": {
      objectives: "Tính được xác suất của một biến cố trong phép thử đơn giản.",
      theory: [
        "Xác suất của biến cố A: P(A) = số kết quả thuận lợi / tổng số kết quả có thể.",
        "Luôn có 0 ≤ P(A) ≤ 1; P(biến cố chắc chắn)=1; P(biến cố không thể)=0.",
        "Biến cố đối: P(Ā) = 1 − P(A)."
      ],
      example: "Gieo một con xúc xắc, xác suất ra mặt chẵn = 3/6 = 1/2.",
      practice: [
        "Rút ngẫu nhiên 1 lá bài từ bộ 52 lá, tính xác suất rút được lá cơ (♥).",
        "Tính xác suất không ra mặt 6 khi gieo xúc xắc một lần."
      ]
    }
  };

  var modal = document.getElementById("subject-modal");
  var modalBadge = document.getElementById("modal-badge");
  var modalTitle = document.getElementById("modal-title");
  var modalSub = document.getElementById("modal-sub");
  var chapterList = document.getElementById("chapter-list");
  var examFormatText = document.getElementById("exam-format-text");
  var examDetailBox = document.getElementById("exam-detail");
  var modalClose = document.getElementById("modal-close");
  var modalCta = document.getElementById("modal-cta");
  var modalNote = document.getElementById("modal-note");
  var examFormatBox = document.getElementById("exam-format");
  var lessonView = document.getElementById("lesson-view");
  var lessonBack = document.getElementById("lesson-back");
  var lessonTitle = document.getElementById("lesson-title");
  var lessonObjectives = document.getElementById("lesson-objectives");
  var lessonTheoryBlock = document.getElementById("lesson-theory-block");
  var lessonTheory = document.getElementById("lesson-theory");
  var lessonExampleBlock = document.getElementById("lesson-example-block");
  var lessonExample = document.getElementById("lesson-example");
  var lessonPracticeBlock = document.getElementById("lesson-practice-block");
  var lessonPractice = document.getElementById("lesson-practice");
  var lessonSoon = document.getElementById("lesson-soon");

  function showChapterListView(){
    lessonView.hidden = true;
    chapterList.hidden = false;
    examFormatBox.hidden = false;
    modalNote.hidden = false;
  }

  function openLesson(subject, chapterName){
    var lesson = LESSON_CONTENT[subject + "::" + chapterName];
    lessonTitle.textContent = chapterName;
    chapterList.hidden = true;
    examFormatBox.hidden = true;
    modalNote.hidden = true;
    lessonView.hidden = false;

    if (lesson) {
      lessonSoon.hidden = true;
      lessonObjectives.textContent = lesson.objectives;
      lessonTheoryBlock.hidden = false;
      lessonTheory.innerHTML = "";
      lesson.theory.forEach(function(point){
        var li = document.createElement("li");
        li.textContent = point;
        lessonTheory.appendChild(li);
      });
      lessonExampleBlock.hidden = false;
      lessonExample.textContent = lesson.example;
      lessonPracticeBlock.hidden = false;
      lessonPractice.innerHTML = "";
      lesson.practice.forEach(function(item){
        var li = document.createElement("li");
        li.textContent = item;
        lessonPractice.appendChild(li);
      });
    } else {
      lessonObjectives.textContent = "";
      lessonTheoryBlock.hidden = true;
      lessonExampleBlock.hidden = true;
      lessonPracticeBlock.hidden = true;
      lessonSoon.hidden = false;
    }
  }

  lessonBack.addEventListener("click", showChapterListView);

  function openSubjectModal(subject, tagLabel, color){
    var data = SUBJECT_CONTENT[subject] || {short:subject.slice(0,2), grades:{"12":["Nội dung đang được cập nhật"]}};
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

    gradeKeys.forEach(function(grade){
      var group = document.createElement("div");
      group.className = "grade-group";
      var label = document.createElement("span");
      label.className = "grade-label";
      label.textContent = "Lớp " + grade;
      group.appendChild(label);
      data.grades[grade].forEach(function(ch, i){
        var row = document.createElement("button");
        row.type = "button";
        row.className = "chapter-item";
        var hasLesson = !!LESSON_CONTENT[subject + "::" + ch];
        row.innerHTML =
          '<span class="chapter-num">' + String(i + 1).padStart(2, "0") + '</span>' +
          '<span class="chapter-name">' + ch + '</span>' +
          '<span class="chapter-meta">' + (hasLesson ? "Xem bài giảng →" : "Chưa học") + '</span>';
        row.addEventListener("click", function(){ openLesson(subject, ch); });
        group.appendChild(row);
      });
      chapterList.appendChild(group);
    });

    modalCta.onclick = function(){
      alert("Đã ghi nhận nhu cầu học " + subject + " (" + tagLabel + "). Đội ngũ sẽ liên hệ để xếp lịch học thử miễn phí.");
      modal.close();
    };
    modal.showModal();
  }

  modalClose.addEventListener("click", function(){ modal.close(); });
  modal.addEventListener("click", function(e){
    var box = modal.getBoundingClientRect();
    var inside = e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom;
    if (!inside) modal.close();
  });

  Array.prototype.forEach.call(document.querySelectorAll(".subj-card[data-subject]"), function(card){
    card.addEventListener("click", function(){
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
