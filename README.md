# ORBITAL — Space Mission Design Game

**Design it. Fly it. Learn it.**

ORBITAL is a playable spacecraft-design game made for the 2026 NASA Space Apps Challenge, **Space Mission Design Game**. Choose a science objective, build a spacecraft within its limits, pilot the mission, and see how your design shaped the science you brought home.

## Start playing

Open `index.html` in a current browser. There is no install or build step.

- Choose **Europa Ice Survey**, **Earth in Focus**, or **Asteroid Scout**.
- Select science instruments, spacecraft bus, launcher, and orbit. Live telemetry shows mass, power, budget, data-return capacity, and mission fit.
- Choose **Cadet**, **Mission**, or **Flight Test** mode, then launch.
- Pilot with **WASD** or the **arrow keys**. Hold **Space** to boost. On touch screens, use the on-screen controls.
- Collect science targets, avoid hazards, manage fuel and hull integrity, and reach the communications relay.
- Review the debrief, revise the design, and fly again.

## The mission loop

1. **Pick a question.** Each scenario introduces a real space-science context.
2. **Design the spacecraft.** Instrument choices trade science value against mass, power, data, communications, and cost. Bus, launcher, and orbit choices change the available margins.
3. **Fly the mission.** Your payload and spacecraft bus affect science collection and handling during the interactive flight.
4. **Learn from the outcome.** The debrief connects design constraints and piloting decisions to mission results.
5. **Compare alternatives.** Save up to three builds in the local design notebook, compare their trade-offs, reload them, or export them as JSON.

## Science scenarios

| Mission | Science focus | NASA reference |
| --- | --- | --- |
| Europa Ice Survey | Explore how radar can investigate Europa’s icy shell. | [Europa Clipper — REASON radar](https://europa.nasa.gov/spacecraft/instruments/reason/) |
| Earth in Focus | Compare surface imaging with thermal observations of Earth. | [Landsat — spectral bands and applications](https://science.nasa.gov/mission/landsat/spectral-bands-and-applications/) |
| Asteroid Scout | Map an asteroid and characterize its surface before sampling. | [OSIRIS-REx — mission and instruments](https://science.nasa.gov/mission/osiris-rex/in-depth/) |

These links ground the scenarios in NASA missions. In-game costs, component values, resource limits, and scoring are simplified teaching estimates; the game does not use a validated flight-design model.

## Crew and replay

ORBITAL can be played solo or shared by a crew of up to four. Crews can assign flight roles and take turns at science checkpoints. Three difficulty modes adjust the time, target, and impact challenge. Flight records and saved blueprints stay in the current browser; they are not uploaded. Players can export records and designs as JSON.

## Suggested judge demo

The public six-slide project demonstration, including screenshots of the mission planner, spacecraft builder, live flight, and flight result, is available here: [ORBITAL project demo](demo/ORBITAL-Project-Demo.pptx).

1. Select Europa and show the NASA REASON science connection.
2. Equip the recommended science package, then change one component and point out how the live resource margins respond.
3. Start the flight, collect a target, and pilot back to the relay.
4. Use the debrief to explain what the design and flight taught; then adjust the spacecraft and replay.

## Model limits

The simulation is designed to teach trade-offs, not to produce real mission specifications. Mass, power, budget, data, communications, orbital capacity, route hazards, and readiness scoring are simplified game values. The **Model Notes** panel explains how the game uses them. NASA references provide scientific context; they are not inputs to a validated spacecraft analysis. Test the game as an educational prototype and consult mission requirements and engineering analyses for real design work.

## Technology

Built with plain HTML, CSS, and JavaScript. The flight game uses the browser Canvas API. No package installation or build tools are required. Google Fonts are used when an internet connection is available; system fonts provide the fallback.

## Project files

- `index.html` — interface, mission scenarios, and dialogs.
- `styles.css` — responsive layout and visual styles.
- `app.js` — mission model, spacecraft builder, flight simulation, debrief, and browser-local saves.
- `README.md` — setup, gameplay, science references, and model limits.
