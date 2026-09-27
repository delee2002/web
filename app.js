"use strict";

const DATA_URL = "장데이터.json";
const searchInput = document.getElementById("search-input");
const clearButton = document.getElementById("clear-button");
const chapterList = document.getElementById("chapter-list");
const resultCount = document.getElementById("result-count");
const statusMessage = document.getElementById("status-message");
let chapters = [];

function normalize(value) {
  return String(value ?? "").toLocaleLowerCase("ko-KR").replace(/\s+/g, " ").trim();
}

function appendFormattedText(container, text) {
  const parts = String(text ?? "").split(/(\*\*[^*]+\*\*)/g);
  parts.forEach((part) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const strong = document.createElement("strong");
      strong.textContent = part.slice(2, -2);
      container.appendChild(strong);
    } else {
      container.appendChild(document.createTextNode(part));
    }
  });
}

function createCard(chapter) {
  const article = document.createElement("article");
  article.className = "chapter-card";
  const badge = document.createElement("span");
  badge.className = "chapter-number";
  badge.textContent = `${chapter.장}장`;
  const title = document.createElement("h3");
  title.textContent = chapter.제목;
  const body = document.createElement("p");
  body.className = "chapter-body";
  appendFormattedText(body, chapter.본문);
  article.append(badge, title, body);
  return article;
}

function render(items, keyword = "") {
  chapterList.replaceChildren();
  const fragment = document.createDocumentFragment();
  items.forEach((item) => fragment.appendChild(createCard(item)));
  chapterList.appendChild(fragment);
  chapterList.setAttribute("aria-busy", "false");
  resultCount.textContent = keyword ? `검색 결과 ${items.length}건` : `전체 ${items.length}건`;
  statusMessage.hidden = items.length !== 0;
  statusMessage.textContent = items.length === 0 ? "검색 결과가 없습니다. 다른 키워드를 입력해 주세요." : "";
}

function filterChapters() {
  const keyword = normalize(searchInput.value);
  const filtered = keyword
    ? chapters.filter((item) => normalize(`${item.제목} ${item.본문}`).includes(keyword))
    : chapters;
  render(filtered, keyword);
}

async function loadChapters() {
  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("JSON 최상위 값이 배열이 아닙니다.");
    chapters = data;
    render(chapters);
  } catch (error) {
    chapterList.setAttribute("aria-busy", "false");
    resultCount.textContent = "불러오기 실패";
    statusMessage.hidden = false;
    statusMessage.textContent = "장데이터.json을 불러오지 못했습니다. GitHub Pages 또는 로컬 서버에서 실행해 주세요.";
    console.error(error);
  }
}

searchInput.addEventListener("input", filterChapters);
clearButton.addEventListener("click", () => { searchInput.value = ""; filterChapters(); searchInput.focus(); });
loadChapters();
