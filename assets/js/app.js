(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const img = k => `assets/img/${k}.jpg`;
  const esc = s => String(s ?? "").replace(/[<>&"]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const WA = "201025352848";

  /* Products listed on the factory's own page. Everything else is illustrative. */
  const PRODUCTS = [
    { id: "tee", ar: "تيشيرتات", en: "T-SHIRTS", img: "p_tee" },
    { id: "track", ar: "ترنجات", en: "TRACKSUITS", img: "p_track" },
    { id: "shirwal", ar: "شروال", en: "JOGGERS", img: "p_jogger" },
    { id: "halfcol", ar: "هاف كول", en: "HALF-ZIP / HALF-COL", img: "p_hoodie2" },
    { id: "sets", ar: "أطقم", en: "SETS", img: "p_set" }
  ];
  const FABRICS = [
    { id: "cotton", ar: "قطن", en: "COTTON", img: "fab_cotton", d: "خفيف ومريح، للتيشيرتات والصيفي." },
    { id: "melton", ar: "ميلتون / فليس", en: "FLEECE", img: "fab_fleece", d: "دافي، للترنجات والهاف كول." },
    { id: "jersey", ar: "جيرسيه", en: "JERSEY", img: "fab_jersey", d: "مرن وعملي للأطقم والشروال." },
    { id: "other", ar: "خامة تانية", en: "CUSTOM", img: "fab_rolls", d: "عندك خامة معينة؟ اكتبها في الملاحظات." }
  ];
  const COLORS = [["أسود", "#151515"], ["أبيض", "#f4f4f2"], ["رمادي ميلانج", "#9b9b9b"], ["كحلي", "#1f2a44"], ["زيتي", "#4f5b3a"], ["بيج", "#d9c7a7"], ["نبيتي", "#6b1f2a"], ["برتقالي", "#ff5a1f"]];
  const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];
  const STEPS = [
    { en: "تصنيع", ar: "المنتج" }, { ar: "الخامة" }, { ar: "الألوان" }, { ar: "المقاسات" },
    { ar: "التصميم" }, { ar: "ملاحظات" }, { ar: "بياناتك" }, { ar: "مراجعة" }
  ];

  /* ---------------- INTRO ---------------- */
  const intro = $("#intro");
  let introTimers = [];
  function finishIntro(fast) {
    introTimers.forEach(clearTimeout);
    if (intro.classList.contains("done")) return;
    intro.classList.add("out");
    document.body.classList.remove("intro-on");
    sessionStorage.setItem("bf_intro", "1");
    setTimeout(() => intro.classList.add("done"), fast ? 0 : 1000);
  }
  function runIntro() {
    const words = $$("#words span"), svg = $(".stitch");
    words.forEach((w, i) => introTimers.push(setTimeout(() => {
      words.forEach((x, k) => { x.classList.toggle("on", k === i); x.classList.toggle("off", k < i); });
      svg.style.setProperty("--p", `${(i + 1) * 20}%`);
      $("#introCount").textContent = "0" + (i + 1);
      $("#introProg").style.width = `${(i + 1) * 20}%`;
    }, 250 + i * 520)));
    introTimers.push(setTimeout(() => { $("#words").style.display = "none"; $("#introBrand").classList.add("on"); }, 250 + 5 * 520 + 120));
    introTimers.push(setTimeout(() => finishIntro(), 250 + 5 * 520 + 1400));
  }
  $("#skipIntro").onclick = () => finishIntro(true);
  if (sessionStorage.getItem("bf_intro") || reduced) finishIntro(true); else runIntro();

  /* ---------------- NAV / RAIL ---------------- */
  const top = $(".top");
  addEventListener("scroll", () => top.classList.toggle("solid", scrollY > 60), { passive: true });
  $("#burger").onclick = () => $("#menu").classList.toggle("open");
  $$("#menu a").forEach(a => a.addEventListener("click", () => $("#menu").classList.remove("open")));
  const secs = $$("[data-n]");
  $("#rail").innerHTML = secs.map(s => `<a href="#${s.id || "home"}" data-for="${s.dataset.n}">${s.dataset.n}</a>`).join("");
  secs.forEach(s => { if (!s.id) s.id = "s" + s.dataset.n; });
  $$("#rail a").forEach((a, i) => a.href = "#" + secs[i].id);
  const railIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) $$("#rail a").forEach(a => a.classList.toggle("on", a.dataset.for === e.target.dataset.n)); }), { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach(s => railIO.observe(s));

  /* ---------------- CONTENT ---------------- */
  $("#prodGrid").innerHTML = PRODUCTS.map((p, i) => `<button class="prod rv" data-p="${p.id}"><img src="${img(p.img)}" alt="${p.ar}" loading="lazy"><span class="go">اطلب تصنيع</span><div class="pi"><small>0${i + 1} &mdash; ${p.en}</small><h4>${p.ar}</h4></div></button>`).join("");
  $("#prodGrid").onclick = e => { const b = e.target.closest("[data-p]"); if (!b) return; order.product = b.dataset.p; step = 1; renderWizard(); renderTicket("product"); $("#request").scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); toast(`تم اختيار: ${PRODUCTS.find(p => p.id === b.dataset.p).ar}`); };
  $("#fabGrid").innerHTML = FABRICS.slice(0, 4).map(f => `<div class="fab rv"><div class="fab-img"><img src="${img(f.img)}" alt="${f.ar}" loading="lazy"></div><div><small>${f.en}</small><h4>${f.ar}</h4><p>${f.d}</p></div></div>`).join("");
  $("#steps").innerHTML = [
    ["01", "الطلب", "بتبعت المنتج والخامة والألوان والمقاسات والتصميم.", "fab_rolls"],
    ["02", "القص", "بعد الاتفاق على التفاصيل، القماش بيتقص حسب الباترون.", "cut"],
    ["03", "الخياطة", "خط الإنتاج بيبدأ يجمّع ويخيّط القطع.", "machine"],
    ["04", "المراجعة", "مراجعة القطع والمقاسات قبل التغليف.", "qc"],
    ["05", "التغليف والشحن", "القطع بتتطبق وتتغلف وتتسلم.", "pack"]
  ].map(s => `<li class="rv"><span class="dot">${s[0]}</span><div class="s-img"><img src="${img(s[3])}" alt="" loading="lazy"></div><h4>${s[1]}</h4><p>${s[2]}</p></li>`).join("");
  const GAL = [["hero", "SEWING FLOOR"], ["g_print", "PRINTING"], ["threads", "THREADS"], ["g_rack", "SAMPLES"], ["p_hoodie", "HOODIES"], ["g_spools", "SPOOLS"], ["p_track2", "TRACKSUITS"], ["g_print2", "SCREEN PRINT"], ["g_dark", "MACHINES"], ["p_tee2", "BLANKS"]];
  $("#gal").innerHTML = GAL.map(g => `<button class="rv" data-src="${img(g[0])}" data-cap="${g[1]}"><img src="${img(g[0])}" alt="${g[1]}" loading="lazy"><span>${g[1]}</span></button>`).join("");
  $("#gal").onclick = e => { const b = e.target.closest("button"); if (!b) return; const lb = $("#lightbox"); lb.querySelector("img").src = b.dataset.src; lb.querySelector(".lb-cap").textContent = b.dataset.cap; lb.classList.add("on"); };
  $("#lightbox").onclick = e => { if (e.target.tagName !== "IMG") $("#lightbox").classList.remove("on"); };
  document.addEventListener("keydown", e => { if (e.key === "Escape") $("#lightbox").classList.remove("on"); });

  /* ---------------- WIZARD ---------------- */
  const woNo = "WO-" + new Date().getFullYear().toString().slice(2) + String(Math.floor(1000 + Math.random() * 9000));
  const order = { product: null, fabric: null, colors: [], custom: "", sizes: {}, file: null, fileUrl: null, placement: "صدر", notes: "", name: "", brand: "", phone: "", city: "", deadline: "" };
  let step = 0;
  const qtyTotal = () => Object.values(order.sizes).reduce((a, b) => a + (+b || 0), 0);

  function renderSteps() {
    $("#wzSteps").innerHTML = STEPS.map((s, i) => `<button type="button" class="${i === step ? "on" : i < step ? "done" : ""}" data-s="${i}">0${i + 1}<small>${s.ar}</small></button>`).join("");
  }
  $("#wzSteps").onclick = e => { const b = e.target.closest("[data-s]"); if (!b) return; const t = +b.dataset.s; if (t <= step || validate(true)) { step = t; renderWizard(); } };

  function renderWizard() {
    renderSteps(); $("#wzErr").textContent = "";
    const B = $("#wzBody");
    const H = (t, s) => `<h4 class="wz-title">${t}</h4><p class="wz-sub">${s}</p>`;
    if (step === 0) B.innerHTML = H("عايز تصنّع إيه؟", "اختار نوع المنتج.") + `<div class="opts">${PRODUCTS.map(p => `<button type="button" class="opt ${order.product === p.id ? "on" : ""}" data-v="${p.id}"><img src="${img(p.img)}" alt=""><b>${p.ar}</b><small>${p.en}</small></button>`).join("")}</div>`;
    if (step === 1) B.innerHTML = H("الخامة", "اختار الخامة. الخامات المتاحة بتتأكد مع المصنع.") + `<div class="opts">${FABRICS.map(f => `<button type="button" class="opt ${order.fabric === f.id ? "on" : ""}" data-v="${f.id}"><img src="${img(f.img)}" alt=""><b>${f.ar}</b><small>${f.d}</small></button>`).join("")}</div>`;
    if (step === 2) B.innerHTML = H("الألوان", "اختار لون أو أكتر.") + `<div class="colors">${COLORS.map(c => `<button type="button" class="cswatch ${order.colors.includes(c[0]) ? "on" : ""}" data-c="${c[0]}"><i style="background:${c[1]}"></i>${c[0]}</button>`).join("")}</div>
      <label class="custom-c"><input type="color" id="customColor" value="#ff5a1f"> لون مخصص؟ اختاره وهيتضاف <button type="button" class="btn btn-line" id="addCustom" style="padding:8px 14px">إضافة</button></label>`;
    if (step === 3) B.innerHTML = H("المقاسات والكمية", "اكتب العدد المطلوب لكل مقاس.") + `<div class="size-table">${SIZES.map(s => `<label class="size-cell ${+order.sizes[s] ? "has" : ""}"><b>${s}</b><input type="number" min="0" inputmode="numeric" data-size="${s}" value="${order.sizes[s] || ""}" placeholder="0"></label>`).join("")}</div><div class="qty-total">إجمالي الكمية <b id="qtyTotal">${qtyTotal()}</b> قطعة</div>`;
    if (step === 4) B.innerHTML = H("التصميم أو اللوجو", "ارفع صورة التصميم (اختياري). في الديمو الملف بيفضل على جهازك ومش بيترفع لأي مكان.") +
      `<label class="drop" id="drop"><input type="file" id="fileIn" accept="image/*,.pdf"><b>اسحب الملف هنا أو دوس للاختيار</b><small>PNG, JPG, PDF</small></label>
       <div id="preview">${order.file ? previewHTML() : ""}</div>
       <div class="place">${["صدر", "ضهر", "كم", "من غير طباعة"].map(p => `<label><input type="radio" name="pl" value="${p}" ${order.placement === p ? "checked" : ""}>${p}</label>`).join("")}</div>`;
    if (step === 5) B.innerHTML = H("تعليمات إضافية", "أي تفاصيل: نوع الطباعة، التطريز، الليبل، التغليف...") + `<label class="fld"><textarea id="notes" rows="6" placeholder="مثال: ليبل باسم البراند جوه الرقبة، وكل قطعة في كيس لوحدها.">${esc(order.notes)}</textarea></label>`;
    if (step === 6) B.innerHTML = H("بياناتك", "عشان المصنع يتواصل معاك بعرض السعر.") + `<div class="two"><label class="fld">الاسم<input id="f_name" value="${esc(order.name)}" autocomplete="name"></label><label class="fld">اسم البراند / المحل<input id="f_brand" value="${esc(order.brand)}"></label></div>
       <div class="two"><label class="fld">رقم الموبايل (واتساب)<input id="f_phone" inputmode="tel" value="${esc(order.phone)}" autocomplete="tel"></label><label class="fld">المحافظة<input id="f_city" value="${esc(order.city)}"></label></div>
       <label class="fld">ميعاد التسليم المطلوب (اختياري)<input type="date" id="f_deadline" value="${esc(order.deadline)}"></label>`;
    if (step === 7) B.innerHTML = H("مراجعة الطلب", "راجع كل حاجة قبل ما تعمل طلب عرض السعر.") + `<div class="review">${reviewRows().map(([k, v, s]) => `<div><span>${k}</span><b>${v}</b><button type="button" data-go="${s}">تعديل</button></div>`).join("")}</div>`;
    $("#wzPrev").disabled = step === 0;
    $("#wzNext").textContent = step === 7 ? "اعمل طلب عرض السعر" : "التالي";
    bindStep();
  }

  function bindStep() {
    const B = $("#wzBody");
    B.onclick = e => {
      const o = e.target.closest(".opt");
      if (o) { if (step === 0) order.product = o.dataset.v; if (step === 1) order.fabric = o.dataset.v; $$(".opt", B).forEach(x => x.classList.toggle("on", x === o)); renderTicket(step === 0 ? "product" : "fabric"); $("#wzErr").textContent = ""; }
      const c = e.target.closest(".cswatch");
      if (c) { const n = c.dataset.c; order.colors = order.colors.includes(n) ? order.colors.filter(x => x !== n) : [...order.colors, n]; c.classList.toggle("on"); renderTicket("colors"); }
      if (e.target.id === "addCustom") { const v = $("#customColor").value; const n = "مخصص " + v; if (!order.colors.includes(n)) { order.colors.push(n); renderTicket("colors"); toast("اتضاف اللون المخصص"); } }
      const g = e.target.closest("[data-go]"); if (g) { step = +g.dataset.go; renderWizard(); }
      if (e.target.closest("#rmFile")) { order.file = null; order.fileUrl = null; $("#preview").innerHTML = ""; renderTicket("file"); }
    };
    B.oninput = e => {
      const s = e.target.dataset.size;
      if (s) { order.sizes[s] = Math.max(0, parseInt(e.target.value) || 0); e.target.parentElement.classList.toggle("has", order.sizes[s] > 0); $("#qtyTotal").textContent = qtyTotal(); renderTicket("sizes"); }
      if (e.target.id === "notes") { order.notes = e.target.value; renderTicket("notes"); }
      if (e.target.id?.startsWith("f_")) { order[e.target.id.slice(2)] = e.target.value; renderTicket("client"); }
    };
    B.onchange = e => {
      if (e.target.name === "pl") { order.placement = e.target.value; renderTicket("file"); }
      if (e.target.id === "fileIn") handleFile(e.target.files[0]);
    };
    const drop = $("#drop");
    if (drop) {
      ["dragenter", "dragover"].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add("over"); }));
      ["dragleave", "drop"].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.remove("over"); }));
      drop.addEventListener("drop", e => handleFile(e.dataTransfer.files[0]));
    }
  }

  function handleFile(f) {
    if (!f) return;
    if (f.size > 15 * 1024 * 1024) { $("#wzErr").textContent = "الملف أكبر من 15 ميجا"; return; }
    order.file = { name: f.name, size: f.size, type: f.type };
    order.fileUrl = f.type.startsWith("image/") ? URL.createObjectURL(f) : null;
    $("#preview").innerHTML = previewHTML(); renderTicket("file"); toast("الملف اتضاف للطلب");
  }
  const previewHTML = () => `<div class="preview">${order.fileUrl ? `<img src="${order.fileUrl}" alt="">` : `<img alt="" src="${img("fab_rolls")}">`}<div><b>${esc(order.file.name)}</b><br>${(order.file.size / 1024).toFixed(0)} KB</div><button type="button" id="rmFile">حذف</button></div>`;

  const pName = () => PRODUCTS.find(p => p.id === order.product)?.ar;
  const fName = () => FABRICS.find(f => f.id === order.fabric)?.ar;
  const sizesTxt = () => SIZES.filter(s => +order.sizes[s]).map(s => `${s}: ${order.sizes[s]}`).join(" / ");
  function reviewRows() {
    return [["المنتج", pName() || "-", 0], ["الخامة", fName() || "-", 1], ["الألوان", order.colors.join("، ") || "-", 2], ["المقاسات", sizesTxt() || "-", 3], ["الكمية", qtyTotal() + " قطعة", 3],
      ["التصميم", order.file ? `${esc(order.file.name)} (${order.placement})` : "من غير ملف", 4], ["ملاحظات", esc(order.notes) || "-", 5], ["العميل", `${esc(order.name)}${order.brand ? " - " + esc(order.brand) : ""}<br>${esc(order.phone)}`, 6]];
  }

  function validate(silent) {
    const err = m => { if (!silent) $("#wzErr").textContent = m; return false; };
    if (step === 0 && !order.product) return err("اختار المنتج");
    if (step === 1 && !order.fabric) return err("اختار الخامة");
    if (step === 2 && !order.colors.length) return err("اختار لون واحد على الأقل");
    if (step === 3 && !qtyTotal()) return err("اكتب الكمية لمقاس واحد على الأقل");
    if (step === 6) {
      if (!order.name.trim()) return err("اكتب الاسم");
      if (!/^01[0125]\d{8}$/.test(order.phone.trim())) return err("رقم الموبايل لازم 11 رقم ويبدأ بـ 01");
    }
    return true;
  }
  $("#wzNext").onclick = () => { if (!validate()) return; if (step < 7) { step++; renderWizard(); } else generate(); };
  $("#wzPrev").onclick = () => { if (step > 0) { step--; renderWizard(); } };

  /* ---------------- TICKET ---------------- */
  function renderTicket(flash) {
    const row = (k, v, key) => `<div class="tk-row ${flash === key ? "flash" : ""}"><span>${k}</span><span>${v || '<span class="empty">&mdash;</span>'}</span></div>`;
    const colorDots = order.colors.length ? `<div class="tk-dots">${order.colors.map(n => { const c = COLORS.find(x => x[0] === n); const hex = c ? c[1] : n.split(" ")[1]; return `<i style="background:${hex}" title="${esc(n)}"></i>`; }).join("")}</div>` : "";
    $("#ticket").innerHTML = `<div class="tk-head"><div><b>WORK ORDER</b><small>أمر شغل - طلب عرض سعر</small></div><span class="tk-no">${woNo}</span></div>
      ${row("PRODUCT", pName(), "product")}${row("FABRIC", fName(), "fabric")}${row("COLORS", colorDots, "colors")}
      ${row("SIZES", sizesTxt(), "sizes")}${row("QTY", qtyTotal() ? qtyTotal() + " قطعة" : "", "sizes")}
      ${row("ARTWORK", order.file ? `${order.fileUrl ? `<img class="tk-thumb" src="${order.fileUrl}" alt="">` : esc(order.file.name)}<br><small>${order.placement}</small>` : "", "file")}
      ${row("NOTES", esc(order.notes).slice(0, 80), "notes")}${row("CLIENT", esc([order.name, order.brand].filter(Boolean).join(" - ")), "client")}
      <div class="tk-foot"><span>BRAND FASHION &middot; TANTA</span><span class="tk-status" id="tkStatus">DRAFT</span></div>`;
  }

  /* ---------------- GENERATE ---------------- */
  function generate() {
    const quote = `طلب عرض سعر تصنيع ${woNo}
المنتج: ${pName()}
الخامة: ${fName()}
الألوان: ${order.colors.join("، ")}
المقاسات: ${sizesTxt()}
إجمالي الكمية: ${qtyTotal()} قطعة
التصميم: ${order.file ? `${order.file.name} (مكان الطباعة: ${order.placement})` : "من غير ملف"}${order.notes ? `\nملاحظات: ${order.notes}` : ""}
العميل: ${order.name}${order.brand ? ` - ${order.brand}` : ""}
الموبايل: ${order.phone}${order.city ? `\nالمحافظة: ${order.city}` : ""}${order.deadline ? `\nالتسليم المطلوب: ${order.deadline}` : ""}`;
    $("#wzSteps").innerHTML = STEPS.map((s, i) => `<button type="button" class="done">0${i + 1}<small>${s.ar}</small></button>`).join("");
    $("#wzBody").innerHTML = `<div class="result">
      <h4 class="wz-title">طلب عرض السعر جاهز</h4>
      <p class="wz-sub">ده الطلب بالشكل اللي هيوصل للمصنع. السعر بيتحدد من المصنع بعد مراجعة التفاصيل.</p>
      <div class="quote" id="quoteTxt">${esc(quote)}</div>
      <div class="res-btns"><button class="btn btn-line" type="button" id="copyQ">نسخ الطلب</button><a class="btn btn-or" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${encodeURIComponent(quote)}">افتح الطلب في واتساب</a><button class="btn btn-line" type="button" id="newReq">طلب جديد</button></div>
      <div class="phone"><div class="screen"><div class="wa-top"><i>BF</i><div>مصنع براند فاشون<small>متصل الآن</small></div></div><div class="wa-chat" id="waChat"></div></div></div>
      <p class="sim">محاكاة لإرسال الطلب، من غير ربط حقيقي بالواتساب.</p></div>`;
    $(".wz-nav").style.display = "none";
    $("#tkStatus").textContent = "SENT";
    $("#copyQ").onclick = () => { navigator.clipboard?.writeText(quote).then(() => toast("الطلب اتنسخ"), () => toast("انسخ النص يدوي")); };
    $("#newReq").onclick = () => location.reload();
    const chat = $("#waChat");
    const add = (h, c = "") => { const d = document.createElement("div"); d.className = "bub " + c; d.innerHTML = h; chat.appendChild(d); chat.scrollTop = chat.scrollHeight; };
    if (order.fileUrl) add(`<img src="${order.fileUrl}" alt=""><span>${esc(order.file.name)}</span>`, "att");
    add(esc(quote) + `<br><small style="color:#4fb6ec">✓✓</small>`);
    setTimeout(() => { const t = document.createElement("div"); t.className = "typing"; t.innerHTML = "<i></i><i></i><i></i>"; chat.appendChild(t); chat.scrollTop = chat.scrollHeight;
      setTimeout(() => { t.remove(); add(`أهلاً ${esc(order.name)}، استلمنا الطلب ${woNo}. هنراجع التفاصيل ونبعتلك عرض السعر.`, "in"); }, 1500); }, reduced ? 0 : 900);
  }

  /* ---------------- REVEAL + TOAST ---------------- */
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: .1 });
  $$(".rv").forEach(el => io.observe(el));
  let tt; function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => el.classList.remove("on"), 1900); }

  renderWizard(); renderTicket();
})();
