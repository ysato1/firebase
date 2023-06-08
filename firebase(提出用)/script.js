
//写真を検索する
function searchImages() {
  const query = document.getElementById("query").value;
  const apiKey = ""; //課題提出時は空欄でだす
  const searchEngineId = ""; //課題提出時は空欄でだす

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&searchType=image&q=${query}`;

  
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.items && data.items.length > 0) {
        const imageUrl = data.items[0].link;
        const image = document.createElement("img");
        image.src = imageUrl;
        document.getElementById("imageContainer").innerHTML = "";
        document.getElementById("imageContainer").appendChild(image);
      } else {
        document.getElementById("imageContainer").innerHTML =
          "写真がみつかりませんでした.";
      }
    })
    .catch((error) => console.log(error));
}

// ローカルストレージにデータを保存
function saveData() {
  const date = document.getElementById("dateInput").value;
  const key = document.getElementById("key").value;
  const memo = document.getElementById("memo").value;

  const data = getLocalStorageData();

  data.push({ date: date, key: key, value: parseFloat(memo) });

  localStorage.setItem("graphData", JSON.stringify(data));

  // 画面をリロードしてグラフを表示
  // location.reload();

  // document.getElementById('key').value = '';
  // document.getElementById('memo').value = '';
}

// ローカルストレージのデータをクリア
function clearData() {
  localStorage.removeItem("graphData");

  // 画面をリロードでグラフを表示、グラフを破棄する処理がわからなかったので、今後の課題とする。
  location.reload();
}

// 初期処理を実行
drawGraph();

// ローカルストレージからデータを取得
function getLocalStorageData() {
  const data = localStorage.getItem("graphData");
  return data ? JSON.parse(data) : [];
}

// グラフを描画
function drawGraph() {
  const graphData = getLocalStorageData();
  const dates = graphData.map((item) => item.date); 
  const keys = graphData.map((item) => item.key); 

  const labels = dates.map((date, index) => {
    const formattedDate = new Date(date).toLocaleDateString("ja-JP");
    const key = keys[index];
    return `${formattedDate} (${key})`;
  });

  const values = graphData.map((item) => item.value);

  const ctx = document.getElementById("myChart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "食材の価格",
          data: values,
          backgroundColor: "rgba(0, 123, 255, 0.2)",
          borderColor: "rgba(0, 123, 255, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "日付(商品名)",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "価格",
          },
        },
      },
    },
  });
}



// クリックイベント
document.getElementById("save").addEventListener("click", saveData);
document.getElementById("clear").addEventListener("click", clearData);
