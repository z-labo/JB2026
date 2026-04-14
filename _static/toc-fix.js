/**
 * toc-fix.js
 * 右サイドバーTOCのハイライトを「現在表示中のセクション」に修正する
 */
window.addEventListener('load', function () {
  const article = document.querySelector('.bd-article-container');
  if (!article) return;

  // 記事内の id 付き見出しをすべて取得
  const headings = Array.from(
    article.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')
  );
  if (!headings.length) return;

  // 右サイドバーのナビリンクを取得
  const navLinks = document.querySelectorAll(
    '.bd-sidebar-secondary .nav-link, ' +
    '.bd-toc .nav-link, ' +
    '#bd-toc-nav .nav-link'
  );
  if (!navLinks.length) return;

  function setActive(id) {
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href') || '';
      // href が "#id" 形式か、末尾が "#id" で終わる場合にマッチ
      const isActive = href === '#' + id || href.endsWith('#' + id);
      link.classList.toggle('active', isActive);
    });
  }

  // ビューポート上端付近に入った見出しを「現在のセクション」とみなす
  // rootMargin: 上端から -20px ～ 下端から -70% の範囲のみ判定
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      rootMargin: '-20px 0px -70% 0px',
      threshold: 0,
    }
  );

  headings.forEach(function (h) {
    observer.observe(h);
  });
});