// Externalized app.js - all app logic

// Utilities
function sanitize(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2,'0')).join('');
}

// Crypto helpers for AES-GCM
const SALT = "Codorniz_Veterinaria_Tecoman_Seguro_2023";
async function getKeyMaterial(password) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey('raw', enc.encode(password), {name:'PBKDF2'}, false, ['deriveBits','deriveKey']);
}
async function getCryptoKey(password) {
  const keyMaterial = await getKeyMaterial(password);
  const saltBuffer = new TextEncoder().encode(SALT);
  return crypto.subtle.deriveKey({name:'PBKDF2', salt: saltBuffer, iterations:100000, hash:'SHA-256'}, keyMaterial, {name:'AES-GCM', length:256}, true, ['encrypt','decrypt']);
}
async function encryptData(text, password) {
  const key = await getCryptoKey(password);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(text);
  const encrypted = await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, encoded);
  const encArray = Array.from(new Uint8Array(encrypted));
  const ivArray = Array.from(iv);
  return JSON.stringify({ iv: btoa(String.fromCharCode.apply(null, ivArray)), data: btoa(String.fromCharCode.apply(null, encArray)) });
}
async function decryptData(encryptedStr, password) {
  try {
    const encObj = JSON.parse(encryptedStr);
    const key = await getCryptoKey(password);
    const ivStr = atob(encObj.iv);
    const iv = new Uint8Array(ivStr.length);
    for (let i=0;i<ivStr.length;i++) iv[i] = ivStr.charCodeAt(i);
    const dataStr = atob(encObj.data);
    const encData = new Uint8Array(dataStr.length);
    for (let i=0;i<dataStr.length;i++) encData[i] = dataStr.charCodeAt(i);
    const decrypted = await crypto.subtle.decrypt({name:'AES-GCM', iv}, key, encData);
    return new TextDecoder().decode(decrypted);
  } catch (e) {
    throw new Error('Clave inválida o datos corruptos');
  }
}

// App state
let catalog = [
  { id: 1, name: "Antiparasitario NexGard Spectra (15-30kg)", price: 450, icon: "fa-pill" },
  { id: 2, name: "Alimento Pro Plan Adulto Raza Mediana 3kg", price: 680, icon: "fa-bone" },
  { id: 3, name: "Collar Antipulgas Seresto", price: 950, icon: "fa-dog" },
  { id: 4, name: "Arena para Gato Scooop Away 10kg", price: 320, icon: "fa-cat" },
  { id: 5, name: "Vacuna Multiple", price: 350, icon: "fa-syringe" },
  { id: 6, name: "Shampoo Hipoalergénico Avena", price: 180, icon: "fa-bath" }
];
let cart = [];
let sessionTimer = null;

// DEFAULT ADMIN PROVISION (username + hash only)
// NOTE: This contains ONLY the username and the SHA-256 hash of the password.
// The actual plaintext password is NOT stored here. Provisioning in code
// ensures an admin account exists after deploy; the owner receives the
// plaintext password separately and can change it later.
const DEFAULT_ADMIN_USER = 'admin';
const DEFAULT_ADMIN_HASH = '2c75c64e57b271443c5410f661c3a600a6f107d35ecdb4ef13a595fbc9f5d8f0';

// DOM helpers
function el(tag, attrs={}, children=[]) {
  const d = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v]) => {
    if (k === 'class') d.className = v;
    else if (k === 'html') d.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') d.addEventListener(k.substring(2).toLowerCase(), v);
    else d.setAttribute(k,v);
  });
  (Array.isArray(children)?children:[children]).forEach(c => { 
    if (!c) return; 
    if (typeof c === 'string' || typeof c === 'number') d.appendChild(document.createTextNode(c)); 
    else d.appendChild(c); 
  });
  return d;
}

// UI functions
function toggleMenu() { document.querySelector('.nav-links').classList.toggle('active'); }

function showLoaderTimeout() { window.addEventListener('load', () => setTimeout(()=>document.body.classList.add('loaded'), 4000)); }

function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const adminProducts = JSON.parse(localStorage.getItem('adminCatalog') || '[]');
  const fullCatalog = [...catalog, ...adminProducts];
  fullCatalog.forEach((p) => {
    const card = el('div', { class: 'product-card' }, [
      el('div', { class: 'product-img' }, [
        p.image ? el('img', { src: p.image, alt: p.name }) : el('i', { class: 'fas ' + sanitize(p.icon) })
      ]),
      el('div', { class: 'product-info' }, [
        el('h3', {}, p.name),
        el('p', { class: 'price' }, '$' + parseFloat(p.price).toFixed(2)),
        el('button', { 
          class: 'btn btn-primary', 
          type: 'button', 
          'aria-label': 'Agregar ' + p.name,
          onclick: () => addToCart(encodeURIComponent(p.name), p.price)
        }, [
          el('i', { class: 'fas fa-cart-plus' }),
          ' Agregar'
        ])
      ])
    ]);
    grid.appendChild(card);
  });
}

function addToCart(nameEncoded, price) {
  const name = decodeURIComponent(nameEncoded);
  const existing = cart.find(i=>i.name===name);
  if (existing) existing.qty++; else cart.push({name, price: parseFloat(price), qty:1});
  updateCartUI();
}

function updateCartUI(){ document.getElementById('cartCount').innerText = cart.reduce((s,i)=>s+i.qty,0); }

function toggleCart(){ document.getElementById('cartPanel').classList.toggle('open'); renderCart(); }

function renderCart() {
  const list = document.getElementById('cartItemsList');
  const totalEl = document.getElementById('cartTotalValue');
  if (!list || !totalEl) return;
  list.innerHTML = '';
  if (cart.length === 0) {
    list.appendChild(el('div', { style: 'text-align:center; padding:50px 0; color:var(--text-light);' }, [
      el('i', { class: 'fas fa-shopping-basket', style: 'font-size:3rem; margin-bottom:15px; display:block; opacity:0.2;' }),
      'Tu carrito está vacío'
    ]));
    totalEl.innerText = '$0.00';
    return;
  }
  let total = 0;
  cart.forEach((item, index) => {
    const sub = item.price * item.qty;
    total += sub;
    const row = el('div', { class: 'cart-item' }, [
      el('div', { style: 'flex:1;' }, [
        el('strong', { style: 'display:block; margin-bottom:5px;' }, item.name),
        el('span', { style: 'color:var(--text-light); font-size:0.9rem;' }, `$${item.price.toFixed(2)} x ${item.qty}`)
      ]),
      el('div', { style: 'text-align:right;' }, [
        el('div', { style: 'font-weight:700; color:var(--primary); margin-bottom:5px;' }, `$${sub.toFixed(2)}`),
        el('button', {
          style: 'background:none; border:none; color:var(--error); cursor:pointer; padding:5px;',
          onclick: () => { cart.splice(index, 1); updateCartUI(); renderCart(); }
        }, [el('i', { class: 'fas fa-trash' })])
      ])
    ]);
    list.appendChild(row);
  });
  totalEl.innerText = '$' + total.toFixed(2);
}

function sendWhatsAppOrder(){
  if (cart.length===0){ alert('Tu carrito está vacío.'); return; }
  const itemsText = cart.map(i=>`${i.qty}x ${i.name}`).join(', ');
  const message = `Hola! Quisiera pedir a domicilio: ${itemsText}. Mi dirección es: ___`;
  window.open(`https://wa.me/523131163103?text=${encodeURIComponent(message)}`,'_blank');
}

// Admin product management
function renderAdminProductList(){
  const list = document.getElementById('adminProductList'); list.innerHTML='';
  const adminProducts = JSON.parse(localStorage.getItem('adminCatalog') || '[]');
  if (adminProducts.length===0){ list.appendChild(el('p',{}, 'No hay productos añadidos por admin.')); return; }
  adminProducts.forEach((p, idx)=>{
    const row = el('div',{style:'display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #eee;'});
    const left = el('div',{}, [ el('strong',{}, p.name), el('div',{}, '$' + parseFloat(p.price).toFixed(2)) ]);
    const actions = el('div',{});
    const editBtn = el('button',{class:'btn', style:'margin-right:8px; padding:6px 10px;'}, 'Editar');
    editBtn.addEventListener('click', ()=> editProduct(idx));
    const delBtn = el('button',{class:'btn', style:'background:#e63946; color:white; padding:6px 10px;'}, 'Eliminar');
    delBtn.addEventListener('click', ()=> { if(confirm('Eliminar producto?')) deleteProduct(idx); });
    actions.appendChild(editBtn); actions.appendChild(delBtn);
    row.appendChild(left); row.appendChild(actions); list.appendChild(row);
  });
}

function deleteProduct(index){
  const db = JSON.parse(localStorage.getItem('adminCatalog') || '[]'); db.splice(index,1); localStorage.setItem('adminCatalog', JSON.stringify(db)); renderProducts(); renderAdminProductList();
}

async function editProduct(index){
  const db = JSON.parse(localStorage.getItem('adminCatalog') || '[]');
  const item = db[index];
  const newName = prompt('Nombre del producto:', item.name); if (!newName) return;
  const newPrice = prompt('Precio ($):', item.price); if (!newPrice) return;
  const newIcon = prompt('Icono (fa-dog, fa-cat, fa-syringe):', item.icon || 'fa-box');
  item.name = sanitize(newName); item.price = parseFloat(newPrice); item.icon = sanitize(newIcon);
  // permitir reemplazar imagen creando input temporal
  if (confirm('¿Deseas reemplazar la imagen?')){
    const input = document.createElement('input'); input.type='file'; input.accept='image/*';
    input.onchange = function(){
      const f = input.files[0]; if(!f) return; resizeImageFile(f, 800, dataUrl => { item.image = dataUrl; localStorage.setItem('adminCatalog', JSON.stringify(db)); renderProducts(); renderAdminProductList(); alert('Producto actualizado con nueva imagen.'); });
    };
    input.click();
  } else {
    localStorage.setItem('adminCatalog', JSON.stringify(db)); renderProducts(); renderAdminProductList(); alert('Producto actualizado.');
  }
}

// Image resize helper
function resizeImageFile(file, maxWidth, cb){
  const reader = new FileReader();
  reader.onload = function(e){
    const img = new Image(); img.onload = function(){
      const ratio = img.width > maxWidth ? maxWidth / img.width : 1;
      const w = img.width * ratio; const h = img.height * ratio;
      const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d'); ctx.drawImage(img,0,0,w,h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8); cb(dataUrl);
    }; img.src = e.target.result;
  }; reader.readAsDataURL(file);
}

// Forms handlers
function handleAppointment(e){ e.preventDefault(); const owner = sanitize(document.getElementById('ownerName').value); const pet = sanitize(document.getElementById('petName').value); const date = document.getElementById('appDate').value; const msg = document.getElementById('appMsg'); msg.style.display='block'; msg.style.color='var(--success)'; msg.textContent=''; const strong=document.createElement('strong'); strong.textContent=pet; msg.appendChild(document.createTextNode('Cita solicitada para ')); msg.appendChild(strong); msg.appendChild(document.createTextNode(' el día ' + new Date(date).toLocaleString() + '. Te contactaremos pronto.')); e.target.reset(); setTimeout(()=>msg.style.display='none',5000); }

function handleAddProduct(e){ e.preventDefault(); const name = sanitize(document.getElementById('newProdName').value); const price = parseFloat(document.getElementById('newProdPrice').value); const icon = sanitize(document.getElementById('newProdIcon').value); const catalogDB = JSON.parse(localStorage.getItem('adminCatalog') || '[]'); const fileInput = document.getElementById('newProdImage'); const file = fileInput.files && fileInput.files[0]; if (file){ resizeImageFile(file, 800, dataUrl => { catalogDB.push({name, price, icon, image: dataUrl}); localStorage.setItem('adminCatalog', JSON.stringify(catalogDB)); document.getElementById('addProductForm').reset(); renderProducts(); renderAdminProductList(); alert('Producto añadido al catálogo con imagen.'); }); } else { catalogDB.push({name, price, icon}); localStorage.setItem('adminCatalog', JSON.stringify(catalogDB)); document.getElementById('addProductForm').reset(); renderProducts(); renderAdminProductList(); alert('Producto añadido al catálogo.'); } }

async function handleSavePet(e){ e.preventDefault(); const id = sanitize(document.getElementById('newPetId').value.trim()); const name = sanitize(document.getElementById('newPetName').value); const vaccines = sanitize(document.getElementById('newPetVaccines').value); const history = sanitize(document.getElementById('newPetHistory').value); const recs = sanitize(document.getElementById('newPetRecs').value); const rawData = JSON.stringify({name, vaccines, history, recs}); try{ const encryptedStr = await encryptData(rawData, id); localStorage.setItem(`pet_${id}`, encryptedStr); const msg = document.getElementById('petSaveMsg'); msg.textContent = 'Ficha guardada de forma segura 🔒'; msg.style.color = 'var(--primary)'; msg.style.display='block'; e.target.reset(); setTimeout(()=>msg.style.display='none',3000); } catch(err){ alert('Error al cifrar los datos: ' + err); } }

async function handlePortal(e){ e.preventDefault(); const id = sanitize(document.getElementById('petSearchId').value.trim()); const err = document.getElementById('portalErr'); const res = document.getElementById('patientDataResult'); err.style.display='none'; res.style.display='none'; const encryptedRecord = localStorage.getItem(`pet_${id}`); if (!encryptedRecord){ err.innerText = 'No se encontraron registros para ese ID.'; err.style.display='block'; return; } try{ const decryptedStr = await decryptData(encryptedRecord, id); const data = JSON.parse(decryptedStr); document.getElementById('resPetName').textContent = data.name; const vacList = document.getElementById('resVaccines'); vacList.innerHTML=''; data.vaccines.split(',').forEach(v=>{ const li = document.createElement('li'); li.textContent = v.trim(); vacList.appendChild(li); }); document.getElementById('resHistory').textContent = data.history || 'Sin registros.'; document.getElementById('resRecs').textContent = data.recs || 'Sin recomendaciones activas.'; res.style.display='block'; } catch(error){ console.error(error); err.innerText = 'Error: Acceso denegado o datos corruptos.'; err.style.display='block'; } }

// Admin login & setup
// setupAdmin removed for security: admin must be provisioned explicitly by owner.

async function handleAdminLogin(e){
  e.preventDefault();
  const user = sanitize(document.getElementById('adminUser').value);
  const pass = document.getElementById('adminPass').value;
  const err = document.getElementById('loginErr');

  let lockout = localStorage.getItem('adminLockout');
  if (lockout && Date.now() < parseInt(lockout)){
    let timeLeft = Math.ceil((parseInt(lockout) - Date.now()) / 60000);
    err.innerText = `Cuenta bloqueada. Intente en ${timeLeft} min.`;
    err.style.display='block';
    return;
  }

  const inputHash = await sha256(pass);
  const storedUser = localStorage.getItem('adminUser') || DEFAULT_ADMIN_USER;
  const storedHash = localStorage.getItem('adminHash') || DEFAULT_ADMIN_HASH;

  if (user === storedUser && inputHash === storedHash){
    localStorage.setItem('adminAttempts','0');
    const randomBuffer = new Uint8Array(32);
    window.crypto.getRandomValues(randomBuffer);
    const token = Array.from(randomBuffer).map(b=>b.toString(16).padStart(2,'0')).join('');
    sessionStorage.setItem('adminToken', token);
    closeAdminLogin();
    resetSessionTimer();
    document.getElementById('adminPanel').classList.add('active');
    renderAdminProductList();
  } else {
    let attempts = parseInt(localStorage.getItem('adminAttempts') || '0') + 1;
    localStorage.setItem('adminAttempts', attempts.toString());
    if (attempts >=5){
      localStorage.setItem('adminLockout', (Date.now() + 15*60000).toString());
      err.innerText = '5 intentos fallidos. Panel bloqueado por 15 minutos.';
    } else {
      err.innerText = `Credenciales incorrectas. Intentos: ${attempts}/5`;
    }
    err.style.display='block';
  }
}

function openAdminLogin(ev){ if(ev) ev.preventDefault(); const token = sessionStorage.getItem('adminToken'); if (token){ resetSessionTimer(); document.getElementById('adminPanel').classList.add('active'); renderAdminProductList(); } else { document.getElementById('loginModal').classList.add('active'); document.getElementById('adminUser').focus(); } }
function closeAdminLogin(){ document.getElementById('loginModal').classList.remove('active'); document.getElementById('adminLoginForm').reset(); document.getElementById('loginErr').style.display='none'; }
function resetSessionTimer(){ if(sessionTimer) clearTimeout(sessionTimer); sessionTimer = setTimeout(logoutAdmin, 30*60000); }
function logoutAdmin(){ sessionStorage.removeItem('adminToken'); if(sessionTimer) clearTimeout(sessionTimer); document.getElementById('adminPanel').classList.remove('active'); alert('Sesión cerrada por seguridad.'); }

// Activity listeners for admin panel
function bindAdminActivity(){ const panel = document.getElementById('adminPanel'); panel.addEventListener('mousemove', ()=>{ if(sessionStorage.getItem('adminToken')) resetSessionTimer(); }); panel.addEventListener('keydown', ()=>{ if(sessionStorage.getItem('adminToken')) resetSessionTimer(); }); }

// Change password flow
function openChangePasswordModal(ev){ if(ev) ev.preventDefault(); const token = sessionStorage.getItem('adminToken'); if(!token){ openAdminLogin(); return; } const modal = document.getElementById('changePassModal'); if(modal) { modal.classList.add('active'); const cur = document.getElementById('currentPass'); if(cur) cur.focus(); } }
function closeChangePasswordModal(){ const modal = document.getElementById('changePassModal'); if(modal) modal.classList.remove('active'); const form = document.getElementById('changePassForm'); if(form) form.reset(); const err = document.getElementById('changePassErr'); if(err) { err.style.display='none'; err.innerText=''; } }
async function handleChangePassword(e){ e.preventDefault(); const token = sessionStorage.getItem('adminToken'); if(!token){ alert('Debes iniciar sesión para cambiar la contraseña.'); closeChangePasswordModal(); return; } const current = document.getElementById('currentPass').value; const newP = document.getElementById('newPass').value; const confirmP = document.getElementById('confirmNewPass').value; const err = document.getElementById('changePassErr'); err.style.display='none'; if(newP !== confirmP){ err.innerText='Las contraseñas no coinciden.'; err.style.display='block'; return; } if(newP.length < 8){ err.innerText='La contraseña debe tener al menos 8 caracteres.'; err.style.display='block'; return; } const storedHash = localStorage.getItem('adminHash') || DEFAULT_ADMIN_HASH; const curHash = await sha256(current); if(curHash !== storedHash){ err.innerText='Contraseña actual incorrecta.'; err.style.display='block'; return; } const newHash = await sha256(newP); try{ localStorage.setItem('adminHash', newHash); alert('Contraseña actualizada correctamente. Se cerrará la sesión.'); closeChangePasswordModal(); logoutAdmin(); }catch(ex){ console.error('No se pudo guardar nueva contraseña', ex); err.innerText='Error al guardar. Revisa permisos del navegador.'; err.style.display='block'; } }

// Init bindings
function init(){
  showLoaderTimeout();
  // FAQ
  document.querySelectorAll('.faq-question').forEach(button => { button.addEventListener('click', ()=>{ button.parentElement.classList.toggle('active'); }); });
  // Buttons / UI
  const menuToggle = document.getElementById('menuToggle'); if(menuToggle) menuToggle.addEventListener('click', toggleMenu);
  const adminLink = document.getElementById('adminLink'); if(adminLink) adminLink.addEventListener('click', openAdminLogin);
  const adminFloat = document.getElementById('adminFloat'); if(adminFloat) adminFloat.addEventListener('click', openAdminLogin);
  const cartWidget = document.getElementById('cartWidget'); if(cartWidget) cartWidget.addEventListener('click', toggleCart);
  const closeCartBtn = document.getElementById('closeCartBtn'); if(closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
  const whatsappBtn = document.getElementById('whatsappBtn'); if(whatsappBtn) whatsappBtn.addEventListener('click', sendWhatsAppOrder);
  const loginCancel = document.getElementById('loginCancel'); if(loginCancel) loginCancel.addEventListener('click', closeAdminLogin);
  const logoutBtn = document.getElementById('logoutBtn'); if(logoutBtn) logoutBtn.addEventListener('click', logoutAdmin);

  // Prefill admin username for non-technical users
  try{
    const storedUser = localStorage.getItem('adminUser') || DEFAULT_ADMIN_USER;
    const adminUserInput = document.getElementById('adminUser');
    if(adminUserInput) adminUserInput.value = storedUser;
    const showPass = document.getElementById('showPass');
    if(showPass){
      showPass.addEventListener('change', (e)=>{
        const pass = document.getElementById('adminPass');
        if(pass) pass.type = e.target.checked ? 'text' : 'password';
      });
    }
  }catch(e){ console.warn('No se pudo prefill admin user', e); }

  // Forms
  const appointmentForm = document.getElementById('appointmentForm'); if(appointmentForm) appointmentForm.addEventListener('submit', handleAppointment);
  const addProductForm = document.getElementById('addProductForm'); if(addProductForm) addProductForm.addEventListener('submit', handleAddProduct);
  const adminLoginForm = document.getElementById('adminLoginForm'); if(adminLoginForm) adminLoginForm.addEventListener('submit', handleAdminLogin);
  const addPetForm = document.getElementById('addPetForm'); if(addPetForm) addPetForm.addEventListener('submit', handleSavePet);
  const portalForm = document.getElementById('portalForm'); if(portalForm) portalForm.addEventListener('submit', handlePortal);

  // Change password bindings
  const changePassBtn = document.getElementById('changePassBtn'); if(changePassBtn) changePassBtn.addEventListener('click', openChangePasswordModal);
  const changePassForm = document.getElementById('changePassForm'); if(changePassForm) changePassForm.addEventListener('submit', handleChangePassword);
  const changePassCancel = document.getElementById('changePassCancel'); if(changePassCancel) changePassCancel.addEventListener('click', closeChangePasswordModal);

  

  // Start
  renderProducts(); updateCartUI(); bindAdminActivity();
}

document.addEventListener('DOMContentLoaded', init);
