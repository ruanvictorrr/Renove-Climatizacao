// Header fica sólido ao rolar
const topbar = document.querySelector('.topbar');
const onScroll = () => topbar.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Revelar elementos ao entrar na tela
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Termostato do hero: 31°C -> 22°C
const tempValue = document.getElementById('tempValue');
const tempBar = document.getElementById('tempBar');
if (tempValue) {
  const from = 31, to = 22;
  let t = from;
  const tick = () => {
    tempValue.textContent = t;
    tempBar.style.width = `${((t - to) / (from - to)) * 80 + 20}%`;
    if (t > to) { t -= 1; setTimeout(tick, 380); }
  };
  setTimeout(tick, 900);
}

// Calculadora de BTU
const form = document.getElementById('btuForm');
if (form) {
  const area = form.querySelector('#area');
  const pessoas = form.querySelector('#pessoas');
  const elet = form.querySelector('#eletronicos');
  const out = {
    area: document.getElementById('areaOut'),
    pessoas: document.getElementById('pessoasOut'),
    elet: document.getElementById('eletOut'),
    btu: document.getElementById('btuOut'),
    type: document.getElementById('typeOut'),
  };
  const cta = document.getElementById('calcCta');
  const tamanhos = [9000, 12000, 18000, 24000, 30000, 36000, 48000, 60000];
  const fmt = (n) => n.toLocaleString('pt-BR');

  const calc = () => {
    const a = +area.value, p = +pessoas.value, e = +elet.value;
    const sol = form.querySelector('input[name="sol"]:checked').value === '1';
    const bruto = a * (sol ? 800 : 600) + Math.max(p - 1, 0) * 600 + e * 600;
    const btu = tamanhos.find((s) => s >= bruto);

    out.area.textContent = `${a} m²`;
    out.pessoas.textContent = p;
    out.elet.textContent = e;

    let tipo, texto;
    if (!btu) {
      tipo = 'Projeto sob medida';
      out.btu.textContent = `+${fmt(60000)}`;
      texto = `mais de 60.000 BTUs (projeto sob medida)`;
    } else {
      tipo = btu >= 30000 ? 'Cassete ou piso-teto' : btu >= 24000 ? 'Split ou cassete' : 'Split Hi-Wall';
      out.btu.textContent = fmt(btu);
      texto = `${fmt(btu)} BTUs (${tipo})`;
    }
    out.type.textContent = tipo;

    const msg = `Olá! Fiz a simulação no site da Renove: ambiente de ${a} m², ${p} pessoa(s), ${e} eletrônico(s), ${sol ? 'com' : 'sem'} sol da tarde. Resultado: ${texto}. Podem me passar um orçamento?`;
    cta.href = `https://wa.me/5581979114549?text=${encodeURIComponent(msg)}`;
  };

  form.addEventListener('input', calc);
  form.addEventListener('submit', (ev) => ev.preventDefault());
  calc();
}

document.getElementById('year').textContent = new Date().getFullYear();
