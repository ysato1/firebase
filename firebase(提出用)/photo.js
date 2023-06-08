"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";
import {
  ref,
  push,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "", //提出用のため空欄
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); //RealtimeDBに接続



// 画像ファイルのアップロードとテキスト抽出の処理
window.addEventListener("DOMContentLoaded", function () {
  // アップロードボタンの要素を取得
  const uploader = document.getElementById("uploader");

  // アップロードボタンのイベントリスナー
  uploader.addEventListener("change", function () {
    // 選択されたファイルの情報を取得
    const file = this.files[0];

    const reader = new FileReader();
    reader.onload = function (e) {
      // 画像ファイルを表示
      const showPic = document.getElementById("showPic");
      showPic.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image" width="300">`;

      // Google Cloud Vision APIにリクエストを送信し、テキストを抽出
      const base64Data = e.target.result.replace(
        /^data:image\/(png|jpeg);base64,/,
        ""
      );
      extractTextFromImage(base64Data);
    };

    // ファイルを読み込む
    reader.readAsDataURL(file);

    // テキスト結果を表示するエリアを表示
    const resultArea = document.getElementsByClassName("resultArea");
    for (let i = 0; i < resultArea.length; i++) {
      resultArea[i].classList.remove("hidden");
    }
  });
});

// Google Cloud Vision APIに画像データを送信してテキストを抽出し、登録する
function extractAndRegister(base64Data) {
  // テキスト抽出処理
  const extractedText = extractTextFromImage(base64Data);

  // データベースルールとの照合
  const isValid = checkDatabaseRules(extractedText);

  // データベースに登録
  if (isValid) {
    registerToDatabase(extractedText);
  }
}

// Google Cloud Vision APIに画像データを送信してテキストを抽出
function extractTextFromImage(base64Data) {
  const apiKey = ""; // 提出用のため空欄
  const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

  const requestBody = {
    requests: [
      {
        image: {
          content: base64Data,
        },
        features: [
          {
            type: "DOCUMENT_TEXT_DETECTION",
          },
        ],
      },
    ],
  };

  const xhr = new XMLHttpRequest();
  xhr.open("POST", endpoint);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      // テキストを取得し表示
      if (data.responses && data.responses.length > 0) {
        const textAnnotations = data.responses[0].textAnnotations;
        if (textAnnotations && textAnnotations.length > 0) {
          const words = textAnnotations[0].description.split("\n");

          // テキスト結果を表示
          displayTextResults(words);

          // テキストに"レタス"が含まれるか判定
          const hasLettuce = checkForLettuce(words);
          if (hasLettuce) {
            // "レタス"が含まれる場合の処理
            const product = {
              name: "レタス",
              price: extractPrice(words), // テキストから価格を抽出する関数を呼び出し
            };
            registerProductToDatabase(product);
          }
        } else {
          displayTextResults([]);
        }
      } else {
        displayTextResults([]);
      }
    } else {
      console.log(xhr.status, xhr.statusText);
      displayTextResults([]);
    }
  };

  xhr.onerror = function () {
    console.log("Request failed");
    displayTextResults([]);
  };

  xhr.send(JSON.stringify(requestBody));
}

// テキスト結果を表示
function displayTextResults(words) {
  const textBox = document.getElementById("textBox");
  textBox.innerHTML = "";

  if (words.length > 0) {
    words.forEach(function (word) {
      textBox.innerHTML += `<tr><td>${word}</td></tr>`;
    });
  } else {
    textBox.innerHTML = `<tr><td>This picture may not contain any text.</td></tr>`;
  }
}

// テキストに"レタス"が含まれるか判定する関数
function checkForLettuce(words) {
  const keyword = "レタス";
  for (let i = 0; i < words.length; i++) {
    if (words[i].includes(keyword)) {
      return true;
    }
  }
  return false;
}

// テキストから価格を抽出する関数
function extractPrice(words) {
  const regex = /(\d+)円/;
  for (let i = 0; i < words.length; i++) {
    const match = words[i].match(regex);
    if (match && match[1]) {
      return parseInt(match[1]);
    }
  }
  return null;
}

// データベースに商品を登録する関数
function registerProductToDatabase(product) {
  const productsRef = ref(db, "products");

  const confirmed = confirm(
    `商品名: ${product.name}\n価格: ${product.price}円\n登録しますか？`
  );

  if (confirmed) {
    // 商品情報を登録
    push(productsRef, {
      name: product.name,
      price: product.price,
      timestamp: serverTimestamp(),
    });
    alert("登録が完了しました。");
  } else {
    alert("キャンセルされました。");
  }
}