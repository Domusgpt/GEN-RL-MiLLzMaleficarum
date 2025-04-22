// script.js - Handles dynamic content, style injection, layout, and visual focus

document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('js-loading');
    document.documentElement.classList.remove('no-js');
    fetchMagazineData();
});

async function fetchMagazineData() {
    const apiUrl = '/api/current-data';
    const mainGrid = document.querySelector('.content-grid');

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) { const errorText = await response.text(); throw new Error(`HTTP ${response.status}: ${errorText || 'Server Error'}`); }
        const magazineData = await response.json();
        if (!magazineData || typeof magazineData !== 'object') { throw new Error("Invalid data format from API."); }
        renderMagazine(magazineData);
    } catch (error) {
        console.error("Failed Fetch/Parse:", error);
        displayLoadError(error.message, mainGrid);
    } finally {
         document.documentElement.classList.remove('js-loading');
         document.documentElement.classList.add('js-ready');
    }
}

function renderMagazine(magazineData) {
    console.log(`Rendering Cycle: ${magazineData.cycleNumber}`);
    setTextContent('#cycle-number', magazineData.cycleNumber);
    setTextContent('#transmission-date', magazineData.transmissionDate);
    setTextContent('#year', new Date().getFullYear());
    setTextContent('#footer-mantra', magazineData.footerMantra);

    const mainGrid = document.querySelector('.content-grid');
    if (!mainGrid) { console.error("Fatal: Main grid not found."); return; }
    mainGrid.innerHTML = ''; // Clear loading/previous
    document.querySelectorAll('.content-module.has-visual-focus').forEach(el => el.classList.remove('has-visual-focus'));

    const layoutConfig = magazineData.layoutConfiguration || {};
    applyLayoutTemplate(layoutConfig.templateName);

    let modulesToRender = getOrderedModules(magazineData.mainContent, layoutConfig.moduleOrder);

    if (!modulesToRender || modulesToRender.length === 0) {
         mainGrid.innerHTML = '<div class="content-module error-message"><p>Empty transmission received.</p></div>';
         console.warn("No modules to render.");
    } else {
        modulesToRender.forEach((item, index) => {
            if (!item || typeof item !== 'object' || !item.id || !item.type) { console.warn(`Skipping invalid item index ${index}:`, item); return; }
            const moduleElement = createContentModuleElement(item, index);
            if (moduleElement) {
                if (item.id === layoutConfig.featuredVisualTargetId) { moduleElement.classList.add('has-visual-focus'); }
                mainGrid.appendChild(moduleElement);
            }
        });
    }
    applyStyleOverrides(magazineData.styleOverrides);
}

function applyLayoutTemplate(templateName) {
    const defaultTemplate = 'standard-grid';
    const finalTemplateName = templateName || defaultTemplate;
    document.body.className = ''; // Clear all body classes first
    document.body.classList.add(finalTemplateName); // Add the layout class
    console.log(`Layout: ${finalTemplateName}`);
}

function getOrderedModules(content = [], orderArray) {
     if (!Array.isArray(content)) { return []; }
     if (!orderArray || !Array.isArray(orderArray) || orderArray.length === 0) { return content; }
     try {
         const contentMap = new Map(content.map(item => [item.id, item]));
         const validOrderIds = orderArray.filter(id => contentMap.has(id));
         let orderedContent = validOrderIds.map(id => contentMap.get(id));
         const orderedIdsSet = new Set(validOrderIds);
         content.forEach(item => { if (item && item.id && !orderedIdsSet.has(item.id)) { orderedContent.push(item); } }); // Append unordered items
         return orderedContent.length > 0 ? orderedContent : content; // Fallback if ordering fails
     } catch (e) { console.error("Order Error:", e); return content; }
}

function createContentModuleElement(item, index) {
    const section = document.createElement('section');
    section.id = item.id;
    section.className = `content-module ${item.type}-module animate-entrance`;
    section.style.animationDelay = `calc(var(--entrance-delay, 0.1s) * ${index + 1})`;
    let title = '', bodyContent = '', isHolographic = false, isSmall = false;
    switch (item.type) {
        case 'directive': title = item.title || '// DIR //'; bodyContent = item.content || '<p>[X]</p>'; isHolographic = true; section.classList.add('holographic-panel'); break;
        case 'article': title = item.title || '// ARC //'; bodyContent = item.content || '<p>[X]</p>'; break;
        case 'letter': title = `// FROM: ${item.sender || '?'} //`; bodyContent = item.content || '<p>[X]</p>'; break;
        case 'cipher': title = item.title || '// CIP //'; bodyContent = `<div class="cipher-text">${item.content || '[X]'}</div>`; if (item.decryptionHint) bodyContent += `<p class="cipher-hint">Hint: ${item.decryptionHint}</p>`; isHolographic = true; isSmall = true; section.classList.add('holographic-panel', 'small-module'); break;
        default: title = `// UNK:${item.type} //`; const pre = document.createElement('pre'); pre.textContent = JSON.stringify(item, null, 2); bodyContent = `<p>?</p>${pre.outerHTML}`;
    }
    section.innerHTML = `<h2 class="section-title">${title}</h2><div class="module-body">${bodyContent}</div>` + (isHolographic ? `<div class="panel-corner corner-tl"></div><div class="panel-corner corner-tr"></div><div class="panel-corner corner-br"></div><div class="panel-corner corner-bl"></div><div class="panel-scanline ${isSmall ? 'intense' : ''}"></div>` : '');
    return section;
}

function applyStyleOverrides(styleOverrides) {
    if (styleOverrides && typeof styleOverrides === 'object') {
        const root = document.documentElement;
        Object.entries(styleOverrides).forEach(([variable, value]) => {
             if (typeof variable === 'string' && variable.startsWith('--') && typeof value === 'string') { root.style.setProperty(variable, value); }
             else { console.warn(`Skip invalid style: ${variable}: ${value}`); }
         });
    } else if (styleOverrides) { console.warn("Invalid styleOverrides:", styleOverrides); }
}

function setTextContent(selector, text) {
    try { const el = document.querySelector(selector); if (el) el.textContent = text ?? ''; }
    catch (e) { console.error(`Err setText ${selector}:`, e); }
}

function displayLoadError(errorMessage = "Signal lost.", targetElement = document.querySelector('.content-grid')) {
    const errorHtml = `<div class="content-module error-message"><h2 class="section-title">// TRANSMISSION ERROR //</h2><p>${errorMessage}</p></div>`;
    if (targetElement) { targetElement.innerHTML = errorHtml; }
    else { document.body.innerHTML = errorHtml; } // Fallback
    console.error("Load Error Displayed:", errorMessage);
}
