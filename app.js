const DATA_FILE = "신청목록.json";

const els = {
  body: document.querySelector("#applicationBody"),
  approvedCount: document.querySelector("#approvedCount"),
  rejectedCount: document.querySelector("#rejectedCount"),
  approvedAmount: document.querySelector("#approvedAmount"),
  resultInfo: document.querySelector("#resultInfo"),
  error: document.querySelector("#errorMessage"),
  reload: document.querySelector("#reloadButton")
};

const numberFormat = new Intl.NumberFormat("ko-KR");
const money = value => `${numberFormat.format(value)}원`;

function validateData(data) {
  if (!Array.isArray(data)) throw new Error("JSON 최상위 데이터가 배열이 아닙니다.");
  return data.map((item, index) => {
    const name = String(item.지자체명 ?? "").trim();
    const population = Number(item.인구수);
    const requested = Number(item.신청액);
    if (!name || !Number.isFinite(population) || !Number.isFinite(requested) || population < 0 || requested < 0) {
      throw new Error(`${index + 1}번째 데이터 형식이 올바르지 않습니다.`);
    }
    const limit = population * 10;
    const approved = requested <= limit;
    return { name, population, requested, limit, approved };
  });
}

function render(items) {
  els.body.replaceChildren();
  let approvedCount = 0;
  let approvedAmount = 0;

  items.forEach(item => {
    if (item.approved) {
      approvedCount += 1;
      approvedAmount += item.requested;
    }
    const row = document.createElement("tr");
    const values = [item.name, numberFormat.format(item.population), money(item.requested), money(item.limit)];
    values.forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });
    const judgmentCell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = `badge ${item.approved ? "approved" : "rejected"}`;
    badge.textContent = item.approved ? "승인" : "반려";
    judgmentCell.appendChild(badge);
    row.appendChild(judgmentCell);
    els.body.appendChild(row);
  });

  els.approvedCount.textContent = `${approvedCount}건`;
  els.rejectedCount.textContent = `${items.length - approvedCount}건`;
  els.approvedAmount.textContent = money(approvedAmount);
  els.resultInfo.textContent = `총 ${items.length}개 지자체의 심사 결과입니다.`;
}

async function loadData() {
  els.error.hidden = true;
  els.resultInfo.textContent = "데이터를 불러오는 중입니다.";
  els.reload.disabled = true;
  try {
    const response = await fetch(DATA_FILE, { cache: "no-store" });
    if (!response.ok) throw new Error(`데이터 요청 실패 (${response.status})`);
    render(validateData(await response.json()));
  } catch (error) {
    els.body.replaceChildren();
    els.approvedCount.textContent = "-";
    els.rejectedCount.textContent = "-";
    els.approvedAmount.textContent = "-";
    els.resultInfo.textContent = "데이터를 표시할 수 없습니다.";
    els.error.textContent = `신청목록.json을 불러오지 못했습니다. Netlify 배포 파일에 JSON이 함께 있는지 확인하세요. 상세: ${error.message}`;
    els.error.hidden = false;
  } finally {
    els.reload.disabled = false;
  }
}

els.reload.addEventListener("click", loadData);
loadData();
