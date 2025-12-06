const versions = [];
for (let i = 9; i >= 1; i--) {
    versions.push(`1.21.${i}`)
}
versions.push(`1.21`)
for (let i = 6; i >= 1; i--) {
    versions.push(`1.20.${i}`)
}
versions.push(`1.20`)
for (let i = 4; i >= 1; i--) {
    versions.push(`1.19.${i}`)
}
versions.push(`1.19`)
for (let i = 2; i >= 1; i--) {
    versions.push(`1.18.${i}`)
}
versions.push(`1.18`)
versions.push(`1.17.1`)
versions.push(`1.17`)
for (let i = 5; i >= 1; i--) {
    versions.push(`1.16.${i}`)
}
versions.push(`1.16`)
versions.push(`1.15.2`)
versions.push(`1.15.1`)
versions.push(`1.15`)
for (let i = 4; i >= 1; i--) {
    versions.push(`1.14.${i}`)
}
versions.push(`1.14`)


const select = document.getElementById("version");
// 保留原来的“不限”
let optionsHtml = '<option value="">不限</option>';
versions.forEach(v => {
    optionsHtml += `<option value="${v}">${v}</option>`;
});

select.innerHTML = optionsHtml;

const btn = document.getElementById("toggle-theme");
const body = document.body;


// 点击按钮切换
btn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    // 保存到本地存储，刷新后依然记住
    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        btn.innerText = "深色";
        btn.background = "#000000";
        btn.color = "#fff";
    } else {
        localStorage.setItem("theme", "light");
        btn.innerText = "浅色";
        btn.style.background = "#fff";
        btn.style.color = "#000000";
    }
});

// 页面加载时读取本地存储
window.addEventListener("load", () => {
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
    }
});
