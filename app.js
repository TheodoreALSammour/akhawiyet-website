const festivalNews = { id: "festival-2026", group: "Church", title: "مهرجان عيد مار ميخائيل", description: "من 30 آب حتى 6 أيلول — اضغط هنا لاكتشاف برنامج المهرجان الكامل.", date: "2026-08-30", endDate: "2026-09-06", link: "#festival" };
const officialNews = [
  festivalNews,
  { id: "fersen-camp-2026", group: "Fersen", title: "Summer Camp Recap", description: "A look back at four memorable days of friendship, activities, and shared moments.", date: "2026-08-13", endDate: "2026-08-16" },
  { id: "talae3-camp-2026", group: "Tala2e3", title: "Mission I'm Possible Summer Camp 2026", description: "Highlights and memories from our summer camp together.", date: "2026-08-05", endDate: "2026-08-08" },
  { id: "chabibe-camp-2026", group: "Chabibe", title: "Mission I'm Possible Summer Camp 2026", description: "Highlights and memories from our summer camp together.", date: "2026-08-05", endDate: "2026-08-08" }
];
const news = [...officialNews];
const events = [];
let activeFilter = "All";
const groupColors = { Fersen: "#2788c9", Tala2e3: "#d9232e", Chabibe: "#1768aa", Church: "#9f2630" };
const groupNames = { Fersen: "فرسان العذراء", Tala2e3: "طلائع العذراء", Chabibe: "شبيبة العذراء", Church: "كنيسة مار ميخائيل", Everyone: "الجميع" };
const meetingLocation = "كنيسة مار ميخائيل - بيت الشعار";
const weeklyMeetings = [
  { title: "اجتماع فرسان العذراء الأسبوعي", group: "Fersen", weekday: 6, start: "15:00", end: "17:00" },
  { title: "اجتماع طلائع العذراء الأسبوعي", group: "Tala2e3", weekday: 5, start: "19:00", end: "20:30" },
  { title: "اجتماع شبيبة العذراء الأسبوعي", group: "Chabibe", weekday: 5, start: "20:30", end: "21:30" }
];
const importantEvents = [
  { id: "consecration-2026", title: "تكريس عائلة الأخويات", group: "Everyone", date: "2026-08-31T18:00", location: meetingLocation, featured: true }
];
const formatDate = (value, options) => new Intl.DateTimeFormat("en-GB", options).format(new Date(value));

function recurringEvents(weeks = 8) {
  const now = new Date();
  const occurrences = [];
  weeklyMeetings.forEach(meeting => {
    const first = new Date(now);
    const daysAhead = (meeting.weekday - first.getDay() + 7) % 7;
    first.setDate(first.getDate() + daysAhead);
    const [hours, minutes] = meeting.start.split(":").map(Number);
    first.setHours(hours, minutes, 0, 0);
    if (first < now) first.setDate(first.getDate() + 7);
    for (let week = 0; week < weeks; week++) {
      const date = new Date(first);
      date.setDate(first.getDate() + week * 7);
      occurrences.push({ ...meeting, id: `${meeting.group}-${date.toISOString()}`, date: date.toISOString(), location: meetingLocation });
    }
  });
  return occurrences;
}

function timeRange(item) {
  const start = formatDate(item.date, { hour: "numeric", minute: "2-digit", hour12: true });
  if (!item.end) return start;
  const [hours, minutes] = item.end.split(":").map(Number);
  const end = new Date(item.date); end.setHours(hours, minutes, 0, 0);
  return `${start} – ${formatDate(end, { hour: "numeric", minute: "2-digit", hour12: true })}`;
}

function renderNews() {
  const filtered = activeFilter === "All" ? news : news.filter(item => item.group === activeFilter);
  document.querySelector("#news-grid").innerHTML = filtered.length ? filtered.sort((a,b) => new Date(b.date)-new Date(a.date)).map(item => `
    <article class="news-card ${item.link ? "featured-news" : ""}" style="--accent:${groupColors[item.group]}">
      <div class="news-visual"><span class="news-tag" lang="ar" dir="rtl">${groupNames[item.group] || item.group}</span></div>
      <div class="news-body"><span class="news-date">${item.endDate ? `${formatDate(item.date,{day:"numeric",month:"long"})} — ${formatDate(item.endDate,{day:"numeric",month:"long",year:"numeric"})}` : formatDate(item.date, {day:"numeric",month:"long",year:"numeric"})}</span><h3 dir="auto">${escapeHTML(item.title)}</h3><p dir="auto">${escapeHTML(item.description)}</p>${item.link ? `<a class="news-more" href="${item.link}">View the festival schedule <span>→</span></a>` : ""}</div>
    </article>`).join("") : '<p class="empty">No updates in this group yet. Check back soon!</p>';
}

function renderEvents() {
  const upcoming = [...events, ...importantEvents, ...recurringEvents()].filter(e => new Date(e.date) >= new Date()).sort((a,b) => new Date(a.date)-new Date(b.date));
  document.querySelector("#event-list").innerHTML = upcoming.length ? upcoming.slice(0,5).map(item => {
    const d = new Date(item.date);
    return `<article class="event-item"><div><div class="event-day">${d.getDate()}</div><div class="event-month">${formatDate(item.date,{month:"short"})}</div></div><div class="event-info"><h3 dir="auto">${escapeHTML(item.title)}</h3><p>${formatDate(item.date,{weekday:"long"})} · ${timeRange(item)} · <span lang="ar" dir="rtl">${escapeHTML(item.location)}</span></p></div><span class="event-group" lang="ar">${groupNames[item.group] || item.group}</span></article>`;
  }).join("") : '<p class="empty">New dates will be announced soon.</p>';
  const next = upcoming.find(event => event.featured) || upcoming[0];
  document.querySelector("#next-event").innerHTML = next ? `<p class="next-date">${formatDate(next.date,{day:"numeric",month:"long"})}</p><p class="next-title" dir="auto">${escapeHTML(next.title)}</p><p class="next-meta">${formatDate(next.date,{weekday:"long"})} · ${timeRange(next)} · <span lang="ar" dir="rtl">${escapeHTML(next.location)}</span></p>` : '<p class="next-title">New dates coming soon</p>';
}

function escapeHTML(text) { const div = document.createElement("div"); div.textContent = text; return div.innerHTML; }
function toast(message) { const el = document.querySelector("#toast"); el.textContent = message; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 2600); }

document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter-row button").forEach(b => b.classList.toggle("active", b.dataset.filter === activeFilter));
  renderNews(); document.querySelector("#news").scrollIntoView();
}));
document.querySelector(".menu-button").addEventListener("click", e => { const nav=document.querySelector(".main-nav"); nav.classList.toggle("open"); e.currentTarget.setAttribute("aria-expanded",nav.classList.contains("open")); });
document.querySelectorAll(".main-nav a").forEach(a => a.addEventListener("click",()=>document.querySelector(".main-nav").classList.remove("open")));
document.querySelector("#year").textContent = new Date().getFullYear();
const schedulePanel = document.querySelector("#schedule-panel");
const festivalDays = [
  { day: "Sun", date: "30 Aug", events: [["5:00 PM","افتتاح كرمس العيد"],["6:00 PM","قداس وشهادة حياة روي أسمر"],["7:00 PM","افتتاح معرض «ع طريق مار مخايل»"],["8:30 PM","سهرة مجانية مع فرقة Nota"]] },
  { day: "Mon", date: "31 Aug", events: [["5:00 PM","متابعة كرمس العيد وLumi Summer Show للأطفال"],["6:00 PM","قداس وتكريس عائلة الأخويات","highlight"],["8:30 PM","سهرة فنية مجانية مع الفنان عماد فرح"]] },
  { day: "Tue", date: "1 Sep", events: [["5:00 PM","متابعة كرمس العيد ومعرض الرعية في الساحة"],["6:00 PM","قداس"],["7:30 PM","سهرة مجانية مع فرقة The Band"],["8:30 PM","سهرة مجانية مع DJ Rony Gaby"]] },
  { day: "Wed", date: "2 Sep", events: [["5:00 PM","متابعة كرمس العيد ومعرض الرعية في الساحة"],["6:00 PM","قداس"],["8:30 PM","سهرة مجانية مع الفنان Charbel Khater"]] },
  { day: "Thu", date: "3 Sep", events: [["5:00 PM","متابعة كرمس العيد ومعرض الرعية في الساحة"],["6:00 PM","قداس"],["7:30 PM","عرض Ghinwa Color Pop في موقف الرعية","reservation","Ghinwa Show — 3 September, 7:30 PM","$5"],["8:30 PM","سهرة مجانية مع Chady Nader And The Band"]] },
  { day: "Fri", date: "4 Sep", events: [["5:00 PM","متابعة كرمس العيد ومعرض الرعية في الساحة"],["5:00 PM","DJ Raymond Azar في ساحة البلدة"],["6:00 PM","قداس"],["8:30 PM","سهرة زجل مع فرقة المجد في موقف الرعية","reservation","Zajal evening with فرقة المجد — 4 September, 8:30 PM","$10"]] },
  { day: "Sat", date: "5 Sep", events: [["5:00 PM","متابعة كرمس العيد ومعرض الرعية في الساحة"],["5:00 PM","DJ Raymond Azar في ساحة البلدة"],["7:00 PM","قداس مار ميخائيل","highlight"],["8:30 PM","سهرة مع Georges Tawil والفنان Fida Khoury","reservation","Georges Tawil & Fida Khoury — 5 September, 8:30 PM","$10"]] },
  { day: "Sun", date: "6 Sep", events: [["11:00 AM","قداس عيد مار ميخائيل","highlight"],["5:00 PM","متابعة كرمس العيد ومعرض الرعية في الساحة"],["5:00 PM","DJ Raymond Azar وEntertainment for Kids"],["7:00 PM","بطولات لبنانية تراثية بمشاركة فرقة تراث جدودنا"]] }
];
const festivalImages = {
  "سهرة مجانية مع فرقة Nota": ["assets/events/nota-30-aug.jpg"],
  "سهرة فنية مجانية مع الفنان عماد فرح": ["assets/events/imad-farah-31-aug.jpg"],
  "سهرة مجانية مع DJ Rony Gaby": ["assets/events/dj-rony-gaby-1-sep.jpg"],
  "سهرة مجانية مع الفنان Charbel Khater": ["assets/events/charbel-khater-2-sep.jpg"],
  "عرض Ghinwa Color Pop في موقف الرعية": ["assets/events/ghinwa-3-sep.jpg"],
  "سهرة مجانية مع Chady Nader And The Band": ["assets/events/chady-nader-3-sep.jpg"],
  "سهرة زجل مع فرقة المجد في موقف الرعية": ["assets/events/zajal-band-4-sep.jpg"],
  "سهرة مع Georges Tawil والفنان Fida Khoury": ["assets/events/georges-tawil-5-sep.jpg", "assets/events/fida-khoury-5-sep.jpg"],
  "بطولات لبنانية تراثية بمشاركة فرقة تراث جدودنا": ["assets/events/lebanese-competition-6-sep.jpg"]
};
function posterMarkup(title) {
  const posters = festivalImages[title] || [];
  return posters.length ? `<div class="event-posters">${posters.map((src,index) => `<a href="${src}" target="_blank" aria-label="Open event poster ${index + 1}"><img src="${src}" alt="Poster for ${title}" loading="lazy" /></a>`).join("")}</div>` : "";
}
function renderFestivalSchedule(active = 0) {
  const selected = festivalDays[active];
  const dayPosters = selected.events.flatMap(event => festivalImages[event[1]] || []);
  const gallery = dayPosters.length ? `<div class="day-showcase"><div class="showcase-label"><span>Featured on this day</span><small>Click a poster to view it in full size</small></div><div class="day-poster-gallery ${dayPosters.length === 1 ? "single" : "multiple"}">${dayPosters.map((src,index) => `<a href="${src}" target="_blank" aria-label="Open poster ${index + 1}"><img src="${src}" alt="Festival poster for ${selected.date}" loading="lazy" /></a>`).join("")}</div></div>` : "";
  schedulePanel.innerHTML = `<div class="schedule-tabs" role="tablist">${festivalDays.map((item,index) => `<button class="${index===active?"active":""}" data-day="${index}" role="tab" aria-selected="${index===active}"><span>${item.day}</span><strong>${item.date}</strong></button>`).join("")}</div><div class="schedule-day"><div class="schedule-day-heading"><span>Festival programme</span><h3>${selected.day}, ${selected.date}</h3></div>${gallery}<div class="schedule-list-label"><span>Schedule & timings</span></div><div class="schedule-events">${selected.events.map(event => `<article class="schedule-event ${event[2] || ""}"><time>${event[0]}</time><div class="schedule-event-copy"><p lang="ar" dir="rtl">${event[1]}</p>${event[2] === "reservation" ? `<div class="reservation-action"><a href="#reservation" class="reserve-link" data-reserve="${event[3]}">Reservation required <span>→</span></a><strong class="ticket-price">${event[4]}</strong></div>` : ""}</div></article>`).join("")}</div></div>`;
  schedulePanel.querySelectorAll("[data-day]").forEach(button => button.addEventListener("click", () => renderFestivalSchedule(Number(button.dataset.day))));
  schedulePanel.querySelectorAll("[data-reserve]").forEach(link => link.addEventListener("click", () => { const select=document.querySelector("#reservation-activity"); select.value=link.dataset.reserve; select.dispatchEvent(new Event("change")); }));
}
const activityPrices = { "Ghinwa Show — 3 September, 7:30 PM": 5, "Zajal evening with فرقة المجد — 4 September, 8:30 PM": 10, "Georges Tawil & Fida Khoury — 5 September, 8:30 PM": 10 };
const activityPosters = {
  "Ghinwa Show — 3 September, 7:30 PM": ["assets/events/ghinwa-3-sep.jpg"],
  "Zajal evening with فرقة المجد — 4 September, 8:30 PM": ["assets/events/zajal-band-4-sep.jpg"],
  "Georges Tawil & Fida Khoury — 5 September, 8:30 PM": ["assets/events/georges-tawil-5-sep.jpg", "assets/events/fida-khoury-5-sep.jpg"]
};
function updateReservationPrice() {
  const activity = document.querySelector("#reservation-activity").value;
  const price = activityPrices[activity];
  const guests = Math.max(1, Number(document.querySelector('[name="guests"]').value) || 1);
  document.querySelector("#reservation-price strong").textContent = price ? `$${price} per person · Total $${price * guests}` : "Choose an activity";
  const posterPanel = document.querySelector("#reservation-poster");
  const posters = activityPosters[activity] || [];
  posterPanel.hidden = !posters.length;
  posterPanel.innerHTML = posters.map(src => `<a href="${src}" target="_blank"><img src="${src}" alt="Selected event poster" /></a>`).join("");
}
document.querySelector("#reservation-activity").addEventListener("change", updateReservationPrice);
document.querySelector('[name="guests"]').addEventListener("input", updateReservationPrice);
document.querySelector("#reservation-form").addEventListener("submit", event => {
  event.preventDefault();
  const reservation = { ...Object.fromEntries(new FormData(event.currentTarget)), id: Date.now(), submittedAt: new Date().toISOString() };
  const unitPrice = activityPrices[reservation.activity] || 0;
  const total = unitPrice * Number(reservation.guests || 1);
  const reservations = JSON.parse(localStorage.getItem("akhawiyat-reservations") || "[]");
  reservations.push(reservation);
  localStorage.setItem("akhawiyat-reservations", JSON.stringify(reservations));
  const message = [
    "طلب حجز جديد - مهرجان عيد مار ميخائيل",
    "",
    `Activity: ${reservation.activity}`,
    `Name: ${reservation.name}`,
    `Phone: ${reservation.phone}`,
    `Places: ${reservation.guests}`,
    `Price: $${unitPrice} per person`,
    `Total: $${total}`,
    reservation.note ? `Note: ${reservation.note}` : ""
  ].filter(Boolean).join("\n");
  window.open(`https://wa.me/96181588232?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  event.currentTarget.reset();
  updateReservationPrice();
  toast("WhatsApp opened — press Send to complete the request");
});
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add("visible"); }),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
renderNews(); renderEvents(); renderFestivalSchedule();
