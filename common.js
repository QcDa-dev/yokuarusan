/* QcDa Project - 共通スクリプト
  (よくある質問・相談さん)
*/

// --- Configuration ---
// このURLは、GAS APIを使用するページ（index, faq, add-question）でのみ使用されます。
const gasWebAppUrl = 'https://script.google.com/macros/s/AKfycby-w3IpCD7YhORJs-Hjpn0c-4bpbFjvR2PBaBDiTOHfbFnXaqKwN0-j-Rf1omuYEnl6Cg/exec';

// --- Hamburger Menu & UI Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');
    const menuOverlay = document.getElementById('menu-overlay');

    // 1. メニュー（nav#menu）が存在する場合、中身を動的に生成する
    if (menu) {
        // HTMLの data-version 属性からバージョン情報を取得
        const version = menu.dataset.version || 'unknown';
        
        // メニューのHTML構造を定義
        menu.innerHTML = `
            <ul class="space-y-4">
                <li><a href="guide.html" target="_blank" class="text-gray-700 hover:text-teal-600">使い方ガイド</a></li>
                <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSckrrhDeGQajywfDx9mnGqzDiT1fUPevqi32mAK1JjutlFSlw/viewform?usp=dialog" target="_blank" class="text-gray-700 hover:text-teal-600">お問い合わせ</a></li>
                <li><a href="release-notes.html" target="_blank" class="text-gray-700 hover:text-teal-600">リリースノート</a></li>
                <li class="pt-4 border-t mt-4"><a href="https://qcda-dev.github.io/HP/index.html" target="_blank" class="text-gray-700 hover:text-teal-600">QcDa Projectについて</a></li>
                <li><a href="https://qcda-dev.github.io/HP/terms-of-service.html" target="_blank" class="text-gray-500 hover:text-teal-500 pl-4 text-sm">利用規約</a></li>
                <li><a href="https://qcda-dev.github.io/HP/community-guidelines.html" target="_blank" class="text-gray-500 hover:text-teal-500 pl-4 text-sm">コミュニティガイドライン</a></li>
            </ul>
            <p class="absolute bottom-4 right-4 text-xs text-gray-400">ver ${version}</p>
        `;
    }

    // 2. メニュー開閉ロジック
    if (menuBtn && menu && menuOverlay) {
        const toggleMenu = () => {
            menu.classList.toggle('closed');
            menuOverlay.classList.toggle('hidden');
        };

        menuBtn.addEventListener('click', toggleMenu);
        menuOverlay.addEventListener('click', toggleMenu);
    }
});

// --- API Communication ---
// この関数は、GAS APIを使用するページ（index, faq, add-question）から呼び出されます。
async function callGasApi(action, payload) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.classList.remove('hidden');
    }
    
    try {
        const response = await fetch(gasWebAppUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify({ action, ...payload }),
            mode: 'cors',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        alert('サーバーとの通信中にエラーが発生しました。');
        return null;
    } finally {
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
    }
}
