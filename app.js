"use strict";

const DATA_URL = "신청목록.json";
const resultBody = document.getElementById("result-body");
const approvedCount = document.getElementById("approved-count");
const rejectedCount = document.getElementById("rejected-count");
const approvedTotal = document.getElementById("approved-total");
const loadStatus = document.getElementById("load-status");
const errorMessage = document.getElementById("error-message");

const numberFormat = new Intl.NumberFormat("ko-KR");
const money = (value) => `${numberFormat.format(value)}원`;

function validateItem(item) {
  return item &&
    typeof item.지자체명 === "string" &&
    Number.isFinite(Number(item.인구수)) &&
    Number.isFinite(Number(item.신청액));
}

function judge(item) {
  const population = Number(item.인구수);
  const requested = Number(item.신청액);
  const limit = population * 10;
  const status = requested > limit ? "반려" : "승인";
  return { name: item.지자체명, population, requested, limit, status };
}

function createCell(text) {
  const td = document.createElement("td");
  td.textContent = text;
  return td;
}

function render(rows) {
  const fragment = document.createDocumentFragment();
  let approvals = 0;
  let rejections = 0;
  let approvalAmount = 0;

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.append(
      createCell(row.name),
      createCell(`${numberFormat.format(row.population)}명`),
      createCell(money(row.requested)),
      createCell(money(row.limit))
    );

    const statusCell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = `status ${row.status === "승인" ? "status-approved" : "status-rejected"}`;
    badge.textContent = row.status;
    statusCell.appendChild(badge);
    tr.appendChild(statusCell);
    fragment.appendChild(tr);

    if (row.status === "승인") {
      approvals += 1;
      approvalAmount += row.requested;
    } else {
      rejections += 1;
    }
  });

  resultBody.replaceChildren(fragment);
  approvedCount.textContent = `${approvals}건`;
  rejectedCount.textContent = `${rejections}건`;
  approvedTotal.textContent = money(approvalAmount);
  loadStatus.textContent = `총 ${rows.length}건 판정 완료`;
}

async function loadApplications() {
  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("JSON 최상위 값은 배열이어야 합니다.");
    if (data.length !== 10) throw new Error(`지자체 데이터가 10건이 아닙니다. 현재 ${data.length}건입니다.`);
    if (!data.every(validateItem)) throw new Error("필수 항목 또는 숫자 값이 올바르지 않습니다.");
    render(data.map(judge));
  } catch (error) {
    loadStatus.textContent = "데이터 불러오기 실패";
    errorMessage.hidden = false;
    errorMessage.textContent = "신청목록.json을 불러오지 못했습니다. 파일 위치와 JSON 형식을 확인해 주세요.";
    console.error(error);
  }
}

loadApplications();
