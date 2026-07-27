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
    "Toán": {short:"T", format:"Trắc nghiệm, 3 dạng câu hỏi: nhiều lựa chọn, đúng/sai (mỗi câu 4 ý), trả lời ngắn (tự điền đáp số) — không còn phần tự luận.", grades:{
      "10":["Mệnh đề và tập hợp","Bất phương trình, hệ bất phương trình bậc nhất hai ẩn","Hệ thức lượng trong tam giác","Vectơ","Hàm số, đồ thị và ứng dụng","Thống kê","Xác suất"],
      "11":["Hàm số lượng giác và phương trình lượng giác","Dãy số – Cấp số cộng – Cấp số nhân","Giới hạn – Hàm số liên tục","Đường thẳng và mặt phẳng trong không gian","Đạo hàm","Quan hệ vuông góc trong không gian"],
      "12":["Ứng dụng đạo hàm khảo sát hàm số","Hàm số lũy thừa – mũ – lôgarit","Nguyên hàm – Tích phân","Vectơ và hệ tọa độ trong không gian","Phương trình mặt phẳng – đường thẳng – mặt cầu","Xác suất có điều kiện"]
    }},
    "Ngữ Văn": {short:"Văn", format:"Tự luận, 2 phần: Đọc hiểu (ngữ liệu hoàn toàn ngoài SGK) và Viết (đoạn văn nghị luận xã hội + bài văn nghị luận văn học).", grades:{
      "10":["Thần thoại và sử thi","Thơ trung đại Việt Nam","Kịch bản chèo – tuồng","Văn bản nghị luận","Truyện ngắn hiện đại"],
      "11":["Truyện thơ dân gian và thơ hiện đại","Bi kịch","Truyện ngắn hiện đại Việt Nam và nước ngoài","Văn bản nghị luận – tùy bút – tản văn","Phóng sự, nhật ký"],
      "12":["Truyện truyền kỳ, truyện ngắn hiện đại","Hài kịch","Nhật ký, hồi ký, phóng sự","Thơ hiện đại","Văn bản nghị luận – luyện đề"]
    }},
    "Vật Lý": {short:"Lý", format:"Trắc nghiệm, 3 dạng câu hỏi: nhiều lựa chọn, đúng/sai (mỗi câu 4 ý), trả lời ngắn — tăng câu hỏi gắn với thí nghiệm, tình huống thực tế.", grades:{
      "10":["Mở đầu Vật lý","Động học","Động lực học","Công – Năng lượng – Công suất","Động lượng","Chuyển động tròn","Biến dạng của vật rắn"],
      "11":["Dao động","Sóng","Điện trường"],
      "12":["Vật lý nhiệt","Khí lý tưởng","Từ trường","Vật lý hạt nhân và phóng xạ"]
    }},
    "Hóa Học": {short:"Hóa", format:"Trắc nghiệm, 3 dạng câu hỏi: nhiều lựa chọn, đúng/sai (mỗi câu 4 ý), trả lời ngắn — chú trọng câu hỏi ứng dụng thực tiễn, thí nghiệm.", grades:{
      "10":["Cấu tạo nguyên tử","Bảng tuần hoàn các nguyên tố hóa học","Liên kết hóa học","Phản ứng oxi hóa – khử","Năng lượng hóa học","Tốc độ phản ứng hóa học","Nguyên tố nhóm VIIA (Halogen)"],
      "11":["Cân bằng hóa học","Nitrogen – Sulfur","Đại cương hóa học hữu cơ","Hydrocarbon","Dẫn xuất halogen – Alcohol – Phenol","Hợp chất carbonyl – Carboxylic acid"],
      "12":["Ester – Lipid","Carbohydrate","Hợp chất chứa nitrogen (Amine – Amino acid – Protein)","Polymer","Đại cương về kim loại","Kim loại nhóm IA – IIA","Nguyên tố nhóm VIIIB (Iron)"]
    }},
    "Sinh Học": {short:"Sinh", format:"Trắc nghiệm, 3 dạng câu hỏi: nhiều lựa chọn, đúng/sai (mỗi câu 4 ý), trả lời ngắn — tăng câu hỏi liên hệ thực tiễn, sức khỏe, môi trường.", grades:{
      "10":["Thành phần hóa học của tế bào","Cấu trúc tế bào","Trao đổi chất và chuyển hóa năng lượng ở tế bào","Chu kỳ tế bào và phân bào","Vi sinh vật và ứng dụng"],
      "11":["Trao đổi chất và chuyển hóa năng lượng ở sinh vật","Cảm ứng ở sinh vật","Sinh trưởng và phát triển ở sinh vật","Sinh sản ở sinh vật"],
      "12":["Di truyền học phân tử (Gene – DNA – RNA)","Di truyền học nhiễm sắc thể","Di truyền học quần thể","Ứng dụng di truyền học","Di truyền học người","Tiến hóa","Sinh thái học và môi trường"]
    }},
    "Lịch Sử": {short:"Sử", format:"Trắc nghiệm, 3 dạng câu hỏi: nhiều lựa chọn, đúng/sai (mỗi câu 4 ý), trả lời ngắn — khai thác tư liệu, hình ảnh, bản đồ lịch sử.", grades:{
      "10":["Hiện thực lịch sử và nhận thức lịch sử","Văn minh Đông Nam Á","Các cuộc cách mạng công nghiệp","Cộng đồng các dân tộc Việt Nam"],
      "11":["Cách mạng tư sản và sự phát triển CNTB","Chủ nghĩa xã hội từ 1917 đến nay","Quá trình giành độc lập của các quốc gia Đông Nam Á","Chiến tranh bảo vệ Tổ quốc trong lịch sử Việt Nam","Công cuộc cải cách trong lịch sử Việt Nam"],
      "12":["Thế giới trong và sau Chiến tranh lạnh","Trật tự thế giới mới và vai trò của ASEAN","Cách mạng tháng Tám năm 1945","Kháng chiến chống Pháp và chống Mỹ (1945–1975)","Công cuộc Đổi mới ở Việt Nam từ 1986","Lịch sử đối ngoại Việt Nam","Hồ Chí Minh trong lịch sử Việt Nam"]
    }},
    "Địa Lý": {short:"Địa", format:"Trắc nghiệm, 3 dạng câu hỏi: nhiều lựa chọn, đúng/sai (mỗi câu 4 ý), trả lời ngắn — kết hợp khai thác Atlat, biểu đồ, bảng số liệu.", grades:{
      "10":["Bản đồ và kỹ năng địa lý","Trái Đất","Thạch quyển – Khí quyển – Thủy quyển","Sinh quyển","Địa lý dân cư đại cương"],
      "11":["Địa lý kinh tế – xã hội thế giới đại cương","Địa lý khu vực và một số quốc gia (Hoa Kỳ, EU, Nhật Bản, Trung Quốc, ĐNÁ, Úc)"],
      "12":["Địa lý tự nhiên Việt Nam","Địa lý dân cư Việt Nam","Địa lý các ngành kinh tế","Địa lý các vùng kinh tế","Kỹ năng biểu đồ – Atlat – bảng số liệu","Biển đảo Việt Nam"]
    }},
    "Tiếng Anh": {short:"Anh", format:"Trắc nghiệm nhiều lựa chọn (giữ định dạng quen thuộc), xây dựng theo Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam.", grades:{
      "10":["Ngữ âm – Trọng âm cơ bản","Thì và cấu trúc câu cơ bản","Từ vựng chủ đề đời sống – học đường"],
      "11":["Ngữ pháp nâng cao (câu điều kiện, câu bị động, mệnh đề quan hệ)","Từ vựng chủ đề xã hội – môi trường","Kỹ năng đọc hiểu đoạn văn"],
      "12":["Ôn tập tổng hợp ngữ pháp trọng tâm","Từ vựng theo chủ đề đề thi THPT","Kỹ năng đọc hiểu nâng cao","Viết lại câu – viết đoạn văn","Luyện đề thi THPT Quốc gia"]
    }},
    "Giáo Dục KT&PL": {short:"KTPL", format:"Trắc nghiệm, 3 dạng câu hỏi: nhiều lựa chọn, đúng/sai (mỗi câu 4 ý), trả lời ngắn — gắn với tình huống pháp luật, kinh tế đời sống.", grades:{
      "10":["Nền kinh tế và các chủ thể kinh tế","Sản xuất kinh doanh và các mô hình kinh tế","Ngân sách và các loại thuế","Pháp luật đời sống cơ bản"],
      "11":["Cạnh tranh, cung cầu trong nền kinh tế thị trường","Lạm phát, thất nghiệp","Ý tưởng và kế hoạch kinh doanh","Quyền bình đẳng của công dân"],
      "12":["Tăng trưởng và phát triển kinh tế","Hội nhập kinh tế quốc tế","Bảo hiểm và an sinh xã hội","Quản lý thu – chi trong gia đình","Trách nhiệm xã hội của doanh nghiệp","Quyền và nghĩa vụ công dân về pháp luật"]
    }},
    "Tin Học": {short:"Tin", format:"Trắc nghiệm, 3 dạng câu hỏi: nhiều lựa chọn, đúng/sai (mỗi câu 4 ý), trả lời ngắn — có câu hỏi thực hành tư duy lập trình.", grades:{
      "10":["Máy tính và xã hội tri thức","Mạng máy tính và Internet","Tổ chức lưu trữ, tìm kiếm, trao đổi thông tin","Đạo đức, pháp luật, văn hóa trong môi trường số","Giải quyết vấn đề với sự trợ giúp của máy tính"],
      "11":["Lập trình cơ bản (Python)","Cấu trúc dữ liệu và giải thuật cơ bản","Mạng máy tính nâng cao","Ứng dụng tin học chuyên ngành"],
      "12":["Quản lý và khai thác dữ liệu","Lập trình nâng cao","An toàn và bảo mật thông tin","Định hướng nghề nghiệp Tin học"]
    }},
    "Công Nghệ": {short:"CN", format:"Trắc nghiệm, 3 dạng câu hỏi: nhiều lựa chọn, đúng/sai (mỗi câu 4 ý), trả lời ngắn — theo đúng định hướng Công nghiệp hoặc Nông nghiệp đã học.", grades:{
      "10":["Công nghệ và đời sống","Thiết kế kỹ thuật","Một số công nghệ phổ biến","Ngành nghề kỹ thuật – công nghệ"],
      "11":["Định hướng Công nghiệp: Vẽ kỹ thuật, Cơ khí chế tạo — hoặc Định hướng Nông nghiệp: Trồng trọt, chăn nuôi cơ bản (tùy nhà trường)"],
      "12":["Định hướng Công nghiệp: Kỹ thuật điện – điện tử — hoặc Định hướng Nông nghiệp: Lâm nghiệp – Thủy sản (tùy nhà trường)"]
    }}
  };

  var modal = document.getElementById("subject-modal");
  var modalBadge = document.getElementById("modal-badge");
  var modalTitle = document.getElementById("modal-title");
  var modalSub = document.getElementById("modal-sub");
  var chapterList = document.getElementById("chapter-list");
  var examFormatText = document.getElementById("exam-format-text");
  var modalClose = document.getElementById("modal-close");
  var modalCta = document.getElementById("modal-cta");

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
    chapterList.innerHTML = "";

    gradeKeys.forEach(function(grade){
      var group = document.createElement("div");
      group.className = "grade-group";
      var label = document.createElement("span");
      label.className = "grade-label";
      label.textContent = "Lớp " + grade;
      group.appendChild(label);
      data.grades[grade].forEach(function(ch, i){
        var row = document.createElement("div");
        row.className = "chapter-item";
        row.innerHTML =
          '<span class="chapter-num">' + String(i + 1).padStart(2, "0") + '</span>' +
          '<span class="chapter-name">' + ch + '</span>' +
          '<span class="chapter-meta">Chưa học</span>';
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
