document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search_cfm');
    const searchButton = document.getElementById('search_button');
    const resultContainer = document.getElementById('result_cfm');

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        const category = document.getElementById('category')?.value || "mod";
        const version = document.getElementById('version')?.value || "";
        const loader = document.getElementById('loader')?.value || "";
        const source = document.getElementById('source')?.value || "all";

        resultContainer.innerHTML = '<p>正在搜索中，请稍候...</p>';

        let searches = [];
        if (source === 'curseforge' || source === 'all') {
            searches.push(searchCurseForge(query, category, version, loader));
        }
        if (source === 'modrinth' || source === 'all') {
            searches.push(searchModrinth(query, category, version, loader));
        }

        Promise.all(searches)
            .then(resultsArr => {
                const results = resultsArr.flat();

                if (results.length === 0) {
                    resultContainer.innerHTML = '<p>没有找到相关内容</p>';
                    return;
                }
                resultContainer.innerHTML = '';  // 清空结果容器
                results.forEach(item => {
                    const element = document.createElement('div');
                    element.classList.add('mod-result');
                    element.innerHTML = `
                      <img src="${item.logoUrl || '默认图片URL'}" alt="${item.name} logo">
                      <div class="mod-content">
                        <h3><a href="${item.url}" target="_blank">${item.name}</a></h3>
                        <div class="mod-summary">${item.summary || '暂无简介'}</div>
                        <div class="mod-meta">
                          平台：${item.platform} | 下载次数：${item.downloadCount}
                        </div>
                      </div>
                    `;
                    resultContainer.appendChild(element);
                });
            })
            .catch(error => {
                console.error('搜索失败:', error);
                resultContainer.innerHTML = '<p>搜索出错，请稍后再试</p>';
            });
    });

    // CurseForge 搜索
    function searchCurseForge(query, category, version, loader) {
        const loaderMap = {forge: 1, fabric: 4, quilt: 5, neoforge: 6};
        const categoryMap = {mod: 6, resourcepack: 12, shader: 6552};

        const params = new URLSearchParams({
            gameId: 432, // Minecraft
            searchFilter: query
        });

        // 仅当选择了具体分类时才加 classId
        if (category !== "all" && categoryMap[category]) {
            params.append("classId", categoryMap[category]);
        }

        if (version) params.append("gameVersion", version);
        if (loader && loaderMap[loader]) params.append("modLoaderType", loaderMap[loader]);

        return fetch(`https://api.curseforge.com/v1/mods/search?${params.toString()}`, {
            headers: {
                "x-api-key": "你的CF_API_KEY"
            }
        })
            .then(res => res.json())
            .then(data => {
                return (data.data || []).map(item => ({
                    name: item.name,
                    url: item.links?.websiteUrl || `https://www.curseforge.com/minecraft/${category}s/${item.slug}`,
                    platform: 'CurseForge',
                    summary: item.summary,
                    logoUrl: item.logo?.thumbnailUrl,
                    downloadCount: item.downloadCount
                }));
            })
            .catch(error => {
                console.error('CurseForge 搜索失败:', error);
                return [];
            });
    }

// Modrinth 搜索
    function searchModrinth(query, category, version, loader) {
        let facets = [];

        // 仅当选择了具体分类时才加 project_type
        if (category !== "all") {
            facets.push(`["project_type:${category}"]`);
        }

        if (version) facets.push(`["versions:${version}"]`);
        if (loader) facets.push(`["categories:${loader}"]`);

        const url = `https://api.modrinth.com/v2/search?query=${encodeURIComponent(query)}`
            + (facets.length ? `&facets=[${facets.join(",")}]` : "");

        return fetch(url, {
            headers: {"Content-Type": "application/json"}
        })
            .then(res => res.json())
            .then(data => {
                return (data.hits || []).map(item => ({
                    name: item.title,
                    url: `https://modrinth.com/${item.project_type}/${item.slug}`,
                    platform: 'Modrinth',
                    summary: item.excerpt,
                    logoUrl: item.icon_url,
                    downloadCount: item.downloads
                }));
            })
            .catch(error => {
                console.error('Modrinth 搜索失败:', error);
                return [];
            });
    }
})
