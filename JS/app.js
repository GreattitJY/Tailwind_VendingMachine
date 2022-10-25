// 입금 및 거스름돈 반환
const purchase = document.querySelector("#section-purchase");
const inpMoney = purchase.querySelector("#input-money input");
const inpBtn = purchase.querySelector("#input-button");
const wallet = document.querySelector("#wallet");
const balance = document.querySelector("#balance");

const toInteger = function (string) {
    return string.match(/[0-9]/g).join("") | 0;
};
const comma = function (num) {
    return num
        .toString()
        .split("")
        .reverse()
        .map((val, idx) => (idx % 3 === 0 && idx !== 0 ? val + "," : val))
        .reverse()
        .join("");
};

let balMoney = 0;

const putMoney = function () {
    const myMoney = toInteger(wallet.textContent);
    if (inpMoney.value > myMoney || inpMoney.value < 0) {
        if (inpMoney.value > myMoney) {
            alert("소지금이 부족합니다.");
        } else {
            alert("알맞은 금액을 넣어주세요.");
        }
        return;
    }
    const curMoney = comma(myMoney - inpMoney.value);
    wallet.textContent = curMoney + " 원";
    balMoney += parseInt(inpMoney.value);
    balance.textContent = balMoney + "원";
};
inpBtn.addEventListener("click", putMoney);

// Todo :: 거스름돈 반환 이벤트 달기

// 잔액 확인용 (추후 지우기)
const checkBalMoney = function () {
    return balMoney;
};
