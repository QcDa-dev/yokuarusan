/* QcDa Project - 共通スクリプト
  (よくある質問・相談さん)
*/

// --- Configuration ---
// このURLは、GAS APIを使用するページ（index, faq, add-question）でのみ使用されます。
const gasWebAppUrl = 'https://script.google.com/macros/s/AKfycby-w3IpCD7YhORJs-Hjpn0c-4bpbFjvR2PBaBDiTOHfbFnXaqKwN0-j-Rf1omuYEnl6Cg/exec';

// --- Hamburger Menu ---
// このロジックは全ページで共通です。
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');
    const menuOverlay = document.getElementById('menu-overlay');

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
