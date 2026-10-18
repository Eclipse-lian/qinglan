/* ============================================================
 * 青岚 · 多语言支持（9 种语言）
 *   zh-CN 简体中文 / zh-Hant 繁體中文 / en English /
 *   en-GB English (UK) / en-US English (US) / fr Français /
 *   fr-CA Français (Canada) / ja 日本語 / es Español
 * 用法：
 *   1) 页面引入 <script src="assets/js/i18n.js">（或 ../assets/js/i18n.js）
 *   2) 需要翻译的元素加 data-i18n="键名"；表单占位符用 data-i18n-placeholder
 *   3) 页面特有文案：在 i18n.js 之前定义
 *      window.QL_I18N = { '键名': {'zh-CN':'..','zh-Hant':'..','en':'..','en-GB':'..','en-US':'..','fr':'..','fr-CA':'..','ja':'..','es':'..'}, ... }
 *   4) 导航栏语言下拉：#langSwitch 容器内的 #langMenu 与触发器由本脚本自动重建
 * 语言偏好存于 localStorage('ql-lang')。缺失语言的词条回退 en，再回退 zh-CN。
 * ============================================================ */
(function () {
  'use strict';
  var KEY = 'ql-lang';

  /* ---------- 语言定义（flag 为本地 SVG 旗帜图标，避免 emoji 在部分系统显示为字母） ---------- */
  var LANGS = [
    { code: 'zh-CN', name: '简体中文', flag: 'assets/img/flags/zh-cn.svg' },
    { code: 'zh-Hant', name: '繁體中文', flag: 'assets/img/flags/zh-hant.svg' },
    { code: 'en', name: 'English', flag: 'assets/img/flags/en.svg' },
    { code: 'en-GB', name: 'English (UK)', flag: 'assets/img/flags/en-gb.svg' },
    { code: 'en-US', name: 'English (US)', flag: 'assets/img/flags/en-us.svg' },
    { code: 'fr', name: 'Français', flag: 'assets/img/flags/fr.svg' },
    { code: 'fr-CA', name: 'Français (Canada)', flag: 'assets/img/flags/fr-ca.svg' },
    { code: 'ja', name: '日本語', flag: 'assets/img/flags/ja.svg' },
    { code: 'es', name: 'Español', flag: 'assets/img/flags/es.svg' }
  ];

  var saved = localStorage.getItem(KEY);
  var lang = LANGS.some(function (l) { return l.code === saved; }) ? saved : 'zh-CN';

  /* 旗帜路径可配置前缀：根页面默认 ''；子目录页在 <head> 设 window.QL_FLAG_BASE='../' 即可 */
  var flagBase = (typeof window.QL_FLAG_BASE === 'string' && window.QL_FLAG_BASE) ? window.QL_FLAG_BASE : '';

  function langInfo(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return LANGS[i];
    return LANGS[0];
  }

  /* ---------- 全局通用字典（9 语言） ---------- */
  var DICT = {
    /* 导航 */
    'nav.home': { 'zh-CN': '首页', 'zh-Hant': '首頁', en: 'Home', 'en-GB': 'Home', 'en-US': 'Home', fr: 'Accueil', 'fr-CA': 'Accueil', ja: 'ホーム', es: 'Inicio' },
    'nav.about': { 'zh-CN': '关于', 'zh-Hant': '關於', en: 'About', 'en-GB': 'About', 'en-US': 'About', fr: 'À propos', 'fr-CA': 'À propos', ja: 'について', es: 'Sobre' },
    'nav.works': { 'zh-CN': '作品', 'zh-Hant': '作品', en: 'Works', 'en-GB': 'Works', 'en-US': 'Works', fr: 'Œuvres', 'fr-CA': 'Œuvres', ja: '作品集', es: 'Obras' },
    'nav.friends': { 'zh-CN': '友情链接', 'zh-Hant': '友情連結', en: 'Friends', 'en-GB': 'Friends', 'en-US': 'Friends', fr: 'Amis', 'fr-CA': 'Amis', ja: 'リンク', es: 'Amigos' },
    'nav.contact': { 'zh-CN': '联系我们', 'zh-Hant': '聯絡我們', en: 'Contact', 'en-GB': 'Contact', 'en-US': 'Contact', fr: 'Contact', 'fr-CA': 'Contact', ja: 'お問い合わせ', es: 'Contacto' },
    'nav.tools': { 'zh-CN': '实用工具', 'zh-Hant': '實用工具', en: 'Tools', 'en-GB': 'Tools', 'en-US': 'Tools', fr: 'Outils', 'fr-CA': 'Outils', ja: 'ツール', es: 'Herramientas' },
    'tools.t1': { 'zh-CN': '函数绘图', 'zh-Hant': '函數繪圖', en: 'Function Plot', 'en-GB': 'Function Plot', 'en-US': 'Function Plot', fr: 'Tracé de fonction', 'fr-CA': 'Tracé de fonction', ja: '関数描画', es: 'Gráfica de función' },
    'tools.t2': { 'zh-CN': '随机数生成', 'zh-Hant': '隨機數生成', en: 'Random Number', 'en-GB': 'Random Number', 'en-US': 'Random Number', fr: 'Nombre aléatoire', 'fr-CA': 'Nombre aléatoire', ja: '乱数生成', es: 'Número aleatorio' },
    'tools.t3': { 'zh-CN': '单位换算', 'zh-Hant': '單位換算', en: 'Unit Converter', 'en-GB': 'Unit Converter', 'en-US': 'Unit Converter', fr: 'Convertisseur d\'unités', 'fr-CA': 'Convertisseur d\'unités', ja: '単位換算', es: 'Conversor de unidades' },
    'tools.t4': { 'zh-CN': '倒计时 · 番茄钟', 'zh-Hant': '倒計時 · 番茄鐘', en: 'Countdown · Pomodoro', 'en-GB': 'Countdown · Pomodoro', 'en-US': 'Countdown · Pomodoro', fr: 'Compte à rebours · Pomodoro', 'fr-CA': 'Compte à rebours · Pomodoro', ja: 'カウントダウン・ポモドーロ', es: 'Cuenta atrás · Pomodoro' },
    'tools.t5': { 'zh-CN': '密码生成', 'zh-Hant': '密碼生成', en: 'Password Generator', 'en-GB': 'Password Generator', 'en-US': 'Password Generator', fr: 'Générateur de mots de passe', 'fr-CA': 'Générateur de mots de passe', ja: 'パスワード生成', es: 'Generador de contraseñas' },
    'tools.t6': { 'zh-CN': '文本统计', 'zh-Hant': '文本統計', en: 'Text Statistics', 'en-GB': 'Text Statistics', 'en-US': 'Text Statistics', fr: 'Statistiques de texte', 'fr-CA': 'Statistiques de texte', ja: 'テキスト統計', es: 'Estadísticas de texto' },
    'tools.t7': { 'zh-CN': '文本编辑器', 'zh-Hant': '文本編輯器', en: 'Text Editor', 'en-GB': 'Text Editor', 'en-US': 'Text Editor', fr: 'Éditeur de texte', 'fr-CA': 'Éditeur de texte', ja: 'テキストエディタ', es: 'Editor de texto' },
    'nav.tribute': { 'zh-CN': '赞赏支持', 'zh-Hant': '贊賞支持', en: 'Support', 'en-GB': 'Support', 'en-US': 'Support', fr: 'Soutien', 'fr-CA': 'Soutien', ja: '支援', es: 'Apoyo' },

    /* 面包屑 */
    'crumb.home': { 'zh-CN': '首页', 'zh-Hant': '首頁', en: 'Home', 'en-GB': 'Home', 'en-US': 'Home', fr: 'Accueil', 'fr-CA': 'Accueil', ja: 'ホーム', es: 'Inicio' },
    'crumb.about': { 'zh-CN': '关于', 'zh-Hant': '關於', en: 'About', 'en-GB': 'About', 'en-US': 'About', fr: 'À propos', 'fr-CA': 'À propos', ja: 'について', es: 'Sobre' },
    'crumb.works': { 'zh-CN': '作品', 'zh-Hant': '作品', en: 'Works', 'en-GB': 'Works', 'en-US': 'Works', fr: 'Œuvres', 'fr-CA': 'Œuvres', ja: '作品集', es: 'Obras' },
    'crumb.friends': { 'zh-CN': '友情链接', 'zh-Hant': '友情連結', en: 'Friends', 'en-GB': 'Friends', 'en-US': 'Friends', fr: 'Amis', 'fr-CA': 'Amis', ja: 'リンク', es: 'Amigos' },
    'crumb.contact': { 'zh-CN': '联系我们', 'zh-Hant': '聯絡我們', en: 'Contact Us', 'en-GB': 'Contact Us', 'en-US': 'Contact Us', fr: 'Contact', 'fr-CA': 'Contact', ja: 'お問い合わせ', es: 'Contacto' },
    'crumb.tribute': { 'zh-CN': '赞赏支持', 'zh-Hant': '贊賞支持', en: 'Support', 'en-GB': 'Support', 'en-US': 'Support', fr: 'Soutien', 'fr-CA': 'Soutien', ja: '支援', es: 'Apoyo' },

    /* 页脚 */
    'foot.lead': {
      'zh-CN': '青岚，取青出于蓝之意，寄山水澄明之愿。以青蓝为底，古意为魂，愿以此一隅素净天地，与君共赏四时清趣。',
      'zh-Hant': '青嵐，取青出於藍之意，寄山水澄明之願。以青藍為底，古意為魂，願以此一隅素淨天地，與君共賞四時清趣。',
      en: 'Qinglan, named after "indigo from the blue", aspires to a limpid realm of ink and azure — where ancient charm forms the soul, and a quiet corner of serenity awaits your four-season delight.',
      'en-GB': 'Qinglan, named after "indigo from the blue", aspires to a limpid realm of ink and azure — where ancient charm forms the soul, and a quiet corner of serenity awaits your four-season delight.',
      'en-US': 'Qinglan, named after "indigo from the blue", aspires toward a limpid realm of ink and azure — where ancient charm forms the soul, and a quiet corner of serenity awaits your four-season delight.',
      fr: 'Qinglan, nommé d\'après « l\'indigo tiré du bleu », aspire à un royaume limpide d\'encre et d\'azur — où le charme ancien forme l\'âme, et où un coin serein vous attend pour les délices des quatre saisons.',
      'fr-CA': 'Qinglan, nommé d\'après « l\'indigo tiré du bleu », aspire à un royaume limpide d\'encre et d\'azur — où le charme ancien forme l\'âme, et où un coin tranquille vous attend pour les délices des quatre saisons.',
      ja: '青嵐は「藍は藍より青し」にちなみ、墨と藍の澄んだ世界を願う。古意を魂とし、青藍を基調とした静かな天地で、四季の趣を共に楽しんでほしい。',
      es: 'Qinglan, nombrado por «el índigo extraído del azul», aspira a un reino límpido de tinta y azur, donde el encanto antiguo es el alma y un rincón sereno aguarda tus delicias de las cuatro estaciones.'
    },
    'foot.col1': { 'zh-CN': '驻足', 'zh-Hant': '駐足', en: 'Stroll', 'en-GB': 'Stroll', 'en-US': 'Stroll', fr: 'Flâner', 'fr-CA': 'Flâner', ja: '立ち止まる', es: 'Detenerse' },
    'foot.col2': { 'zh-CN': '清谈', 'zh-Hant': '清談', en: 'Dialogue', 'en-GB': 'Dialogue', 'en-US': 'Dialogue', fr: 'Entretien', 'fr-CA': 'Entretien', ja: '談話', es: 'Conversación' },
    'foot.col3': { 'zh-CN': '四时', 'zh-Hant': '四時', en: 'Seasons', 'en-GB': 'Seasons', 'en-US': 'Seasons', fr: 'Saisons', 'fr-CA': 'Saisons', ja: '四季', es: 'Estaciones' },
    'foot.home': { 'zh-CN': '首页', 'zh-Hant': '首頁', en: 'Home', 'en-GB': 'Home', 'en-US': 'Home', fr: 'Accueil', 'fr-CA': 'Accueil', ja: 'ホーム', es: 'Inicio' },
    'foot.about': { 'zh-CN': '关于我们', 'zh-Hant': '關於我們', en: 'About Us', 'en-GB': 'About Us', 'en-US': 'About Us', fr: 'À propos', 'fr-CA': 'À propos', ja: '私たちについて', es: 'Sobre nosotros' },
    'foot.works': { 'zh-CN': '作品集', 'zh-Hant': '作品集', en: 'Works', 'en-GB': 'Works', 'en-US': 'Works', fr: 'Œuvres', 'fr-CA': 'Œuvres', ja: '作品集', es: 'Obras' },
    'foot.contact': { 'zh-CN': '联系我们', 'zh-Hant': '聯絡我們', en: 'Contact Us', 'en-GB': 'Contact Us', 'en-US': 'Contact Us', fr: 'Contact', 'fr-CA': 'Contact', ja: 'お問い合わせ', es: 'Contacto' },
    'foot.tribute': { 'zh-CN': '赞赏支持', 'zh-Hant': '贊賞支持', en: 'Support Us', 'en-GB': 'Support Us', 'en-US': 'Support Us', fr: 'Soutenez-nous', 'fr-CA': 'Soutenez-nous', ja: 'ご支援ください', es: 'Apóyanos' },
    'foot.inquire': { 'zh-CN': '来函相询', 'zh-Hant': '來函相詢', en: 'Write to Us', 'en-GB': 'Write to Us', 'en-US': 'Write to Us', fr: 'Écrivez-nous', 'fr-CA': 'Écrivez-nous', ja: 'お便りください', es: 'Escríbenos' },
    'foot.w1': { 'zh-CN': '青山 · 佳篇', 'zh-Hant': '青山 · 佳篇', en: 'Green Hills · Verse', 'en-GB': 'Green Hills · Verse', 'en-US': 'Green Hills · Verse', fr: 'Monts verts · vers', 'fr-CA': 'Monts verts · vers', ja: '青山・佳篇', es: 'Verdes montes · verso' },
    'foot.w2': { 'zh-CN': '碧水 · 清词', 'zh-Hant': '碧水 · 清詞', en: 'Clear Waters · Lyric', 'en-GB': 'Clear Waters · Lyric', 'en-US': 'Clear Waters · Lyric', fr: 'Eaux claires · lyrisme', 'fr-CA': 'Eaux claires · lyrisme', ja: '碧水・清詞', es: 'Aguas claras · lírica' },
    'foot.w3': { 'zh-CN': '归雁 · 长吟', 'zh-Hant': '歸雁 · 長吟', en: 'Wild Geese · Chant', 'en-GB': 'Wild Geese · Chant', 'en-US': 'Wild Geese · Chant', fr: 'Oies sauvages · chant', 'fr-CA': 'Oies sauvages · chant', ja: '帰雁・長吟', es: 'Gansos salvajes · canto' },
    'foot.copyright': {
      'zh-CN': '© 2026 青岚 · 古风雅集', 'zh-Hant': '© 2026 青嵐 · 古風雅集',
      en: '© 2026 Qinglan · Antique Verse', 'en-GB': '© 2026 Qinglan · Antique Verse', 'en-US': '© 2026 Qinglan · Antique Verse',
      fr: '© 2026 Qinglan · Vers antiques', 'fr-CA': '© 2026 Qinglan · Vers antiques', ja: '© 2026 青嵐 · 古風雅集', es: '© 2026 Qinglan · Versos antiguos'
    },
    'foot.slogan': {
      'zh-CN': '山水有清音 · 愿君常驻此青蓝之间',
      'zh-Hant': '山水有清音 · 願君常駐此青藍之間',
      en: 'The hills and streams sing softly; may you linger long amid this azure.',
      'en-GB': 'The hills and streams sing softly; may you linger long amid this azure.',
      'en-US': 'The hills and streams sing softly; may you stay a while amid this azure.',
      fr: 'Les monts et les ruisseaux chantent doucement ; puissiez-vous demeurer longtemps dans cet azur.',
      'fr-CA': 'Les monts et les ruisseaux chantent doucement ; puissiez-vous rester longtemps dans cet azur.',
      ja: '山河に清音あり、この青藍の間に長くとどまらんことを。',
      es: 'Cantan suavemente montes y arroyos; ojalá te quedes mucho en este azul.'
    },

    /* 友邻页通用 */
    'back.friends': { 'zh-CN': '返回友情链接', 'zh-Hant': '返回友情連結', en: 'Back to Friends', 'en-GB': 'Back to Friends', 'en-US': 'Back to Friends', fr: 'Retour aux amis', 'fr-CA': 'Retour aux amis', ja: '友リンクに戻る', es: 'Volver a amigos' },
    'friend.pending': { 'zh-CN': '暂无合作', 'zh-Hant': '暫無合作', en: 'No cooperation yet', 'en-GB': 'No cooperation yet', 'en-US': 'No cooperation yet', fr: 'Aucune collaboration pour l\'instant', 'fr-CA': 'Aucune collaboration pour l\'instant', ja: 'まだ提携はありません', es: 'Aún sin cooperación' },
    'friend.contactUs': { 'zh-CN': '联系我们', 'zh-Hant': '聯絡我們', en: 'Contact Us', 'en-GB': 'Contact Us', 'en-US': 'Contact Us', fr: 'Contactez-nous', 'fr-CA': 'Contactez-nous', ja: 'お問い合わせ', es: 'Contáctanos' },
    'friend.lead': {
      'zh-CN': '此门虚席以待，静候知音。若蒙垂顾，愿结善缘，共赏青蓝。',
      'zh-Hant': '此門虛席以待，靜候知音。若蒙垂顧，願結善緣，共賞青藍。',
      en: 'This gate awaits its guest. Should you favour us, a kind fate shall be sealed beneath the azure.',
      'en-GB': 'This gate awaits its guest. Should you favour us, a kind fate shall be sealed beneath the azure.',
      'en-US': 'This gate awaits its guest. Should you favor us, a kind fate shall be sealed beneath the azure.',
      fr: 'Cette porte attend son hôte. Si vous nous faites la faveur, un heureux destin se scellera sous l\'azur.',
      'fr-CA': 'Cette porte attend son invité. Si vous nous faites la faveur, un heureux destin se scellera sous l\'azur.',
      ja: 'この門は客を待つ。御覧じあらば、青藍の下に善き縁を結ばん。',
      es: 'Esta puerta aguarda a su huésped. Si nos honras, un destino amable se sellará bajo el azur.'
    },
    'friend.title': { 'zh-CN': '友邻之门', 'zh-Hant': '友鄰之門', en: 'Friend\'s Gate', 'en-GB': 'Friend\'s Gate', 'en-US': 'Friend\'s Gate', fr: 'Porte de l\'ami', 'fr-CA': 'Porte de l\'ami', ja: '友隣の門', es: 'Puerta del amigo' },

    /* 支付名称 */
    'pay.wx': { 'zh-CN': '微信', 'zh-Hant': '微信', en: 'WeChat', 'en-GB': 'WeChat', 'en-US': 'WeChat', fr: 'WeChat', 'fr-CA': 'WeChat', ja: '微信', es: 'WeChat' },
    'pay.zfb': { 'zh-CN': '支付宝', 'zh-Hant': '支付寶', en: 'Alipay', 'en-GB': 'Alipay', 'en-US': 'Alipay', fr: 'Alipay', 'fr-CA': 'Alipay', ja: '支付宝', es: 'Alipay' }
  };

  /* ---------- 文本替换 ---------- */
  function tr(key) {
    var map = (window.QL_I18N && window.QL_I18N[key]) || DICT[key];
    if (!map) return null;
    if (map[lang] != null) return map[lang];
    if (map.en != null) return map.en;
    return map['zh-CN'] != null ? map['zh-CN'] : null;
  }

  function htmlLang() {
    document.documentElement.setAttribute('lang', lang);
  }

  function flagHtml(flag) {
    return '<img class="lang-flag-img" src="' + flagBase + flag + '" alt="" loading="lazy">';
  }

  function apply() {
    htmlLang();
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var t = tr(el.getAttribute('data-i18n'));
      if (t != null) el.textContent = t;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var t = tr(el.getAttribute('data-i18n-placeholder'));
      if (t != null) el.setAttribute('placeholder', t);
    });
    /* 含高亮 span 的标题等：用 innerHTML 替换（词典值内嵌 <span class="mark|grad|brush">） */
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var t = tr(el.getAttribute('data-i18n-html'));
      if (t != null) el.innerHTML = t;
    });
    /* meta description：写入 content 属性 */
    document.querySelectorAll('[data-i18n-content]').forEach(function (el) {
      var t = tr(el.getAttribute('data-i18n-content'));
      if (t != null) el.setAttribute('content', t);
    });
    /* 更新导航栏触发器：左旗帜图标 右国家名 */
    var info = langInfo(lang);
    var fl = document.getElementById('langFlag');
    var nm = document.getElementById('langName');
    if (fl) fl.innerHTML = flagHtml(info.flag);
    if (nm) nm.textContent = info.name;
    /* 子菜单当前项高亮 */
    document.querySelectorAll('#langMenu [data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('active', on);
      b.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  }

  /* ---------- 语言切换 ---------- */
  function setLang(code) {
    if (!LANGS.some(function (l) { return l.code === code; })) return;
    lang = code;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    apply();
  }

  /* ---------- 动态重建语言下拉菜单（9 项，左旗右国家） ---------- */
  function buildMenu() {
    var menu = document.getElementById('langMenu');
    var box = document.getElementById('langSwitch');
    var trig = document.getElementById('langTrigger');
    if (menu) {
      menu.innerHTML = '';
      LANGS.forEach(function (l) {
        var li = document.createElement('li');
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('role', 'menuitem');
        b.setAttribute('data-lang', l.code);
        b.setAttribute('aria-checked', 'false');
        var sp = document.createElement('span');
        sp.className = 'lang-flag';
        sp.innerHTML = flagHtml(l.flag);
        var nm = document.createElement('span');
        nm.className = 'lang-name';
        nm.textContent = l.name;
        b.appendChild(sp);
        b.appendChild(nm);
        li.appendChild(b);
        menu.appendChild(li);
        b.addEventListener('click', function () { pick(l.code); });
      });
      /* 事件委托兜底 */
      menu.addEventListener('click', function (e) {
        var b = e.target.closest ? e.target.closest('[data-lang]') : null;
        if (b) pick(b.getAttribute('data-lang'));
      });
    }
    if (trig && box) {
      trig.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = box.classList.toggle('open');
        trig.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.addEventListener('click', function (e) {
        if (!box.contains(e.target)) {
          box.classList.remove('open');
          if (trig) trig.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  function pick(code) {
    setLang(code);
    var box = document.getElementById('langSwitch');
    var trig = document.getElementById('langTrigger');
    if (box) box.classList.remove('open');
    if (trig) trig.setAttribute('aria-expanded', 'false');
  }

  document.addEventListener('DOMContentLoaded', function () { buildMenu(); apply(); });
})();
