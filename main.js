const TelegramBot = require("node-telegram-bot-api");
const token = "5374444274:AAGWmVigj2hxeHuLmqdE-8w4lV_Cf8v1O-o";
const bot = new TelegramBot(token, { polling: true });
const axios = require("axios").default;

const chatId = 5595047535;
const accoptions = {
  method: "GET",
  url: "https://api.upbit.com/v1/accounts",
  headers: {
    Accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3Nfa2V5IjoiNjU5WTFSTGlLN1lQb09jT0kxcmlFY25sR2dlVm1XOGsxaUxQdjJQUiIsIm5vbmNlIjoiMTIwMTEyMDExMSJ9.u36p4bmBSTanBf5C1Qlag4qxE14E9LLLhSclCKvQ9bE",
  },
};

let playing = true;

const options = {
  method: "GET",
  url: "https://api.upbit.com/v1/ticker",
  params: { markets: "KRW-BTC" },
  headers: { Accept: "application/json" },
};

const options2 = {
  method: "GET",
  url: "https://api.upbit.com/v1/market/all",
  params: { isDetails: "false" },
  headers: { Accept: "application/json" },
};

// interval
// const interval = setInterval(coinPriceLoad, 1000);

// axios.get 결과값 리턴
// 인자 p가 무슨 정보 받아올지 결정하는 인자
// option1이면 시세, 2면 목록

const TestApiCall = async (p) => {
  try {
    const response = await axios.get(p.url, p); // url , request(추가정보)
    return response;
  } catch (err) {
    console.log("Error >>", err);
  }
};
//
// clg
// res로 받아옴
function coinPriceLoad() {
  TestApiCall(options).then((res) => {
    bot.sendMessage(
      chatId,
      `${res.data[0].trade_price.toLocaleString()}원이고 ${(
        res.data[0].signed_change_rate * 100
      ).toFixed(
        2
      )}%만큼 변화했어요. 어제보다 ${res.data[0].signed_change_price.toLocaleString()}원 변화했어요.`
    );
  });
}

function coinListLoad() {
  TestApiCall(options2).then((res) => {
    console.log(res.data[0]);
  });
}

// 코인 셀렉트
function coinSelectControl(i) {
  // options.params["markets"] = coinList[Math.round(Math.random() * 2)];
  options.params["markets"] = i;
}

coinPriceLoad();

bot.onText(/\/btc/, coinPriceLoad);
bot.sendMessage(chatId, `응답할 준비가 되었어요!`);

// const button = document.querySelector(".btn");
// const button2 = document.querySelector(".btn2");
// const stop = document.querySelector(".stop");
// const start = document.querySelector(".start");
// const inputtext = document.querySelector(".inputtext");
// const inputsubmit = document.querySelector(".inputsubmit");
// const form = document.querySelector(".submitform");

// button.addEventListener("click", () => {
//   coinSelectControl(inputtext.value);
//   coinListLoad();
// });

// start.addEventListener("click", () => {
//   setInterval(coinPriceLoad, 1000);
// });

// stop.addEventListener("click", () => {});

// form.addEventListener("submit", (event) => {
//   event.preventDefault();
//   coinSelectControl(inputtext.value);
//   console.log(inputtext.value);
//   inputtext.value = "";
// });

// button2.addEventListener("click", () => {
//   coinPriceLoad();
// });
