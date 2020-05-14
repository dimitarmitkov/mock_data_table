import {MOCK} from "./MOCK_DATA.js";

(function (data, document) {

    let keys = Object.keys(data[0]);
    // other version
    // let result = keys.map(key=>`<div>${key}</div>`).join("");

    function createTag(tag, content) {
        return `<${tag}>${Array.isArray(content) ? content.join("") : content}</${tag}>`
    }

    function createSingleTag(tag, prop, val) {
        return `<${tag} ${prop}="${val}" />`;
    }
    // ohter version
    // Function.prototype.curr = function (...rest) {
    //     this.bind(this, ...rest);
    // }

    const renderTable = createTag.bind(undefined, "table");
    const renderThead = createTag.bind(undefined, "thead");
    const renderTbody = createTag.bind(undefined, "tbody");
    const renderTr = createTag.bind(undefined, "tr");
    const renderTh = createTag.bind(undefined, "th");
    const renderTd = createTag.bind(undefined, "td");
    const renderUl = createTag.bind(undefined, "ul");
    const renderLi = createTag.bind(undefined, "li");

    function chooseContentType(map, defaultWrapper, type, content) {
        if (typeof map[type] === "function") {
            return defaultWrapper(map[type](type, content));
        }
        return defaultWrapper(content);
    }

    const fieldsMap = {
        avatar: (_, x) => createSingleTag("img", "src", x),
        friends: (_, list) => renderUl(list.map(f => renderLi(`${f.first_name} ${f.last_name}`))),
        email: (_, x) => `<a href="mailto:${x}">${x}</a>`
    }


    const headingsMap = ["id", "first_name", "last_name", "email", "gender", "ip_address"].reduce((a, b) => {
        a[b] = (type, content) => `<a class="filter" data-sortby="${type}">${content}</a>`;
        return a;
    }, {})

    const defaultTd = chooseContentType.bind(
        undefined,
        fieldsMap, renderTd
    )
    const defaultTh = chooseContentType.bind(
        undefined,
        headingsMap, renderTh
    )

    const dictionary = {
        id: "Идентификатор",
        email: "Мейл",
        avatar: "Картинка",
        gender: "Пол",
        friends: "Приятели",
        last_name: "Фамилия",
        first_name: "Име",
        ip_address: "IP",
    }

    function main(data) {
        return renderTable(
            renderThead(renderTr(keys.map(key => defaultTh(key, dictionary[key])))) +
            // renderThead(renderTr(keys.map(key => renderTh(key)))) + without translate by dictionary
            renderTbody(data.map(row => renderTr(keys.map(cell => defaultTd(cell, row[cell])))))
        )
    }
    // other version
    // let result = renderTable(
    //     renderThead(renderTr(keys.map(key => defaultTh(key, dictionary[key])))) +
    //     // renderThead(renderTr(keys.map(key => renderTh(key)))) + without translate by dictionary
    //     renderTbody(data.map(row => renderTr(keys.map(cell => defaultTd(cell, row[cell])))))
    // )

    // check info
    // console.log(Object.keys(data[0]))

    function addToHTML(data) {
        document.getElementById("app").innerHTML = main(data);
    }

    function sortBy(key, a, b) {
        if (typeof a[key]=== "number"){
            return a[key] - (b[key]);
        }
        return a[key].localeCompare(b[key]);
    }
    // other version
    // document.getElementById("app").innerHTML = main(data);
    addToHTML(data);
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("filter")) {
            e.target.dataset.sortby;
            addToHTML(data.sort(sortBy.bind(undefined, e.target.dataset.sortby)));
        }
    }, true)
}(MOCK.slice(0, 20), document))
// check version
// }(MOCK, {getElementById:()=>{} }))

