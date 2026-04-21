// ==========================================
// ELECTRONIC CONFIGURATION MODULE
// ==========================================

const elecInputMode = document.getElementById('elecInputMode');
const elecDynamicInputs = document.getElementById('elecDynamicInputs');
const elecCalcBtn = document.getElementById('elecCalcBtn');

const MOELLER = [
    { n: 1, l: 0, max: 2, name: '1s' },
    { n: 2, l: 0, max: 2, name: '2s' },
    { n: 2, l: 1, max: 6, name: '2p' },
    { n: 3, l: 0, max: 2, name: '3s' },
    { n: 3, l: 1, max: 6, name: '3p' },
    { n: 4, l: 0, max: 2, name: '4s' },
    { n: 3, l: 2, max: 10, name: '3d' },
    { n: 4, l: 1, max: 6, name: '4p' },
    { n: 5, l: 0, max: 2, name: '5s' },
    { n: 4, l: 2, max: 10, name: '4d' },
    { n: 5, l: 1, max: 6, name: '5p' },
    { n: 6, l: 0, max: 2, name: '6s' },
    { n: 4, l: 3, max: 14, name: '4f' },
    { n: 5, l: 2, max: 10, name: '5d' },
    { n: 6, l: 1, max: 6, name: '6p' },
    { n: 7, l: 0, max: 2, name: '7s' },
    { n: 5, l: 3, max: 14, name: '5f' },
    { n: 6, l: 2, max: 10, name: '6d' },
    { n: 7, l: 1, max: 6, name: '7p' }
];

const TEMPLATES = {
    z: `<div class="input-group">
            <label>Elemento(s) (Z o Símbolo)</label>
            <input type="text" class="elecZValue" placeholder="Ej. 11, Na, 13 (separados por coma)">
        </div>`,
    ion: `<div class="quantum-grid">
            <div class="input-group">
                <label>Z o Símbolo</label>
                <input type="text" class="elecZValue" placeholder="Ej. 11 o Na">
            </div>
            <div class="input-group">
                <label>Carga del Ion</label>
                <input type="number" class="elecChargeValue" placeholder="Ej. -1 o +2">
            </div>
          </div>`,
    quantum: `<div class="quantum-grid">
                <div class="input-group">
                    <label>n (Principal)</label>
                    <input type="number" class="qN" placeholder="n" min="1" max="7">
                </div>
                <div class="input-group">
                    <label>l (Secundario)</label>
                    <input type="number" class="qL" placeholder="l" min="0" max="3">
                </div>
                <div class="input-group">
                    <label>ml (Magnético)</label>
                    <input type="number" class="qML" placeholder="ml">
                </div>
                <div class="input-group">
                    <label>ms (Spin)</label>
                    <select class="qMS">
                        <option value="0.5">+1/2</option>
                        <option value="-0.5">-1/2</option>
                    </select>
                </div>
              </div>
              <div class="quantum-switch">
                <input type="checkbox" class="elecPenultimate" style="width: auto;">
                <label class="switch-label" style="text-transform: none; margin: 0; padding-left: 0.5rem">Es el penúltimo electrón</label>
              </div>`,
    cn: `<div class="input-group">
            <label>Carga Nuclear (CN en ues)</label>
            <input type="text" class="elecCNValue" placeholder="Ej. 2.8818e-9 o 2,8818e-9">
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 5px;">Se dividirá por e (4.803e-10)</div>
         </div>`,
    ce: `<div class="input-group">
            <label>Carga Electrónica (CE en ues)</label>
            <input type="text" class="elecCEValue" placeholder="Ej. -4.803e-9 o -4,803e-9">
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 5px;">Divide por la carga elemental para #e-</div>
         </div>`,
    isoelectronic: `
        <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.4; padding: 0.5rem 1rem; background: rgba(34, 197, 94, 0.05); border-left: 3px solid var(--primary); border-radius: 0 8px 8px 0;">
            <strong>¿Qué es la Carga de Referencia?</strong> Es la carga del elemento con el que se está comparando.<br>
            <em>Ejemplo de problema:</em> "El ión <strong>M⁺¹</strong> es isoelectrónico con el <strong>O⁻²</strong>"<br>
            • <strong>Carga de M:</strong> +1 (porque es M⁺¹)<br>
            • <strong>Referencia:</strong> O (oxígeno)<br>
            • <strong>Carga Referencia:</strong> -2 (porque el oxígeno está como ion O⁻². Si fuera un gas noble neutro como Ne, la carga sería 0).
        </div>
        <div class="quantum-grid">
            <div class="input-group" style="grid-column: span 2;">
                <label>Carga de M (Ion Desconocido)</label>
                <input type="number" class="isoUnknownCharge" placeholder="Ej. +1">
            </div>
            <div class="input-group">
                <label>Elemento Referencia</label>
                <input type="text" class="isoRefZValue" placeholder="Ej. Ne u O">
            </div>
            <div class="input-group">
                <label>Carga Referencia</label>
                <input type="number" class="isoRefCharge" placeholder="Ej. 0 (neutro) o -2">
            </div>
        </div>`
};

const elecElementsList = document.getElementById('elecElementsList');
const addElecBlockBtn = document.getElementById('addElecBlockBtn');

function updateBlockTitles() {
    if (!elecElementsList) return;
    const blocks = elecElementsList.querySelectorAll('.element-block');
    blocks.forEach((block, index) => {
        const title = block.querySelector('.block-title');
        if (title) title.innerText = `Elemento ${index + 1}`;
        const removeBtn = block.querySelector('.remove-block-btn');
        if (removeBtn) {
            removeBtn.style.display = blocks.length > 1 ? 'flex' : 'none';
        }
    });
}

function bindBlock(block) {
    const modeSelect = block.querySelector('.elecInputMode');
    const dynamicArea = block.querySelector('.elecDynamicInputs');
    const removeBtn = block.querySelector('.remove-block-btn');
    
    if (!block.dataset.bound) {
        modeSelect.addEventListener('change', (e) => {
            dynamicArea.innerHTML = TEMPLATES[e.target.value];
        });
        removeBtn.addEventListener('click', () => {
            block.remove();
            updateBlockTitles();
        });
        block.dataset.bound = "true";
    }
}

function initBlocks() {
    if (!elecElementsList) return;
    const blocks = elecElementsList.querySelectorAll('.element-block');
    blocks.forEach(block => bindBlock(block));
    updateBlockTitles();
}
initBlocks();

if (addElecBlockBtn) {
    addElecBlockBtn.addEventListener('click', () => {
        const templateBlock = document.createElement('div');
        templateBlock.className = 'element-block';
        templateBlock.innerHTML = `
            <div class="element-block-header">
                <h4 class="block-title">Elemento Nuevo</h4>
                <button class="remove-block-btn" style="display: none;" title="Eliminar"><i class="fa-solid fa-trash-can"></i></button>
            </div>
            <div class="input-group">
                <label>¿Qué dato tienes?</label>
                <select class="elecInputMode">
                    <option value="z">Número Atómico (Z) o Símbolo</option>
                    <option value="ion">Ion (Z y Carga)</option>
                    <option value="isoelectronic">Relación Isoelectrónica</option>
                    <option value="quantum">Estado Cuántico del Electrón</option>
                    <option value="cn">Carga Nuclear (CN)</option>
                    <option value="ce">Carga Electrónica (CE)</option>
                </select>
            </div>
            <div class="elecDynamicInputs elec-dynamic-area">
                ${TEMPLATES['z']}
            </div>
        `;
        elecElementsList.appendChild(templateBlock);
        bindBlock(templateBlock);
        updateBlockTitles();
    });
}

function calculateElectronsFromQuantum(n, l, ml, ms, isPenultimate) {
    if (l >= n || l < 0 || l > 3) return null;
    if (Math.abs(ml) > l) return null;
    
    const subshellIndex = MOELLER.findIndex(m => m.n === n && m.l === l);
    if (subshellIndex === -1) return null;
    
    let subshellElectrons = 0;
    if (ms > 0) { // +1/2
        subshellElectrons = ml + l + 1;
    } else { // -1/2
        subshellElectrons = 3 * l + ml + 2;
    }
    
    if (subshellElectrons > MOELLER[subshellIndex].max || subshellElectrons <= 0) return null;
    
    let totalE = 0;
    for (let i = 0; i < subshellIndex; i++) {
        totalE += MOELLER[i].max;
    }
    totalE += subshellElectrons;
    
    if (isPenultimate) {
        totalE += 1;
    }
    
    return totalE;
}

const ELEMENTARY_CHARGE = 4.803e-10;

if (elecCalcBtn) {
    elecCalcBtn.addEventListener('click', () => {
        let elementsToProcess = [];
        let valid = true;
        
        const blocks = elecElementsList.querySelectorAll('.element-block');
        
        blocks.forEach(block => {
            const mode = block.querySelector('.elecInputMode').value;
            
            if (mode === 'z') {
                const rawValIn = block.querySelector('.elecZValue');
                if(!rawValIn) { valid = false; return; }
                const rawVal = rawValIn.value;
                const parts = rawVal.split(',').map(s => s.trim()).filter(s => s !== '');
                if (parts.length === 0) valid = false;
                
                parts.forEach(p => {
                    let zVal = parseInt(p);
                    if (isNaN(zVal)) {
                        const symIndex = SYMBOLS_BY_Z.findIndex(s => s.toLowerCase() === p.toLowerCase());
                        if (symIndex > 0) zVal = symIndex;
                    }
                    if (isNaN(zVal) || zVal < 1 || zVal > 118) valid = false;
                    else elementsToProcess.push({ z: zVal, e: zVal });
                });
            } else if (mode === 'ion') {
                const zRawValIn = block.querySelector('.elecZValue');
                const chargeValIn = block.querySelector('.elecChargeValue');
                if(!zRawValIn || !chargeValIn) { valid = false; return; }
                const zRaw = zRawValIn.value;
                const charge = parseInt(chargeValIn.value) || 0;
                let zVal = parseInt(zRaw);
                if (isNaN(zVal)) {
                    const symIndex = SYMBOLS_BY_Z.findIndex(s => s.toLowerCase() === zRaw.trim().toLowerCase());
                    if (symIndex > 0) zVal = symIndex;
                }
                if (isNaN(zVal) || zVal < 1) valid = false; else {
                    let totalE = zVal - charge;
                    if(totalE < 0) totalE = 0;
                    elementsToProcess.push({ z: zVal, e: totalE });
                }
            } else if (mode === 'cn') {
                const cnValIn = block.querySelector('.elecCNValue');
                if(!cnValIn) { valid = false; return; }
                const rawCn = cnValIn.value.replace(',', '.');
                const cn = parseFloat(rawCn);
                if (isNaN(cn)) valid = false; else {
                    const z = Math.round(Math.abs(cn) / ELEMENTARY_CHARGE);
                    elementsToProcess.push({ z: z, e: z });
                }
            } else if (mode === 'ce') {
                const ceValIn = block.querySelector('.elecCEValue');
                if(!ceValIn) { valid = false; return; }
                const rawCe = ceValIn.value.replace(',', '.');
                const ce = parseFloat(rawCe);
                if (isNaN(ce)) valid = false; else {
                    const e = Math.round(Math.abs(ce) / ELEMENTARY_CHARGE);
                    elementsToProcess.push({ z: e, e: e });
                }
            } else if (mode === 'isoelectronic') {
                const unkChargeValIn = block.querySelector('.isoUnknownCharge');
                const refZValIn = block.querySelector('.isoRefZValue');
                const refChargeValIn = block.querySelector('.isoRefCharge');
                if(!unkChargeValIn || !refZValIn || !refChargeValIn) { valid = false; return; }
                
                const unkCharge = parseInt(unkChargeValIn.value) || 0;
                const refZRaw = refZValIn.value.trim();
                const refCharge = parseInt(refChargeValIn.value) || 0;
                
                let refZ = parseInt(refZRaw);
                if (isNaN(refZ)) {
                    const symIndex = SYMBOLS_BY_Z.findIndex(s => s.toLowerCase() === refZRaw.toLowerCase());
                    if (symIndex > 0) refZ = symIndex;
                }
                
                if (isNaN(refZ) || refZ < 1) valid = false; else {
                    let refE = refZ - refCharge;
                    if(refE < 0) refE = 0;
                    
                    let unkZ = refE + unkCharge;
                    if (unkZ < 1) valid = false; else {
                        elementsToProcess.push({ z: unkZ, e: refE });
                    }
                }
            } else if (mode === 'quantum') {
                const n = parseInt(block.querySelector('.qN')?.value);
                const l = parseInt(block.querySelector('.qL')?.value);
                const ml = parseInt(block.querySelector('.qML')?.value);
                const ms = parseFloat(block.querySelector('.qMS')?.value);
                const pen = block.querySelector('.elecPenultimate')?.checked;
                
                if (isNaN(n) || isNaN(l) || isNaN(ml) || isNaN(ms)) valid = false; else {
                    const res = calculateElectronsFromQuantum(n, l, ml, ms, pen);
                    if (res === null) valid = false; else elementsToProcess.push({ z: res, e: res });
                }
            }
        });
        
        if (!valid || elementsToProcess.length === 0) {
            alert("Datos inválidos o insuficientes en alguno de los elementos. Por favor verifique.");
            return;
        }
        
        elementsToProcess.reverse().forEach(item => {
            if (item.e > 0) generateAndDisplayConfiguration(item.e, item.z);
        });
    });
}

const NOBLE_GASES = [
    { z: 2, sym: 'He' }, { z: 10, sym: 'Ne' }, { z: 18, sym: 'Ar' },
    { z: 36, sym: 'Kr' }, { z: 54, sym: 'Xe' }, { z: 86, sym: 'Rn' }, { z: 118, sym: 'Og' }
];

const SYMBOLS_BY_Z = [
    "", "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", 
    "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", 
    "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", 
    "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr", 
    "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", 
    "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", 
    "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", 
    "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", 
    "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th", 
    "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", 
    "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", 
    "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"
];

const PERIODIC_DATA = {
    1: { rad: 53, ie: 1312, ea: 73, en: 2.20, met: 'No Metal' }, 2: { rad: 31, ie: 2372, ea: 0, en: 0, met: 'Gas Noble' },
    3: { rad: 167, ie: 520, ea: 60, en: 0.98, met: 'Metal Alcalino' }, 4: { rad: 112, ie: 899, ea: -50, en: 1.57, met: 'Metal Alcalinotérreo' },
    5: { rad: 87, ie: 801, ea: 27, en: 2.04, met: 'Metaloide' }, 6: { rad: 67, ie: 1086, ea: 122, en: 2.55, met: 'No Metal' },
    7: { rad: 56, ie: 1402, ea: -7, en: 3.04, met: 'No Metal' }, 8: { rad: 48, ie: 1314, ea: 141, en: 3.44, met: 'No Metal' },
    9: { rad: 42, ie: 1681, ea: 328, en: 3.98, met: 'Halógeno' }, 10: { rad: 38, ie: 2081, ea: 0, en: 0, met: 'Gas Noble' },
    11: { rad: 190, ie: 496, ea: 53, en: 0.93, met: 'Metal Alcalino' }, 12: { rad: 145, ie: 738, ea: -40, en: 1.31, met: 'Metal Alcalinotérreo' },
    13: { rad: 118, ie: 578, ea: 43, en: 1.61, met: 'Metal Pobre' }, 14: { rad: 111, ie: 786, ea: 134, en: 1.90, met: 'Metaloide' },
    15: { rad: 98, ie: 1012, ea: 72, en: 2.19, met: 'No Metal' }, 16: { rad: 88, ie: 1000, ea: 200, en: 2.58, met: 'No Metal' },
    17: { rad: 79, ie: 1251, ea: 349, en: 3.16, met: 'Halógeno' }, 18: { rad: 71, ie: 1521, ea: 0, en: 0, met: 'Gas Noble' },
    19: { rad: 243, ie: 419, ea: 48, en: 0.82, met: 'Metal Alcalino' }, 20: { rad: 194, ie: 590, ea: -29, en: 1.00, met: 'Metal Alcalinotérreo' },
    21: { rad: 184, ie: 633, ea: 18, en: 1.36, met: 'Metal de Transición' }, 22: { rad: 176, ie: 659, ea: 8, en: 1.54, met: 'Metal de Transición' },
    23: { rad: 171, ie: 651, ea: 51, en: 1.63, met: 'Metal de Transición' }, 24: { rad: 166, ie: 653, ea: 65, en: 1.66, met: 'Metal de Transición' },
    25: { rad: 161, ie: 717, ea: 0, en: 1.55, met: 'Metal de Transición' }, 26: { rad: 156, ie: 763, ea: 15, en: 1.83, met: 'Metal de Transición' },
    27: { rad: 152, ie: 760, ea: 64, en: 1.88, met: 'Metal de Transición' }, 28: { rad: 149, ie: 737, ea: 112, en: 1.91, met: 'Metal de Transición' },
    29: { rad: 145, ie: 745, ea: 119, en: 1.90, met: 'Metal de Transición' }, 30: { rad: 142, ie: 906, ea: 0, en: 1.65, met: 'Metal de Transición' },
    31: { rad: 136, ie: 579, ea: 29, en: 1.81, met: 'Metal Pobre' }, 32: { rad: 125, ie: 762, ea: 119, en: 2.01, met: 'Metaloide' },
    33: { rad: 114, ie: 947, ea: 78, en: 2.18, met: 'Metaloide' }, 34: { rad: 103, ie: 941, ea: 195, en: 2.55, met: 'No Metal' },
    35: { rad: 94, ie: 1140, ea: 325, en: 2.96, met: 'Halógeno' }, 36: { rad: 88, ie: 1351, ea: 0, en: 3.00, met: 'Gas Noble' },
    37: { rad: 265, ie: 403, ea: 47, en: 0.82, met: 'Metal Alcalino' }, 38: { rad: 219, ie: 550, ea: -30, en: 0.95, met: 'Metal Alcalinotérreo' },
    39: { rad: 212, ie: 600, ea: 30, en: 1.22, met: 'Metal de Transición' }, 40: { rad: 206, ie: 640, ea: 41, en: 1.33, met: 'Metal de Transición' },
    41: { rad: 198, ie: 652, ea: 86, en: 1.6, met: 'Metal de Transición' }, 42: { rad: 190, ie: 684, ea: 72, en: 2.16, met: 'Metal de Transición' },
    43: { rad: 183, ie: 702, ea: 53, en: 1.9, met: 'Metal de Transición' }, 44: { rad: 178, ie: 710, ea: 101, en: 2.2, met: 'Metal de Transición' },
    45: { rad: 173, ie: 720, ea: 110, en: 2.28, met: 'Metal de Transición' }, 46: { rad: 169, ie: 804, ea: 54, en: 2.20, met: 'Metal de Transición' },
    47: { rad: 165, ie: 731, ea: 126, en: 1.93, met: 'Metal de Transición' }, 48: { rad: 161, ie: 868, ea: 0, en: 1.69, met: 'Metal de Transición' },
    49: { rad: 156, ie: 558, ea: 29, en: 1.78, met: 'Metal Pobre' }, 50: { rad: 145, ie: 709, ea: 107, en: 1.96, met: 'Metal Pobre' },
    51: { rad: 140, ie: 834, ea: 101, en: 2.05, met: 'Metaloide' }, 52: { rad: 123, ie: 869, ea: 190, en: 2.1, met: 'Metaloide' },
    53: { rad: 115, ie: 1008, ea: 295, en: 2.66, met: 'Halógeno' }, 54: { rad: 108, ie: 1170, ea: 0, en: 2.6, met: 'Gas Noble' },
    55: { rad: 298, ie: 376, ea: 46, en: 0.79, met: 'Metal Alcalino' }, 56: { rad: 253, ie: 503, ea: -14, en: 0.89, met: 'Metal Alcalinotérreo' },
    79: { rad: 166, ie: 890, ea: 223, en: 2.54, met: 'Metal de Transición' }, 80: { rad: 155, ie: 1007, ea: 0, en: 2.00, met: 'Metal de Transición' },
    82: { rad: 154, ie: 716, ea: 35, en: 2.33, met: 'Metal Pobre' }
};

const DEFAULT_PROP = { rad: 'N/A', ie: 'N/A', ea: 'N/A', en: 'N/A', met: 'Transición/Otros' };

function getElementSymbol(z) {
    if(z > 0 && z < SYMBOLS_BY_Z.length) return SYMBOLS_BY_Z[z];
    return "X";
}

function calculateZeff(z, configArray) {
    if(z <= 0) return 0;
    
    let groups = {};
    let maxN = 0;
    
    configArray.forEach(sub => {
        const n = sub.n;
        const l = sub.l;
        if (n > maxN) maxN = n;
        
        let type = 'sp';
        if (l === 2) type = 'd';
        if (l === 3) type = 'f';
        
        const key = `${n}${type}`;
        if (!groups[key]) groups[key] = { n: n, type: type, e: 0 };
        groups[key].e += sub.e;
    });
    
    let groupKeys = Object.keys(groups);
    if(groupKeys.length === 0) return 0;
    
    let slaterOrder = ['1sp', '2sp', '3sp', '3d', '4sp', '4d', '4f', '5sp', '5d', '5f', '6sp', '6d', '7sp'];
    
    let valenceKey = null;
    let maxIndex = -1;
    groupKeys.forEach(k => {
        let idx = slaterOrder.indexOf(k);
        if(idx > maxIndex) { maxIndex = idx; valenceKey = k; }
    });
    
    if(!valenceKey) return 0;
    
    let valGroup = groups[valenceKey];
    let S = 0;
    let isSOrP = valGroup.type === 'sp';
    let valN = valGroup.n;
    
    let sameGroupE = valGroup.e - 1; 
    if(sameGroupE < 0) sameGroupE = 0;
    
    if (valN === 1) { 
        S += sameGroupE * 0.30;
    } else if (isSOrP) {
        S += sameGroupE * 0.35;
        let nMinus1E = 0;
        let nLowerE = 0;
        
        groupKeys.forEach(k => {
            if (k !== valenceKey) {
                let g = groups[k];
                if (g.n === valN - 1) nMinus1E += g.e;
                else if (g.n < valN - 1) nLowerE += g.e;
            }
        });
        
        S += nMinus1E * 0.85;
        S += nLowerE * 1.00;
    } else { 
        S += sameGroupE * 0.35;
        groupKeys.forEach(k => {
            if (k !== valenceKey) {
                let idxK = slaterOrder.indexOf(k);
                if (idxK < maxIndex) {
                    S += groups[k].e * 1.00;
                }
            }
        });
    }
    
    return (z - S).toFixed(2);
}

function getPeriodicInfo(z) {
    if (z < 1 || z > 118) return { period: '-', group: '-', family: '-' };
    
    let remaining = z;
    let maxN = 0;
    let lastSub = null;
    let sElectrons = 0;
    let config = [];
    
    for (let i = 0; i < MOELLER.length; i++) {
        if (remaining <= 0) break;
        const sub = MOELLER[i];
        const take = Math.min(remaining, sub.max);
        config.push({ ...sub, e: take });
        remaining -= take;
        if (sub.n > maxN) maxN = sub.n;
        lastSub = { ...sub, e: take };
    }
    
    const highestS = config.find(s => s.n === maxN && s.l === 0);
    sElectrons = highestS ? highestS.e : 0;
    
    let group = 0;
    let family = "";
    let block = "";
    
    if (lastSub.l === 0) {
        block = "s";
        group = sElectrons;
        if (z === 2) group = 18;
    } else if (lastSub.l === 1) {
        block = "p";
        group = 12 + lastSub.e;
    } else if (lastSub.l === 2) {
        block = "d";
        group = sElectrons + lastSub.e;
    } else if (lastSub.l === 3) {
        block = "f";
        group = 3;
    }
    
    if (z === 2) group = 18;
    
    if (group === 1) family = (z === 1) ? "No Metales" : "IA (Metales Alcalinos)";
    else if (group === 2) family = "IIA (Metales Alcalinotérreos)";
    else if (group === 3) family = "IIIB (Familia del Escandio)";
    else if (group === 4) family = "IVB (Familia del Titanio)";
    else if (group === 5) family = "VB (Familia del Vanadio)";
    else if (group === 6) family = "VIB (Familia del Cromo)";
    else if (group === 7) family = "VIIB (Familia del Manganeso)";
    else if (group >= 8 && group <= 10) family = "VIIIB (Metales de Transición)";
    else if (group === 11) family = "IB (Metales de Transición)";
    else if (group === 12) family = "IIB (Metales de Transición)";
    else if (group === 13) family = "IIIA (Térreos / Boroideos)";
    else if (group === 14) family = "IVA (Carbonoideos)";
    else if (group === 15) family = "VA (Nitrogenoideos)";
    else if (group === 16) family = "VIA (Anfígenos / Calcógenos)";
    else if (group === 17) family = "VIIA (Halógenos)";
    else if (group === 18) family = "VIIIA (Gases Nobles)";
    else if (lastSub.l === 2) family = "Metales de Transición";
    else if (lastSub.l === 3) {
        family = (maxN === 6) ? "Lantánidos" : "Actínidos";
    }
    
    return { period: maxN, group: group, family: family, block: block };
}

const elecResultsContainer = document.getElementById('elecResultsContainer');
const elecClearBtn = document.getElementById('elecClearBtn');

if (elecClearBtn) {
    elecClearBtn.addEventListener('click', () => {
        elecResultsContainer.innerHTML = '';
        elecClearBtn.style.display = 'none';
    });
}

function getConfigurationHtml(electrons) {
    let remaining = electrons;
    let standardConfigArray = [];
    let configWithInfo = [];
    
    for (let i = 0; i < MOELLER.length; i++) {
        if (remaining <= 0) break;
        const sub = MOELLER[i];
        const take = Math.min(remaining, sub.max);
        standardConfigArray.push({ name: sub.name, e: take });
        configWithInfo.push({ name: sub.name, e: take, n: sub.n, l: sub.l });
        remaining -= take;
    }
    
    const standardHtml = standardConfigArray.map(m => m.name + '<sup>' + m.e + '</sup>').join(' ');
    
    let kernelTarget = null;
    for (let i = NOBLE_GASES.length - 1; i >= 0; i--) {
        if (NOBLE_GASES[i].z < electrons) {
            kernelTarget = NOBLE_GASES[i];
            break;
        }
    }
    
    let kernelHtml = standardHtml;
    
    if (kernelTarget) {
        let skipRemaining = kernelTarget.z;
        let pIndex = 0;
        for (let i = 0; i < standardConfigArray.length; i++) {
            if (skipRemaining <= 0) break;
            skipRemaining -= standardConfigArray[i].e;
            pIndex = i + 1;
        }
        const restHtmlChunks = standardConfigArray.slice(pIndex).map(m => m.name + '<sup>' + m.e + '</sup>');
        kernelHtml = `[${kernelTarget.sym}] ` + restHtmlChunks.join(' ');
    }
    
    return { standardHtml, kernelHtml, configWithInfo };
}

function getIonConfigurationHtml(z, currentE) {
    if (z === currentE || currentE > z) {
        return getConfigurationHtml(currentE);
    }
    
    let neutralConfig = getConfigurationHtml(z).configWithInfo;
    let config = neutralConfig.map(s => ({...s}));
    let toRemove = z - currentE;
    
    while (toRemove > 0) {
        let maxSub = null;
        let maxIdx = -1;
        
        for (let i = 0; i < config.length; i++) {
            if (config[i].e > 0) {
                if (!maxSub) {
                    maxSub = config[i];
                    maxIdx = i;
                } else {
                    if (config[i].n > maxSub.n) {
                        maxSub = config[i];
                        maxIdx = i;
                    } else if (config[i].n === maxSub.n) {
                        if (config[i].l > maxSub.l) {
                            maxSub = config[i];
                            maxIdx = i;
                        }
                    }
                }
            }
        }
        
        if (maxIdx !== -1) {
            let removeCount = Math.min(toRemove, config[maxIdx].e);
            config[maxIdx].e -= removeCount;
            toRemove -= removeCount;
        } else {
            break;
        }
    }
    
    config = config.filter(s => s.e > 0);
    const standardHtml = config.map(m => m.name + '<sup>' + m.e + '</sup>').join(' ');
    
    let kernelTarget = null;
    for (let i = NOBLE_GASES.length - 1; i >= 0; i--) {
        if (NOBLE_GASES[i].z < currentE) {
            kernelTarget = NOBLE_GASES[i];
            break;
        }
    }
    
    let kernelHtml = standardHtml;
    
    if (kernelTarget) {
        let skipRemaining = kernelTarget.z;
        let pIndex = 0;
        for (let i = 0; i < config.length; i++) {
            if (skipRemaining <= 0) break;
            skipRemaining -= config[i].e;
            pIndex = i + 1;
        }
        if (skipRemaining <= 0) {
            const restHtmlChunks = config.slice(pIndex).map(m => m.name + '<sup>' + m.e + '</sup>');
            kernelHtml = `[${kernelTarget.sym}] ` + restHtmlChunks.join(' ');
        }
    }
    
    return { standardHtml, kernelHtml, configWithInfo: config };
}

function updateComparisons() {
    const propsToCompare = ['zeff', 'rad', 'ie', 'ea', 'en'];
    
    document.querySelectorAll('.comp-stat .stat-value').forEach(el => {
        el.style.color = '';
        el.style.fontWeight = '';
        if (el.classList.contains('default-color-z')) el.style.color = 'var(--primary)';
    });
    
    const cards = document.querySelectorAll('.elec-result-card');
    if (cards.length < 2) return;
    
    propsToCompare.forEach(prop => {
        let values = [];
        cards.forEach(card => {
            const statDiv = card.querySelector(`.comp-stat[data-prop="${prop}"]`);
            if (statDiv) {
                const valStr = statDiv.getAttribute('data-value');
                if (valStr !== 'N/A' && valStr !== '') {
                    values.push({
                        val: parseFloat(valStr),
                        element: statDiv.querySelector('.stat-value')
                    });
                }
            }
        });
        
        if (values.length >= 2) {
            values.sort((a, b) => a.val - b.val);
            const minVal = values[0].val;
            const maxVal = values[values.length - 1].val;
            
            if (minVal !== maxVal) {
                values.forEach(v => {
                    if (v.val === maxVal) {
                        v.element.style.color = '#ef4444'; // Red for max
                        v.element.style.fontWeight = '700';
                    } else if (v.val === minVal) {
                        v.element.style.color = '#3b82f6'; // Blue for min
                        v.element.style.fontWeight = '700';
                    }
                });
            }
        }
    });
}

function generateAndDisplayConfiguration(initialE, atomicZ) {
    let z = atomicZ !== undefined ? atomicZ : initialE;
    let currentE = initialE;
    let prevE = currentE;
    
    const sym = getElementSymbol(z);
    const pInfo = getPeriodicInfo(z);
    const props = PERIODIC_DATA[z] || { rad: 'N/A', ie: 'N/A', ea: 'N/A', en: 'N/A', met: pInfo.family };
    
    let card = document.createElement('div');
    card.className = 'elec-result-card';
    
    function renderCard() {
        let charge = z - currentE;
        let chargeText = "";
        if (charge > 0) chargeText = `<sup>+${charge === 1 ? '' : charge}</sup>`;
        else if (charge < 0) chargeText = `<sup>${charge === -1 ? '-' : charge}</sup>`;
        
        let displaySym = sym + chargeText;
        
        const neutralConfig = getConfigurationHtml(z);
        const ionConfig = currentE !== z ? getIonConfigurationHtml(z, currentE) : null;
        
        const zeff = calculateZeff(z, neutralConfig.configWithInfo);

        let atomStatusHtml = '';
        if (charge === 0) {
            atomStatusHtml = '<div class="atom-status neutral"><i class="fa-solid fa-scale-balanced"></i> Átomo Neutro</div>';
        } else if (charge > 0) {
            atomStatusHtml = `<div class="atom-status cation"><i class="fa-solid fa-arrow-trend-down"></i> Catión (Perdió ${charge} e⁻)</div>`;
        } else {
            atomStatusHtml = `<div class="atom-status anion"><i class="fa-solid fa-arrow-trend-up"></i> Anión (Ganó ${Math.abs(charge)} e⁻)</div>`;
        }

        let approxNeutrons = Math.round(z * (z > 20 ? 1.4 : 1));
        if (z === 1) approxNeutrons = 0;
        
        let totalNucleons = z + approxNeutrons;
        let radiusMax = 6 + Math.pow(totalNucleons, 0.45) * 2;
        let nucleusHtml = '';
        
        let nucleonTypes = [];
        for(let i=0; i<z; i++) nucleonTypes.push('prot');
        for(let i=0; i<approxNeutrons; i++) nucleonTypes.push('neut');
        nucleonTypes.sort(() => Math.random() - 0.5);
        
        nucleonTypes.forEach((type) => {
            let r = Math.sqrt(Math.random()) * radiusMax; 
            let theta = Math.random() * 2 * Math.PI;
            let x = r * Math.cos(theta);
            let y = r * Math.sin(theta);
            let zIdx = Math.floor(Math.random() * 20);
            nucleusHtml += `<div class="nucleon ${type}" style="transform: translate(${x}px, ${y}px); z-index: ${zIdx};"></div>`;
        });
        
        // Exact quantum shells for orbits
        let shellsObj = {}; 
        let maxN = 0;
        const activeConfig = (ionConfig || neutralConfig).configWithInfo;
        activeConfig.forEach(sub => {
            if(!shellsObj[sub.n]) shellsObj[sub.n] = 0;
            shellsObj[sub.n] += sub.e;
            if(sub.n > maxN) maxN = sub.n;
        });

        let shellsSvg = '';
        let electronsHtml = '';

        for (let n = 1; n <= maxN; n++) {
            let eCount = shellsObj[n] || 0;
            if (eCount === 0) continue; 

            let rx = 35 + n * (85 / maxN); // Dynamically scale up to ~120
            let ry = rx * 0.35;
            let angle = (n * 360 / maxN) + 20; 

            shellsSvg += `<g transform="translate(150, 150) rotate(${angle})">
                             <ellipse rx="${rx}" ry="${ry}" fill="none" class="hd-orbit-path" />
                          </g>`;

            let pathString = `path('M -${rx} 0 A ${rx} ${ry} 0 1 0 ${rx} 0 A ${rx} ${ry} 0 1 0 -${rx} 0')`;
            let duration = 3 + n * 1.8; 
            
            let layerHtml = `<div class="shell-layer" style="position: absolute; top: 150px; left: 150px; transform: rotate(${angle}deg);">`;
            for(let i=0; i<eCount; i++) {
                let delay = -(duration / eCount) * i;
                layerHtml += `<div class="premium-electron" style="offset-path: ${pathString}; animation: moveElectron ${duration}s linear infinite; animation-delay: ${delay}s;"></div>`;
            }
            layerHtml += `</div>`;
            electronsHtml += layerHtml;
        }

        // Generate Flying Electron FX based on prevE vs currentE
        let fxHtml = '';
        if (currentE < prevE) {
            // Electron lost
            fxHtml = `<div class="atom-electron-fx fx-escaping"></div>`;
        } else if (currentE > prevE) {
            // Electron gained
            fxHtml = `<div class="atom-electron-fx fx-entering"></div>`;
        }

        let atomVisualHtml = `
            <div class="atom-infographic">
                <div class="atom-premium">
                    <svg class="atom-orbits-svg" width="300" height="300" viewBox="0 0 300 300">
                        ${shellsSvg}
                    </svg>
                    <div class="atom-nucleus">
                        <div style="position: absolute; top: 150px; left: 150px;">
                            ${nucleusHtml}
                        </div>
                    </div>
                    <div class="atom-electrons">
                        ${electronsHtml}
                        ${fxHtml}
                    </div>
                </div>
                <div class="stats-panels">
                    <div class="panel-stat p-protons" title="Carga Positiva (+) en el núcleo"><span class="dot red"></span> <strong>${z}</strong> Protones</div>
                    <div class="panel-stat p-neutrons" title="Partículas sin carga en el núcleo"><span class="dot gray"></span> <strong>~${approxNeutrons}</strong> Neutrones</div>
                    <div class="panel-stat p-electrons" title="Carga Negativa (-) orbitando"><span class="dot blue"></span> <strong>${currentE}</strong> Electrones</div>
                    ${atomStatusHtml}
                </div>
            </div>
        `;

        let configSectionHtml = `
            ${atomVisualHtml}
            <div style="font-size: 0.9rem; margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-main); text-transform: uppercase; border-bottom: 1px dashed var(--border-color); padding-bottom: 5px;">
                <i class="fa-solid fa-atom"></i> Átomo Neutro (Z=${z})
            </div>
            <div class="input-group" style="margin-bottom: 1rem;">
                <label>Configuración Estándar Neutra</label>
                <div class="config-string">${neutralConfig.standardHtml}</div>
            </div>
            <div class="input-group" style="margin-bottom: 1rem;">
                <label style="color: #ef4444; font-weight: bold;"><i class="fa-solid fa-fire-flame-curved"></i> Configuración Kernel Neutra</label>
                <div class="config-string" style="border: 2px solid #ef4444; background: rgba(239, 68, 68, 0.05); box-shadow: 0 4px 15px rgba(239, 68, 68, 0.1);">${neutralConfig.kernelHtml}</div>
            </div>
        `;
        
        if (ionConfig) {
            configSectionHtml += `
            <div style="font-size: 0.9rem; margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: 600; color: var(--primary); text-transform: uppercase; border-bottom: 1px dashed var(--primary); padding-bottom: 5px;">
                <i class="fa-solid fa-bolt"></i> ${charge > 0 ? 'Catión' : 'Anión'} con ${currentE} e⁻
            </div>
            <div class="input-group" style="margin-bottom: 1rem;">
                <label>Estándar Ion</label>
                <div class="config-string" style="border-color: var(--primary); background: rgba(34, 197, 94, 0.05);">${ionConfig.standardHtml}</div>
            </div>
            <div class="input-group" style="margin-bottom: 1rem;">
                <label style="color: #ef4444; font-weight: bold;"><i class="fa-solid fa-fire-flame-curved"></i> Kernel Ion</label>
                <div class="config-string" style="border: 2px solid #ef4444; background: rgba(239, 68, 68, 0.1); box-shadow: 0 4px 15px rgba(239, 68, 68, 0.15);">${ionConfig.kernelHtml}</div>
            </div>
            `;
        }

        let badgeClass = charge > 0 ? 'is-cation' : (charge < 0 ? 'is-anion' : '');
        card.innerHTML = `
            <button class="card-close-btn" title="Eliminar"><i class="fa-solid fa-xmark"></i></button>
            <div class="elec-result-header">
                <div class="elec-symbol-badge ${badgeClass}" style="${charge !== 0 ? 'font-size: 1.4rem;' : ''}">${displaySym}</div>
                <div class="elec-header-info" style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                        <div>
                            <h4>Elemento Z = ${z}</h4>
                            <div style="font-size: 0.85rem; color: var(--primary); margin-top: 5px; font-weight: 600;">
                                Periodo: ${pInfo.period} &nbsp;|&nbsp; Bloque: ${pInfo.block.toUpperCase()} &nbsp;|&nbsp; ${pInfo.family}
                            </div>
                        </div>
                        <div class="electron-stepper">
                            <button class="e-btn minus-e" title="Quitar electrón (Catión)"><i class="fa-solid fa-minus"></i></button>
                            <span class="e-count">${currentE} e⁻</span>
                            <button class="e-btn plus-e" title="Añadir electrón (Anión)"><i class="fa-solid fa-plus"></i></button>
                            <button class="e-btn reset-e" title="Volver a Neutro" style="margin-left: 0.2rem; display: ${charge !== 0 ? 'flex' : 'none'};"><i class="fa-solid fa-rotate-left"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            
            ${configSectionHtml}
            
            <div class="periodic-props-grid">
                <div class="comp-stat" data-prop="zeff" data-value="${zeff}">
                    <span class="stat-label">Carga Nuclear (Z<sub>eff</sub>)</span>
                    <span class="stat-value default-color-z" style="color: var(--primary);">${zeff}</span>
                </div>
                <div class="comp-stat" data-prop="rad" data-value="${props.rad}">
                    <span class="stat-label">Radio Atómico</span>
                    <span class="stat-value">${props.rad !== 'N/A' ? props.rad + ' pm' : 'N/A'}</span>
                </div>
                <div class="comp-stat">
                    <span class="stat-label">Carácter Metálico</span>
                    <span class="stat-value">${props.met}</span>
                </div>
                <div class="comp-stat" data-prop="ie" data-value="${props.ie}">
                    <span class="stat-label">Energía de Ionización</span>
                    <span class="stat-value">${props.ie !== 'N/A' ? props.ie + ' kJ/mol' : 'N/A'}</span>
                </div>
                <div class="comp-stat" data-prop="ea" data-value="${props.ea}">
                    <span class="stat-label">Afinidad Electrónica</span>
                    <span class="stat-value">${props.ea !== 'N/A' ? props.ea + ' kJ/mol' : 'N/A'}</span>
                </div>
                <div class="comp-stat" data-prop="en" data-value="${props.en}">
                    <span class="stat-label">Electronegatividad</span>
                    <span class="stat-value">${props.en !== 'N/A' ? props.en : 'N/A'}</span>
                </div>
            </div>
        `;
        
        card.querySelector('.card-close-btn').addEventListener('click', () => {
            card.remove();
            if (elecResultsContainer.children.length === 0) elecClearBtn.style.display = 'none';
            updateComparisons();
        });
        
        card.querySelector('.minus-e').addEventListener('click', () => {
            if (currentE > 0) { prevE = currentE; currentE--; renderCard(); setTimeout(updateComparisons, 10); }
        });
        
        card.querySelector('.plus-e').addEventListener('click', () => {
            prevE = currentE; currentE++; renderCard(); setTimeout(updateComparisons, 10);
        });
        
        const resetBtn = card.querySelector('.reset-e');
        if(resetBtn) resetBtn.addEventListener('click', () => {
            currentE = z; renderCard(); setTimeout(updateComparisons, 10);
        });
    }
    
    renderCard();
    
    elecResultsContainer.prepend(card);
    if (elecClearBtn) elecClearBtn.style.display = 'block';
    
    setTimeout(updateComparisons, 10);
}
