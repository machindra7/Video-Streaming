// ===== Authentication Setup =====
console.log("script.js loaded");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userMenu = document.getElementById("userMenu");
const userEmail = document.getElementById("userEmail");
const userRole = document.getElementById("userRole");

// Debug logging
console.log("Auth Elements Found:", { loginBtn: !!loginBtn, logoutBtn: !!logoutBtn, userMenu: !!userMenu });

// Initialize auth UI
function initAuthUI() {
  const token = getTokenFromStorage();
  if (token) {
    const decoded = decodeToken(token);
    if (decoded && decoded.email) {
      showUserMenu(decoded);
    }
  }
}

function showUserMenu(userInfo) {
  loginBtn.style.display = "none";
  userMenu.style.display = "block";
  userEmail.textContent = userInfo.email || "User";
  
  const groups = userInfo["cognito:groups"] || [];
  const role = groups.includes("admin") ? "Admin" : "Viewer";
  userRole.textContent = role;
  
  // Store for later use
  setUserInfo({ email: userInfo.email, groups, role });
}

function hideUserMenu() {
  loginBtn.style.display = "block";
  userMenu.style.display = "none";
}

// Login/Logout handlers
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const url = getLoginUrl();
    console.log("Redirecting to login URL:", url);
    window.location.href = url;
  });
} else {
  console.error("Login button not found!");
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    clearTokens();
    hideUserMenu();
    const url = getLogoutUrl();
    console.log("Redirecting to logout URL:", url);
    window.location.href = url;
  });
}

// Handle OAuth callback
function handleAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  
  if (code) {
    console.log("Authorization code received:", code);
    // TODO: Exchange code for tokens on your backend
    // This should be done server-side for security
    window.location.replace(window.location.origin);
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded, initializing auth...");
  handleAuthCallback();
  initAuthUI();
});

// ===== Content Carousel & Tabs =====
const track = document.getElementById("contentTrack");
const prevButton = document.getElementById("prevTrack");
const nextButton = document.getElementById("nextTrack");
const tabs = [...document.querySelectorAll(".tab")];
const tabResults = document.getElementById("tabResults");
const cards = [...document.querySelectorAll(".show-card")];
const toggles = [...document.querySelectorAll(".watch-toggle")];
const watchCount = document.getElementById("watchCount");

let currentOffset = 0;
const cardStep = 230;

const curatedItems = [
  { title: "Neon Tides", genre: "sci-fi", mood: "Edge-of-seat" },
  { title: "Arclight District", genre: "sci-fi", mood: "High-intensity" },
  { title: "River of Glass", genre: "drama", mood: "Emotional" },
  { title: "Moon Archive", genre: "fantasy", mood: "Immersive" },
  { title: "Velocity IX", genre: "action", mood: "Adrenaline" }
];

function renderTabContent(activeTab) {
  const visible = activeTab === "all"
    ? curatedItems
    : curatedItems.filter((item) => item.genre === activeTab);

  tabResults.innerHTML = "";

  visible.forEach((item) => {
    const row = document.createElement("article");
    row.className = "mini-item";
    row.innerHTML = `<p>${item.title}</p><span>${item.mood}</span>`;
    tabResults.appendChild(row);
  });
}

function updateTrack() {
  track.style.transform = `translateX(${-currentOffset}px)`;
}

nextButton.addEventListener("click", () => {
  const maxOffset = Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
  currentOffset = Math.min(currentOffset + cardStep, maxOffset);
  updateTrack();
});

prevButton.addEventListener("click", () => {
  currentOffset = Math.max(currentOffset - cardStep, 0);
  updateTrack();
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    renderTabContent(tab.dataset.tab);

    cards.forEach((card) => {
      const match = tab.dataset.tab === "all" || card.dataset.genre === tab.dataset.tab;
      card.style.opacity = match ? "1" : "0.38";
      card.style.transform = match ? "translateY(0)" : "translateY(4px)";
    });
  });
});

toggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    const count = document.querySelectorAll(".watch-toggle.active").length;
    watchCount.textContent = String(count);
  });
});

renderTabContent("all");
updateTrack();
