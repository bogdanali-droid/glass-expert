(function(){
  const KEY = 'vg-cookies-v1';
  if (localStorage.getItem(KEY)) return;
  const lang = (document.documentElement.lang || 'ro').toLowerCase();
  const t = lang.startsWith('en') ? {
    title: 'We use cookies',
    body: 'This site uses functional cookies and anonymous analytics to improve your experience. See our',
    link: 'privacy policy',
    href: '/vagoglass/en/privacy.html',
    accept: 'Accept all',
    reject: 'Essential only'
  } : {
    title: 'Folosim cookie-uri',
    body: 'Acest site folosește cookie-uri funcționale și analize anonime pentru a îmbunătăți experiența ta. Vezi',
    link: 'politica de confidențialitate',
    href: '/vagoglass/privacy.html',
    accept: 'Accept toate',
    reject: 'Doar esențiale'
  };
  const el = document.createElement('div');
  el.className = 'cookie-banner';
  el.setAttribute('role','dialog');
  el.setAttribute('aria-live','polite');
  el.innerHTML =
    '<div class="cookie-banner-text">' +
      '<strong>' + t.title + '</strong>' +
      t.body + ' <a href="' + t.href + '">' + t.link + '</a>.' +
    '</div>' +
    '<div class="cookie-banner-actions">' +
      '<button class="cookie-btn-reject" type="button">' + t.reject + '</button>' +
      '<button class="cookie-btn-accept" type="button">' + t.accept + '</button>' +
    '</div>';
  document.body.appendChild(el);
  const close = (choice) => {
    localStorage.setItem(KEY, JSON.stringify({choice, ts: Date.now()}));
    el.classList.add('hide');
    setTimeout(()=>el.remove(), 220);
  };
  el.querySelector('.cookie-btn-accept').addEventListener('click', ()=>close('accept'));
  el.querySelector('.cookie-btn-reject').addEventListener('click', ()=>close('reject'));
})();
