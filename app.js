let services = [];

async function loadData() {

    try {

        const response =
            await fetch("./안내서비스_목록.json");

        if (!response.ok) {
            throw new Error("JSON 로드 실패");
        }

        services = await response.json();

        createCategoryOptions();

        renderServices(services);

    } catch(error) {

        console.error(error);

        document.getElementById("count").textContent =
            "데이터를 불러오지 못했습니다.";
    }
}

function createCategoryOptions() {

    const select =
        document.getElementById("categoryFilter");

    const categories =
        [...new Set(
            services.map(
                item => item["안내분야"]
            )
        )];

    categories.sort();

    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;
        option.textContent = category;

        select.appendChild(option);
    });
}

function renderServices(data) {

    const list =
        document.getElementById("serviceList");

    document.getElementById("count").textContent =
        `결과 ${data.length}건`;

    list.innerHTML = "";

    data.forEach(item => {

        const card =
            document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h3>${item["서비스명"]}</h3>
            <p><strong>안내분야:</strong> ${item["안내분야"]}</p>
            <p><strong>소관기관:</strong> ${item["소관기관"]}</p>
            <p><strong>온라인안내:</strong> ${item["온라인안내"]}</p>
            <p><strong>콜센터:</strong> ${item["콜센터"]}</p>
        `;

        list.appendChild(card);
    });
}

function filterServices() {

    const keyword =
        document
        .getElementById("searchInput")
        .value
        .trim()
        .toLowerCase();

    const category =
        document
        .getElementById("categoryFilter")
        .value;

    const filtered =
        services.filter(item => {

            const searchMatch =
                item["서비스명"]
                .toLowerCase()
                .includes(keyword);

            const categoryMatch =
                category === ""
                ? true
                : item["안내분야"] === category;

            return searchMatch && categoryMatch;
        });

    renderServices(filtered);
}

document
.getElementById("searchInput")
.addEventListener(
    "input",
    filterServices
);

document
.getElementById("categoryFilter")
.addEventListener(
    "change",
    filterServices
);

loadData();