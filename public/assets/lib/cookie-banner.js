(function () {
	var KEY = 'neeka_ga';
	var cfg = window.NEEKA_GA;
	if (!cfg || !cfg.id) return;

	function readChoice() {
		var m = document.cookie.match(/(?:^|; )neeka_ga=([^;]*)/);
		return m ? decodeURIComponent(m[1]) : '';
	}

	function writeChoice(value) {
		document.cookie = KEY + '=' + value + '; Max-Age=31536000; Path=/; SameSite=Lax';
	}

	function loadGa() {
		if (window.gtag) return;
		var s = document.createElement('script');
		s.async = true;
		s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.id);
		document.head.appendChild(s);
		window.dataLayer = window.dataLayer || [];
		window.gtag = function () { dataLayer.push(arguments); };
		gtag('js', new Date());
		gtag('config', cfg.id, {
			page_path: cfg.path || location.pathname,
			page_title: cfg.title || document.title
		});
	}

	function hide(el) {
		if (el && el.parentNode) el.parentNode.removeChild(el);
	}

	function showBanner() {
		if (document.querySelector('.cookie-notice')) return;
		var bar = document.createElement('div');
		bar.className = 'cookie-notice';
		bar.setAttribute('role', 'dialog');
		bar.setAttribute('aria-label', 'Cookies');
		bar.innerHTML =
			'<div class="cn-inner">' +
				'<p>Coletamos e processamos suas informações pessoais para os seguintes propósitos: Preferências e Estatísticas. Para aprender mais, por favor leia nossa <a href="/politica-de-privacidade">política de privacidade</a>.</p>' +
				'<div class="cn-buttons">' +
					'<button type="button" class="cn-btn cn-btn-refuse">Recusar</button>' +
					'<button type="button" class="cn-btn cn-btn-accept">Aceitar</button>' +
				'</div>' +
			'</div>';
		bar.querySelector('.cn-btn-accept').onclick = function () {
			writeChoice('1');
			hide(bar);
			loadGa();
		};
		bar.querySelector('.cn-btn-refuse').onclick = function () {
			writeChoice('0');
			hide(bar);
		};
		document.body.appendChild(bar);
	}

	var choice = readChoice();
	if (choice === '1') loadGa();
	else if (choice !== '0') showBanner();
})();
