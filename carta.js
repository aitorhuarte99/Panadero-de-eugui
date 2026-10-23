/* =====================================================================
   Panadero de Eugui · carta y datos compartidos (portada + pedidos)
   Cambia aquí productos, precios, locales y horarios.
   Necesita imagenes.js cargado antes (define IMG).
   ===================================================================== */

const CONFIG = {
  horario: { desde: 8, hasta: 20, intervaloMin: 30 },
  margenPreparacionMin: 45,
  diasVista: 7,
  regaloDesde: 110,               // compra mínima para regalar la botella
  regaloTexto: 'una botella de Pagos de Araiz roble 2018',
  telefonoPedidos: '948 33 09 13',
  appNombre: 'la app del Panadero de Eugui',
  urlCrearPago: null,             // backend de la pasarela (Redsys / Stripe / Bizum)
  urlGuardarPedido: null          // endpoint donde guardar pedidos
};

const LOCALES = [
  {id:'carlos3', nombre:'Carlos III', dir:'Av. Carlos III, 24 · Pamplona', tel:'948 330 913', img:'local-carlos3'},
  {id:'sanfrancisco', nombre:'Plaza San Francisco', dir:'Plaza San Francisco, 8 · Pamplona', tel:'948 105 315', img:'local-sanfrancisco'},
  {id:'najera', nombre:'García el de Nájera', dir:'Paseo García el de Nájera, 17 · Pamplona', tel:'948 151 724', img:'local-najera'},
  {id:'huarte', nombre:'Huarte', dir:'Calle Intxaurdia, 3 · Huarte', tel:'948 330 913', img:'local-huarte'},
  {id:'corteingles', nombre:'El Corte Inglés', dir:'El Corte Inglés · Pamplona', tel:'', img:'corte-ingles'}
];

const CATEGORIAS = [
  {id:'desayunos',  nombre:'Desayunos y cafetería', desc:'Café tostado en casa, tostadas, bocadillos y algo dulce.'},
  {id:'pan',        nombre:'Panadería',            desc:'Más de 10 variedades de pan de masa madre, horneadas cada día.'},
  {id:'bolleria',   nombre:'Bollería',             desc:'Hojaldres, magdalenas y dulces del obrador.'},
  {id:'reposteria', nombre:'Repostería y tartas',  desc:'Tartas, dulces, hojaldres y miniaturas. Las tartas, con 48 h de antelación.'},
  {id:'llevar',     nombre:'Comida para llevar',   desc:'Menús, asados en horno de leña y cocinados de la casa. Igual que en nuestra carta del asador.'},
  {id:'regalo',     nombre:'Bonos regalo',         desc:'Un desayuno para regalar, para canjear en cualquier local.'}
];

/* Productos.
   p = precio único · o = opciones [{n, p}] (tamaños, raciones, kilos) · sub = apartado dentro de la categoría
   ant = días de antelación mínimos · top = sale en "Favoritos de la casa" (portada)
   Precios de "Comida para llevar": los de la carta de elpanaderodeeugui.com.
   Resto: ORIENTATIVOS, sustituir por los reales. */
const PRODUCTOS = [
  // Desayunos y cafetería
  {id:'d1',cat:'desayunos',n:'Desayuno Panadero',d:'Café o infusión + media tostada de jamón ibérico con tomate.',p:6.50,img:'desayuno-jamon',top:1},
  {id:'d2',cat:'desayunos',n:'Tostada de tomate y queso',d:'Pan de masa madre tostado, tomate natural, queso y aceite de oliva.',p:4.20,img:'tostada-tomate'},
  {id:'d3',cat:'desayunos',n:'Tostada gratinada de queso azul',d:'Pan rústico con queso azul fundido.',p:4.80,img:'tostada-queso',top:1},
  {id:'d4',cat:'desayunos',n:'Capuchino',d:'Con espuma de leche y canela.',p:2.40,img:'capuchino'},
  {id:'d5',cat:'desayunos',n:'Café con leche',d:'Nuestro café, tostado en casa.',p:1.90,img:'cafe'},
  {id:'d6',cat:'desayunos',n:'Bocadillo del día',d:'Pregunta por el relleno de hoy: vegetal, jamón, tortilla…',p:4.50,img:'bocadillos'},
  // Panadería
  {id:'p1',cat:'pan',n:'Barra de masa madre',d:'Corteza crujiente, miga alveolada. 250 g.',p:1.60,img:'barras',top:1},
  {id:'p2',cat:'pan',n:'Torta rústica',d:'Hogaza de fermentación lenta. 500 g.',p:3.80,img:'w-hogaza'},
  {id:'p3',cat:'pan',n:'Bollo de maíz y semillas',d:'Sabroso y con mucha textura.',p:3.20,img:'w-semillas'},
  {id:'p4',cat:'pan',n:'Bollo de pasas y nueces',d:'Ideal con quesos.',p:3.90,img:'w-pasas'},
  {id:'p5',cat:'pan',n:'Bollo integral sin sal',d:'Integral completo, sin sal añadida.',p:3.30,img:'w-integral'},
  // Bollería
  {id:'b1',cat:'bolleria',n:'Napolitana de chocolate',d:'Hojaldre de mantequilla y chocolate.',p:1.80,img:'napolitanas'},
  {id:'b2',cat:'bolleria',n:'Magdalena de chocolate',d:'Esponjosa, hecha en casa.',p:1.60,img:'magdalenas'},
  {id:'b3',cat:'bolleria',n:'Palmera de hojaldre',d:'Caramelizada, crujiente.',p:1.70,img:'w-palmera'},
  {id:'b4',cat:'bolleria',n:'Rosquilla de chocolate',d:'Cubierta de chocolate negro.',p:1.70,img:'w-rosquilla'},
  // Repostería y tartas
  {id:'r1',cat:'reposteria',n:'Tarta de queso',d:'Cremosa, al estilo de la casa. 6-8 raciones.',p:24.00,img:'w-tartaqueso',ant:2},
  {id:'r2',cat:'reposteria',n:'Crema quemada (4 uds.)',d:'Postre individual con caramelo tostado.',p:9.60,img:'cuajadas'},
  {id:'r3',cat:'reposteria',n:'Pastel ruso',d:'Clásico navarro. 6 raciones.',p:22.00,img:'vitrina-dulces',ant:2},

  // Comida para llevar · Menús (carta del asador)
  {id:'m1',cat:'llevar',sub:'Menús para llevar',n:'Menú 1 · Cordero asado',d:'Para 10-12 personas: cordero asado (10-12 raciones), ensalada mixta (10-12 raciones), 36 fritos variados y 12 goshuas tradicionales.',p:305,img:'w-cordero',top:1},
  {id:'m2',cat:'llevar',sub:'Menús para llevar',n:'Menú 2 · ½ cordero asado',d:'Para 5-6 personas: ½ cordero asado (5-6 raciones), ensalada mixta (5-6 raciones), 18 fritos variados y 6 goshuas tradicionales.',p:157,img:'w-cordero'},
  {id:'m3',cat:'llevar',sub:'Menús para llevar',n:'Menú 3 · Gorrín asado',d:'Para 10-12 personas: gorrín asado (10-12 raciones), ensalada mixta (10-12 raciones), 36 fritos variados y 12 goshuas tradicionales.',p:260,img:'w-gorrin'},
  {id:'m4',cat:'llevar',sub:'Menús para llevar',n:'Menú 4 · ½ gorrín asado',d:'Para 5-6 personas: ½ gorrín asado (5-6 raciones), ensalada mixta (5-6 raciones), 18 fritos variados y 6 goshuas tradicionales.',p:130,img:'w-gorrin'},
  {id:'m5',cat:'llevar',sub:'Menús para llevar',n:'Menú 5 · Pollo asado',d:'Para 2-3 personas: pollo asado, ensalada mixta (2-3 raciones), patatas panadera (2 raciones), 9 fritos variados y 3 goshuas tradicionales.',p:52,img:'pollo-asado',top:1},
  {id:'m6',cat:'llevar',sub:'Menús para llevar',n:'Menú 6 · ½ pollo asado',d:'Para 1 persona: ½ pollo asado, ensalada mixta, patatas panadera y 1 goshua tradicional.',p:19,img:'pollo-asado'},
  // Asados en horno de leña
  {id:'a1',cat:'llevar',sub:'Asados',n:'Cordero asado',d:'Asado lentamente en nuestro horno de leña.',img:'w-cordero',o:[{n:'Entero · 10-12 raciones',p:215},{n:'¾ · 7-8 raciones',p:161.25},{n:'½ · 5-6 raciones',p:107.50},{n:'¼ · 2-3 raciones',p:53.75}]},
  {id:'a2',cat:'llevar',sub:'Asados',n:'Cabrito asado',d:'Tierno y jugoso, asado en horno de leña.',img:'w-cabrito',o:[{n:'Entero · 8 raciones',p:195},{n:'¾ · 6 raciones',p:146.25},{n:'½ · 4 raciones',p:97.50},{n:'¼ · 2 raciones',p:48.75}]},
  {id:'a3',cat:'llevar',sub:'Asados',n:'Gorrín asado',d:'Piel crujiente y carne melosa.',img:'w-gorrin',o:[{n:'Entero · 10-12 raciones',p:169},{n:'¾ · 7-8 raciones',p:126.75},{n:'½ · 5-6 raciones',p:84.50},{n:'¼ · 2-3 raciones',p:42.25}]},
  {id:'a4',cat:'llevar',sub:'Asados',n:'Pollo asado',d:'Asado en el día.',img:'pollo-asado',o:[{n:'Entero',p:14},{n:'½ pollo',p:7.50},{n:'Entero con patatas panadera',p:17}]},
  // Guarniciones y tortillas
  {id:'g1',cat:'llevar',sub:'Guarniciones y tortillas',n:'Patatas fritas',d:'Por ración.',p:3.00,img:'w-patfritas'},
  {id:'g2',cat:'llevar',sub:'Guarniciones y tortillas',n:'Patatas panadera',d:'Por ración.',p:3.75,img:'w-panadera'},
  {id:'g3',cat:'llevar',sub:'Guarniciones y tortillas',n:'Fritos variados',d:'Por unidad.',p:1.50,img:'w-fritos'},
  {id:'g4',cat:'llevar',sub:'Guarniciones y tortillas',n:'Tortilla de patatas',d:'8 raciones.',img:'tortilla',top:1,o:[{n:'Normal',p:19.00},{n:'Rellena',p:19.50}]},
  // Cocinados (ración ≈ 250 g)
  {id:'k1',cat:'llevar',sub:'Cocinados · Carnes',n:'Estofado de ternera',d:'Guiso tradicional de la casa.',img:'w-estofado',o:[{n:'Ración (≈250 g)',p:9.85},{n:'1 kg',p:28}]},
  {id:'k2',cat:'llevar',sub:'Cocinados · Carnes',n:'Cordero al chilindrón',d:'Con pimiento choricero, receta navarra.',img:'w-chilindron',o:[{n:'Ración (≈250 g)',p:13},{n:'1 kg',p:39}]},
  {id:'k3',cat:'llevar',sub:'Cocinados · Carnes',n:'Muslos de pavo en salsa',d:'Por unidad.',p:5.00,img:'w-pavo'},
  {id:'k4',cat:'llevar',sub:'Cocinados · Carnes',n:'Carrilleras',d:'Melosas, cocinadas a fuego lento.',img:'w-carrilleras',o:[{n:'Ración (≈250 g)',p:14},{n:'1 kg',p:58}]},
  {id:'k5',cat:'llevar',sub:'Cocinados · Carnes',n:'Albóndigas con tomate',d:'Caseras.',img:'w-albondigas',o:[{n:'Ración (≈250 g)',p:5.50},{n:'1 kg',p:14}]},
  {id:'k6',cat:'llevar',sub:'Cocinados · Pescados',n:'Bonito en fritada',d:'Con tomate y pimiento.',img:'w-bonito',o:[{n:'Ración (≈250 g)',p:7.75},{n:'1 kg',p:27}]},
  {id:'k7',cat:'llevar',sub:'Cocinados · Pescados',n:'Calamares en su tinta',d:'Receta de siempre.',img:'w-calamares',o:[{n:'Ración (≈250 g)',p:10},{n:'1 kg',p:32}]},
  {id:'k8',cat:'llevar',sub:'Cocinados · Pescados',n:'Ajoarriero',d:'Bacalao al ajoarriero, plato navarro.',img:'w-ajoarriero',o:[{n:'Ración (≈250 g)',p:12},{n:'1 kg',p:36}]},
  {id:'k9',cat:'llevar',sub:'Cocinados · Pescados',n:'Bacalao en fritada',d:'Con fritada casera.',img:'w-bacalao',o:[{n:'Ración (≈250 g)',p:7.50},{n:'1 kg',p:27}]},
  {id:'k10',cat:'llevar',sub:'Cocinados · Pasta y arroces',n:'Macarrones',d:'Precio por kilo.',img:'w-macarrones',o:[{n:'1 kg',p:15}]},
  {id:'k11',cat:'llevar',sub:'Cocinados · Pasta y arroces',n:'Spaghetti',d:'Precio por kilo.',img:'w-spaghetti',o:[{n:'1 kg',p:15}]},
  {id:'k12',cat:'llevar',sub:'Cocinados · Pasta y arroces',n:'Canelones',d:'Precio por kilo.',img:'w-canelones',o:[{n:'1 kg',p:18}]},
  {id:'k13',cat:'llevar',sub:'Cocinados · Pasta y arroces',n:'Paella de marisco',d:'Por kilo o paella para 4 personas.',img:'w-paella',o:[{n:'1 kg',p:25},{n:'Paella para 4 personas',p:38}]},
  {id:'k14',cat:'llevar',sub:'Cocinados · Pasta y arroces',n:'Arroz con carne',d:'Por kilo o paella de carne para 4 personas.',img:'w-arrozcarne',o:[{n:'1 kg',p:22},{n:'Paella para 4 personas',p:32}]},
  {id:'k15',cat:'llevar',sub:'Cocinados · Pasta y arroces',n:'Fideuá de marisco',d:'Precio por kilo.',img:'w-fideua',o:[{n:'1 kg',p:25}]},
  {id:'k16',cat:'llevar',sub:'Cocinados · Pasta y arroces',n:'Pastel vegetal',d:'Por raciones.',img:'w-pastelveg',o:[{n:'1 ración',p:3.50},{n:'4 raciones',p:14},{n:'8 raciones',p:28}]},
  // Vinos de la casa (precio orientativo: no figura en la web)
  {id:'v1',cat:'llevar',sub:'Vinos de la casa',n:'1927 Crianza (Shiraz)',d:'Frutas negras y tostados de barrica. Marida con asados. Embotellado por Viña L’Ampara (Lodosa).',p:9.50,img:'vino'},
  {id:'v2',cat:'llevar',sub:'Vinos de la casa',n:'1927 Blanco (Godello)',d:'Floral y de fruta blanca. Marida con pescado, arroces y marisco. Embotellado por Viña L’Ampara (Lodosa).',p:9.50,img:'vino'},

  // Bonos regalo
  {id:'bo1',cat:'regalo',n:'Bono desayuno individual',d:'Un desayuno completo para canjear en cualquier local.',p:8.00,img:'desayuno-jamon'},
  {id:'bo2',cat:'regalo',n:'Bono desayuno para dos',d:'Para compartir sin prisas.',p:15.00,img:'tostadas'}
];
const NOTAS_LLEVAR = 'Raciones de 250 g aproximadamente. El producto envasado tiene un incremento de 1 € sobre el precio de tarifa. Precios sujetos a posibles variaciones.';


/* Fotos de platos de ejemplo: Unsplash (licencia Unsplash, uso libre). Sustituir por fotos propias cuando las haya. */
const CREDITOS_FOTOS = 'Algunas fotos de platos son de ejemplo, de Unsplash (licencia Unsplash, uso libre).';

/* ---------- utilidades ---------- */
const eur = n => n.toFixed(2).replace('.',',')+' €';
const esc = s => String(s??'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const prod = id => PRODUCTOS.find(p => p.id === id);
const img = k => (k && IMG[k]) || '';

/* ---------- cesta compartida (clave "id" o "id~opción") ---------- */
let cesta = {};
try { cesta = JSON.parse(localStorage.getItem('eugui_cesta')||'{}') || {}; } catch(e){ cesta = {}; }
const lineaInfo = key => {
  const [id, oi] = key.split('~'); const p = prod(id); if (!p) return null;
  if (p.o){ const o = p.o[+oi]; if (!o) return null; return {key, p, nombre:p.n, opcion:o.n, precio:o.p}; }
  return {key, p, nombre:p.n, opcion:'', precio:p.p};
};
Object.keys(cesta).forEach(k => { if (!lineaInfo(k) || !(cesta[k] > 0)) delete cesta[k]; });
const guardarCesta = () => { try { localStorage.setItem('eugui_cesta', JSON.stringify(cesta)); } catch(e){} };
const lineas = () => Object.keys(cesta).map(k => ({...lineaInfo(k), q:cesta[k]}));
const nCesta = () => Object.values(cesta).reduce((a,b)=>a+b,0);
const subtotal = () => lineas().reduce((s,l)=>s+l.precio*l.q,0);
const antelacion = () => Math.max(0, ...lineas().map(l => l.p.ant||0));
function sumar(key, d){
  const q = (cesta[key]||0) + d;
  if (q <= 0) delete cesta[key]; else cesta[key] = Math.min(q, 99);
  guardarCesta();
}
