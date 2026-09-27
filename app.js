"use strict";

const DATA_URL = "./장데이터.json";
const searchInput = document.getElementById("q");
const clearButton = document.getElementById("clear-button");
const list = document.getElementById("list");
const count = document.getElementById("count");
const emptyState = document.getElementById("empty");
const errorState = document.getElementById("error");

let chapters = [];

function normalize(value) {
  return String(value ?? "").toLocaleLowerCase("ko-KR").trim();
}

function validateData(value) {
  return Array.isArray(value) && value.every((item) =>
    item && typeof item === "object" &&
    typeof item["장"] === "string" &&
    typeof item["제목"] === "string" &&
    typeof item["본문"] === "string"
  );
}

function plainText(value) {
  return String(value).replace(/\*\*(.*?)\*\*/g, "$1");
}

function createCard(chapter) {
  const article = document.createElement("article");
  article.className = "card";

  const headingWrap = document.createElement("div");
  headingWrap.className = "card-heading";

  const label = document.createElement("span");
  label.className = "card-label";
  label.textContent = `${chapter["장"]}장`;

  const title = document.createElement("h3");
  title.textContent = chapter["제목"];

  const body = document.createElement("p");
  body.className = "card-body";
  body.textContent = plainText(chapter["본문"]);

  headingWrap.append(label, title);
  article.append(headingWrap, body);
  return article;
}

function render(items) {
  const fragment = document.createDocumentFragment();
  items.forEach((chapter) => fragment.appendChild(createCard(chapter)));
  list.replaceChildren(fragment);
  list.setAttribute("aria-busy", "false");
  count.textContent = `총 ${chapters.length}개 장 중 ${items.length}개 결과`;
  emptyState.hidden = items.length !== 0;
}

function filterChapters() {
  const keyword = normalize(searchInput.value);
  const filtered = keyword
    ? chapters.filter((chapter) =>
        normalize(chapter["제목"]).includes(keyword) ||
        normalize(chapter["본문"]).includes(keyword)
      )
    : chapters;
  render(filtered);
}

async function loadChapters() {
  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!validateData(data)) throw new Error("Invalid data format");
    chapters = data;
    render(chapters);
  } catch (error) {
    console.error("장 데이터 로드 실패:", error);
    list.setAttribute("aria-busy", "false");
    list.replaceChildren();
    count.textContent = "결과를 표시할 수 없습니다.";
    emptyState.hidden = true;
    errorState.hidden = false;
  }
}

searchInput.addEventListener("input", filterChapters);
clearButton.addEventListener("click", () => {
  searchInput.value = "";
  filterChapters();
  searchInput.focus();
});

document.addEventListener("DOMContentLoaded", loadChapters);
