function redirectTo(url) {
    window.location.href = url; // 跳转到指定的URL
}

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const url = button.getAttribute('data-url');
            const message = button.getAttribute('data-message');
            // 弹出提示框
            if (message) {
                window.alert(message);
            }
            // 如果有 URL，跳转到该地址
            if (url) {
                window.location.href = url;
            }
        });
    });
});




