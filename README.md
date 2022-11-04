# VendingMachine

-   음료를 판매하는 자판기를 구현하는 프로젝트입니다.
    -   미디어 쿼리를 이용한 반응형 웹 페이지입니다.
    -   [피그마 링크](https://www.figma.com/file/c4mPUK5xcqzzRVBadSu6BG/%EB%A9%8B%EC%82%AC_%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%EC%8A%A4%EC%BF%A8_3%EA%B8%B0?node-id=0%3A1)
-   요구사항 명세 (JavaScript)
    -   판매할 음료에 대한 데이터는 따로 분리됩니다.
    -   돈의 입금과 음료의 선택 시점은 자유롭지만 돈이 모자라면 음료가 나오지 않습니다.
    -   거스름돈이 나와야 합니다.
    -   버튼을 누르면 상품이 1개씩 추가됩니다.

## 업데이트 및 고민사항

-   11월 4일 (issue)

    -   issue 1 fetch는 비동기 처리 방식으로 코드 실행 순서에서 의도치 않은 문제가 발생 (11월 3일 작업 코드)
    -   issue 1-1 json 데이터에서 음료 재고가 0일 경우 바로 품절표시 되지 않음 (노드리스트가 빈 배열)
    -   해결 방법 : Promise .then으로 문제 해결

    ```js
    const renderProductData = [];

    const promise = new Promise((resolve, reject) => {
        const response = fetch("./JS/item.json");
        resolve(response);
    })
        .then((response) => {
            const result = response.json();
            return result;
        })
        .then((result) => {
            for (const data of result) {
                renderProductData.push({
                    ...data,
                });
            }
        })
        .then((result) => {
            Array.prototype.forEach.call(productList, (product) => {
                checkStock(product);
                product.addEventListener("click", addBasket);
            });
        })
        .catch((e) => {
            console.error(e);
        });
    ```

-   11월 3일 (업데이트 사항)

    -   item.json 파일 생성
    -   json 파일 렌더링 함수 구현 완료했습니다.

    ```js
    const renderProductData = [];
    const renderProduct = async function () {
    try {
        const response = await fetch("./JS/item.json");
        const result = await response.json();
        for (const data of result) {
            renderProductData.push({
                ...data,
            });
        }
    } catch (e) {
        console.error(e);
    ```

-   10월 31일 (issue)

    -   issue 1 입금액 입력에 콤마 찍기
    -   issue 1-1 input의 type을 text로 받을 시 형변환 과정에서 입력값이 없을 경우 join 메서드에서 null 오류 발생
    -   해결 방법 : try, catch를 통해 오류를 해결하여 숫자만 입력 가능하도록 만들었습니다.

    ```js
    const inpMoney = purchase.querySelector("#input-money input");

    const inpValue = function () {
        try {
            inpMoney.value = comma(toInteger(inpMoney.value));
        } catch {
            inpMoney.value = "";
        }
    };

    inpMoney.addEventListener("input", inpValue);
    ```

-   10월 29일 (issue, html 의존성 낮추기)

    -   issue 1 json 형식을 통해 데이터를 받아올 경우 재고 처리를 어떻게 할 것이지에 대한 문제 (실제로 api를 받아오진 않고 가정만 했습니다.)
    -   해결 방법 : render를 통한 객체를 생성 후 변수를 할당하기로 해결했습니다.
    -   html 의존성 낮추기 : json 데이터 형식을 활용할 경우 dataset.price를 자바스크립트에서 처리 (dataset.price는 제거, dataset.name은 아직 남아 있습니다.)

        ```js
        const renderProductData = (function () {
            const temp = [];
            for (const data of productData) {
                temp.push({
                    ...data,
                });
            }
            return temp;
        })();
        ```

-   10월 27일 (issue)

    -   issue 1 클릭 이벤트 발생 시 `button`의 자식 요소인 상품 이미지와 이름을 어떻게 가져올 지에 대한 고민
    -   issue 1-1 돔 트리에 다시 접근해 가져올 경우 코드가 복잡해지는 문제가 발생 -> 클릭 이벤트 한 번으로 해결하기
    -   해결 방법 : HTMLElement.dataset을 이용해서 정보를 읽어와 해결했습니다.
        ```html
        <button data-nmae="Original_Cola">
            <img src="./img/Original_Cola.svg" alt="" />
            <strong>Original_Cola</strong>
            <span>1000원</span>
        </button>
        ```
        ```js
        productImg.setAttribute("src", `./img/${this.dataset.name}.svg`);
        ```

-   10월 26일 (issue)

    -   issue 1 Tailwind를 npm run을 통해서 빌드할 경우 input.css의 `@layer components`가 빌드되지 않아 자바스크립트 컨트롤이 안 되는 문제가 발생.
    -   해결 방법 : 단순히 html에 `<script>`를 작성한다고 끝나는 게 아니라 tailwind.config.js에 경로 추가 (Tailwind 공식 문서 참고)

    ```js
    module.exports = {
        content: ["./index.html", "./JS/app.js"],
    };
    ```

    -   자바스크립트를 통한 명세서 구현 중입니다.
        -   입금 및 거스름돈 구현 완료
        -   음료 클릭 시 구매 이벤트 구현 중입니다.

-   10월 8일

    -   CSS를 Tailwind로 다시 리팩토링했습니다.
    -   npm을 통해 CLI로 작업했습니다.
    -   미디어 쿼리까지 구현했습니다.
    -   현재 자바스크립트를 이용한 명세서는 미구현입니다.

-   9월 27일
    -   HTML과 CSS를 통한 미디어 쿼리까지 구현했습니다.
    -   현 시점으로 요구사항 명세는 아직 미구현입니다.
