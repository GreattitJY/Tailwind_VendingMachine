const goods = document.querySelector("#section-goods");
const goodsList = goods.querySelectorAll("#section-goods button");
const purchase = document.querySelector("#section-purchase");
const inpMoney = purchase.querySelector("#input-money input");
const inpBtn = purchase.querySelector("#input-button");
const balance = purchase.querySelector("#balance");
const balBtn = purchase.querySelector("#balBtn");
const wallet = document.querySelector("#wallet");
const basket = document.querySelector("#section-basket");
const basketList = basket.querySelector("#section-basket ul");

// goods
const addBasket = function () {
    console.log(this === goodsList[0]);
    // if (this === goodsList[0] && basketList)
    const aa = document.querySelector("#test");
    if (document.querySelector("#test") === null) {
        const productLi = document.createElement("li");
        const productBtn = document.createElement("button");
        const productImg = document.createElement("img");
        const productName = document.createElement("strong");
        const productPrice = document.createElement("span");
        basketList.appendChild(productLi);
        productLi.appendChild(productBtn);
        productBtn.appendChild(productImg);
        productBtn.appendChild(productName);
        productBtn.appendChild(productPrice);
        productLi.id = "test";
    }
};

Array.prototype.forEach.call(goodsList, (item) => {
    item.addEventListener("click", addBasket);
});

// purchase\
const toInteger = function (string) {
    return parseInt(string.match(/[0-9]/g).join(""));
};

const comma = function (money) {
    return money
        .toString()
        .split("")
        .reverse()
        .map((val, idx) => (idx % 3 === 0 && idx !== 0 ? val + "," : val))
        .reverse()
        .join("");
};

let leftMoney = 0;

const putMoney = function () {
    const myMoney = toInteger(wallet.textContent);
    if (inpMoney.value.length === 0) {
        alert("금액을 넣어주세요.");
        return;
    }
    if (inpMoney.value > myMoney || inpMoney.value < 0) {
        if (inpMoney.value > myMoney) {
            alert("소지금이 부족합니다.");
        } else {
            alert("알맞은 금액을 넣어주세요.");
        }
        return (inpMoney.value = "");
    }
    const curMoney = comma(myMoney - inpMoney.value);
    wallet.textContent = curMoney + " 원";
    leftMoney += parseInt(inpMoney.value);
    balance.textContent = comma(leftMoney) + " 원";
    inpMoney.value = "";
};

inpBtn.addEventListener("click", putMoney);

const returnMoney = function () {
    const curMoney = toInteger(wallet.textContent) + leftMoney;
    leftMoney = 0;
    balance.textContent = 0 + " 원";
    wallet.textContent = comma(curMoney) + " 원";
};

balBtn.addEventListener("click", returnMoney);
