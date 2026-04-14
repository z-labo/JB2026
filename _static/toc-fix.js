/**
 * toc-fix.js
 * 右サイドバーTOCのハイライトを「現在表示中のセクション」に修正する
 * scroll イベントベースで実装し、テーマのスクロールスパイを上書きする
 */
(function () {
  function init() {
    var article = document.querySelector('.bd-article-container');
    if (!article) return;

    // 記事内の id 付き見出しを取得
    var headings = Array.from(
      article.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')
    );
    if (!headings.length) return;

    // 右サイドバーの TOC リンクを取得（複数セレクタに対応）
    var navLinks = Array.from(
      document.querySelectorAll(
        '.bd-sidebar-secondary .nav-link, ' +
        '#bd-toc-nav .nav-link, ' +
        '.bd-toc .nav-link'
      )
    );
    if (!navLinks.length) return;

    var OFFSET = 120; // ヘッダーの高さ分のオフセット（px）

    function getCurrentId() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var current = headings[0];

      for (var i = 0; i < headings.length; i++) {
        var top = headings[i].getBoundingClientRect().top + scrollTop;
        if (top <= scrollTop + OFFSET) {
          current = headings[i];
        } else {
          break;
        }
      }
      return current ? current.id : '';
    }

    function updateActive() {
      var id = getCurrentId();
      navLinks.forEach(function (link) {
        var href = link.getAttribute('href') || '';
        var isActive = (href === '#' + id) || href.endsWith('#' + id);
        if (isActive) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    // スクロール時に更新
    window.addEventListener('scroll', updateActive, { passive: true });

    // 初回実行
    updateActive();
  }

  // テーマの JS が完全に読み込まれた後に実行（600ms 待機）
  if (document.readyState === 'complete') {
    setTimeout(init, 600);
  } else {
    window.addEventListener('load', function () {
      setTimeout(init, 600);
    });
  }
})();