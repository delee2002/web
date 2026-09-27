let data = [];
fetch('장데이터.json').then(r => r.json()).then(d => { data = d; render(d); });
const q = document.getElementById('q');
const list = document.getElementById('list');
const count = document.getElementById('count');
q.addEventListener('input', () => {
  const kw = q.value.trim();
  const filtered = kw ? data.filter(a => a.본문.includes(kw) || a.제목.includes(kw)) : data;
  render(filtered);
});
function render(arr) {
  count.textContent = `결과 ${arr.length}건`;
  list.innerHTML = arr.map(a => `
    <div class="card">
      <span class="label">${a.장}장</span>
      <div class="title">${a.제목}</div>
      <div class="body">${a.본문.slice(0, 300)}${a.본문.length > 300 ? '…' : ''}</div>
    </div>`).join('');
}
