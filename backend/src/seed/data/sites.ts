export interface SeedRevision {
  title: string
  html: string

  daysAgo: number
}

export interface SeedSite {
  address: string
  authorId: string
  revisions: SeedRevision[]
}

export const SEED_SITES: SeedSite[] = [
  {
    address: 'directory.zz',
    authorId: 'p-ada',
    revisions: [
      {
        title: 'The Saltmarsh Directory',
        daysAgo: 40,
        html: `<style>
  body { font-family: "Courier New", monospace; background: #fbf8f1; color: #2b2620; }
  h1 { border-bottom: 3px double #2b2620; padding-bottom: .4rem; }
  h2 { font-size: 1rem; text-transform: uppercase; letter-spacing: .12em; margin-top: 2rem; }
  li { margin: .35rem 0; }
  .note { color: #7a6f60; }
</style>
<h1>The Saltmarsh Directory</h1>
<p>Every site in this little web, kept by hand. If you have published something and it is not here, tell me at the Saturday market and I will add it the same week. I don't rank anything. The list is in the order I found things.</p>
<h2>Sea and shore</h2>
<ul>
  <li><a href="tidepool.zz">tidepool.zz</a>: how to read a rock pool at low tide, by Esme.</li>
  <li><a href="kelpforest.zz">kelpforest.zz</a>: what grows under the canopy past the point.</li>
  <li><a href="lighthouse.zz">lighthouse.zz</a>: the keeper's log from Gull Point Light.</li>
  <li><a href="nightswim.zz">nightswim.zz</a>: the Night Swim Club, which is mine.</li>
</ul>
<h2>Food</h2>
<ul>
  <li><a href="sourdough.zz">sourdough.zz</a>: Bruno's bread notes, starter and all.</li>
  <li><a href="ferment.zz">ferment.zz</a>: more of Bruno, this time in jars.</li>
  <li><a href="market.zz">market.zz</a>: the Saturday market on the old quay.</li>
</ul>
<h2>Town</h2>
<ul>
  <li><a href="garden.zz">garden.zz</a>: Plot 14 at the allotments.</li>
  <li><a href="weather.zz">weather.zz</a>: the Gull Point weather station.</li>
  <li><a href="radio.zz">radio.zz</a>: Saltmarsh Community Radio, 94.2.</li>
  <li><a href="bikes.zz">bikes.zz</a>: the bike repair co-op.</li>
</ul>
<h2>Gone quiet</h2>
<ul class="note">
  <li><a href="harbourmaster.zz">harbourmaster.zz</a>: used to post the tide charts. Nobody has heard from it since spring.</li>
</ul>
<p class="note">Looking for something by what it says, not what it's called? Try <a href="about:search?q=low+tide">searching the web</a>.</p>`,
      },
    ],
  },
  {
    address: 'tidepool.zz',
    authorId: 'p-esme',
    revisions: [
      {
        title: 'Reading a Tide Pool',
        daysAgo: 31,
        html: `<style>
  body { background: #eef6f5; color: #18343a; }
  h1 { color: #0f5c63; font-style: italic; }
  blockquote { border-left: 4px solid #6fb7b0; margin: 1.5rem 0; padding: .2rem 1rem; color: #2e5a5f; }
</style>
<h1>Reading a Tide Pool</h1>
<p>The best pools on the Saltmarsh shore show up for about two hours either side of a spring low tide. Go out on the ebb, not at slack water, and you will have the rocks to yourself for longer than you expect. The lower the pool sits on the shore, the stranger what lives in it, because those pools are only out of the sea for a few hours a month.</p>
<p>Start by not touching anything. Crouch at the edge and wait until the water stops moving from your shadow. Beadlet anemones open again first: little red jelly drops that unfold into crowns. Then the prawns come back, nearly transparent except for their eyes. If you are patient, a hermit crab will decide you are part of the rock and carry its borrowed shell across the bottom.</p>
<blockquote>Every rock you turn over is somebody's roof. Put it back the way it was, the same side up, in the same hollow.</blockquote>
<p>The top of the shore is barnacles and limpets, animals that can shut themselves away and wait out a dry afternoon. Further down come the wracks, then the red seaweeds, and finally, at the very lowest tides, the edge of the kelp. If you want to know what lives past that line, my notes on <a href="kelpforest.zz">the kelp forest</a> pick up where this page stops.</p>
<p>For tide times I use the keeper's posts at <a href="lighthouse.zz">Gull Point Light</a>, and I check <a href="weather.zz">the weather station</a> for swell. The old charts at <a href="harbourmaster.zz">harbourmaster.zz</a> were better, but they have been gone for months.</p>
<p>I lead a tide walk from the <a href="market.zz">Saturday market</a> whenever the low water falls before noon.</p>`,
      },
    ],
  },
  {
    address: 'kelpforest.zz',
    authorId: 'p-esme',
    revisions: [
      {
        title: 'Under the Kelp',
        daysAgo: 22,
        html: `<style>
  body { background: #0f2a24; color: #d8eadf; }
  a { color: #8fe3c0; }
  h1 { color: #b8f0d6; letter-spacing: .02em; }
  .depth { font-family: monospace; color: #7fb5a0; }
</style>
<h1>Under the Kelp</h1>
<p class="depth">2 to 12 metres below chart datum, off Gull Point</p>
<p>A kelp forest is a building that grows itself. Each plant holds on with a holdfast, a knot of root-like fingers clamped to the rock, and sends a single stipe up towards the light, where the fronds spread into a canopy. At high water you swim through dim green rooms. At the lowest spring tides the canopy lies flat on the surface like spilled ribbon.</p>
<p>The holdfasts are where the town is. Pull one apart (please don't) and you would find brittle stars, worms, juvenile crabs and dozens of other animals sheltering in a space the size of a fist. The stipes are furred with smaller red seaweeds and sea mats. The fronds are grazed by blue-rayed limpets, whose stripes look painted on with a fine brush.</p>
<p>Urchins are the threat. Where there are too many of them they mow the forest down to bare rock. On other coasts sea otters keep urchins in check, and someone once started a page about whether otters ever lived here, <a href="otters.zz">otters.zz</a>, but I have never managed to load it.</p>
<p>If you want to see the forest yourself, the <a href="nightswim.zz">Night Swim Club</a> goes out over it on calm summer nights. Bring a torch, keep it pointed down, and you will see the fronds light up with tiny sparks. Back in the shallows, <a href="tidepool.zz">the tide pools</a> are where most of these animals start out.</p>`,
      },
    ],
  },
  {
    address: 'lighthouse.zz',
    authorId: 'p-esme',
    revisions: [
      {
        title: "Keeper's Log — Gull Point Light",
        daysAgo: 6,
        html: `<style>
  body { font-family: Georgia, serif; background: #fffdf6; }
  h1 { font-variant: small-caps; }
  .entry { border-top: 1px solid #ddd3b8; padding-top: .6rem; margin-top: 1.4rem; }
  .entry b { font-family: monospace; color: #8a5a00; }
  nav { background: #f3ecd8; padding: .5rem .8rem; border-radius: 6px; }
</style>
<h1>Keeper's Log — Gull Point Light</h1>
<nav>Jump to: <a href="#lamp">the lamp</a> · <a href="#log">this week's log</a> · <a href="#visiting">visiting</a></nav>
<p>The light has been automatic since before I was born, but the town still keeps a keeper. Someone has to climb the hundred and four steps, wipe the salt off the lantern glass, write down the weather and tell the fishing boats when the fog is coming in. Since the harbour office went quiet, that someone is me, three mornings a week.</p>
<h2 id="lamp">The lamp</h2>
<p>Gull Point shows two white flashes every fifteen seconds, visible for eighteen nautical miles on a clear night. The old fresnel lens is still in the lantern room: concentric rings of glass, each one a prism, bending the light into a single flat beam. Up close it looks like a beehive made of ice.</p>
<h2 id="log">This week's log</h2>
<div class="entry"><b>Mon 06:10</b> Low water 07:42, 0.4 m. Wind SW 3. Visibility good. Seals hauled out on the north ledge, eleven counted.</div>
<div class="entry"><b>Wed 06:25</b> Low water 09:05, 0.6 m. Sea fog rolling in from the south by 08:00, which <a href="weather.zz">the weather station</a> had predicted. Called it in on <a href="radio.zz">the radio</a>'s morning bulletin.</div>
<div class="entry"><b>Fri 06:05</b> Low water 10:31, 0.9 m. Clear and cold. Esme's group out on the rocks below; good pools today, see <a href="tidepool.zz">tidepool.zz</a>.</div>
<h2 id="visiting">Visiting</h2>
<p>The tower opens on the first Sunday of the month. The footpath from the <a href="oldmill.zz">old mill</a> is the pretty way up, though the mill itself is long gone. Wear proper shoes: the last forty steps are an iron spiral and they ring like a bell.</p>`,
      },
    ],
  },
  {
    address: 'sourdough.zz',
    authorId: 'p-bruno',
    revisions: [
      {
        title: "Bruno's Sourdough Notes",
        daysAgo: 27,
        html: `<style>
  body { font-family: "Trebuchet MS", sans-serif; background: #fff8ee; color: #3a2a18; }
  h1 { color: #9a4f12; }
  table { border-collapse: collapse; margin: 1rem 0; }
  td, th { border: 1px solid #e0c9a8; padding: .35rem .7rem; text-align: left; }
</style>
<h1>Bruno's Sourdough Notes</h1>
<p>I have kept the same starter alive for nine years. It lives in a jam jar on the windowsill and it has a name, Gertrude, which my daughter gave it. A starter is only flour and water that you leave alone until the wild yeasts and lactic bacteria living in the flour take over. Feed it every day and it will outlive your oven.</p>
<h2>The everyday loaf</h2>
<table>
  <tr><th>Strong white flour</th><td>450 g</td></tr>
  <tr><th>Wholemeal</th><td>50 g</td></tr>
  <tr><th>Water</th><td>360 g (72% hydration)</td></tr>
  <tr><th>Active starter</th><td>100 g</td></tr>
  <tr><th>Salt</th><td>10 g</td></tr>
</table>
<p>Mix the flour and water and leave it for an hour. Bakers call this autolyse, and it means the dough does the kneading for you. Add starter and salt, then fold the dough over itself every half hour for two hours. After that, leave it alone. Bulk fermentation is done when the dough has risen by about half, feels airy and wobbles when you shake the bowl. In my cold kitchen that takes six hours; in summer, four.</p>
<p>Shape, put it in a floured basket, and retard it overnight in the fridge. Retarding is the part people skip, and it is the part that makes the crust blister and the crumb taste of something. Bake in a lidded pot at 250°C, twenty minutes covered and twenty uncovered.</p>
<p>The same slow-fermentation idea turns cabbage into sauerkraut. I write about that at <a href="ferment.zz">ferment.zz</a>. You can buy a loaf at my stall at the <a href="market.zz">Saturday market</a>, and if you want to know when the oven is on, I meant to keep a page at <a href="bakery-hours.zz">bakery-hours.zz</a>. I still haven't made it.</p>`,
      },
    ],
  },
  {
    address: 'ferment.zz',
    authorId: 'p-bruno',
    revisions: [
      {
        title: 'Slow Food in Jars',
        daysAgo: 14,
        html: `<style>
  body { font-family: "Trebuchet MS", sans-serif; background: #f6f9ef; color: #26331c; }
  h1 { color: #4f7a1e; }
  .rule { background: #e6efd3; padding: .8rem 1rem; border-radius: 8px; font-weight: bold; }
</style>
<h1>Slow Food in Jars</h1>
<p>Fermenting vegetables is preserving with patience instead of heat. You salt the vegetables and push them under their own brine. Then you let the lactic acid bacteria that already live on the leaves turn sugars into acid. The acid keeps the food safe and gives it that sharp, deep sour taste.</p>
<p class="rule">The one rule: 2% salt by weight, and everything stays under the brine.</p>
<h2>Sauerkraut</h2>
<p>Shred a firm white cabbage finely and weigh it. Add 2% of that weight in salt, so twenty grams for a kilo, and squeeze it with your hands for ten minutes until it weeps. Pack it hard into a clean jar so the liquid rises over the top, weigh it down with a small bag of brine, and leave it somewhere cool. After a week it is tangy. After four it is properly sour. The best cabbages I have used came from Dara's allotment, written up at <a href="garden.zz">garden.zz</a>.</p>
<h2>Kimchi, roughly</h2>
<p>Salt halved napa cabbages overnight and rinse them. Then rub every leaf with a paste of garlic, ginger, chilli flakes, fish sauce and a little rice flour porridge. It ferments faster than sauerkraut because there is more sugar. Taste it daily and move it to the fridge when you like it.</p>
<p>Brine and bread are cousins, and the starter that raises my loaves is the same kind of living culture; see <a href="sourdough.zz">sourdough.zz</a>. If a jar grows fuzzy coloured mould on top, throw it out. A white film called kahm yeast is harmless, so just skim it.</p>`,
      },
    ],
  },
  {
    address: 'market.zz',
    authorId: 'p-chen',
    revisions: [
      {
        title: 'Saturday Market at the Old Quay',
        daysAgo: 35,
        html: `<style>
  body { font-family: Verdana, sans-serif; }
  h1 { color: #b0302a; }
</style>
<h1>Saturday Market at the Old Quay</h1>
<p>Every Saturday, 8 until 1, on the cobbles by the old quay. Twenty-odd stalls, a coffee cart and a lot of dogs.</p>
<ul>
  <li>Bread from Bruno: <a href="sourdough.zz">sourdough.zz</a></li>
  <li>Veg from the allotments: <a href="garden.zz">garden.zz</a></li>
  <li>Bike fixes while you shop: <a href="bikes.zz">bikes.zz</a></li>
</ul>`,
      },
      {
        title: 'Saturday Market at the Old Quay',
        daysAgo: 3,
        html: `<style>
  body { font-family: Verdana, sans-serif; background: #fffaf7; }
  h1 { color: #b0302a; }
  .winter { background: #fde8e4; border: 1px solid #f0b8ae; padding: .7rem 1rem; border-radius: 6px; }
  dt { font-weight: bold; margin-top: .8rem; }
  dd { margin-left: 0; }
</style>
<h1>Saturday Market at the Old Quay</h1>
<p class="winter"><b>Winter hours:</b> from November to February we open at 9 instead of 8, because the light comes late and the cobbles are icy. We still close at 1.</p>
<p>Every Saturday on the cobbles by the old quay. Twenty-odd stalls, a coffee cart, a lot of dogs, and the best gossip in Saltmarsh. Nobody organises it exactly. I keep this page and hold the key to the electricity box, which is close enough.</p>
<dl>
  <dt>Bakery</dt>
  <dd>Bruno's sourdough, gone by eleven most weeks. Read how he makes it at <a href="sourdough.zz">sourdough.zz</a>; the jars of kraut are from <a href="ferment.zz">ferment.zz</a>.</dd>
  <dt>Vegetables</dt>
  <dd>Whatever the allotments have too much of. Right now that means leeks, squash and the last of the chard. Dara's diary is at <a href="garden.zz">garden.zz</a>.</dd>
  <dt>Repairs</dt>
  <dd>The bike co-op sets up by the bollards. Leave your bike, shop, and pick it up fixed. See <a href="bikes.zz">bikes.zz</a>.</dd>
  <dt>Tide walk</dt>
  <dd>When low water is before noon, Esme leads a walk from the market down to the pools. Notes at <a href="tidepool.zz">tidepool.zz</a>.</dd>
  <dt>On air</dt>
  <dd>The community radio broadcasts live from the coffee cart on the first Saturday of the month: <a href="radio.zz">radio.zz</a>.</dd>
</dl>`,
      },
    ],
  },
  {
    address: 'bikes.zz',
    authorId: 'p-chen',
    revisions: [
      {
        title: 'Spoke & Chain — Bike Repair Co-op',
        daysAgo: 18,
        html: `<style>
  body { font-family: Arial, sans-serif; background: #f4f5f7; color: #1e2329; }
  h1 { background: #1e2329; color: #ffd23f; padding: .6rem .9rem; display: inline-block; }
  ol li { margin: .4rem 0; }
</style>
<h1>Spoke &amp; Chain</h1>
<p>We are a repair co-op, not a shop. Bring a bike, borrow our tools and stands, and one of us will show you how to fix it yourself. We are open on Tuesday evenings in the back of the old chandlery and on Saturday mornings at the <a href="market.zz">market</a>.</p>
<h2>Fixing a puncture</h2>
<ol>
  <li>Take the wheel off and let out any remaining air.</li>
  <li>Hook two tyre levers under the bead, a hand's width apart, and work the tyre off one side.</li>
  <li>Pull out the inner tube, pump it up and listen for the hiss, or hold it under water and watch for bubbles.</li>
  <li>Run your fingers slowly around the inside of the tyre. Whatever caused the puncture is usually still in there.</li>
  <li>Roughen the area, apply a thin layer of glue, wait until it goes tacky, then press on the patch.</li>
</ol>
<h2>Salt air</h2>
<p>Saltmarsh eats chains. The sea air leaves a fine salt crust that pulls water in and rusts every link. Wipe your chain after wet rides and re-oil it weekly with a wet lube, not a dry one. Check <a href="weather.zz">the weather station</a> before a long ride; the wind on the coast road can double your time.</p>
<p>We are drawing a map of quiet cycling routes around town at <a href="maps.zz">maps.zz</a>. It isn't up yet.</p>`,
      },
    ],
  },
  {
    address: 'garden.zz',
    authorId: 'p-dara',
    revisions: [
      {
        title: 'Plot 14 — an Allotment Diary',
        daysAgo: 9,
        html: `<style>
  body { font-family: Palatino, "Book Antiqua", serif; background: #fbfaf3; }
  h1 { color: #5b4a1b; }
  h3 { color: #6d7f2b; margin-bottom: .2rem; }
</style>
<h1>Plot 14 — an Allotment Diary</h1>
<p>Ten rods of heavy clay on the hill above the harbour, inherited from a man called Reg who grew nothing but onions for forty years. I am slowly persuading the soil to grow other things.</p>
<h3>Early November</h3>
<p>Garlic in, one clove every fifteen centimetres, pointy end up, just below the surface. It needs a proper cold spell to split into bulbs, which this hill always provides. Broad beans in the next bed for an early crop in May.</p>
<h3>Late October</h3>
<p>After the storm I dragged three sacks of washed-up seaweed up from the beach and spread it on the empty beds as mulch. Seaweed is full of trace minerals and breaks down quickly. Rinse it first or you salt the soil. Esme says it is mostly kelp torn off the forest past the point; there is more about that at <a href="kelpforest.zz">kelpforest.zz</a>.</p>
<h3>Mid October</h3>
<p>The cabbages were enormous this year. Too many to eat, so half went to Bruno, who turned them into sauerkraut: <a href="ferment.zz">ferment.zz</a>. The rest of the glut goes to the <a href="market.zz">Saturday market</a>.</p>
<p>The council promised a page about the new community compost scheme at <a href="compost.zz">compost.zz</a>. Until it exists, my heap is the one behind the water butt; help yourselves. I plant by <a href="weather.zz">the weather station</a>'s frost warnings, not the calendar.</p>`,
      },
    ],
  },
  {
    address: 'weather.zz',
    authorId: 'p-farid',
    revisions: [
      {
        title: 'Gull Point Weather Station',
        daysAgo: 1,
        html: `<style>
  body { font-family: "Segoe UI", sans-serif; background: #eef3fb; color: #182433; }
  h1 { color: #1f4f99; }
  .reading { display: inline-block; background: #fff; border: 1px solid #c9d6ec; border-radius: 8px; padding: .5rem .9rem; margin: .25rem; font-family: monospace; }
</style>
<h1>Gull Point Weather Station</h1>
<p>An anemometer, a rain gauge and a barometer bolted to the railing below <a href="lighthouse.zz">the lighthouse</a>, read by hand every morning and wired to a little radio that reports every ten minutes the rest of the time.</p>
<p>
  <span class="reading">Wind SW 14 kn, gusting 22</span>
  <span class="reading">Pressure 1004 hPa, falling</span>
  <span class="reading">Air 9°C · Sea 12°C</span>
  <span class="reading">Rain 24h: 3.2 mm</span>
</p>
<h2>Reading the sky here</h2>
<p>A falling barometer with a south-westerly wind means rain within a day, nine times out of ten. Sea fog is the local speciality. It forms when warm, damp air moves over the colder water, and it can swallow the point in twenty minutes on an otherwise bright morning. If the sea is warmer than the air, as it is now, fog is unlikely. Wait until spring.</p>
<p>The first frost on the allotment hill usually arrives two weeks before it reaches the harbour, because cold air pours downhill and pools. Gardeners: <a href="garden.zz">Dara</a> watches the hill reading, not the harbour one.</p>
<p>Readings are read out on the hour on <a href="radio.zz">Saltmarsh Community Radio</a>. Swimmers, check the swell and the wind against the tide before going out with <a href="nightswim.zz">the Night Swim Club</a>.</p>`,
      },
    ],
  },
  {
    address: 'radio.zz',
    authorId: 'p-farid',
    revisions: [
      {
        title: 'Saltmarsh Community Radio 94.2',
        daysAgo: 12,
        html: `<style>
  body { font-family: Tahoma, sans-serif; background: #1b1530; color: #ece8f7; }
  a { color: #ffb86b; }
  h1 { color: #ff7ab6; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: .45rem .3rem; border-bottom: 1px solid #3a2f5e; vertical-align: top; }
  td:first-child { font-family: monospace; color: #b9aef0; white-space: nowrap; }
</style>
<h1>Saltmarsh Community Radio · 94.2</h1>
<p>Run by volunteers from a cupboard above the chandlery. One transmitter, two microphones and a kettle.</p>
<table>
  <tr><td>07:00</td><td><b>Morning bulletin</b>: shipping, fog and tides, phoned in from <a href="lighthouse.zz">the lighthouse</a>.</td></tr>
  <tr><td>on the hour</td><td><b>Weather</b> from <a href="weather.zz">the Gull Point station</a>.</td></tr>
  <tr><td>Tue 19:00</td><td><b>Tide Talk</b> with Esme Laurent: what's in the pools this week (<a href="tidepool.zz">tidepool.zz</a>).</td></tr>
  <tr><td>Thu 20:00</td><td><b>The Bread Hour</b>: Bruno answers your starter questions live (<a href="sourdough.zz">sourdough.zz</a>).</td></tr>
  <tr><td>Fri 22:00</td><td><b>Night Swim notices</b>: is it on tonight? (<a href="nightswim.zz">nightswim.zz</a>)</td></tr>
  <tr><td>1st Sat</td><td><b>Live from the market</b> (<a href="market.zz">market.zz</a>).</td></tr>
</table>
<p>Old shows used to be archived at <a href="http://radio-archive.example.com/shows">http://radio-archive.example.com</a>, out on the big web. We are not sure it still works.</p>`,
      },
    ],
  },
  {
    address: 'nightswim.zz',
    authorId: 'p-ada',
    revisions: [
      {
        title: 'The Night Swim Club',
        daysAgo: 20,
        html: `<style>
  body { background: #070b1f; color: #c9d4ff; font-family: Georgia, serif; }
  a { color: #7ef0ff; }
  h1 { color: #ffffff; text-shadow: 0 0 12px #3fd0ff; }
  .rules li { margin: .3rem 0; }
</style>
<h1>The Night Swim Club</h1>
<p>From June to September, on calm nights near the new moon, a few of us swim out from the slipway over the edge of <a href="kelpforest.zz">the kelp</a>. In the dark the sea comes alive: every stroke stirs up bioluminescent plankton, and your hands trail green-blue sparks as if you were swimming through a cold galaxy.</p>
<p>The light comes from dinoflagellates, single-celled plankton that flash when the water around them is disturbed. Nobody is quite sure why. The best theory is a burglar alarm: the flash draws bigger predators to whatever is trying to eat them. It is brightest after a few warm, still days.</p>
<h2>Rules, which are not optional</h2>
<ul class="rules">
  <li>Never swim alone. Buddy up, and count heads in and out.</li>
  <li>Everyone wears a tow float with a light on it.</li>
  <li>Check <a href="weather.zz">the weather</a> and the swell. If the keeper at <a href="lighthouse.zz">Gull Point</a> says fog, we don't go.</li>
  <li>Swim along the shore, never straight out. The ebb tide off the point is stronger than you are.</li>
</ul>
<p>Scared of the dark water? Start in daylight. Snorkel over <a href="tidepool.zz">the tide pools</a> at low water and get to know what's down there.</p>`,
      },
    ],
  },
]
