from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

app = Flask(__name__)

chrome_options = Options()
chrome_options.add_argument('blink-settings=imagesEnabled=false')  # 不加载图片

@app.route('/api/endpoint', methods=['POST'])
def search_mod():
    data = request.get_json()
    mod_name = data.get('data', '')
    page = 1
    results = get_mrm(mod_name, page)  # 这里你可以使用 get_cfm 或 get_mrm 函数来获取数据
    return jsonify({'message': results})

def get_mrm(mod_name, pages=1):
    url = f'https://modrinth.com/mods?q={mod_name}&page={pages}'
    driver = webdriver.Chrome(options=chrome_options)
    driver.get(url)
    time.sleep(1.5)
    html = driver.page_source
    driver.quit()

    soup = BeautifulSoup(html, 'html.parser')
    article_tags = soup.find_all('article', class_='project-card base-card padding-bg')
    result = []
    for a in article_tags:
        a_tag = a.find('a', href=True)
        if a_tag:
            href = a_tag['href']
            name = a_tag['title']
        result.append((name, href))

    return result

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
