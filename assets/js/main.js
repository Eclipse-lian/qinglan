/* ============================================================
   青岚 · 古风蓝青色静态站 · 共享脚本
   - 头部滚动态 / 移动端导航
   - 滚动揭示动画（IntersectionObserver）
   - 山峦视差
   - 赞赏面板切换
   - 回到顶部 / 表单占位提示
   ============================================================ */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. 头部滚动态 ---------- */
  var header = document.querySelector(".site-header");
  var toTop = document.querySelector(".to-top");
  function onScrollHeader() {
    if (!header) return;
    var scrolled = window.scrollY > 30;
    header.classList.toggle("scrolled", scrolled);
    if (toTop) toTop.classList.toggle("show", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- 2. 移动端导航 ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    // 点击导航项后关闭抽屉
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- 3. 滚动揭示动画（双向：进入视口显示，离开视口回退） ---------- */
  var revealItems = document.querySelectorAll("[data-reveal]");
  if (revealItems.length) {
    if (prefersReduced) {
      revealItems.forEach(function (el) { el.classList.add("in-view"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          // 进入视口 -> 显示；离开视口（向上或向下）-> 回退隐藏，再次进入重新动画
          en.target.classList.toggle("in-view", en.isIntersecting);
        });
      }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
      revealItems.forEach(function (el, i) {
        // 交错延迟：同一父块内的相邻元素依次浮现
        el.style.setProperty("--d", (i % 6) * 0.08 + "s");
        io.observe(el);
      });
    }
  }

  /* ---------- 4. 描边路径动画（进入视口后描画） ---------- */
  var drawPaths = document.querySelectorAll(".draw-path");
  if (drawPaths.length) {
    var dio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in-view"); dio.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    drawPaths.forEach(function (el) { dio.observe(el); });
  }

  /* ---------- 5. 山峦视差 ---------- */
  var layers = document.querySelectorAll(".mountain-layer");
  if (layers.length && !prefersReduced) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var y = window.scrollY;
          var vh = window.innerHeight;
          // 仅在首屏范围内有效果
          var p = Math.min(y / vh, 1.2);
          layers.forEach(function (layer) {
            var speed = parseFloat(layer.getAttribute("data-speed") || "0");
            layer.style.transform = "translateY(" + (p * speed) + "px)";
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- 6. 赞赏面板切换（单面板内容互斥切换） ---------- */
  document.querySelectorAll("[data-tribute-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-tribute-target");
      var panel = document.querySelector("[data-tribute-panel]");
      if (!panel) return;
      var shown = panel.querySelector('.qr-opt:not(.is-hidden)');
      var target = panel.querySelector('.qr-opt[data-qr="' + id + '"]');
      if (!target || target === shown) return;
      panel.querySelectorAll(".qr-opt").forEach(function (opt) {
        opt.classList.add("is-hidden");
        opt.classList.remove("show");
      });
      target.classList.remove("is-hidden");
      // 重放入场动画
      void target.offsetWidth;
      target.classList.add("show");
    });
  });

  /* ---------- 7. 回到顶部 ---------- */
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  /* ---------- 8. 表单占位提交提示 ---------- */
  document.querySelectorAll("[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.querySelector("[data-form-msg]");
      if (msg) {
        msg.textContent = "承蒙厚意，来函已妥为收讫，青岚将择时奉复。";
        msg.style.opacity = 1;
      }
      form.reset();
    });
  });

  /* ---------- 9. 横向数字波纹装饰（内页页脚山脉可选） ---------- */
  // （无）

  /* ---------- 10. 卡片数字自动加千分位（若存在 .num[data-count]） ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && !prefersReduced) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var target = parseFloat(el.getAttribute("data-count"));
        var dur = 1400, start = null;
        function step(ts) {
          if (!start) start = ts;
          var t = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased).toLocaleString();
          if (t < 1) window.requestAnimationFrame(step);
          else el.textContent = target.toLocaleString();
        }
        window.requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }
})();
