const supabaseUrl = "https://ixoieamdagpzwbwjjwbp.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b2llYW1kYWdwendid2pqd2JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NTM3NDQsImV4cCI6MjA1MTIyOTc0NH0.YxtdvQbCEux1XVnBxpyh8LBEMOAnfXPg4qlhQn-9_BY";

async function storeData(content) {
    const data = {
        content: content,
        timestamp: new Date().toISOString(),
    };

    const response = await fetch(`${supabaseUrl}/rest/v1/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        alert("数据上传成功！");
    } else {
        alert("数据上传失败：" + (await response.text()));
    }
}

// 绑定表单提交事件
document.getElementById("suggests").addEventListener("submit", (e) => {
    e.preventDefault(); // 阻止表单默认提交
    const message = document.getElementById("message").value; // 获取用户输入
    storeData(message); // 调用函数上传数据
});
