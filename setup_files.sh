#!/data/data/com.termux/files/usr/bin/bash
# setup_files.sh - Populates frontend files for GEN-R-L MiLLz project

# Exit immediately if a command exits with a non-zero status.
set -e

echo ">>> Starting file population script..."

# Ensure the script is run from the project root where 'public' exists
if [ ! -d "public" ]; then
    echo "!!! ERROR: 'public' directory not found. Please run this script from the project root: $(pwd)"
    exit 1
fi

# === Write public/index.html ===
echo ">>> Writing public/index.html..."
cat << 'EOF' > public/index.html
<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>COMMUNIQUE :: GEN-R-L MiLLz :: ETERNAL TRANSMISSION</title>
    <link rel="stylesheet" href="style.css">
    <!-- Fonts: Orbitron, Rajdhani, VT323 -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;700&family=VT323&display=swap" rel="stylesheet">
</head>
<body class="standard-grid"> <!-- Default layout class -->
    <div class="parallax-container">
        <!-- Background Layers -->
        <div class="parallax-layer layer-bg-grid-far"></div>
        <div class="parallax-layer layer-bg-grid-mid"></div>
        <div class="parallax-layer layer-bg-elements">
            <!-- Floating geometric shapes or symbols -->
            <div class="floating-element shape-triangle"></div>
            <div class="floating-element shape-ring"></div>
            <div class="floating-element shape-glitchy-square"></div>
        </div>

        <!-- Main Content -->
        <div class="main-content-wrapper">
            <header class="main-header holographic-panel">
                <!-- Glitch text needs data-text attribute matching the content -->
                <h1 class="glitch-text" data-text="GEN-R-L MiLLz">GEN-R-L MiLLz</h1>
                <div class="subtitle">ETERNAL TRANSMISSION :: CYCLE <span id="cycle-number">0</span></div>
                <div class="transmission-date" id="transmission-date">AWAITING CONNECTION...</div>
            </header>

            <main class="content-grid">
                <!-- Modules will be dynamically inserted here by script.js -->
                <div class="content-module placeholder-module">
                    <p>Connecting to MiLLz Central Command...</p>
                    <p>Awaiting data stream...</p>
                </div>
            </main>

            <footer class="main-footer">
                <p id="footer-mantra">// STANDBY FOR TRANSMISSION //</p>
                <p>&copy; <span id="year">20XX</span> MiLLz CENTRAL COMMAND / GEN-RL-M-S-R-E </p>
            </footer>
        </div>
    </div>

    <!-- Load the script that fetches data and renders -->
    <script src="script.js"></script>
</body>
</html>
EOF
echo ">>> DONE: public/index.html"

# === Write public/style.css ===
echo ">>> Writing public/style.css..."
cat << 'EOF' > public/style.css
/* === GEN-R-L MiLLz Maleficarum Styles === */

/* --- Variables & Base --- */
:root { /* Default variables (Can be overridden by styleOverrides from data) */
    --primary-neon: #ff00ff; --secondary-neon: #00ffff; --tertiary-neon: #ffff00;
    --accent-military: #4CAF50; --background-deep: #0d001a; --panel-bg: rgba(20, 0, 40, 0.75);
    --panel-border: var(--secondary-neon); --panel-glow: rgba(0, 255, 255, 0.4);
    --text-color: #e0e0e0; --text-highlight: var(--tertiary-neon); --title-color: var(--primary-neon);
    --grid-color-far: rgba(0, 255, 255, 0.05); --grid-color-mid: rgba(255, 0, 255, 0.1);
    --glitch-intensity: 4px; --glitch-slice-max: 15px; --glitch-chance: 0.8;
    --scanline-opacity: 0.08; --scanline-intensity: 2px; --float-speed: 20s;
    --float-intensity: 15px; --entrance-delay: 0.1s; --holographic-opacity: 0.8;
    --parallax-perspective: 15px; --parallax-z-far: -50px; --parallax-z-mid: -30px; --parallax-z-elements: -10px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; }
body {
    font-family: 'Rajdhani', sans-serif; background-color: var(--background-deep); color: var(--text-color);
    line-height: 1.6; overflow-x: hidden; height: 100vh; overflow-y: scroll; margin: 0;
}

/* --- Fonts --- */
h1, h2, h3, h4, h5, h6 { font-family: 'Orbitron', sans-serif; text-transform: uppercase; margin-bottom: 1rem; letter-spacing: 0.1em; font-weight: 700; }
h1 { font-size: clamp(2.5rem, 6vw, 4.5rem); color: var(--title-color); font-weight: 900; text-shadow: 0 0 5px var(--title-color), 0 0 10px var(--title-color); }
h2.section-title { font-size: clamp(1.1rem, 3vw, 1.6rem); color: var(--secondary-neon); border-bottom: 1px solid var(--secondary-neon); padding-bottom: 0.5rem; margin-bottom: 1.5rem; display: inline-block; text-shadow: 0 0 3px var(--secondary-neon);}
.subtitle { font-family: 'Rajdhani', sans-serif; font-size: clamp(0.9rem, 2vw, 1.2rem); color: var(--text-color); opacity: 0.8; letter-spacing: 0.2em; margin-top: -0.5rem; margin-bottom: 1rem; }
.transmission-date { font-family: 'VT323', monospace; color: var(--accent-military); font-size: 1rem; margin-bottom: 1rem; opacity: 0.9;}
.cipher-text { font-family: 'VT323', monospace; font-size: 1.1rem; line-height: 1.4; color: var(--accent-military); word-break: break-all; opacity: 0.9; border: 1px dashed rgba(255, 255, 0, 0.3); padding: 0.5rem; background: rgba(0,0,0,0.2);}
.cipher-hint { font-family: 'VT323', monospace; font-size: 0.9rem; color: var(--tertiary-neon); opacity: 0.7; margin-top: 0.5rem; }
.module-body p { margin-bottom: 1em; }
.highlight { color: var(--text-highlight); font-weight: bold; text-shadow: 0 0 3px var(--text-highlight); }
.loading-text, .placeholder-module p { font-family: 'VT323', monospace; color: var(--tertiary-neon); animation: blink 1s infinite; text-align: center; opacity: 0.8; }

/* --- Parallax --- */
.parallax-container { height: 100vh; overflow-x: hidden; overflow-y: auto; position: relative; perspective: var(--parallax-perspective); transform-style: preserve-3d; }
.parallax-layer { position: absolute; top: 0; left: 0; right: 0; bottom: 0; min-height: 100%; width: 100%; background-position: center center; background-repeat: repeat; will-change: transform; transform-style: preserve-3d; pointer-events: none; }
.layer-bg-grid-far { background-image: linear-gradient(var(--grid-color-far) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color-far) 1px, transparent 1px); background-size: 80px 80px; transform: translateZ(var(--parallax-z-far)) scale(calc(1 + (var(--parallax-z-far) * -1 / var(--parallax-perspective)))); z-index: 1; }
.layer-bg-grid-mid { background-image: linear-gradient(var(--grid-color-mid) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color-mid) 1px, transparent 1px); background-size: 50px 50px; transform: translateZ(var(--parallax-z-mid)) scale(calc(1 + (var(--parallax-z-mid) * -1 / var(--parallax-perspective)))); z-index: 2; mix-blend-mode: screen; }
.layer-bg-elements { transform: translateZ(var(--parallax-z-elements)) scale(calc(1 + (var(--parallax-z-elements) * -1 / var(--parallax-perspective)))); z-index: 3; }

/* --- Main Content Wrapper --- */
.main-content-wrapper { position: relative; z-index: 10; padding: 2rem clamp(1rem, 5vw, 4rem); max-width: 1200px; margin: 0 auto; background: transparent; }

/* --- Layout Grid --- */
.content-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; margin-top: 3rem; }
/* Layout Template Examples (add more as needed in CSS & AI prompt) */
body.standard-grid .content-grid { grid-template-columns: 1fr; }
body.split-view .content-grid { grid-template-columns: repeat(auto-fit, minmax(min(350px, 100%), 1fr)); }
body.focus-main-aside .content-grid { grid-template-columns: 2fr 1fr; } /* Example */
@media (max-width: 768px) { /* Force single column on smaller screens */
    body.split-view .content-grid, body.focus-main-aside .content-grid { grid-template-columns: 1fr; }
}

.content-module { margin-bottom: 2rem; transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease, opacity 0.4s ease; background-color: rgba(10, 0, 20, 0.5); border: 1px solid rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 4px; }
.small-module { /* For ciphers etc. */ }

/* --- Holographic Panel --- */
.holographic-panel { background-color: var(--panel-bg); border: 1px solid var(--panel-border); padding: 1.5rem; position: relative; box-shadow: 0 0 12px 2px var(--panel-glow), inset 0 0 8px 1px var(--panel-glow); opacity: var(--holographic-opacity); transition: opacity 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease; backdrop-filter: blur(3px); }
.holographic-panel:hover { opacity: 0.95; box-shadow: 0 0 20px 4px var(--panel-glow), inset 0 0 12px 2px var(--panel-glow); }
.panel-corner { position: absolute; width: 10px; height: 10px; border-style: solid; border-color: var(--secondary-neon); }
.corner-tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; } .corner-tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; } .corner-br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; } .corner-bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
.panel-scanline { position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; background-image: repeating-linear-gradient(transparent, transparent var(--scanline-intensity), rgba(0, 0, 0, 0.5) var(--scanline-intensity), rgba(0, 0, 0, 0.5) calc(var(--scanline-intensity) * 2)); background-size: 100% calc(var(--scanline-intensity) * 2); opacity: var(--scanline-opacity); pointer-events: none; animation: scanlines 20s linear infinite; z-index: 1; }
.panel-scanline.intense { --scanline-opacity: calc(var(--scanline-opacity) * 1.5); animation-duration: 10s; }


/* --- Glitch Text Effect --- */
.glitch-text { position: relative; color: var(--text-highlight); animation: glitch-anim-main calc(1.2s / var(--glitch-chance)) infinite linear alternate-reverse; display: inline-block; }
.glitch-text::before, .glitch-text::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; background: var(--background-deep); }
.glitch-text::before { left: var(--glitch-intensity); text-shadow: -2px 0 var(--primary-neon); animation: glitch-anim-1 calc(0.8s / var(--glitch-chance)) infinite linear alternate-reverse; mix-blend-mode: screen; }
.glitch-text::after { left: calc(var(--glitch-intensity) * -1); text-shadow: -2px 0 var(--secondary-neon); animation: glitch-anim-2 calc(0.6s / var(--glitch-chance)) infinite linear alternate-reverse; mix-blend-mode: screen; }

/* --- Floating Background Elements --- */
.floating-element { position: absolute; opacity: 0.08; animation: float var(--float-speed) infinite ease-in-out alternate; will-change: transform; pointer-events: none; }
.shape-triangle { width: 0; height: 0; border-left: 30px solid transparent; border-right: 30px solid transparent; border-bottom: 50px solid var(--secondary-neon); background-color: transparent; top: 20%; left: 10%; animation-delay: -2s; }
.shape-ring { width: 60px; height: 60px; border: 5px solid var(--tertiary-neon); border-radius: 50%; background-color: transparent; top: 60%; right: 15%; animation-delay: -5s; }
.shape-glitchy-square { width: 40px; height: 40px; background-color: var(--primary-neon); top: 40%; left: 70%; animation: float var(--float-speed) infinite ease-in-out alternate, glitch-anim-main 2s infinite linear alternate-reverse; animation-delay: -8s; }

/* --- Content Module Types --- */
.letter-module { border-left: 3px solid var(--accent-military); padding-left: calc(1.5rem + 3px); }
.article-module { /* Add distinct styling if needed */ }
.directive-module { /* Add distinct styling if needed */ }

/* --- Visual Focus --- */
.content-module.has-visual-focus { border: 2px solid var(--tertiary-neon); box-shadow: 0 0 20px 4px var(--tertiary-neon), inset 0 0 10px 2px var(--tertiary-neon); transform: scale(1.02); z-index: 15; }
.holographic-panel.has-visual-focus { --panel-border: var(--tertiary-neon); box-shadow: 0 0 25px 5px var(--tertiary-neon), inset 0 0 15px 3px var(--tertiary-neon); opacity: 0.98; }
.content-module.has-visual-focus::before { content: ':: VISUAL_TARGET ::'; position: absolute; top: -1.5em; left: 50%; transform: translateX(-50%); font-family: 'VT323', monospace; color: var(--tertiary-neon); background-color: var(--background-deep); padding: 0.2em 0.5em; border: 1px solid var(--tertiary-neon); font-size: 0.8rem; z-index: 16; white-space: nowrap; }

/* --- Footer --- */
.main-footer { margin-top: 4rem; padding: 2rem 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center; font-family: 'VT323', monospace; font-size: 0.9rem; color: var(--accent-military); opacity: 0.7; }
.main-footer p { margin-bottom: 0.5em; }

/* --- Animations --- */
@keyframes blink { 50% { opacity: 0.5; } }
@keyframes scanlines { 0% { background-position: 0 0; } 100% { background-position: 0 100%; } }
@keyframes float { from { transform: translateY(calc(var(--float-intensity) * -1)); } to { transform: translateY(var(--float-intensity)); } }
@keyframes glitch-anim-main{0%,100%{clip-path:inset(50% 0 30% 0)}5%{clip-path:inset(10% 0 85% 0)}10%{clip-path:inset(95% 0 1% 0)}15%{clip-path:inset(40% 0 40% 0)}20%{clip-path:inset(80% 0 5% 0)}25%{clip-path:inset(20% 0 75% 0)}30%{clip-path:inset(60% 0 30% 0)}35%{clip-path:inset(90% 0 3% 0)}40%{clip-path:inset(30% 0 60% 0)}45%{clip-path:inset(70% 0 10% 0)}50%{clip-path:inset(15% 0 80% 0)}55%{clip-path:inset(85% 0 10% 0)}60%{clip-path:inset(45% 0 45% 0)}65%{clip-path:inset(5% 0 90% 0)}70%{clip-path:inset(75% 0 15% 0)}75%{clip-path:inset(25% 0 70% 0)}80%{clip-path:inset(65% 0 25% 0)}85%{clip-path:inset(98% 0 1% 0)}90%{clip-path:inset(35% 0 55% 0)}95%{clip-path:inset(77% 0 8% 0)}}
@keyframes glitch-anim-1{0%{transform:translateX(var(--glitch-intensity));clip-path:inset(80% 0 5% 0)}100%{transform:translateX(calc(-1 * var(--glitch-intensity)));clip-path:inset(5% 0 80% 0)}}
@keyframes glitch-anim-2{0%{transform:translateY(var(--glitch-intensity));clip-path:inset(5% 0 90% 0)}100%{transform:translateY(calc(-1 * var(--glitch-intensity)));clip-path:inset(90% 0 5% 0)}}
.animate-entrance { opacity: 0; transform: translateY(20px); animation: fadeInTranslate 0.6s ease-out forwards; }
@keyframes fadeInTranslate { to { opacity: 1; transform: translateY(0); } }

/* --- Utility & Fallback --- */
.no-js .animate-entrance { opacity: 1; transform: translateY(0); }
.error-message { color: #ff5555; font-weight: bold; text-align: center; margin-top: 40px; }

/* --- Responsive --- */
@media (max-width: 768px) {
    html { font-size: 15px; }
    .main-content-wrapper { padding: 1.5rem clamp(0.5rem, 3vw, 1.5rem); }
    .content-grid { gap: 1.5rem; }
    .holographic-panel, .content-module { padding: 1rem; }
    h1 { font-size: clamp(2rem, 5vw, 3rem); }
    h2.section-title { font-size: clamp(1rem, 2.5vw, 1.3rem); }
}
EOF
echo ">>> DONE: public/style.css"

# === Write public/script.js ===
echo ">>> Writing public/script.js..."
# (Content same as previous script.js example)
cat << 'EOF' > public/script.js
// script.js - Handles dynamic content, style injection, and visual focus
document.addEventListener('DOMContentLoaded',()=>{fetchMagazineData();});async function fetchMagazineData(){const apiUrl='/api/current-data';try{const response=await fetch(apiUrl);if(!response.ok)throw new Error(`HTTP error! Status: ${response.status}`);const magazineData=await response.json();renderMagazine(magazineData);}catch(error){console.error("Failed to fetch magazine data:",error);displayLoadError();}}
function renderMagazine(magazineData){console.log("Rendering Cycle:",magazineData.cycleNumber);setTextContent('#cycle-number',magazineData.cycleNumber);setTextContent('#transmission-date',magazineData.transmissionDate);setTextContent('#year',new Date().getFullYear());setTextContent('#footer-mantra',magazineData.footerMantra);const mainGrid=document.querySelector('.content-grid');if(mainGrid){mainGrid.innerHTML='<p class="placeholder-module">Processing Transmission...</p>';document.querySelectorAll('.content-module.has-visual-focus').forEach(el=>el.classList.remove('has-visual-focus'));const layoutConfig=magazineData.layoutConfiguration||{};applyLayoutTemplate(layoutConfig.templateName);let modulesToRender=getOrderedModules(magazineData.mainContent,layoutConfig.moduleOrder);mainGrid.innerHTML='';modulesToRender.forEach((item,index)=>{const moduleElement=createContentModuleElement(item,index);if(moduleElement){if(item.id&&layoutConfig&&layoutConfig.featuredVisualTargetId===item.id){moduleElement.classList.add('has-visual-focus');}
mainGrid.appendChild(moduleElement);}});applyStyleOverrides(magazineData.styleOverrides);document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js-ready');}else{console.error("Main content grid container not found.");}}
function applyLayoutTemplate(templateName='standard-grid'){document.body.className='';document.body.classList.add(templateName||'standard-grid');console.log(`Applying layout template: ${templateName||'standard-grid'}`);}
function getOrderedModules(content,orderArray){if(!orderArray||!Array.isArray(orderArray)||orderArray.length===0){console.log("Using default module order (no valid order array).");return content;}try{const contentMap=new Map(content.map(item=>[item.id,item]));const validOrderIds=orderArray.filter(id=>contentMap.has(id));if(validOrderIds.length!==content.length){console.warn(`Module order array length (${orderArray.length}) or IDs don't match content length (${content.length}). Using default order.`);return content;}
const orderedContent=validOrderIds.map(id=>contentMap.get(id));console.log("Applying custom module order.");return orderedContent;}catch(e){console.error("Error applying module order:",e);return content;}}
function createContentModuleElement(item,index){const section=document.createElement('section');section.id=item.id||`module-${index}-${Date.now()}`;section.className=`content-module ${item.type}-module animate-entrance`;section.style.animationDelay=`calc(var(--entrance-delay, 0.1s) * ${index+1})`;let title='';let bodyContent='';let isHolographic=false;let isSmall=false;switch(item.type){case'directive':title=item.title||'// DIRECTIVE //';bodyContent=item.content||'<p>...</p>';isHolographic=true;section.classList.add('holographic-panel');break;case'article':title=item.title||'// ARCHIVE //';bodyContent=item.content||'<p>...</p>';break;case'letter':title=`// FROM: ${item.sender||'UNIT'} //`;bodyContent=item.content||'<p>...</p>';break;case'cipher':title=item.title||'// ENCRYPTED //';bodyContent=`<div class="cipher-text">${item.content||'...'}</div>`;if(item.decryptionHint)bodyContent+=`<p class="cipher-hint">Hint: ${item.decryptionHint}</p>`;isHolographic=true;isSmall=true;section.classList.add('holographic-panel','small-module');break;default:title=`// TYPE UNKNOWN: ${item.type} //`;bodyContent=`<p>Format unrecognized.</p>`;}
const titleElement=document.createElement('h2');titleElement.className='section-title';titleElement.textContent=title;const bodyElement=document.createElement('div');bodyElement.className='module-body';bodyElement.innerHTML=bodyContent;section.appendChild(titleElement);section.appendChild(bodyElement);if(isHolographic){const corners=`<div class="panel-corner corner-tl"></div><div class="panel-corner corner-tr"></div><div class="panel-corner corner-br"></div><div class="panel-corner corner-bl"></div>`;const scanline=`<div class="panel-scanline ${isSmall?'intense':''}"></div>`;section.insertAdjacentHTML('beforeend',corners+scanline);}
return section;}
function applyStyleOverrides(styleOverrides){if(styleOverrides){const root=document.documentElement;for(const[variable,value]of Object.entries(styleOverrides)){if(variable.startsWith('--')){root.style.setProperty(variable,value);}}}}
function setTextContent(selector,text){const element=document.querySelector(selector);if(element)element.textContent=text??'';}
function displayLoadError(){const grid=document.querySelector('.content-grid');if(grid)grid.innerHTML=`<p class="error-message">SIGNAL LOST. Cannot load transmission data.</p>`;const style=document.createElement('style');style.textContent='.error-message{color:#ff5555;font-weight:bold;text-align:center;margin-top:50px;}';document.head.appendChild(style);}
EOF
echo ">>> DONE: public/script.js"

# === Write public/dashboard.html ===
echo ">>> Writing public/dashboard.html..."
# (Content same as previous dashboard.html example)
cat << 'EOF' > public/dashboard.html
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>GEN-R-L MiLLz - Update Dashboard</title><style>body{font-family:sans-serif;background-color:#1a1a1a;color:#e0e0e0;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;}.container{background-color:#2a2a2a;padding:30px 40px;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.4);text-align:center;max-width:500px;width:90%;}h1{color:#ff00ff;margin-bottom:25px;text-transform:uppercase;letter-spacing:2px;font-size:1.5em;}label{display:block;margin-bottom:10px;font-weight:bold;color:#00ffff;}input[type="file"]{display:block;width:calc(100% - 22px);margin:0 auto 20px auto;padding:10px;border:1px dashed #ccc;border-radius:4px;cursor:pointer;background:#333;}button{background:linear-gradient(to right, #ff00ff, #00ffff);color:#111;border:none;padding:12px 25px;border-radius:5px;font-size:1em;font-weight:bold;text-transform:uppercase;cursor:pointer;transition:transform 0.2s ease, box-shadow 0.2s ease;width:100%;}button:hover{transform:translateY(-2px);box-shadow:0 6px 12px rgba(0, 255, 255, 0.3);}button:active{transform:translateY(0px);box-shadow:0 3px 6px rgba(0, 255, 255, 0.2);}#statusMessage{margin-top:20px;font-weight:bold;min-height:1.2em;word-wrap:break-word;}.success{color:#55ff55;} .error{color:#ff5555;}</style></head><body><div class="container"><h1>Magazine Data Upload</h1><form id="uploadForm" enctype="multipart/form-data"><label for="magazineDataFile">Select Daily JSON File:</label><input type="file" id="magazineDataFile" name="magazineDataFile" accept=".json" required><button type="submit">Upload & Update</button></form><p id="statusMessage"></p></div><script src="dashboard.js"></script></body></html>
EOF
echo ">>> DONE: public/dashboard.html"

# === Write public/dashboard.js ===
echo ">>> Writing public/dashboard.js..."
# (Content same as previous dashboard.js example)
cat << 'EOF' > public/dashboard.js
const form=document.getElementById('uploadForm');const fileInput=document.getElementById('magazineDataFile');const statusMessage=document.getElementById('statusMessage');const submitButton=form.querySelector('button[type="submit"]');form.addEventListener('submit',async(event)=>{event.preventDefault();if(!fileInput.files||fileInput.files.length===0){displayMessage('Please select a JSON file.','error');return;}
const file=fileInput.files[0];const formData=new FormData();formData.append('magazineDataFile',file);displayMessage('Uploading...','');submitButton.disabled=true;try{const response=await fetch('/upload',{method:'POST',body:formData});const result=await response.json();if(response.ok&&result.success){displayMessage(result.message,'success');fileInput.value='';}else{displayMessage(result.message||'Upload failed.','error');}}catch(error){console.error('Upload Error:',error);displayMessage('Network or server error during upload.','error');}finally{submitButton.disabled=false;}});function displayMessage(message,type){statusMessage.textContent=message;statusMessage.className=type;}
EOF
echo ">>> DONE: public/dashboard.js"

echo ""
echo ">>> All files populated successfully!"
echo ">>> Ready for Git commit/push and Azure deployment phases."
echo ""