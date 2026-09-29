'use strict';

const data = Array.isArray(globalThis.장데이터) ? globalThis.장데이터 : [];
const q = document.getElementById('q');
const list = document.getElementById('list');
const count = document.getElementById('count');
const clearButton = document.getElementById('clear');
const empty = document.getElementById('empty');

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

function highlight(value, keyword) {
  const safe = escapeHtml(value);
  if (!keyword) return safe;
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return safe.replace(new RegExp(escapedKeyword, 'gi'), match => `<mark>${match}</mark>`);
}

function render(items, keyword = '') {
  count.textContent = `전체 ${data.length}개 장 중 결과 ${items.length}개`;
  empty.hidden = items.length !== 0;
  list.innerHTML = items.map(item => `
    <article class="card">
      <span class="label">${escapeHtml(item.장)}장</span>
      <h2 class="title">${highlight(item.제목, keyword)}</h2>
      <div class="body">${highlight(item.본문, keyword)}</div>
    </article>`).join('');
}

function search() {
  const keyword = q.value.trim();
  const normalized = keyword.toLocaleLowerCase('ko-KR');
  const filtered = normalized
    ? data.filter(item => `${item.제목} ${item.본문}`.toLocaleLowerCase('ko-KR').includes(normalized))
    : data;
  render(filtered, keyword);
}

q.addEventListener('input', search);
clearButton.addEventListener('click', () => {
  q.value = '';
  search();
  q.focus();
});
render(data);
