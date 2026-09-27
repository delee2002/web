'use strict';

const DATA_URL = './장데이터.json';
let chapters = [];

const searchInput = document.getElementById('q');
const clearButton = document.getElementById('clearBtn');
const list = document.getElementById('list');
const count = document.getElementById('count');
const message = document.getElementById('message');

function normalize(value) {
  return String(value ?? '').toLocaleLowerCase('ko-KR');
}

function createCard(chapter) {
  const article = document.createElement('article');
  article.className = 'card';

  const label = document.createElement('span');
  label.className = 'label';
  label.textContent = `${chapter.장}장`;

  const title = document.createElement('h2');
  title.className = 'title';
  title.textContent = chapter.제목;

  const body = document.createElement('p');
  body.className = 'body';
  body.textContent = chapter.본문.replace(/\*\*/g, '');

  article.append(label, title, body);
  return article;
}

function render(items) {
  list.replaceChildren(...items.map(createCard));
  count.textContent = `결과 ${items.length}건`;

  const noResults = items.length === 0 && chapters.length > 0;
  message.hidden = !noResults;
  message.className = 'message';
  message.textContent = noResults ? '검색 결과가 없습니다. 다른 키워드를 입력해 주세요.' : '';
}

function filterChapters() {
  const keyword = normalize(searchInput.value.trim());
  const filtered = keyword
    ? chapters.filter((chapter) =>
        normalize(chapter.제목).includes(keyword) ||
        normalize(chapter.본문).includes(keyword)
      )
    : chapters;
  render(filtered);
}

async function loadData() {
  try {
    const response = await fetch(DATA_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('JSON 최상위 값이 배열이 아닙니다.');

    chapters = data.filter((item) => item && item.장 && item.제목 && item.본문);
    if (chapters.length !== 5) throw new Error(`유효한 장 데이터가 ${chapters.length}건입니다.`);

    render(chapters);
  } catch (error) {
    console.error('데이터 로드 오류:', error);
    list.replaceChildren();
    count.textContent = '결과 0건';
    message.hidden = false;
    message.className = 'message error';
    message.textContent = '장데이터.json을 불러오지 못했습니다. 파일명과 배포 위치를 확인해 주세요.';
  }
}

searchInput.addEventListener('input', filterChapters);
clearButton.addEventListener('click', () => {
  searchInput.value = '';
  filterChapters();
  searchInput.focus();
});

document.addEventListener('DOMContentLoaded', loadData);
