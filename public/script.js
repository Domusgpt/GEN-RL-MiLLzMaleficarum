// script.js - Handles dynamic content, style injection, layout, and visual focus

document.addEventListener('DOMContentLoaded', () => {
    // Add js-loading class immediately
    document.documentElement.classList.add('js-loading');
    document.documentElement.classList.remove('no-js');
    fetchMagazineData();
});

async function fetchMagazineData() {
    const apiUrl = '/api/current-data'; // Relative path for deployment
    const mainGrid = document.querySelector('.content-grid'); // Get grid early for error display

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${errorText || 'Server Error'}`);
        }
        const magazineData = await response.json();
        if (!magazineData || typeof magazineData !== 'object') {
             throw new Error("Invalid data format received from API.");
        }
        // Add short delay for perceived loading if desired (optional)
        // await new Promise(resolve => setTimeout(resolve, 200));
        renderMagazine(magazineData);
    } catch (error) {
        console.error("Failed to fetch or parse magazine data:", error);
        displayLoadError(error.message, mainGrid); // Pass grid to error handler
    } finally {
         // Remove loading state, add ready state
         document.documentElement.classList.remove('js-loading');
         document.documentElement.classList.add('js-ready');
    }
}

function renderMagazine(magazineData) {
    console.log(`Rendering Cycle: ${magazineData.cycleNumber}`);
    // --- Update Metadata ---
    setTextContent('#cycle-number', magazineData.cycleNumber);
    setTextContent('#transmission-date', magazineData.transmissionDate);
    setTextContent('#year', new Date().getFullYear());
    setTextContent('#footer-mantra', magazineData.footerMantra);

    // --- Apply Layout & Render Content ---
    const mainGrid = document.querySelector('.content-grid');
    if (!mainGrid) {
        console.error("Fatal Error: Main content grid container not found.");
        return;
    }
    mainGrid.innerHTML = ''; // Clear loading/previous
    document.querySelectorAll('.content-module.has-visual-focus').forEach(el => el.classList.remove('has-visual-focus'));

    const layoutConfig = magazineData.layoutConfiguration || {};
    applyLayoutTemplate(layoutConfig.templateName);

    let modulesToRender = getOrderedModules(magazineData.mainContent, layoutConfig.moduleOrder);

    if (!modulesToRender || modulesToRender.length === 0) {
         mainGrid.innerHTML = '<div class="content-module error-message"><p>No content received in this transmission cycle.</p></div>';
         console.warn("No modules to render in mainContent.");
    } else {
        modulesToRender.forEach((item, index) => {
            if (!item || typeof item !== 'object' || !item.id || !item.type) {
                 console.warn(`Skipping invalid content item at index ${index}:`, item);
                 return;
            }
            const moduleElement = createContentModuleElement(item, index);
            if (moduleElement) {
                if (item.id === layoutConfig.featuredVisualTargetId) {
                    moduleElement.classList.add('has-visual-focus');
                }
                mainGrid.appendChild(moduleElement);
            }
        });
    }

    applyStyleOverrides(magazineData.styleOverrides);
}

function applyLayoutTemplate(templateName) {
    const defaultTemplate = 'standard-grid';
    const finalTemplateName = templateName || defaultTemplate;
    // Simple approach: replace all classes on body except essential ones
    document.body.className = finalTemplateName; // Assumes no other critical body classes needed
    // More robust:
    // document.body.classList.remove('standard-grid', 'focus-center', 'split-view'); // Remove known layout classes
    // document.body.classList.add(finalTemplateName);
    console.log(`Applying layout template: ${finalTemplateName}`);
}

function getOrderedModules(content = [], orderArray) {
     if (!Array.isArray(content)) { return []; }
     if (!orderArray || !Array.isArray(orderArray) || orderArray.length === 0) { return content; }
     try {
         const contentMap = new Map(content.map(item => [item.id, item]));
         const validOrder = orderArray.filter(id => contentMap.has(id));
         let orderedContent = validOrder.map(id => contentMap.get(id));
         const orderedIds = new Set(validOrder);
         content.forEach(item => { if (!orderedIds.has(item.id)) { orderedContent.push(item); } });
         if(orderedContent.length > 0) { console.log("Applied module order."); return orderedContent; }
         else { console.warn("Module order resulted in empty list. Using default."); return content; }
     } catch (e) { console.error("Error applying module order:", e); return content; }
}

function createContentModuleElement(item, index) {
    const section = document.createElement('section');
    section.id = item.id;
    section.className = `content-module ${item.type}-module animate-entrance`;
    section.style.animationDelay = `calc(var(--entrance-delay, 0.1s) * ${index + 1})`;

    let title = '';
    let bodyContent = ''; // This will contain HTML string
    let isHolographic = false;
    let isSmall = false;

    // Generate title and body based on type
    switch (item.type) {
        case 'directive':
            title = item.title || '// DIRECTIVE //';
            bodyContent = item.content || '<p>[Directive Content Corrupted]</p>';
            isHolographic = true; section.classList.add('holographic-panel');
            break;
        case 'article':
            title = item.title || '// ARCHIVE ENTRY //';
            bodyContent = item.content || '<p>[Article Content Corrupted]</p>';
            break;
        case 'letter':
            title = `// FROM: ${item.sender || 'UNKNOWN SOURCE'} //`;
            bodyContent = item.content || '<p>[Letter Content Corrupted]</p>';
            break;
        case 'cipher':
            title = item.title || '// ENCRYPTED FRAGMENT //';
            bodyContent = `<div class="cipher-text">${item.content || '[Cipher Corrupted]'}</div>`;
            if (item.decryptionHint) bodyContent += `<p class="cipher-hint">Hint: ${item.decryptionHint}</p>`;
            isHolographic = true; isSmall = true; section.classList.add('holographic-panel', 'small-module');
            break;
        default:
            console.warn(`Rendering unknown content type: ${item.type} for ID: ${item.id}`);
            title = `// UNKNOWN DATA TYPE: ${item.type} //`;
            const safeContent = document.createElement('pre');
            safeContent.textContent = JSON.stringify(item, null, 2);
            bodyContent = `<p>Unrecognized content format.</p>${safeContent.outerHTML}`;
    }

    // Construct inner HTML safely using template literals
    section.innerHTML = `
        <h2 class="section-title">${title}</h2>
        <div class="module-body">${bodyContent}</div>
        ${isHolographic ? `
            <div class="panel-corner corner-tl"></div><div class="panel-corner corner-tr"></div>
            <div class="panel-corner corner-br"></div><div class="panel-corner corner-bl"></div>
            <div class="panel-scanline ${isSmall ? 'intense' : ''}"></div>` : ''}
    `;
    return section;
}


function applyStyleOverrides(styleOverrides) {
    if (styleOverrides && typeof styleOverrides === 'object') {
        const root = document.documentElement;
        // console.log("Applying Style Overrides:", styleOverrides); // Optional: Debugging
        Object.entries(styleOverrides).forEach(([variable, value]) => {
             if (typeof variable === 'string' && variable.startsWith('--') && typeof value === 'string') {
                root.style.setProperty(variable, value);
             } else {
                 console.warn(`Skipping invalid style override: ${variable}: ${value}`);
             }
         });
    } else if (styleOverrides) {
         console.warn("Received invalid styleOverrides data:", styleOverrides);
    }
}


function setTextContent(selector, text) {
    try {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = text ?? ''; // Use default empty string if text is null/undefined
        } else {
            // console.warn(`Element not found for selector: ${selector}`); // Reduce console noise
        }
    } catch (e) {
        console.error(`Error setting text content for selector "${selector}":`, e);
    }
}


function displayLoadError(errorMessage = "Signal lost.", targetElement = document.querySelector('.content-grid')) {
    if (targetElement) {
        targetElement.innerHTML = `<div class="content-module error-message"><h2 class="section-title">// TRANSMISSION ERROR //</h2><p>${errorMessage}</p></div>`;
    } else {
         // Fallback if grid doesn't exist
         document.body.innerHTML = `<div class="error-message"><h1>FATAL ERROR</h1><p>${errorMessage}</p></div>`;
    }
     console.error("Displaying load error:", errorMessage);
}
