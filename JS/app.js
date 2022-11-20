const $product = document.querySelector("#section-product");
const $productList = $product.querySelectorAll("#section-product button");

const $purchase = document.querySelector("#section-purchase");
const $inpMoney = $purchase.querySelector("#input-money input");
const $inpBtn = $purchase.querySelector("#input-button");
const $balance = $purchase.querySelector("#balance");
const $balBtn = $purchase.querySelector("#balBtn");
const $getBtn = $purchase.querySelector("#get-button");

const $wallet = document.querySelector("#wallet");

const $basket = document.querySelector("#section-basket");
const $basketList = $basket.querySelector("#section-basket ul");

const $getSection = document.querySelector("#section-get");
const $getBox = $getSection.querySelector("#get-box");
const $totalMoney = $getSection.querySelector("#totalMoney");

// json에서 받은 데이터를 저장
const renderProductData = [];

/* 비동기로 json 데이터를 받아옵니다.
 *   1. 제품 데이터를 생성합니다.
 *   2. 재고를 파악합니다.
 *   3. 제품에 클릭 이벤트를 추가합니다.
 */
const renderProduct = async function () {
    try {
        const response = await fetch("./JS/item.json");
        const result = await response.json();

        for (const data of result) {
            renderProductData.push({
                ...data,
            });
        }
        Array.prototype.forEach.call($productList, (product) => {
            checkStock(product);
            product.addEventListener("click", addBasket);
        });
    } catch (error) {
        console.error(error);
    }
};

// 양의 정수 및 콤마 기능
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

// 잔액
let balance = toInteger($balance.textContent);

/* 음료 클릭 이벤트
 *  1. 잔액과 제품 가격을 비교합니다.
 *  2. 잔액이 적을 경우 실행을 멈추고 경고창을 띄웁니다.
 *  3. 결제를 진행합니다. (잔액 = 잔액 - 제품가격)
 *  4. 제품이 바구니에 있을 경우 개수를 늘립니다.
 *  5. 제품이 바구니에 없을 경우 리스트를 생성합니다.
 */
const addBasket = function () {
    const renderData = checkStock(this);
    if (balance < renderData["price"]) {
        alert("잔액이 모자랍니다.");
        return;
    }
    balance -= renderData["price"];
    $balance.textContent = comma(balance) + " 원";
    if ($basket.querySelector(`#${renderData["name"]}`) === null) {
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
        productLi.setAttribute("id", `${renderData["name"]}`);
        productBtn.setAttribute("class", "productBtn");
        productBtn.setAttribute("type", "button");
        productImg.setAttribute("class", "productImg");
        productImg.setAttribute("src", `./img/${renderData["name"]}.svg`);
        productName.setAttribute("class", "productName");
        productName.textContent = `${renderData["name"]}`;
        productCount.setAttribute("class", "productCount");
        productCount.textContent = 1;
        $basketList.appendChild(productLi);
        renderData["stock"] -= 1;
    } else {
        const productCount = $basketList.querySelector(`#${renderData["name"]} .productCount`);
        productCount.textContent = parseInt(productCount.textContent) + 1;
        renderData["stock"] -= 1;
    }
    checkStock(this);
};

/* 재고 파악
 *   1. 재고가 없을 시 품절 표시를 띄웁니다.
 *   2. 재고가 있을 경우 해당 데이터를 반환합니다.
 */
const checkStock = function (productData) {
    for (const renderData of renderProductData) {
        if (productData.dataset.name === renderData["name"]) {
            if (renderData["stock"] === 0) {
                productData.classList.add("before:disabled");
                productData.disabled = true;
            } else {
                return renderData;
            }
        }
    }
};

// 입금액 버튼 기능
const putMoney = function () {
    try {
        const myMoney = toInteger($wallet.textContent);
        const insertMoney = toInteger($inpMoney.value);
        if (insertMoney > myMoney) {
            alert("소지금이 부족합니다.");
            return ($inpMoney.value = "");
        }
        const curMoney = comma(myMoney - insertMoney);
        $wallet.textContent = curMoney + " 원";
        balance += parseInt(insertMoney);
        $balance.textContent = comma(balance) + " 원";
        $inpMoney.value = "";
    } catch {
        alert("금액을 넣어주세요.");
    }
};

// 거스름돈 반환 버튼 기능
const returnMoney = function () {
    const curMoney = toInteger($wallet.textContent) + balance;
    balance = 0;
    $balance.textContent = 0 + " 원";
    $wallet.textContent = comma(curMoney) + " 원";
};

/* 획득 버튼 기능
 *   1. 바구니에 있는 제품을 소지품으로 옮깁니다.
 *   2. 소지품에 제품이 있을 경우 개수를 늘립니다.
 *   3. 소지품에 제품이 없을 경우 리스트를 생성합니다.
 *   4. 소지품에 있는 음료의 총 가격을 표시합니다.
 */
const getProduct = function () {
    let countMoney = toInteger($totalMoney.textContent);
    const $basketProduct = $basketList.querySelectorAll("li");
    let count = 0;
    for (let i = 0; i < $basketProduct.length; i++) {
        const basketProductId = $basketProduct[i].getAttribute("id");
        const basketProductCount = $basketProduct[i].querySelector("span").textContent;
        const $checkGetbox = $getBox.querySelector(`#${basketProductId}`);
        if ($checkGetbox) {
            let $getBoxProductCount = $getBox.querySelector(`#${basketProductId} span`);
            $getBoxProductCount.textContent = parseInt($getBoxProductCount.textContent) + parseInt(basketProductCount);
        } else {
            const $copyBasketProduct = $basketProduct[i].cloneNode(true);
            $getBox.appendChild($copyBasketProduct);
        }
        count += parseInt(basketProductCount);
    }
    $basketList.innerHTML = "";
    countMoney += parseInt(count * 1000);
    countMoney = comma(countMoney);
    $totalMoney.textContent = `총 금액 : ${countMoney}원`;
};

// 입금액에 숫자 유효성 검사 및 콤마 기능
const inpValue = function () {
    try {
        $inpMoney.value = comma(toInteger($inpMoney.value));
    } catch {
        $inpMoney.value = "";
    }
};

renderProduct();
$inpMoney.addEventListener("input", inpValue);
$inpBtn.addEventListener("click", putMoney);
$balBtn.addEventListener("click", returnMoney);
$getBtn.addEventListener("click", getProduct);
