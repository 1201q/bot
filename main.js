let coinsetting = false;
let observe = false;
let playing = true;
const current = {
  price: [],
  percent: [],
};

const coinListArr = {
  kor: [],
  eng: [],
  mar: [],
};

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

// interval 기능
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

coinListLoad();

function coinListLoad() {
  TestApiCall(options2).then((res) => {
    for (let i = 0; i < res.data.length; i++) {
      if (res.data[i].market.includes("KRW")) {
        coinListArr.kor.push(res.data[i].korean_name);
        coinListArr.eng.push(res.data[i].english_name);
        coinListArr.mar.push(res.data[i].market);
      }
    }
  });
}

// 코인 셀렉트
function coinSelectControl(coinName) {
  if (coinListArr.mar.includes(coinName)) {
    coinsetting = true;
    options.params["markets"] = coinName;
    console.log("목록에 있음");
    bot.sendMessage(chatId, `기본코인이 ${coinName}로 설정되었어요.`);
  } else {
    console.log("목록에 없음");
    bot.sendMessage(chatId, `입력하신 코인은 목록에 없어요.`);
  }
}

bot.onText(/\/btc/, () => {
  // if (coinsetting === false) {
  //   bot.sendMessage(chatId, `기본코인을 설정하세요.`);
  // } else {
  coinPriceLoad();
  // }
});

//help
bot.onText(/\/help/, () => {
  bot.sendMessage(chatId, `1`);
});

//기본코인설정
bot.onText(/\/코인설정 (.+)/, (msg, match) => {
  coinSelectControl(match[1].toUpperCase());
});

//코인목록
bot.onText(/\/코인목록/, () => {
  if (coinListArr === undefined) {
    bot.sendMessage(
      chatId,
      `아직 코인목록이 로딩되지 않았어요. 조금만 기다려주세요.`
    );
  } else {
    bot.sendMessage(
      chatId,
      `현재 원화마켓에서 가능한 코인이에요. \n ${coinListArr.kor}`
    );
  }
});

// bot.onText(/\/이름 (.+)/, (msg, match) => {
//   const korIncludes = coinListArr.kor.includes(match[1].toUpperCase());
//   const engIncludes = coinListArr.eng.includes(match[1].toUpperCase());
//   const marIncludes = coinListArr.mar.includes(match[1].toUpperCase());
//   const korIndexof = coinListArr.kor.indexOf(match[1].toUpperCase());
//   const engIndexof = coinListArr.eng.indexOf(match[1].toUpperCase());
//   const marIndexof = coinListArr.mar.indexOf(match[1].toUpperCase());
// });
