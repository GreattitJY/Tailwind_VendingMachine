const product = document.querySelector("#section-product");
const productList = product.querySelectorAll("#section-product button");
const purchase = document.querySelector("#section-purchase");
const inpMoney = purchase.querySelector("#input-money input");
const inpBtn = purchase.querySelector("#input-button");
const balance = purchase.querySelector("#balance");
const balBtn = purchase.querySelector("#balBtn");
const getBtn = purchase.querySelector("#get-button");
const wallet = document.querySelector("#wallet");
const basket = document.querySelector("#section-basket");
const basketList = basket.querySelector("#section-basket ul");
const getSection = document.querySelector("#section-get");
const getBox = getSection.querySelector("#get-box");
const totalMoney = getSection.querySelector("#totalMoney");
let leftMoney = 0;

const productData = [
    {
        name: "Original_Cola",
        price: 1000,
        stock: 5,
    },
    {
        name: "Violet_Cola",
        price: 1000,
        stock: 0,
    },
    {
        name: "Yellow_Cola",
        price: 1000,
        stock: 10,
    },
    {
        name: "Cool_Cola",
        price: 1000,
        stock: 2,
    },
    {
        name: "Green_Cola",
        price: 1000,
        stock: 10,
    },
    {
        name: "Orange_Cola",
        price: 1000,
        stock: 10,
    },
];

const renderProductData = (function () {
    const temp = [];
    for (const data of productData) {
        temp.push({
            ...data,
        });
    }
    return temp;
})();

const addBasket = function () {
    const renderProductData = checkStock(this);
    if (leftMoney < renderProductData["price"]) {
        alert("잔액이 모자랍니다.");
        return;
    }
    leftMoney -= renderProductData["price"];
    balance.textContent = comma(leftMoney) + " 원";
    if (basket.querySelector(`#${renderProductData["name"]}`) === null) {
        const productLi = document.createElement("li");
        const productBtn = document.createElement("button");
        const productImg = document.createElement("img");
        const productName = document.createElement("strong");
        const productCount = document.createElement("span");
        productLi.appendChild(productBtn);
        productBtn.appendChild(productImg);
        productBtn.appendChild(productName);
        productBtn.appendChild(productCount);
        productLi.setAttribute("class", "productLi");
        productLi.setAttribute("id", `${renderProductData["name"]}`);
        productBtn.setAttribute("class", "productBtn");
        productBtn.setAttribute("type", "button");
        productImg.setAttribute("class", "productImg");
        productImg.setAttribute("src", `./img/${renderProductData["name"]}.svg`);
        productName.setAttribute("class", "productName");
        productName.textContent = `${renderProductData["name"]}`;
        productCount.setAttribute("class", "productCount");
        productCount.textContent = 1;
        basketList.appendChild(productLi);
        renderProductData["stock"] -= 1;
    } else {
        const productCount = basketList.querySelector(`#${renderProductData["name"]} .productCount`);
        productCount.textContent = parseInt(productCount.textContent) + parseInt(1);
        renderProductData["stock"] -= 1;
    }
    checkStock(this);
};

const checkStock = function (product) {
    for (const data of renderProductData) {
        if (product.dataset.name === data["name"]) {
            if (data["stock"] === 0) {
                product.classList.add("before:disabled");
                product.disabled = true;
            } else {
                return data;
            }
        }
    }
};

Array.prototype.forEach.call(productList, (product) => {
    checkStock(product);
    product.addEventListener("click", addBasket);
});

// purchase
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

const putMoney = function () {
    try {
        const myMoney = toInteger(wallet.textContent);
        const insertMoney = toInteger(inpMoney.value);
        if (insertMoney > myMoney) {
            alert("소지금이 부족합니다.");
            return (inpMoney.value = "");
        }
        const curMoney = comma(myMoney - insertMoney);
        wallet.textContent = curMoney + " 원";
        leftMoney += parseInt(insertMoney);
        balance.textContent = comma(leftMoney) + " 원";
        inpMoney.value = "";
    } catch {
        alert("금액을 넣어주세요.");
    }
};

const returnMoney = function () {
    const curMoney = toInteger(wallet.textContent) + leftMoney;
    leftMoney = 0;
    balance.textContent = 0 + " 원";
    wallet.textContent = comma(curMoney) + " 원";
};

const getProduct = function () {
    let countMoney = toInteger(totalMoney.textContent);
    const basketProduct = basketList.querySelectorAll("li");
    let count = 0;
    for (let i = 0; i < basketProduct.length; i++) {
        const basketProductId = basketProduct[i].getAttribute("id");
        const basketProductCount = basketProduct[i].querySelector("span").textContent;
        const checkGetbox = getBox.querySelector(`#${basketProductId}`);
        if (checkGetbox) {
            let getBoxProductCount = getBox.querySelector(`#${basketProductId} span`);
            getBoxProductCount.textContent = parseInt(getBoxProductCount.textContent) + parseInt(basketProductCount);
        } else {
            const copyBasketProduct = basketProduct[i].cloneNode(true);
            getBox.appendChild(copyBasketProduct);
        }
        count += parseInt(basketProductCount);
    }
    basketList.innerHTML = "";
    countMoney += parseInt(count * 1000);
    countMoney = comma(countMoney);
    totalMoney.textContent = `총 금액 : ${countMoney}원`;
};

const inpValue = function () {
    try {
        inpMoney.value = comma(toInteger(inpMoney.value));
    } catch {
        inpMoney.value = "";
    }
};

inpMoney.addEventListener("input", inpValue);
inpBtn.addEventListener("click", putMoney);
balBtn.addEventListener("click", returnMoney);
getBtn.addEventListener("click", getProduct);
