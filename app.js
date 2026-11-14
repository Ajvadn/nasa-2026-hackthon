const scenarios = [
  { id: 'europa', name: 'Europa Ice Survey', category: 'OCEAN WORLDS', icon: 'mission-europa', brief: 'Search for clues to a hidden ocean beneath the ice.', targets: ['radar', 'spectrometer'], orbit: 'jupiter', scienceTitle: 'How can radar investigate an ocean beneath ice?', scienceText: 'NASA’s Europa Clipper carries REASON, a dual-frequency radar designed to probe Europa’s ice shell and study its structure. Choose radar to boost the science return in this simplified mission.', source: 'https://europa.nasa.gov/spacecraft/instruments/reason/', sourceLabel: 'NASA · REASON instrument' },
  { id: 'earth', name: 'Earth in Focus', category: 'EARTH OBSERVATION', icon: 'mission-earth', brief: 'Track a changing climate from a front-row seat in orbit.', targets: ['camera', 'thermal'], orbit: 'leo', scienceTitle: 'Why observe Earth in more than visible light?', scienceText: 'Landsat’s OLI and TIRS instruments measure visible, infrared, and thermal wavelengths. Thermal bands help track land-surface temperature; this game pairs surface imaging with thermal mapping to make that contrast visible.', source: 'https://science.nasa.gov/mission/landsat/spectral-bands-and-applications/', sourceLabel: 'NASA Science · Landsat spectral bands' },
  { id: 'asteroid', name: 'Asteroid Scout', category: 'PLANETARY DEFENSE', icon: 'mission-asteroid', brief: 'Map a near-Earth asteroid and measure what it is made of.', targets: ['camera', 'spectrometer'], orbit: 'rendezvous', scienceTitle: 'How do scientists map an asteroid before sampling?', scienceText: 'NASA’s OSIRIS-REx used cameras, a laser altimeter, and visible/infrared spectrometers to map asteroid Bennu and characterize sample sites. Pair imaging with spectroscopy for a stronger survey.', source: 'https://science.nasa.gov/mission/osiris-rex/in-depth/', sourceLabel: 'NASA Science · OSIRIS-REx' }
];

const instruments = [
  { id: 'camera', name: 'High-res camera', sub: 'Detailed images of the surface', mass: 180, power: 90, cost: 130, data: 75, science: 24, comm: 15, icon: 'instrument-camera' },
  { id: 'spectrometer', name: 'Imaging spectrometer', sub: 'Identifies minerals and chemistry', mass: 220, power: 110, cost: 170, data: 65, science: 29, comm: 12, icon: 'instrument-spectrum' },
  { id: 'radar', name: 'Ice-penetrating radar', sub: 'Looks beneath ice and dry ground', mass: 310, power: 180, cost: 230, data: 95, science: 36, comm: 20, icon: 'instrument-radar' },
  { id: 'magnetometer', name: 'Magnetometer', sub: 'Measures magnetic fields nearby', mass: 95, power: 45, cost: 85, data: 30, science: 17, comm: 6, icon: 'instrument-magnetometer' },
  { id: 'thermal', name: 'Thermal mapper', sub: 'Measures surface temperature', mass: 145, power: 75, cost: 105, data: 55, science: 20, comm: 10, icon: 'instrument-thermal' }
];

const buses = [
  { id: 'compact', name: 'Compact Explorer', sub: 'Lean and nimble; less room to grow', mass: 450, power: 280, cost: 310, comm: 55, icon: 'small-satellite' },
  { id: 'standard', name: 'Surveyor Bus', sub: 'A balanced platform for deep-space science', mass: 680, power: 520, cost: 470, comm: 100, icon: 'system-bus' },
  { id: 'heavy', name: 'Deep Space Cruiser', sub: 'More power and communications for the long haul', mass: 1020, power: 850, cost: 690, comm: 175, icon: 'system-orbit' }
];

const rockets = [
  { id: 'small', name: 'Small launcher', payload: 1300, cost: 260 },
  { id: 'medium', name: 'Medium launcher', payload: 2600, cost: 470 },
  { id: 'heavy', name: 'Heavy launcher', payload: 5200, cost: 760 }
];

const orbits = [
  { id: 'leo', name: 'Low Earth orbit', cost: 85, time: 8, comm: 0.96, fit: ['earth'], description: 'Frequent passes over Earth; short communication gaps.' },
  { id: 'geo', name: 'Geostationary orbit', cost: 145, time: 10, comm: 1, fit: ['earth'], description: 'Constant view of one side of Earth; farther and pricier.' },
  { id: 'jupiter', name: 'Jupiter transfer orbit', cost: 270, time: 14, comm: 0.56, fit: ['europa'], description: 'Long journey to the Jovian system; demanding communications.' },
  { id: 'rendezvous', name: 'Asteroid rendezvous', cost: 180, time: 8, comm: 0.78, fit: ['asteroid'], description: 'Match an asteroid’s path to observe it up close.' }
];

const state = { scenario: 'europa', selected: ['radar', 'spectrometer'], bus: 'standard', rocket: 'medium', orbit: 'jupiter', launched: false, run: null, crewSize: 1, crewNames: ['Alex', 'Jordan', 'Sam', 'Riley'], difficulty: 'cadet' };
const BUDGET = 1900;
const crewRoles = ['Mission commander & pilot', 'Flight engineer', 'Science lead', 'Communications lead'];
const $ = (s) => document.querySelector(s);
const byId = (items, id) => items.find((item) => item.id === id);
const format = (n) => Math.round(n).toLocaleString('en-US');
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const iconSvg = (name, className = '') => `<svg class="ui-icon ${className}" aria-hidden="true" focusable="false"><use href="#icon-${name}"></use></svg>`;
let flightRecords = [];
try { const stored = JSON.parse(localStorage.getItem('orbital-flight-records') || '[]'); flightRecords = Array.isArray(stored) ? stored : []; } catch { flightRecords = []; }
let blueprints = [];
let comparisonIds = [];
let comparisonOpen = false;
try { const stored = JSON.parse(localStorage.getItem('orbital-blueprints') || '[]'); blueprints = Array.isArray(stored) ? stored.slice(0, 3) : []; } catch { blueprints = []; }

function renderScenarios() {
  $('#scenario-grid').innerHTML = scenarios.map((item) => {
    const targets = item.targets.map((id) => byId(instruments, id)?.name || id);
    return `<article class="scenario-card ${item.id === state.scenario ? 'selected' : ''}" data-scenario="${item.id}" role="button" tabindex="0" aria-pressed="${item.id === state.scenario}" aria-label="Select ${item.name}, science targets: ${targets.join(' and ')}"><span class="scenario-symbol">${iconSvg(item.icon)}</span><span class="scenario-info"><small>${item.category}</small><strong>${item.name}</strong><p>${item.brief}</p><span class="scenario-targets">SCIENCE TARGETS ${targets.map((name) => `<i>${name}</i>`).join('')}</span></span><span class="scenario-orbit-label">${item.id === 'europa' ? 'JOVIAN SYSTEM' : item.id === 'earth' ? 'EARTH ORBIT' : 'RENDEZVOUS'}</span><span class="select-mark"></span></article>`;
  }).join('');
}

function renderScienceConnection() {
  const s = byId(scenarios, state.scenario);
  const matched = s.targets.filter((id) => state.selected.includes(id)).length;
  const ready = matched === s.targets.length;
  $('#science-connection').innerHTML = `<span class="connection-icon">${iconSvg('brand-orbit')}</span><div class="connection-copy"><small>REAL MISSION CONNECTION · SCIENCE PACKAGE ${matched}/${s.targets.length}</small><strong>${s.scienceTitle}</strong><p>${s.scienceText}</p><div class="mission-target-list">${s.targets.map((id) => { const instrument = byId(instruments, id); const isReady = state.selected.includes(id); return `<button class="mission-target ${isReady ? 'target-ready' : ''}" data-target-instrument="${id}" aria-pressed="${isReady}" title="${isReady ? 'Remove' : 'Add'} ${instrument.name}">${iconSvg(isReady ? 'check' : instrument.icon)}<span>${instrument.name}</span></button>`; }).join('')}<button class="equip-mission" data-equip-mission ${ready ? 'disabled' : ''}>${ready ? `${iconSvg('check')} Science package ready` : `Equip science package ${iconSvg('chevron')}`}</button></div></div><a href="${s.source}" target="_blank" rel="noreferrer">${s.sourceLabel} ↗</a>`;
}

function crewSnapshot() {
  return Array.from({ length: state.crewSize }, (_, i) => ({ name: state.crewNames[i].trim() || `Flight director ${i + 1}`, role: state.crewSize === 1 ? 'Flight director & pilot' : crewRoles[i] }));
}

function renderCrew() {
  $('#crew-size').value = String(state.crewSize);
  $('#difficulty-select').value = state.difficulty;
  const crew = crewSnapshot();
  renderCrewSummary();
  $('#flight-mode-note').textContent = ({ cadet: 'Extra time, a forgiving damage model, and one fewer required target.', mission: 'Balanced flight challenge with the mission’s full science target.', test: 'Tight clock, full science target plus one, and more severe impacts.' })[state.difficulty];
  $('#crew-roster').innerHTML = crew.map((member, i) => `<label class="crew-member"><span class="crew-number">0${i + 1}</span><span class="crew-role">${member.role}</span><input type="text" maxlength="18" value="${escapeHTML(member.name)}" data-crew-name="${i}" aria-label="Name for ${member.role}" /></label>`).join('');
}

function renderCrewSummary() {
  $('#crew-mode-summary').textContent = state.crewSize === 1 ? `Solo mission · ${state.crewNames[0] || 'Flight director'}` : `Crew of ${state.crewSize} · shared console`;
}

function renderArchive() {
  $('#archive-flights').textContent = flightRecords.length;
  $('#archive-best').textContent = flightRecords.length ? `${Math.max(...flightRecords.map((record) => record.score))}` : '—';
  $('#export-button').disabled = flightRecords.length === 0;
  const recent = flightRecords.slice(0, 5);
  $('#archive-list').innerHTML = recent.length ? recent.map((record) => `<div class="archive-row"><span class="archive-grade ${record.success ? 'won' : ''}">${record.success ? '✓' : '·'}</span><div><strong>${escapeHTML(record.mission)}</strong><small>${escapeHTML(record.crew?.map((member) => member.name).join(' + ') || 'Solo')} · ${new Date(record.date).toLocaleDateString()}</small></div><b>${record.score}<small>PTS</small></b></div>`).join('') : '<p class="archive-empty">No flights recorded yet. Complete a mission and your flight report will appear here.</p>';
}

function makeBlueprint() {
  const m = calculate();
  const index = blueprints.filter((item) => item.scenario === state.scenario).length + 1;
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: `${m.scenario.name} · Build ${index}`,
    savedAt: new Date().toISOString(), scenario: state.scenario, instruments: [...state.selected], bus: state.bus, rocket: state.rocket, orbit: state.orbit,
    readiness: m.score, massKg: m.mass, launchCapacityKg: m.capacity, powerW: m.totals.power, availablePowerW: m.power, budgetRemainingM: m.budget, dataGB: m.data, communicationsGB: m.comm
  };
}

function renderBlueprints() {
  $('#compare-count').textContent = comparisonIds.length;
  $('#compare-blueprints').disabled = comparisonIds.length < 2;
  $('#compare-blueprints').innerHTML = comparisonOpen ? 'Hide comparison <span>−</span>' : `Compare <span>${comparisonIds.length}</span>/3`;
  $('#blueprint-compare').classList.toggle('hidden', !comparisonOpen || comparisonIds.length < 2);
  $('#blueprint-list').innerHTML = blueprints.length ? blueprints.map((item) => {
    const mission = byId(scenarios, item.scenario);
    const selected = comparisonIds.includes(item.id);
    const instrumentNames = (item.instruments || []).map((id) => byId(instruments, id)?.name).filter(Boolean).join(' + ') || 'No instruments';
    const budgetLabel = item.budgetRemainingM >= 0 ? `$${format(item.budgetRemainingM)}M left` : `$${format(Math.abs(item.budgetRemainingM))}M over`;
    return `<article class="blueprint-card ${selected ? 'comparing' : ''}"><label class="blueprint-select"><input type="checkbox" data-compare="${item.id}" ${selected ? 'checked' : ''} aria-label="Select ${escapeHTML(item.name)} for comparison"/><span></span></label><div class="blueprint-card-main"><div class="blueprint-card-title"><span class="blueprint-sigil" style="--mission:${item.scenario === 'earth' ? '#8ee6c7' : item.scenario === 'asteroid' ? '#ffc17a' : '#97d9ed'}">${iconSvg(mission?.icon || 'brand-orbit')}</span><div><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(byId(buses, item.bus)?.name || item.bus)} · ${escapeHTML(byId(orbits, item.orbit)?.name || item.orbit)}</small></div></div><div class="blueprint-mini-stats"><span>${format(item.massKg)} kg</span><span>${format(item.powerW)}/${format(item.availablePowerW)} W</span><span>${budgetLabel}</span><span>${item.readiness} readiness</span></div><div class="blueprint-instruments">${escapeHTML(instrumentNames)}</div></div><div class="blueprint-card-actions"><button data-load-blueprint="${item.id}">Use build</button><button data-export-blueprint="${item.id}" aria-label="Export ${escapeHTML(item.name)}">↓</button><button data-remove-blueprint="${item.id}" aria-label="Remove ${escapeHTML(item.name)}">×</button></div></article>`;
  }).join('') : '<div class="blueprint-empty"><span>◇</span><strong>Your design notebook is empty.</strong><small>Save a spacecraft build to compare it with another mission plan.</small></div>';
  if (comparisonOpen && comparisonIds.length >= 2) renderBlueprintComparison();
}

function renderBlueprintComparison() {
  const selected = comparisonIds.map((id) => blueprints.find((item) => item.id === id)).filter(Boolean);
  const rows = [
    ['MISSION', (b) => byId(scenarios, b.scenario)?.name || b.scenario],
    ['READINESS', (b) => `${b.readiness} / 100`],
    ['INSTRUMENTS', (b) => (b.instruments || []).map((id) => byId(instruments, id)?.name).filter(Boolean).join(', ') || 'None'],
    ['SPACECRAFT MASS', (b) => `${format(b.massKg)} / ${format(b.launchCapacityKg)} kg`],
    ['POWER MARGIN', (b) => `${format(b.availablePowerW - b.powerW)} W`],
    ['BUDGET', (b) => b.budgetRemainingM >= 0 ? `$${format(b.budgetRemainingM)}M left` : `$${format(Math.abs(b.budgetRemainingM))}M over`],
    ['DATA / LINK', (b) => `${format(b.dataGB)} / ${format(b.communicationsGB)} GB`],
    ['LAUNCH + ORBIT', (b) => `${byId(rockets, b.rocket)?.name || b.rocket} · ${byId(orbits, b.orbit)?.name || b.orbit}`]
  ];
  $('#blueprint-compare').innerHTML = `<div class="compare-heading"><div><span class="section-kicker">TRADE-OFF STUDY</span><strong>Same question. Different spacecraft.</strong></div><span>${selected.length} builds selected</span></div><div class="compare-grid" style="--compare-count:${selected.length}"><div class="compare-labels"><span>MISSION METRIC</span>${rows.map(([label]) => `<span>${label}</span>`).join('')}</div>${selected.map((blueprint) => `<div class="compare-column"><strong>${escapeHTML(blueprint.name)}</strong>${rows.map(([, value]) => `<span>${escapeHTML(value(blueprint))}</span>`).join('')}<button data-load-blueprint="${blueprint.id}">Fly this build ↗</button></div>`).join('')}</div><p class="compare-note">Values use ORBITAL’s simplified teaching model; compare trade-offs, not flight-ready specifications.</p>`;
}

function persistBlueprints() {
  try { localStorage.setItem('orbital-blueprints', JSON.stringify(blueprints)); return true; } catch { showToast('Browser storage is unavailable; this notebook will reset when you close the page.'); return false; }
}

function saveCurrentBlueprint() {
  if (blueprints.length >= 3) { showToast('Notebook full. Remove a saved build before adding another.'); return; }
  blueprints.unshift(makeBlueprint());
  const persisted = persistBlueprints(); renderBlueprints();
  if (persisted) showToast('Build saved to your mission notebook.');
}

function loadBlueprint(id) {
  const item = blueprints.find((blueprint) => blueprint.id === id);
  if (!item) return;
  state.scenario = item.scenario;
  state.selected = (item.instruments || []).filter((instrumentId) => byId(instruments, instrumentId)).slice(0, 3);
  state.bus = byId(buses, item.bus)?.id || 'standard';
  state.rocket = byId(rockets, item.rocket)?.id || 'medium';
  state.orbit = byId(orbits, item.orbit)?.id || byId(scenarios, item.scenario)?.orbit || 'leo';
  game.active = false; cancelAnimationFrame(animationFrame); held.clear(); state.run = null;
  $('#flight-panel').classList.add('hidden'); $('#debrief').classList.add('hidden'); $('#launch-button').disabled = false; $('#launch-button').innerHTML = '<span>▶</span> Begin mission';
  render(); $('#planner').scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast(`${item.name} loaded into the mission builder.`);
}

function downloadJSON(data, filename) {
  const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a'); link.href = URL.createObjectURL(file); link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function exportBlueprint(id) {
  const item = blueprints.find((blueprint) => blueprint.id === id);
  if (item) downloadJSON(item, `orbital-blueprint-${item.scenario}-${item.savedAt.slice(0, 10)}.json`);
}

function removeBlueprint(id) {
  blueprints = blueprints.filter((item) => item.id !== id);
  comparisonIds = comparisonIds.filter((itemId) => itemId !== id);
  persistBlueprints(); renderBlueprints();
}

function saveFlightRecord(mission, success, score, returnedData) {
  if (!state.run || state.run.saved) return;
  const record = {
    date: new Date().toISOString(), mission: mission.scenario.name, success, score,
    flightMode: state.difficulty,
    samples: game.collected.size, requiredSamples: game.map.goal,
    hullPercent: Math.round(game.hull / game.maxHull * 100), fuelPercent: Math.round(game.fuel / game.maxFuel * 100),
    returnedDataGB: returnedData, crew: state.run.crew,
    spacecraft: { bus: mission.bus.name, rocket: mission.rocket.name, orbit: mission.orbit.name, instruments: mission.payload.map((item) => item.name), massKg: mission.mass, budgetRemainingM: mission.budget }
  };
  flightRecords = [record, ...flightRecords].slice(0, 20);
  state.run.saved = true;
  try { localStorage.setItem('orbital-flight-records', JSON.stringify(flightRecords)); } catch { showToast('Flight finished. Browser storage is unavailable, so this score will not persist.'); }
  renderArchive();
}

function renderInstruments() {
  $('#instrument-list').innerHTML = instruments.map((item) => {
    const checked = state.selected.includes(item.id);
    return `<div class="option-row"><label class="option-card ${checked ? 'selected' : ''}"><input type="checkbox" value="${item.id}" ${checked ? 'checked' : ''} aria-label="${item.name}"/><span class="checkmark"></span><span class="option-icon">${iconSvg(item.icon)}</span><span class="option-copy"><strong>${item.name}</strong><small>${item.sub}</small></span><span class="option-traits"><b>${item.mass} kg</b> · ${item.power} W · $${item.cost}M</span></label><button class="inspect-button" data-inspect="instrument:${item.id}" aria-label="Learn about ${item.name}" title="Inspect ${item.name}">i</button></div>`;
  }).join('');
}

function renderBuses() {
  $('#bus-list').innerHTML = buses.map((item) => `<div class="option-row"><label class="option-card ${item.id === state.bus ? 'selected' : ''}"><input type="radio" name="bus" value="${item.id}" ${item.id === state.bus ? 'checked' : ''} aria-label="${item.name}"/><span class="checkmark"></span><span class="option-icon">${iconSvg(item.icon)}</span><span class="option-copy"><strong>${item.name}</strong><small>${item.sub}</small></span><span class="option-traits"><b>${item.mass} kg</b> · ${item.power} W</span></label><button class="inspect-button" data-inspect="bus:${item.id}" aria-label="Learn about ${item.name}" title="Inspect ${item.name}">i</button></div>`).join('');
}

function renderSelects() {
  $('#rocket-select').innerHTML = rockets.map((r) => `<option value="${r.id}">${r.name} · ${r.payload.toLocaleString()} kg · $${r.cost}M</option>`).join('');
  $('#orbit-select').innerHTML = orbits.map((o) => `<option value="${o.id}">${o.name} · $${o.cost}M</option>`).join('');
  $('#rocket-select').value = state.rocket;
  $('#orbit-select').value = state.orbit;
}

function renderLaunchInsight() {
  const rocket = byId(rockets, state.rocket);
  const orbit = byId(orbits, state.orbit);
  $('#launch-insight').innerHTML = `<span class="insight-mark">↗</span><span><b>${rocket.name}</b> can lift ${format(rocket.payload)} kg. <b>${orbit.name}</b> ${orbit.description.toLowerCase()}</span>`;
}

function renderCraftPreview() {
  const m = calculate();
  const preview = $('#craft-preview');
  preview.dataset.bus = state.bus;
  preview.classList.toggle('scan-active', state.selected.includes('radar') || state.selected.includes('thermal'));
  $('#preview-bus-name').textContent = m.bus.name;
  $('#preview-payload').textContent = `${state.selected.length} instrument${state.selected.length === 1 ? '' : 's'}`;
  $('#preview-mass').textContent = `${format(m.mass)} / ${format(m.capacity)} kg`;
  const powerMargin = m.power - m.totals.power;
  $('#preview-power').textContent = `${powerMargin >= 0 ? '+' : ''}${format(powerMargin)} W`;
  $('#preview-power').classList.toggle('negative', powerMargin < 0);
  $('#preview-profile').textContent = ({ compact: 'Agile · light', standard: 'Balanced', heavy: 'Durable · heavy' })[state.bus];
  const positions = [[241, 60], [298, 60], [241, 92]];
  $('#craft-instrument-points').innerHTML = state.selected.map((id, i) => {
    const instrument = byId(instruments, id), [x, y] = positions[i];
    return `<g class="craft-point"><circle cx="${x}" cy="${y}" r="10"/><svg x="${x - 6}" y="${y - 6}" width="12" height="12" class="craft-node-icon"><use href="#icon-${instrument.icon}"/></svg></g>`;
  }).join('');
  $('#preview-tags').innerHTML = state.selected.length ? state.selected.map((id) => { const item = byId(instruments, id); return `<button class="preview-tag" data-inspect="instrument:${id}" title="Inspect ${item.name}">${iconSvg(item.icon)}${item.name}<i>↗</i></button>`; }).join('') : '<span class="preview-empty">Select instruments to add them to the spacecraft.</span>';
}

function openComponentInfo(kind, id) {
  const dialog = $('#component-dialog');
  if (kind === 'instrument' && id === 'overview') {
    $('#component-kicker').textContent = 'PAYLOAD · SYSTEMS TRADE-OFF';
    $('#component-title').textContent = 'Instruments turn light and signals into science.';
    $('#component-description').textContent = 'Every instrument adds useful measurements and also asks the spacecraft for mass, power, money, and downlink capacity. Select an instrument to see how it affects flight.';
    $('#component-stats').innerHTML = instruments.map((item) => `<span><small>${item.name.toUpperCase()}</small><b>${item.mass} kg · ${item.power} W</b></span>`).join('');
    $('#component-takeaway').innerHTML = '<strong>Design question</strong><p>Which measurement best answers your mission question, and can your bus and communications system support it?</p>';
    dialog.showModal(); return;
  }
  if (kind === 'bus' && id === 'overview') {
    $('#component-kicker').textContent = 'SPACECRAFT BUS · PLATFORM TRADE-OFF';
    $('#component-title').textContent = 'The bus is the spacecraft’s backbone.';
    $('#component-description').textContent = 'It carries the payload and supplies power and communications. A larger bus has more capacity, but its mass and cost leave less room elsewhere in the mission.';
    $('#component-stats').innerHTML = buses.map((item) => `<span><small>${item.name.toUpperCase()}</small><b>${item.mass} kg · ${item.power} W</b></span>`).join('');
    $('#component-takeaway').innerHTML = '<strong>Design question</strong><p>Choose the smallest platform that can support the science your team values most.</p>';
    dialog.showModal(); return;
  }
  if (kind === 'instrument') {
    const item = byId(instruments, id);
    const flightEffects = { camera: 'Slightly widens the sample pickup radius.', spectrometer: 'Adds science points for every sample recovered.', radar: 'Adds hull protection; on Europa it also boosts science return.', magnetometer: 'Widens the sample pickup radius.', thermal: 'Widens the sample pickup radius to detect warm targets.' };
    $('#component-kicker').textContent = 'PAYLOAD INSTRUMENT';
    $('#component-title').textContent = item.name;
    $('#component-description').textContent = `${item.sub}. In the simplified game model, this instrument generates ${item.data} GB of science data and contributes ${item.science} base science points.`;
    $('#component-stats').innerHTML = `<span><small>MASS</small><b>${item.mass} kg</b></span><span><small>POWER</small><b>${item.power} W</b></span><span><small>COST</small><b>$${item.cost}M</b></span><span><small>DATA</small><b>${item.data} GB</b></span>`;
    $('#component-takeaway').innerHTML = `<strong>In flight</strong><p>${flightEffects[item.id]}</p>`;
  } else {
    const item = byId(buses, id);
    const flightEffects = { compact: 'More agile steering, but a smaller hull and less power.', standard: 'Balanced steering, hull, fuel, power, and communications.', heavy: 'More hull and fuel, plus softer impacts; heavier handling.' };
    $('#component-kicker').textContent = 'SPACECRAFT BUS';
    $('#component-title').textContent = item.name;
    $('#component-description').textContent = `${item.sub}. The bus sets available power and communications before instruments and orbit add their own demands.`;
    $('#component-stats').innerHTML = `<span><small>DRY MASS</small><b>${item.mass} kg</b></span><span><small>POWER</small><b>${item.power} W</b></span><span><small>COST</small><b>$${item.cost}M</b></span><span><small>DATA LINK</small><b>${item.comm} GB</b></span>`;
    $('#component-takeaway').innerHTML = `<strong>In flight</strong><p>${flightEffects[item.id]}</p>`;
  }
  dialog.showModal();
}

function calculate() {
  const scenario = byId(scenarios, state.scenario);
  const bus = byId(buses, state.bus);
  const rocket = byId(rockets, state.rocket);
  const orbit = byId(orbits, state.orbit);
  const payload = state.selected.map((id) => byId(instruments, id));
  const totals = payload.reduce((sum, item) => ({ mass: sum.mass + item.mass, power: sum.power + item.power, cost: sum.cost + item.cost, data: sum.data + item.data, science: sum.science + item.science, comm: sum.comm + item.comm }), { mass: 0, power: 0, cost: 0, data: 0, science: 0, comm: 0 });
  const mass = bus.mass + totals.mass;
  const power = bus.power;
  const budget = BUDGET - bus.cost - totals.cost - rocket.cost - orbit.cost;
  const comm = Math.round((bus.comm * orbit.comm));
  const data = totals.data;
  const capacity = rocket.payload;
  const metrics = [
    { id: 'mass', name: 'Spacecraft mass', value: mass, max: capacity, unit: 'kg', label: `${format(mass)} / ${format(capacity)} kg`, fine: 'Rocket payload capacity' },
    { id: 'power', name: 'Available power', value: power, max: Math.max(totals.power, 1), unit: 'W', label: `${format(power)} W available · ${format(totals.power)} W needed`, fine: 'Spacecraft power systems' },
    { id: 'budget', name: 'Budget remaining', value: budget, max: BUDGET, unit: 'M', label: budget >= 0 ? `$${format(budget)}M remaining` : `$${format(Math.abs(budget))}M over budget`, fine: 'Mission development & launch' },
    { id: 'data', name: 'Science data', value: data, max: comm, unit: 'GB', label: `${format(data)} / ${format(comm)} GB capacity`, fine: 'Data generated / return capacity' }
  ];
  let score = 100;
  const issues = [];
  const warnings = [];
  const massUse = mass / capacity;
  const powerUse = totals.power / power;
  const dataUse = data / Math.max(comm, 1);
  if (massUse > 1) { score -= Math.min(30, 16 + (massUse - 1) * 25); issues.push(`Spacecraft is ${format(mass - capacity)} kg above ${rocket.name.toLowerCase()} capacity.`); }
  else if (massUse > .85) { score -= 9; warnings.push('Payload is close to launch vehicle capacity.'); }
  if (powerUse > 1) { score -= Math.min(30, 17 + (powerUse - 1) * 20); issues.push(`Instruments need ${format(totals.power - power)} W more than the bus can supply.`); }
  else if (powerUse > .8) { score -= 7; warnings.push('Power reserves are getting tight.'); }
  if (budget < 0) { score -= Math.min(30, 17 + Math.abs(budget) / 30); issues.push(`Design exceeds the $${format(BUDGET)}M budget by $${format(Math.abs(budget))}M.`); }
  else if (budget < 100) { score -= 8; warnings.push('Very little budget is left for operations.'); }
  if (dataUse > 1) { score -= Math.min(20, 12 + (dataUse - 1) * 10); issues.push(`Communications can return ${format(data - comm)} GB less than the instruments generate.`); }
  else if (dataUse > .85) { score -= 5; warnings.push('Data return capacity has little margin.'); }
  if (!orbit.fit.includes(state.scenario)) { score -= 26; issues.push(`${orbit.name} does not match this mission’s science destination.`); }
  const missing = scenario.targets.filter((target) => !state.selected.includes(target));
  const science = totals.science + (state.selected.includes(scenario.targets[0]) ? 10 : 0) + (state.selected.includes(scenario.targets[1]) ? 8 : 0);
  if (missing.length) { score -= missing.length * 11; warnings.push(`Consider adding a mission-focused instrument (${missing.map((id) => byId(instruments, id).name.toLowerCase()).join(', ')}).`); }
  if (state.selected.length === 0) { score -= 25; warnings.push('Your spacecraft needs at least one science instrument.'); }
  score = Math.max(0, Math.min(100, Math.round(score)));
  let insight = issues[0] || warnings[0] || 'Your design is in good shape. Run the simulation to see how it performs.';
  if (!state.selected.length) insight = 'Add at least one instrument so your spacecraft has science to do.';
  return { scenario, bus, rocket, orbit, payload, totals, mass, power, budget, comm, data, capacity, metrics, score, issues, warnings, science, massUse, powerUse, dataUse, insight };
}

function renderTelemetry() {
  const m = calculate();
  $('#mission-name').textContent = m.scenario.name;
  $('#mission-icon').innerHTML = iconSvg(m.scenario.icon, 'mission-icon-svg');
  $('#health-score').textContent = m.score;
  $('#health-ring').style.background = `conic-gradient(${m.score < 50 ? 'var(--red)' : m.score < 75 ? 'var(--orange)' : 'var(--lime)'} 0deg ${m.score * 3.6}deg,#2b3b48 ${m.score * 3.6}deg 360deg)`;
  $('#health-title').textContent = m.score >= 85 ? 'Ready to fly' : m.score >= 65 ? 'Looking promising' : m.score >= 40 ? 'Needs attention' : 'High risk design';
  $('#health-copy').textContent = m.issues.length ? `${m.issues.length} critical constraint${m.issues.length === 1 ? '' : 's'} to resolve.` : m.warnings.length ? 'A few trade-offs to check before launch.' : 'Your systems are within their limits.';
  $('#mission-insight').textContent = m.insight;
  $('#resource-list').innerHTML = m.metrics.map((item) => {
    let pct = item.id === 'mass' ? m.massUse * 100 : item.id === 'power' ? m.powerUse * 100 : item.id === 'budget' ? Math.max(0, m.budget / BUDGET) * 100 : m.dataUse * 100;
    const cls = pct > 100 ? 'over' : pct > 85 ? 'warn' : '';
    return `<div class="resource-row"><div class="resource-top"><span class="resource-name">${item.name}</span><span class="resource-meta">${item.label}</span></div><div class="bar-track"><div class="bar-fill ${cls}" style="width:${Math.max(2, Math.min(100, pct))}%"></div></div></div>`;
  }).join('');
  $('#design-status').textContent = m.issues.length ? `${m.issues.length} CONSTRAINT${m.issues.length > 1 ? 'S' : ''} TO RESOLVE` : m.score >= 85 ? 'SYSTEMS NOMINAL' : 'DESIGN IN PROGRESS';
  $('#design-status').previousElementSibling.style.background = m.issues.length ? 'var(--red)' : m.score >= 85 ? 'var(--mint)' : 'var(--orange)';
}

function render() { renderScenarios(); renderScienceConnection(); renderCrew(); renderInstruments(); renderBuses(); renderSelects(); renderLaunchInsight(); renderTelemetry(); renderCraftPreview(); renderBlueprints(); }

function explainMetric(label, metric, className) {
  if (className === 'bad') return `${metric}`;
  return metric;
}

const canvas = $('#flight-canvas');
const ctx = canvas.getContext('2d');
const held = new Set();
let animationFrame = 0;
let previousFrame = 0;
let stars = [];
const missionMaps = {
  europa: { title: 'Europa · Ice canyon approach', story: 'Thread between fractured ice ridges, scan the glowing brine pockets, and reach the relay.', goal: 3, time: 80, style: 'ice', accent: '#9be7eb', rockFill: '#435d69', rockStroke: '#8bc8d0', sample: '#8dfff0', rocks: [
    { x: 175, y: 258, r: 42 }, { x: 270, y: 130, r: 31 }, { x: 340, y: 360, r: 44 }, { x: 425, y: 220, r: 35 }, { x: 520, y: 92, r: 42 }, { x: 575, y: 365, r: 36 }, { x: 665, y: 235, r: 47 }, { x: 750, y: 105, r: 27 }, { x: 785, y: 390, r: 39 }
  ], samples: [{ x: 290, y: 270 }, { x: 390, y: 80 }, { x: 490, y: 440 }, { x: 600, y: 155 }, { x: 720, y: 320 }], pickups: [{ x: 455, y: 350, type: 'repair' }, { x: 755, y: 280, type: 'fuel' }] },
  earth: { title: 'Earth · Orbital debris run', story: 'Weave through orbital debris, photograph the highlighted targets, and get the data to the ground station.', goal: 4, time: 72, style: 'debris', accent: '#79d6ff', rockFill: '#536d78', rockStroke: '#97cad4', sample: '#7cdbff', rocks: [
    { x: 165, y: 165, r: 24 }, { x: 255, y: 370, r: 18 }, { x: 330, y: 245, r: 27 }, { x: 430, y: 112, r: 20 }, { x: 505, y: 385, r: 29 }, { x: 595, y: 230, r: 22 }, { x: 680, y: 110, r: 28 }, { x: 755, y: 375, r: 24 }
  ], samples: [{ x: 225, y: 260 }, { x: 355, y: 85 }, { x: 445, y: 300 }, { x: 590, y: 435 }, { x: 735, y: 250 }], pickups: [{ x: 285, y: 105, type: 'fuel' }, { x: 635, y: 350, type: 'repair' }] },
  asteroid: { title: 'Asteroid Scout · Close pass', story: 'Survey four mineral sites in a tight field, then make the rendezvous before your fuel runs low.', goal: 4, time: 92, style: 'asteroid', accent: '#ffbd72', rockFill: '#67574d', rockStroke: '#c59c73', sample: '#ffc16e', rocks: [
    { x: 160, y: 285, r: 38 }, { x: 245, y: 130, r: 35 }, { x: 290, y: 410, r: 27 }, { x: 365, y: 270, r: 49 }, { x: 455, y: 92, r: 31 }, { x: 490, y: 430, r: 43 }, { x: 555, y: 245, r: 36 }, { x: 650, y: 125, r: 43 }, { x: 680, y: 390, r: 32 }, { x: 780, y: 260, r: 44 }
  ], samples: [{ x: 210, y: 270 }, { x: 330, y: 80 }, { x: 450, y: 330 }, { x: 610, y: 270 }, { x: 735, y: 150 }], pickups: [{ x: 425, y: 465, type: 'fuel' }, { x: 710, y: 450, type: 'repair' }] }
};
const game = { active: false, paused: false, ended: false, x: 55, y: 260, vx: 0, vy: 0, hull: 100, fuel: 100, time: 80, collected: new Set(), foundPickups: new Set(), hitCooldown: 0, particles: [], elapsed: 0, map: missionMaps.europa, handling: 1, pickupRadius: 25, sampleBonus: 0, requiredSamples: 3, collisionDamage: 34 };

function startMission() {
  if (state.run && !state.run.finished) return;
  state.run = { points: 0, science: 0, risk: 0, dataRate: 0, log: [], finished: false, crew: crewSnapshot(), id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` };
  const busMods = { compact: { handling: 1.2, hull: 85, fuel: 100 }, standard: { handling: 1, hull: 100, fuel: 110 }, heavy: { handling: .82, hull: 130, fuel: 125 } }[state.bus];
  const flightModes = { cadet: { time: 22, goal: -1, damage: 22, hull: 18, scan: 7, points: 0 }, mission: { time: 0, goal: 0, damage: 34, hull: 0, scan: 0, points: 4 }, test: { time: -16, goal: 1, damage: 44, hull: -8, scan: -2, points: 10 } };
  const mode = flightModes[state.difficulty];
  const map = missionMaps[state.scenario];
  const startingHull = Math.max(60, busMods.hull + (state.selected.includes('radar') ? 15 : 0) + mode.hull);
  Object.assign(game, { active: true, paused: false, ended: false, x: 55, y: 260, vx: 0, vy: 0, hull: startingHull, maxHull: startingHull, fuel: busMods.fuel, maxFuel: busMods.fuel, time: Math.max(35, map.time + mode.time), collected: new Set(), foundPickups: new Set(), hitCooldown: 0, particles: [], elapsed: 0, map, handling: busMods.handling, pickupRadius: Math.max(20, 25 + (state.selected.includes('magnetometer') ? 9 : 0) + (state.selected.includes('camera') ? 4 : 0) + (state.selected.includes('thermal') ? 5 : 0) + mode.scan), sampleBonus: (state.selected.includes('spectrometer') ? 3 : 0) + (state.selected.includes('radar') && state.scenario === 'europa' ? 4 : 0), requiredSamples: Math.max(2, Math.min(map.samples.length, map.goal + mode.goal)), collisionDamage: mode.damage });
  stars = Array.from({ length: 95 }, () => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 1.5 + .35, twinkle: Math.random() * 6 }));
  held.clear();
  $('#debrief').classList.add('hidden');
  $('#flight-panel').classList.remove('hidden', 'finished');
  $('#game-overlay').classList.add('hidden');
  $('#flight-panel').scrollIntoView({ behavior: 'smooth', block: 'center' });
  $('#launch-button').innerHTML = '<span>✓</span> Flight in progress';
  $('#launch-button').disabled = true;
  $('#game-status').textContent = 'UNDERWAY';
  $('#flight-log').innerHTML = '';
  $('#flight-title').textContent = game.map.title;
  $('#flight-story').textContent = `${game.map.story} ${state.run.crew[0].name} takes the first pilot shift.`;
  $('#game-hint').textContent = `${game.requiredSamples} samples to unlock the relay · pickups restore fuel or hull`;
  updateGameHud();
  cancelAnimationFrame(animationFrame);
  previousFrame = 0;
  animationFrame = requestAnimationFrame(gameFrame);
}

function updateGameHud() {
  $('#game-samples').textContent = `${game.collected.size} / ${game.requiredSamples}`;
  $('#game-hull').textContent = `${Math.max(0, Math.round(game.hull / game.maxHull * 100))}%`;
  $('#game-fuel').textContent = `${Math.max(0, Math.round(game.fuel / game.maxFuel * 100))}%`;
  const seconds = Math.max(0, Math.ceil(game.time));
  $('#game-time').textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  $('#hull-meter').style.width = `${Math.max(0, game.hull / game.maxHull * 100)}%`;
  $('#fuel-meter').style.width = `${Math.max(0, game.fuel / game.maxFuel * 100)}%`;
  if (game.collected.size >= game.requiredSamples) $('#game-hint').textContent = 'Science goal met — reach the green relay ring!';
}

function gameFrame(now) {
  if (!game.active) return;
  if (game.paused) { drawGame(); animationFrame = requestAnimationFrame(gameFrame); return; }
  const dt = Math.min(.035, previousFrame ? (now - previousFrame) / 1000 : .016);
  previousFrame = now;
  game.elapsed += dt;
  updateGame(dt);
  drawGame();
  updateGameHud();
  if (game.active) animationFrame = requestAnimationFrame(gameFrame);
}

function updateGame(dt) {
  const up = held.has('ArrowUp') || held.has('KeyW');
  const down = held.has('ArrowDown') || held.has('KeyS');
  const left = held.has('ArrowLeft') || held.has('KeyA');
  const right = held.has('ArrowRight') || held.has('KeyD');
  const boost = (held.has('Space') || held.has(' ')) && game.fuel > 0;
  const dx = (right ? 1 : 0) - (left ? 1 : 0);
  const dy = (down ? 1 : 0) - (up ? 1 : 0);
  const thrust = (boost ? 330 : 205) * game.handling;
  if (dx || dy) {
    const mag = Math.hypot(dx, dy) || 1;
    game.vx += (dx / mag) * thrust * dt;
    game.vy += (dy / mag) * thrust * dt;
    game.fuel = Math.max(0, game.fuel - dt * (boost ? 2.7 : .85) / game.handling);
    if (game.elapsed % .055 < dt) game.particles.push({ x: game.x, y: game.y, vx: -dx * 15 + (Math.random() - .5) * 25, vy: -dy * 15 + (Math.random() - .5) * 25, life: .28, max: .28 });
  }
  const drag = Math.pow(.985, dt * 60);
  game.vx *= drag; game.vy *= drag;
  const maxSpeed = boost ? 250 : 175;
  const speed = Math.hypot(game.vx, game.vy);
  if (speed > maxSpeed) { game.vx = game.vx / speed * maxSpeed; game.vy = game.vy / speed * maxSpeed; }
  game.x += game.vx * dt; game.y += game.vy * dt;
  if (game.x < 15) { game.x = 15; game.vx = Math.abs(game.vx) * .5; }
  if (game.x > 885) { game.x = 885; game.vx = -Math.abs(game.vx) * .5; }
  if (game.y < 15) { game.y = 15; game.vy = Math.abs(game.vy) * .5; }
  if (game.y > 505) { game.y = 505; game.vy = -Math.abs(game.vy) * .5; }
  game.hitCooldown = Math.max(0, game.hitCooldown - dt);
  for (const rock of game.map.rocks) {
    const ddx = game.x - rock.x, ddy = game.y - rock.y, distance = Math.hypot(ddx, ddy);
    if (distance < rock.r + 12 && game.hitCooldown <= 0) {
      game.hull = Math.max(0, game.hull - (state.bus === 'heavy' ? game.collisionDamage * .75 : game.collisionDamage));
      game.hitCooldown = 1.05;
      const n = distance || 1;
      game.vx += ddx / n * 145; game.vy += ddy / n * 145;
      burst(game.x, game.y, '#ff987d', 18);
      $('#game-hint').textContent = 'Impact! Hull damaged — steer around the asteroids.';
      if (game.hull <= 0) return endGame('HULL LOST', 'Asteroid impacts disabled the spacecraft before it reached the relay.');
    }
  }
  for (let i = 0; i < game.map.samples.length; i++) {
    const item = game.map.samples[i];
    if (!game.collected.has(i) && Math.hypot(game.x - item.x, game.y - item.y) < game.pickupRadius) {
      game.collected.add(i); burst(item.x, item.y, game.map.sample, 14);
      const pilot = state.run.crew[(game.collected.size - 1) % state.run.crew.length];
      state.run.log.push(`${pilot.name} secured sample ${game.collected.size}`);
      $('#flight-log').innerHTML = state.run.log.map((line) => `<span class="log-chip">✳ ${line}</span>`).join('');
      const nextPilot = state.run.crew[game.collected.size % state.run.crew.length];
      $('#game-hint').textContent = game.collected.size < game.requiredSamples ? `${nextPilot.name}, your pilot shift — sample secured!` : 'Science goal met — head for the relay!';
      if (state.run.crew.length > 1 && game.collected.size < game.requiredSamples) {
        game.paused = true;
        $('#game-status').textContent = 'SHIFT CHANGE';
        $('#overlay-title').textContent = `Pilot shift: ${nextPilot.name}`;
        $('#overlay-copy').textContent = `${nextPilot.role} · Sample ${game.collected.size} secured. Take the controls for the next leg.`;
        $('#overlay-button').textContent = `${nextPilot.name} takes control`;
        $('#game-overlay').classList.remove('hidden');
      }
    }
  }
  game.map.pickups.forEach((item, i) => {
    if (game.foundPickups.has(i) || Math.hypot(game.x - item.x, game.y - item.y) >= 22) return;
    game.foundPickups.add(i);
    if (item.type === 'fuel') game.fuel = Math.min(game.maxFuel, game.fuel + game.maxFuel * .28);
    else game.hull = Math.min(game.maxHull, game.hull + game.maxHull * .32);
    burst(item.x, item.y, item.type === 'fuel' ? '#ffc16e' : '#80d6ff', 15);
    $('#game-hint').textContent = item.type === 'fuel' ? 'Fuel cell collected — boost on!' : 'Repair kit collected — hull restored!';
  });
  game.particles = game.particles.filter((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; return p.life > 0; });
  if (Math.hypot(game.x - 842, game.y - 260) < 39 && game.collected.size >= game.requiredSamples) return endGame('RELAY REACHED', 'You made it through the field with your science data aboard.');
  if (game.fuel <= 0 && speed < 8) return endGame('FUEL DEPLETED', 'The spacecraft ran out of fuel before reaching the relay.');
  game.time -= dt;
  if (game.time <= 0) return endGame('TIME EXPIRED', 'The relay window closed before the spacecraft arrived.');
}

function burst(x, y, color, count) {
  for (let i = 0; i < count; i++) { const a = Math.random() * Math.PI * 2, v = 30 + Math.random() * 130; game.particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: .45 + Math.random() * .4, max: .85, color }); }
}

function drawGame() {
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const bg = ctx.createLinearGradient(0, 0, w, h); bg.addColorStop(0, '#0a1623'); bg.addColorStop(.55, '#0c1b27'); bg.addColorStop(1, '#101c29');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#97b4b30b'; ctx.lineWidth = 1;
  ctx.strokeStyle = `${game.map.accent}0b`; ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 45) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += 45) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  stars.forEach((s) => { ctx.globalAlpha = .35 + .5 * Math.abs(Math.sin(game.elapsed + s.twinkle)); ctx.fillStyle = '#d5e7df'; ctx.fillRect(s.x, s.y, s.size, s.size); }); ctx.globalAlpha = 1;
  if (game.map.style === 'ice') { const planet = ctx.createRadialGradient(860, 55, 7, 855, 55, 94); planet.addColorStop(0, '#a1edf099'); planet.addColorStop(.6, '#5297a055'); planet.addColorStop(1, '#21485c00'); ctx.fillStyle = planet; ctx.beginPath(); ctx.arc(855, 55, 94, 0, Math.PI * 2); ctx.fill(); }
  if (game.map.style === 'earth') { const planet = ctx.createRadialGradient(24, 500, 4, 24, 500, 145); planet.addColorStop(0, '#1c6fa7aa'); planet.addColorStop(.72, '#143d66aa'); planet.addColorStop(1, '#143d6600'); ctx.fillStyle = planet; ctx.beginPath(); ctx.arc(24, 500, 145, 0, Math.PI * 2); ctx.fill(); }
  if (game.map.style === 'asteroid') { const planet = ctx.createRadialGradient(448, 534, 15, 448, 534, 110); planet.addColorStop(0, '#a07148aa'); planet.addColorStop(.8, '#59463baa'); planet.addColorStop(1, '#59463b00'); ctx.fillStyle = planet; ctx.beginPath(); ctx.arc(448, 534, 110, 0, Math.PI * 2); ctx.fill(); }
  const gateGlow = ctx.createRadialGradient(842, 260, 4, 842, 260, 57); gateGlow.addColorStop(0, `${game.map.accent}22`); gateGlow.addColorStop(1, `${game.map.accent}00`); ctx.fillStyle = gateGlow; ctx.beginPath(); ctx.arc(842, 260, 57, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = game.collected.size >= game.requiredSamples ? game.map.accent : '#65756b'; ctx.lineWidth = 3; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.arc(842, 260, 26, game.elapsed * .7, game.elapsed * .7 + Math.PI * 1.65); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = game.map.accent; ctx.font = '10px "DM Mono", monospace'; ctx.textAlign = 'center'; ctx.fillText('RELAY', 842, 302);
  game.map.rocks.forEach((r, i) => {
    const a = game.elapsed * (i % 2 ? -.04 : .035) + i;
    if (game.map.style === 'debris') {
      ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(a * 2); ctx.fillStyle = game.map.rockFill; ctx.strokeStyle = game.map.rockStroke; ctx.lineWidth = 1.2;
      ctx.fillRect(-r.r * .48, -r.r * .27, r.r * .96, r.r * .54); ctx.strokeRect(-r.r * .48, -r.r * .27, r.r * .96, r.r * .54);
      ctx.fillStyle = `${game.map.accent}88`; ctx.fillRect(-r.r * .85, -r.r * .12, r.r * .36, r.r * .24); ctx.fillRect(r.r * .49, -r.r * .12, r.r * .36, r.r * .24); ctx.restore(); return;
    }
    ctx.fillStyle = game.map.rockFill; ctx.strokeStyle = game.map.rockStroke; ctx.lineWidth = 1.3; ctx.beginPath();
    for (let n = 0; n < 10; n++) { const ang = a + n * Math.PI / 5, rad = r.r * (.83 + .13 * Math.sin(n * 8 + i)); const x = r.x + Math.cos(ang) * rad, y = r.y + Math.sin(ang) * rad; if (!n) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
    ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#92979a55'; ctx.beginPath(); ctx.arc(r.x - r.r * .2, r.y - r.r * .15, r.r * .2, 0, 6.3); ctx.fill();
  });
  game.map.samples.forEach((p, i) => { if (game.collected.has(i)) return; const pulse = 1 + Math.sin(game.elapsed * 4 + i) * .15; ctx.fillStyle = `${game.map.sample}18`; ctx.beginPath(); ctx.arc(p.x, p.y, 20 * pulse, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#edffbd'; ctx.lineWidth = 1.2; if (game.map.style === 'earth') { ctx.strokeRect(p.x - 7 * pulse, p.y - 7 * pulse, 14 * pulse, 14 * pulse); ctx.fillStyle = game.map.sample; ctx.fillRect(p.x - 3, p.y - 3, 6, 6); } else if (game.map.style === 'asteroid') { ctx.fillStyle = game.map.sample; ctx.beginPath(); ctx.moveTo(p.x, p.y - 8 * pulse); ctx.lineTo(p.x + 6 * pulse, p.y); ctx.lineTo(p.x, p.y + 8 * pulse); ctx.lineTo(p.x - 6 * pulse, p.y); ctx.closePath(); ctx.fill(); ctx.stroke(); } else { ctx.fillStyle = game.map.sample; ctx.beginPath(); ctx.arc(p.x, p.y, 6 * pulse, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); } });
  game.map.pickups.forEach((p, i) => { if (game.foundPickups.has(i)) return; const color = p.type === 'fuel' ? '#ffc16e' : '#80d6ff'; ctx.strokeStyle = color; ctx.fillStyle = `${color}22`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, 11 + Math.sin(game.elapsed * 4 + i) * 1.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = color; ctx.font = '10px "DM Mono", monospace'; ctx.textAlign = 'center'; ctx.fillText(p.type === 'fuel' ? 'F' : '+', p.x, p.y + 3); });
  game.particles.forEach((p) => { ctx.globalAlpha = Math.max(0, p.life / p.max); ctx.fillStyle = p.color || '#ffb969'; ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2); ctx.fill(); }); ctx.globalAlpha = 1;
  const angle = Math.hypot(game.vx, game.vy) > 8 ? Math.atan2(game.vy, game.vx) : -Math.PI / 2;
  ctx.save(); ctx.translate(game.x, game.y); ctx.rotate(angle);
  if (held.has('Space') || held.has(' ')) { ctx.fillStyle = '#ffbd63'; ctx.beginPath(); ctx.moveTo(-10, -5); ctx.lineTo(-20 - Math.random() * 8, 0); ctx.lineTo(-10, 5); ctx.fill(); }
  ctx.fillStyle = '#dfe9e6'; ctx.strokeStyle = '#a6c5b3'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(15, 0); ctx.lineTo(-9, -9); ctx.lineTo(-5, 0); ctx.lineTo(-9, 9); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#8edcff'; ctx.beginPath(); ctx.arc(2, 0, 3.4, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  if (game.hitCooldown > 0 && Math.floor(game.elapsed * 18) % 2 === 0) { ctx.strokeStyle = '#ff817eaa'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(game.x, game.y, 19, 0, Math.PI * 2); ctx.stroke(); }
  ctx.textAlign = 'left';
}

function endGame(title, message) {
  if (!game.active) return;
  game.active = false; game.ended = true; state.run.finished = true;
  state.run.reachedRelay = title === 'RELAY REACHED';
  state.run.science = game.collected.size * (8 + game.sampleBonus);
  state.run.points = game.collected.size * 3 + Math.round(game.hull / game.maxHull * 20) + ({ cadet: 0, mission: 4, test: 10 }[state.difficulty]);
  state.run.risk = (100 - game.hull) * .35 + (100 - game.fuel) * .04;
  state.run.dataRate = game.collected.size / game.map.samples.length;
  $('#game-status').textContent = state.run.reachedRelay ? 'RELAY REACHED' : 'FLIGHT ENDED';
  $('#flight-title').textContent = title;
  $('#flight-story').textContent = message;
  $('#game-overlay').classList.remove('hidden');
  $('#overlay-title').textContent = title;
  $('#overlay-copy').textContent = `${game.collected.size}/${game.requiredSamples} science targets · ${Math.round(game.hull / game.maxHull * 100)}% hull · ${Math.max(0, Math.ceil(game.time))} seconds remaining`;
  $('#overlay-button').textContent = 'View mission report';
  $('#game-hint').textContent = state.run.reachedRelay ? 'Nice flying, flight director.' : 'Tip: collect the targets first, then head for the relay.';
}

function runSimulation() {
  const m = calculate();
  const run = state.run || { points: 0, science: 0, risk: 0, dataRate: 1, log: [] };
  const returnedData = Math.round(Math.min(m.data, m.comm) * run.dataRate);
  const score = Math.max(0, Math.min(100, Math.round(m.score + run.points - Math.max(0, run.risk) * .55)));
  const success = Boolean(run.reachedRelay) && score >= 60 && !m.issues.some((x) => x.startsWith('Spacecraft is') || x.startsWith('Instruments need') || x.startsWith('Design exceeds') || x.startsWith(m.orbit.name));
  const title = success ? (score > 84 ? 'Science mission accomplished' : 'Mission returns useful science') : 'Mission needs another design pass';
  $('#debrief-title').textContent = title;
  $('#debrief-summary').textContent = success ? `${m.scenario.name} reached ${m.orbit.name.toLowerCase()} and returned ${returnedData} GB of science data. Your piloting earned ${run.points} flight points for a final score of ${score}/100.` : `${run.log.length} science sample${run.log.length === 1 ? '' : 's'} secured. ${run.reachedRelay ? 'The spacecraft reached the relay, but a design constraint remains.' : 'The spacecraft did not reach the relay.'} Review the report and try another flight.`;
  $('#final-score').textContent = score;
  $('#mission-grade').style.borderColor = success ? '#45624b' : '#654447';
  $('#mission-grade').style.background = success ? '#182720' : '#2b2024';
  const cards = [
    { label: 'SCIENCE RETURN', good: state.selected.length > 0, title: `${Math.max(0, m.science + run.science)} science points`, detail: m.scenario.targets.every((id) => state.selected.includes(id)) ? `Your payload covered the key targets; piloting added ${run.science} science points.` : 'Some mission science targets are not covered.' },
    { label: 'SYSTEMS CHECK', good: !m.issues.some((x) => x.startsWith('Spacecraft is') || x.startsWith('Instruments need')), title: m.massUse <= 1 && m.powerUse <= 1 ? 'Within key limits' : 'Over a spacecraft limit', detail: `${format(m.mass)} kg spacecraft · ${format(m.totals.power)} W instrument demand.` },
    { label: 'DATA RETURN', good: returnedData >= m.data, title: `${format(returnedData)} GB returned`, detail: returnedData >= m.data ? 'The full planned dataset made it home.' : `${format(m.data - returnedData)} GB stayed onboard or missed the downlink.` },
    { label: 'BUDGET', good: m.budget >= 0, title: m.budget >= 0 ? `$${format(m.budget)}M in reserve` : `$${format(-m.budget)}M over budget`, detail: `Estimated mission cost: $${format(BUDGET - m.budget)}M of $${format(BUDGET)}M.` },
    { label: 'MISSION FIT', good: m.orbit.fit.includes(state.scenario), title: m.orbit.fit.includes(state.scenario) ? 'Destination matched' : 'Destination mismatch', detail: `${m.orbit.name} ${m.orbit.fit.includes(state.scenario) ? 'supports' : 'does not support'} this mission objective.` },
    { label: 'MISSION VALUE', good: score >= 70, title: score >= 85 ? 'Strong mission' : score >= 60 ? 'Promising flight' : 'Needs another pass', detail: `${run.points} flight points · ${Math.max(0, m.science + run.science)} science points · ${score}/100 total.` }
  ];
  $('#outcome-grid').innerHTML = cards.map((c) => `<article class="outcome-card ${c.good ? 'good' : 'bad'}"><span>${c.label}</span><strong>${c.title}</strong><p>${c.detail}</p></article>`).join('');
  const lesson = m.issues[0] || m.warnings[0] || 'A healthy margin helps a mission handle the unexpected.';
  $('#lesson-copy').textContent = `${lesson} ${run.crew.length > 1 ? `Your crew (${run.crew.map((member) => `${member.name}, ${member.role}`).join('; ')})` : 'You'} secured ${run.log.length} science targets and earned ${run.points} flight points. ${m.scenario.scienceText}`;
  $('#lesson-source').href = m.scenario.source;
  $('#lesson-source').textContent = m.scenario.sourceLabel + ' ↗';
  saveFlightRecord(m, success, score, returnedData);
  $('#debrief').classList.remove('hidden');
  $('#debrief').scrollIntoView({ behavior: 'smooth', block: 'start' });
  $('#toast').textContent = success ? 'Simulation complete · mission data received' : 'Simulation complete · review the flight report';
  $('#toast').classList.add('show');
  setTimeout(() => $('#toast').classList.remove('show'), 2600);
}

function reset() {
  game.active = false; cancelAnimationFrame(animationFrame); held.clear();
  state.scenario = 'europa'; state.selected = ['radar', 'spectrometer']; state.bus = 'standard'; state.rocket = 'medium'; state.orbit = 'jupiter'; state.launched = false; state.run = null; state.crewSize = 1; state.crewNames = ['Alex', 'Jordan', 'Sam', 'Riley']; state.difficulty = 'cadet';
  $('#debrief').classList.add('hidden'); $('#flight-panel').classList.add('hidden'); $('#flight-panel').classList.remove('finished'); $('#launch-button').disabled = false; $('#launch-button').innerHTML = '<span>▶</span> Begin mission'; render(); window.scrollTo({ top: 0, behavior: 'smooth' });
}

$('#scenario-grid').addEventListener('click', (e) => {
  const card = e.target.closest('[data-scenario]'); if (!card) return;
  state.scenario = card.dataset.scenario;
  state.orbit = byId(scenarios, state.scenario).orbit;
  $('#debrief').classList.add('hidden'); render();
});
$('#scenario-grid').addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-scenario]')) { e.preventDefault(); e.target.click(); } });
$('#scenario-grid').addEventListener('pointermove', (e) => {
  const card = e.target.closest('[data-scenario]');
  if (!card || e.pointerType === 'touch') return;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--pointer-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
  card.style.setProperty('--pointer-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  card.style.setProperty('--tilt-x', `${((e.clientX - rect.left) / rect.width - .5) * 2}deg`);
  card.style.setProperty('--tilt-y', `${(.5 - (e.clientY - rect.top) / rect.height) * 2}deg`);
});
$('#scenario-grid').addEventListener('pointerleave', (e) => {
  const card = e.target.closest('[data-scenario]');
  if (card) { card.style.removeProperty('--pointer-x'); card.style.removeProperty('--pointer-y'); card.style.removeProperty('--tilt-x'); card.style.removeProperty('--tilt-y'); }
}, true);
$('#science-connection').addEventListener('click', (e) => {
  const target = e.target.closest('[data-target-instrument]');
  const mission = byId(scenarios, state.scenario);
  if (target) {
    const id = target.dataset.targetInstrument;
    if (state.selected.includes(id)) state.selected = state.selected.filter((item) => item !== id);
    else if (state.selected.length < 3) state.selected.push(id);
    else { showToast('Payload full. Remove an instrument before adding this science target.'); return; }
    render();
    return;
  }
  if (e.target.closest('[data-equip-mission]')) {
    state.selected = [...new Set([...mission.targets, ...state.selected.filter((id) => !mission.targets.includes(id))])].slice(0, 3);
    render();
    $('#instrument-list').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});
$('#crew-size').addEventListener('change', (e) => { state.crewSize = Number(e.target.value); renderCrew(); });
$('#difficulty-select').addEventListener('change', (e) => { state.difficulty = e.target.value; renderCrew(); });
$('#crew-roster').addEventListener('input', (e) => { if (e.target.matches('[data-crew-name]')) { state.crewNames[Number(e.target.dataset.crewName)] = e.target.value; renderCrewSummary(); } });
$('#instrument-list').addEventListener('click', (e) => { const button = e.target.closest('[data-inspect]'); if (button) { const [kind, id] = button.dataset.inspect.split(':'); openComponentInfo(kind, id); } });
$('#bus-list').addEventListener('click', (e) => { const button = e.target.closest('[data-inspect]'); if (button) { const [kind, id] = button.dataset.inspect.split(':'); openComponentInfo(kind, id); } });
$('#preview-tags').addEventListener('click', (e) => { const button = e.target.closest('[data-inspect]'); if (button) { const [kind, id] = button.dataset.inspect.split(':'); openComponentInfo(kind, id); } });
$('#instrument-help').addEventListener('click', () => openComponentInfo('instrument', 'overview'));
$('#bus-help').addEventListener('click', () => openComponentInfo('bus', 'overview'));
$('#save-blueprint').addEventListener('click', saveCurrentBlueprint);
$('#compare-blueprints').addEventListener('click', () => { comparisonOpen = !comparisonOpen; renderBlueprints(); });
$('#blueprint-list').addEventListener('change', (e) => {
  const checkbox = e.target.closest('[data-compare]');
  if (!checkbox) return;
  const id = checkbox.dataset.compare;
  if (checkbox.checked && comparisonIds.length >= 3) { checkbox.checked = false; showToast('Compare up to three builds at a time.'); return; }
  comparisonIds = checkbox.checked ? [...comparisonIds, id] : comparisonIds.filter((itemId) => itemId !== id);
  comparisonOpen = comparisonIds.length >= 2;
  renderBlueprints();
});
$('#blueprint-list').addEventListener('click', (e) => {
  const load = e.target.closest('[data-load-blueprint]');
  const download = e.target.closest('[data-export-blueprint]');
  const remove = e.target.closest('[data-remove-blueprint]');
  if (load) loadBlueprint(load.dataset.loadBlueprint);
  else if (download) exportBlueprint(download.dataset.exportBlueprint);
  else if (remove) removeBlueprint(remove.dataset.removeBlueprint);
});
$('#blueprint-compare').addEventListener('click', (e) => { const load = e.target.closest('[data-load-blueprint]'); if (load) loadBlueprint(load.dataset.loadBlueprint); });
$('#instrument-list').addEventListener('change', (e) => {
  if (e.target.type !== 'checkbox') return;
  if (e.target.checked && state.selected.length >= 3) { e.target.checked = false; showToast('A spacecraft can carry up to 3 instruments.'); return; }
  state.selected = [...document.querySelectorAll('#instrument-list input:checked')].map((input) => input.value);
  $('#debrief').classList.add('hidden'); render();
});
$('#bus-list').addEventListener('change', (e) => { if (e.target.name !== 'bus') return; state.bus = e.target.value; $('#debrief').classList.add('hidden'); render(); });
$('#rocket-select').addEventListener('change', (e) => { state.rocket = e.target.value; $('#debrief').classList.add('hidden'); render(); });
$('#orbit-select').addEventListener('change', (e) => { state.orbit = e.target.value; $('#debrief').classList.add('hidden'); render(); });
$('#launch-button').addEventListener('click', startMission);
$('#overlay-button').addEventListener('click', () => {
  if (game.paused) {
    game.paused = false; $('#game-overlay').classList.add('hidden'); $('#game-status').textContent = 'UNDERWAY';
    $('#game-hint').textContent = `${state.run.crew[game.collected.size % state.run.crew.length].name} has the controls`;
    held.clear(); return;
  }
  runSimulation();
});
$('#export-button').addEventListener('click', () => {
  if (!flightRecords.length) return;
  const record = flightRecords[0];
  downloadJSON(record, `orbital-flight-${record.date.slice(0, 10)}.json`);
});
window.addEventListener('keydown', (e) => {
  if (!game.active) return;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) held.add(e.code);
});
window.addEventListener('keyup', (e) => held.delete(e.code));
window.addEventListener('blur', () => held.clear());
document.querySelectorAll('.touch-pad [data-key]').forEach((button) => {
  const code = button.dataset.key;
  button.addEventListener('pointerdown', (e) => { e.preventDefault(); button.setPointerCapture(e.pointerId); held.add(code); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((name) => button.addEventListener(name, () => held.delete(code)));
});
$('#reset-button').addEventListener('click', reset);
$('#replay-button').addEventListener('click', () => { game.active = false; cancelAnimationFrame(animationFrame); held.clear(); $('#debrief').classList.add('hidden'); $('#flight-panel').classList.add('hidden'); $('#flight-panel').classList.remove('finished'); $('#launch-button').disabled = false; $('#launch-button').innerHTML = '<span>▶</span> Begin mission'; state.run = null; $('#planner').scrollIntoView({ behavior: 'smooth' }); });
function showToast(message) { $('#toast').textContent = message; $('#toast').classList.add('show'); setTimeout(() => $('#toast').classList.remove('show'), 2300); }
const dialog = $('#help-dialog');
$('#help-button').addEventListener('click', () => dialog.showModal());
$('#dialog-close').addEventListener('click', () => dialog.close());
$('#got-it').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
$('#component-close').addEventListener('click', () => $('#component-dialog').close());
$('#component-done').addEventListener('click', () => $('#component-dialog').close());
$('#component-dialog').addEventListener('click', (e) => { if (e.target === e.currentTarget) e.currentTarget.close(); });
const modelDialog = $('#model-dialog');
$('#model-info-button').addEventListener('click', () => modelDialog.showModal());
$('#model-close').addEventListener('click', () => modelDialog.close());
$('#model-done').addEventListener('click', () => modelDialog.close());
modelDialog.addEventListener('click', (e) => { if (e.target === modelDialog) modelDialog.close(); });
function updateClock() { $('#clock').textContent = new Date().toISOString().slice(11, 19) + ' UTC'; }
updateClock(); setInterval(updateClock, 1000);
render();
renderArchive();
