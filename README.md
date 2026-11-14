# ORBITAL — Design it. Fly it. Learn it.

ORBITAL turns space mission design into a cooperative, playable learning game. A crew picks a science question, builds a spacecraft under competing limits, pilots it through a target-specific route, and sees exactly how the design and flight affected the science return.

## Play the demo

Open `index.html` in a current browser. Choose Europa, Earth, or Asteroid Scout. Select solo or a crew of up to four, then choose Cadet, Mission, or Flight Test mode. Configure instruments, spacecraft bus, launch vehicle, and orbit; telemetry updates as the design changes. Click **Begin mission**. Steer with **WASD** or arrow keys and hold **Space** to boost. Mobile players can use the on-screen controls.

Collect the route’s required science targets, avoid hazards, use fuel and repair pickups, and reach the relay before time expires. The crew takes turns at sample checkpoints. The debrief scores the engineering design and flight, explains the science trade-offs, and saves the run to the local mission log. Export a flight record as JSON for a presentation or follow-up analysis.

Save up to three spacecraft configurations in the design notebook. Select two or three to compare mission readiness, payload mass, power margin, budget, data volume, and communications capacity. Reload any saved build or export it as JSON.

## What makes the project a strong challenge response

- **Complete mission loop:** objective → crew and difficulty → spacecraft design → hands-on flight → explanatory debrief.
- **Integrated trade-offs:** mass, power, budget, data volume, communications, launch capacity, and orbit affect readiness; instruments and spacecraft bus also change flight handling and rewards.
- **Cooperative play:** shared-console roles let up to four people divide mission planning and rotate pilot shifts.
- **Science grounding:** each route explains a real mission or instrument connection and links directly to NASA source material.
- **Accessible replay:** keyboard and touch controls, three difficulty levels, multiple routes, resource pickups, and a persistent local flight log.
- **Interactive design desk:** a spacecraft schematic, power/mass readouts, and inspectable instrument and bus cards update as the design changes. Save, compare, reload, and export alternative blueprints.
- **Clear presentation:** each run produces a score, mission outcome, science lesson, crew record, and exportable JSON artifact.

## Short demo script

1. Select **Europa Ice Survey** and point out the NASA REASON instrument reference.
2. Switch to a four-person crew and assign the commander, engineer, science lead, and communications lead.
3. Show how changing the bus or instruments moves mass, power, budget, and data telemetry.
4. Begin the flight, collect targets, take damage or recover a pickup, and pilot to the relay.
5. Read the debrief’s explanation, then export the flight record.

## Project files

- `index.html` — game interface, crew setup, mission source cards, and report.
- `styles.css` — responsive visual system and touch layout.
- `app.js` — mission models, resource scoring, Canvas flight game, crew turns, and local flight archive.

The resource values, costs, orbital capacities, route geometry, and outcomes are simplified teaching estimates created for this game; they are not NASA flight-planning data. NASA pages are linked as science context, not as inputs to a validated engineering model. Flight records are stored only in the current browser and are not uploaded.

## Science references

- [NASA Europa Clipper — REASON ice-penetrating radar](https://europa.nasa.gov/spacecraft/instruments/reason/)
- [NASA Science — Landsat spectral bands and applications](https://science.nasa.gov/mission/landsat/spectral-bands-and-applications/)
- [NASA Science — OSIRIS-REx mission and instrument suite](https://science.nasa.gov/mission/osiris-rex/in-depth/)

## Judging fit

The 2026 local event overview lists Impact, Creativity, Validity, Relevance, and Presentation. ORBITAL is designed to make its STEM impact visible in a live demo, offer a distinctive build-and-fly loop, ground science explanations in NASA sources, address the full mission-design challenge, and give judges a short debrief plus a downloadable record. See the [2026 NASA Space Apps page](https://www.spaceappschallenge.org/2026/) and [2026 judging overview](https://www.spaceappschallenge.org/2026/local-events/ajmer/).

## What 2025 global winners suggest

The official [2025 winner list](https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-announces-2025-international-space-apps-challenge-global-winners/) shows a recurring strength: the project makes a specific scientific or practical task usable. PureFlow lets people model a habitat and test it against space-weather threats; SpaceGenes+ makes research results easier to explore; HerCode Space turns heliophysics into a classroom story; Zumorroda-X uses short games to make Earth-science decisions tangible. These are useful examples of interactive work tied to a concrete outcome, not a formula for winning.

ORBITAL applies that lesson through a mission loop: state a science question, choose a payload, see resource consequences, fly the mission, and review the result. The Earth-observation package now pairs imaging with thermal mapping to match its Landsat explanation. A player-facing model card explains each resource calculation, score penalties, and the limits of the simplified estimates. The NASA source links stay attached to the relevant science.

The main remaining opportunity is to expand evidence and validation: run short play sessions with students, record whether they can explain the trade-offs afterward, and use published mission facts or open datasets to strengthen the educational scenarios without presenting game estimates as flight specifications.
