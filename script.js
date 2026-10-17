const categoryNames = {
  news: "daily debrief",
  tech: "tech stuff ♡",
  money: "MONEYYYY",
  escape: "escapism (ft RAYE)",
  think: "ur brain needs a lil Socrates",
  mood: "MooooodBOarddd"
};

const contentItems = [
  {id:"owid", category:"news", title:"Make sense of the world with data", source:"Our World in Data", format:"Data stories", time:"Browse at your pace", description:"Research and visualisations that make big global questions easier to understand, from health to climate to living standards.", url:"https://ourworldindata.org/"},
  {id:"reuters", category:"news", title:"The news, with the noise turned down", source:"Reuters", format:"News", time:"5–10 min", description:"A useful starting point for checking major stories and comparing how events are reported. Read beyond the headline.", url:"https://www.reuters.com/world/"},
  {id:"ground", category:"news", title:"Put a global issue in context", source:"The Conversation", format:"Expert explainers", time:"5–8 min", description:"Articles written by academics and researchers that unpack the context behind current affairs.", url:"https://theconversation.com/"},
  {id:"ai", category:"tech", title:"A friendly guide to how AI works", source:"Google — AI basics", format:"Learning guide", time:"Explore a topic", description:"Get familiar with the ideas behind artificial intelligence without needing to start with dense technical papers.", url:"https://ai.google/"},
  {id:"cs50", category:"tech", title:"Build your computer science foundations", source:"Harvard CS50", format:"Course", time:"Learn in chapters", description:"A well-known introduction to computer science, problem-solving and programming. You can learn at your own pace.", url:"https://cs50.harvard.edu/x/"},
  {id:"explained", category:"tech", title:"Explore the internet's building blocks", source:"MDN Web Docs", format:"Reference & tutorials", time:"Pick a guide", description:"A dependable place to learn web development fundamentals, from HTML and CSS to JavaScript and APIs.", url:"https://developer.mozilla.org/"},
  {id:"investopedia", category:"money", title:"Learn the language of money", source:"Investopedia", format:"Explainers", time:"5–10 min", description:"Look up unfamiliar finance terms and build your understanding before making decisions with real money.", url:"https://www.investopedia.com/"},
  {id:"zerodha", category:"money", title:"Personal finance, explained simply", source:"Zerodha Varsity", format:"Learning modules", time:"One module at a time", description:"Free modules covering financial markets and investing basics. Education first; no need to rush into investing.", url:"https://zerodha.com/varsity/"},
  {id:"rbi", category:"money", title:"Understand money in the Indian context", source:"Reserve Bank of India", format:"Financial education", time:"Explore a topic", description:"Official resources for learning about banking, financial awareness and the wider Indian financial system.", url:"https://www.rbi.org.in/"},
  {id:"ted", category:"escape", title:"A talk that stays with you", source:"TED", format:"Talks", time:"5–20 min", description:"Ideas, stories and perspectives from people with something worth sharing. Pick a subject that genuinely interests you.", url:"https://www.ted.com/talks"},
  {id:"librivox", category:"escape", title:"Get lost in a book — for free", source:"LibriVox", format:"Audiobooks", time:"Listen at your pace", description:"Public-domain books read aloud by volunteers. A lovely way to give your commute or wind-down time a storyline.", url:"https://librivox.org/"},
  {id:"criterion", category:"escape", title:"Watch a film with a little more intention", source:"The Criterion Collection", format:"Film essays & discovery", time:"Pick a film", description:"Explore film history, criticism and cinema beyond the usual recommendation loop.", url:"https://www.criterion.com/current"},
  {id:"plato", category:"think", title:"Start with the big questions", source:"Stanford Encyclopedia of Philosophy", format:"Reference essays", time:"Dip into a topic", description:"A scholarly reference for philosophical ideas. Choose one question and follow your curiosity rather than trying to read it all.", url:"https://plato.stanford.edu/"},
  {id:"philosophy", category:"think", title:"Philosophy, without the velvet rope", source:"Philosophy Break", format:"Accessible essays", time:"5–10 min", description:"Approachable introductions to philosophical questions, thinkers and ideas you can carry into everyday life.", url:"https://philosophybreak.com/"},
  {id:"psych", category:"think", title:"Question how you think", source:"Psyche", format:"Ideas & guides", time:"5–15 min", description:"Thoughtful writing on how to live, think and understand ourselves, grounded in psychology and philosophy.", url:"https://psyche.co/"},
  {id:"moma", category:"mood", title:"Take a tiny museum break", source:"The Museum of Modern Art", format:"Art & design", time:"Browse a collection", description:"Explore artists, works and design ideas from a major modern-art collection — no gallery ticket required.", url:"https://www.moma.org/"},
  {id:"design", category:"mood", title:"Notice the design of everyday life", source:"It's Nice That", format:"Creative discovery", time:"Browse at your pace", description:"Illustration, graphic design, photography and creative projects to refresh the way you look at things.", url:"https://www.itsnicethat.com/"},
  {id:"archdaily", category:"mood", title:"Go somewhere through architecture", source:"ArchDaily", format:"Architecture & spaces", time:"Pick a project", description:"Explore buildings, interiors and spaces from around the world, and notice how design shapes how we feel.", url:"https://www.archdaily.com/"}
];

const categoryColors = {news:"#9aa77b", tech:"#879b78", money:"#c3a04b", escape:"#c87961", think:"#9785b2", mood:"#d0ad4e"};
const contentGrid = document.getElementById("contentGrid");
const filterPills = document.getElementById("filterPills");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const savedGrid = document.getElementById("savedGrid");
const savedEmpty = document.getElementById("savedEmpty");
const toast = document.getElementById("toast");
let activeFilter = "all";
let savedIds = new Set();

try { savedIds = new Set(JSON.parse(localStorage.getItem("attentionEditSaved") || "[]")); } catch { savedIds = new Set(); }

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}
function saveState() {
  try { localStorage.setItem("attentionEditSaved", JSON.stringify([...savedIds])); } catch {}
  updateSavedCount();
  renderSaved();
}
function updateSavedCount() {
  document.getElementById("savedCount").textContent = savedIds.size;
  document.getElementById("savedPanelCount").textContent = `${String(savedIds.size).padStart(2,"0")} ITEMS`;
}
function cardMarkup(item) {
  const isSaved = savedIds.has(item.id);
  return `<article class="content-card" data-category="${item.category}">
    <div class="content-card-top">
      <span class="content-category"><span class="category-dot"></span>${categoryNames[item.category]}</span>
      <button class="bookmark-button ${isSaved ? "saved" : ""}" data-save="${item.id}" aria-label="${isSaved ? "Remove from" : "Save to"} shortlist" aria-pressed="${isSaved}">${isSaved ? "♥" : "♡"}</button>
    </div>
    <h3>${item.title}</h3>
    <div class="content-source">${item.source} · ${item.format}</div>
    <p class="content-description">${item.description}</p>
    <div class="content-card-bottom"><span class="content-meta">${item.time}</span><a class="content-open" href="${item.url}" target="_blank" rel="noopener noreferrer">Explore ↗</a></div>
  </article>`;
}
function renderContent() {
  const query = searchInput.value.trim().toLowerCase();
  const items = contentItems.filter(item => {
    const matchesFilter = activeFilter === "all" || item.category === activeFilter;
    const haystack = `${item.title} ${item.source} ${item.format} ${item.description} ${categoryNames[item.category]}`.toLowerCase();
    return matchesFilter && haystack.includes(query);
  });
  contentGrid.innerHTML = items.map(cardMarkup).join("");
  emptyState.hidden = items.length > 0;
  contentGrid.hidden = items.length === 0;
}
function renderSaved() {
  const items = contentItems.filter(item => savedIds.has(item.id));
  savedGrid.innerHTML = items.map(item => `<div class="saved-item">
    <span class="saved-item-icon">✳</span>
    <div><h3>${item.title}</h3><small>${item.source} · ${categoryNames[item.category]}</small></div>
    <button data-remove="${item.id}" aria-label="Remove ${item.title} from shortlist">×</button>
  </div>`).join("");
  savedEmpty.hidden = items.length > 0;
  savedGrid.hidden = items.length === 0;
  updateSavedCount();
}
function chooseFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll(".filter-pill").forEach(button => {
    const selected = button.dataset.filter === filter;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", selected);
  });
  renderContent();
  if (filter !== "all") {
    document.getElementById("recommendationTitle").innerHTML = `${categoryNames[filter]} <span class="headline-mark">for your mind.</span>`;
    document.getElementById("recommendationSubtitle").innerHTML = "A little corner of curiosity.<br>Pick what calls to you.";
  } else {
    document.getElementById("recommendationTitle").innerHTML = `A little bit of <span class="headline-mark">everything.</span>`;
    document.getElementById("recommendationSubtitle").innerHTML = "Curated for curious minds.<br>Picked with intention.";
  }
}
filterPills.addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (button) chooseFilter(button.dataset.filter);
});
document.getElementById("categoryGrid").addEventListener("click", event => {
  const card = event.target.closest("[data-category]");
  if (!card) return;
  chooseFilter(card.dataset.category);
  document.getElementById("recommendations").scrollIntoView({behavior:"smooth"});
});
searchInput.addEventListener("input", renderContent);
document.addEventListener("click", event => {
  const saveButton = event.target.closest("[data-save]");
  const removeButton = event.target.closest("[data-remove]");
  if (saveButton) {
    const id = saveButton.dataset.save;
    if (savedIds.has(id)) {
      savedIds.delete(id);
      showToast("Removed from your shortlist.");
    } else {
      savedIds.add(id);
      showToast("Saved for later, not never. ♡");
    }
    saveState();
    renderContent();
  }
  if (removeButton) {
    savedIds.delete(removeButton.dataset.remove);
    saveState();
    renderContent();
    showToast("Your shortlist has been edited.");
  }
});
const menuToggle = document.getElementById("menuToggle");
const nav = document.querySelector(".desktop-nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
nav.addEventListener("click", event => {
  if (event.target.closest("a")) {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});
const navLinks = document.querySelectorAll("[data-nav]");
const sections = ["home","the-edit","saved"].map(id => document.getElementById(id));
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle("active", link.dataset.nav === entry.target.id));
      }
    });
  }, {rootMargin:"-30% 0px -60% 0px"});
  sections.forEach(section => sectionObserver.observe(section));
} else {
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
}
renderContent();
renderSaved();
