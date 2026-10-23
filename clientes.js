/* =====================================================================
   Panadero de Eugui · Acceso de clientes registrados (hostelería)
   Los pedidos A DOMICILIO solo están disponibles para clientes dados de alta
   desde la app del Panadero de Eugui (normalmente restaurantes y bares).

   Con CONFIG.api (carta.js) el acceso se comprueba en el servidor de la app
   (POST /api/login → {token, cliente}) y el usuario de prueba de abajo se ignora.
   ⚠️ Antes de publicar con clientes reales, BORRAR CLIENTES_DEMO de este archivo.
   ===================================================================== */

CONFIG.horarioReparto = CONFIG.horarioReparto || { desde: 7, hasta: 12, intervaloMin: 30 };   // franja de reparto a hostelería

// Cliente de prueba (ficticio) — solo mientras no haya servidor
const CLIENTES_DEMO = [{
  usuario: 'restaurante.demo',
  clave: 'Eugui2026!',
  id: 'C-0001',
  nombre: 'Restaurante Demo',
  contacto: 'Responsable de cocina',
  tel: '600 000 000',
  mail: 'demo@restaurante-ejemplo.es',
  direccion: 'Calle Mayor, 1 (dirección de prueba)',
  cp: '31001', localidad: 'Pamplona',
  condiciones: 'Reparto incluido · factura mensual'
}];

/* ---------- sesión ---------- */
let CLIENTE = null;
try { CLIENTE = JSON.parse(localStorage.getItem('eugui_cliente')||'null'); } catch(e){ CLIENTE = null; }
const esCliente = () => !!CLIENTE;
const categoriasVisibles = () => CATEGORIAS.filter(c => !c.soloClientes || esCliente());

async function iniciarSesion(usuario, clave){
  usuario = usuario.trim().toLowerCase();
  let datos = null;
  if (CONFIG.api){
    try { const r = await api('/api/login', {method:'POST', body:JSON.stringify({usuario, clave})}); datos = {...r.cliente, token:r.token}; }
    catch(e){ if (e.status !== 401) throw e; }
  } else {
    const c = CLIENTES_DEMO.find(x => x.usuario === usuario && x.clave === clave);
    if (c){ const {clave:_, ...resto} = c; datos = resto; }
  }
  if (!datos) return false;
  CLIENTE = datos;
  try { localStorage.setItem('eugui_cliente', JSON.stringify(datos)); } catch(e){}
  if (CONFIG.api) await cargarCarta();     // con sesión el servidor devuelve también la carta de hostelería
  document.dispatchEvent(new CustomEvent('sesion'));
  return true;
}
async function cerrarSesion(){
  if (CONFIG.api && CLIENTE?.token){ try { await api('/api/logout', {method:'POST'}); } catch(e){} }
  CLIENTE = null;
  try { localStorage.removeItem('eugui_cliente'); } catch(e){}
  // fuera de la cesta lo que es solo para clientes
  Object.keys(cesta).forEach(k => { const p = prod(k.split('~')[0]); if (p && CATEGORIAS.find(c => c.id===p.cat)?.soloClientes) delete cesta[k]; });
  guardarCesta();
  if (CONFIG.api){ await cargarCarta(); limpiarCesta(); }
  document.dispatchEvent(new CustomEvent('sesion'));
}

/* ---------- interfaz: botón en la cabecera + ventana de acceso ---------- */
(function montarAcceso(){
  const css = document.createElement('style');
  css.textContent = `
  [hidden]{display:none!important}
  nav.menu a{white-space:nowrap}
  @media (max-width:1300px) and (min-width:981px){nav.menu{gap:14px} nav.menu a{letter-spacing:.06em;font-size:13px} .cuenta-btn{padding:9px 12px}}
  .cuenta-btn{background:var(--oro);color:#fff;border:2px solid var(--oro);border-radius:999px;padding:9px 16px;font:500 14px Oswald,sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;display:flex;gap:8px;align-items:center;margin-left:auto;white-space:nowrap}
  .cuenta-btn:hover{background:var(--oro-osc);border-color:var(--oro-osc)}
  .cuenta-btn.dentro{background:transparent;color:var(--papel)}
  nav.menu + .cuenta-btn{margin-left:0}
  .top .carrito-btn{margin-left:0}
  .cuenta-menu{position:absolute;right:20px;top:72px;background:var(--blanco);color:var(--texto);border-radius:10px;box-shadow:var(--sombra);padding:16px 18px;min-width:260px;z-index:70;display:none}
  .cuenta-menu.on{display:block}
  .cuenta-menu b{font:500 16px Oswald,sans-serif;letter-spacing:.06em;display:block}
  .cuenta-menu small{display:block;color:var(--texto-suave);font-size:13px;margin:2px 0}
  .cuenta-menu .acc{display:flex;flex-direction:column;gap:8px;margin-top:12px}
  .cuenta-menu .acc a,.cuenta-menu .acc button{font:500 13px Oswald,sans-serif;letter-spacing:.1em;text-transform:uppercase;text-align:center;border-radius:999px;padding:9px 12px;cursor:pointer;text-decoration:none;border:1px solid var(--negro);background:var(--negro);color:#fff}
  .cuenta-menu .acc button{background:transparent;color:var(--negro)}
  .top .wrap{position:relative}
  #mLogin label{display:block;font:500 13px Oswald,sans-serif;letter-spacing:.1em;text-transform:uppercase;margin:14px 0 6px}
  #mLogin input{width:100%;font:inherit;padding:12px 14px;border:1px solid #cdbfa9;border-radius:8px;background:var(--blanco)}
  #mLogin .demo{background:#fff4d6;border:1px solid #d9b65b;border-radius:8px;padding:10px 12px;font-size:14px;margin-top:16px}
  #mLogin .err{color:#a3321f;min-height:1.2em;margin:10px 0 0;font-size:14px}
  @media (max-width:980px){.cuenta-btn{margin-left:auto}.cuenta-btn .t{display:none}}
  @media (max-width:600px){.cuenta-menu{top:64px;right:10px;left:10px}}
  `;
  document.head.appendChild(css);

  const carrito = document.querySelector('.top .carrito-btn');
  const btn = document.createElement('button');
  btn.className = 'cuenta-btn'; btn.type = 'button'; btn.id = 'btnCuenta';
  carrito.parentNode.insertBefore(btn, carrito);
  const menu = document.createElement('div');
  menu.className = 'cuenta-menu'; menu.id = 'menuCuenta';
  carrito.parentNode.appendChild(menu);

  const capa = document.createElement('div');
  capa.className = 'capa'; capa.id = 'mLogin'; capa.setAttribute('role','dialog'); capa.setAttribute('aria-modal','true'); capa.setAttribute('aria-labelledby','tLogin');
  capa.innerHTML = `<div class="modal" style="max-width:440px">
    <button class="cerrar" aria-label="Cerrar" onclick="cerrarLogin()">×</button>
    <h2 id="tLogin">Acceso clientes</h2>
    <p class="aviso" style="margin:0">Pedidos a domicilio para restaurantes y hostelería. Solo clientes dados de alta desde la app del Panadero de Eugui.</p>
    <form id="fLogin" autocomplete="on">
      <label for="lUsuario">Usuario</label><input id="lUsuario" name="username" autocomplete="username" required>
      <label for="lClave">Contraseña</label><input id="lClave" name="password" type="password" autocomplete="current-password" required>
      <p class="err" id="lErr"></p>
      <button class="btn" type="submit" style="width:100%">Entrar</button>
    </form>
    <p style="font-size:14px;margin:16px 0 0;color:var(--texto-suave)">¿Aún no tienes cuenta? Pide el alta en cualquiera de nuestros locales o escríbenos a <a href="mailto:info@elpanaderodeeugui.com">info@elpanaderodeeugui.com</a>.</p>
    ${CONFIG.api ? '' : '<p class="demo">Versión de prueba · usuario <b>restaurante.demo</b> · contraseña <b>Eugui2026!</b></p>'}
  </div>`;
  document.body.appendChild(capa);
  capa.addEventListener('click', e => { if (e.target === capa) cerrarLogin(); });
  document.getElementById('fLogin').addEventListener('submit', async e => {
    e.preventDefault();
    let ok = false;
    try { ok = await iniciarSesion(document.getElementById('lUsuario').value, document.getElementById('lClave').value); }
    catch(err){ document.getElementById('lErr').textContent = 'No se ha podido conectar. Inténtalo en unos minutos.'; return; }
    if (!ok){ document.getElementById('lErr').textContent = 'Usuario o contraseña incorrectos.'; return; }
    document.getElementById('fLogin').reset(); document.getElementById('lErr').textContent='';
    cerrarLogin();
  });
  document.addEventListener('keydown', e => { if (e.key==='Escape'){ cerrarLogin(); menu.classList.remove('on'); } });
  document.addEventListener('click', e => { if (!menu.contains(e.target) && e.target.closest('#btnCuenta')===null) menu.classList.remove('on'); });

  function pintar(){
    if (esCliente()){
      btn.classList.add('dentro');
      btn.innerHTML = `<span aria-hidden="true">👤</span><span class="t">${esc(CLIENTE.nombre)}</span>`;
      btn.setAttribute('aria-label','Mi cuenta: '+CLIENTE.nombre);
      btn.onclick = () => menu.classList.toggle('on');
      const enPedidos = /pedidos\.html/.test(location.pathname);
      menu.innerHTML = `<b>${esc(CLIENTE.nombre)}</b><small>${esc(CLIENTE.direccion)}</small><small>${esc(CLIENTE.cp)} ${esc(CLIENTE.localidad)}</small><small>${esc(CLIENTE.condiciones||'')}</small>
        <div class="acc"><a href="${enPedidos?'#hosteleria':'pedidos.html?v=20261023b#hosteleria'}" onclick="document.getElementById('menuCuenta').classList.remove('on')">Pedir pan a domicilio</a><button type="button" onclick="cerrarSesion();document.getElementById('menuCuenta').classList.remove('on')">Cerrar sesión</button></div>`;
    } else {
      btn.classList.remove('dentro');
      btn.innerHTML = `<span aria-hidden="true">🔑</span><span class="t">Acceso clientes</span>`;
      btn.setAttribute('aria-label','Acceso clientes');
      btn.onclick = abrirLogin;
      menu.classList.remove('on');
    }
  }
  document.addEventListener('sesion', pintar);
  pintar();
})();
function abrirLogin(){ const c=document.getElementById('mLogin'); c.classList.add('on'); setTimeout(()=>document.getElementById('lUsuario').focus(),30); }
function cerrarLogin(){ document.getElementById('mLogin')?.classList.remove('on'); }
