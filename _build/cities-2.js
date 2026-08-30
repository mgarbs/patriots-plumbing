/* Second wave of town pages.
   Same rule as cities.js: each one earns its page with genuinely distinct
   local content, or it does not get built. Meadowview and Atkins were
   deliberately left out — nothing true can be said about them that isn't
   already the Glade Spring or Marion page, and that's the definition of a
   doorway page.

   Well equipment (pumps, pressure tanks, wellheads) is a well contractor's
   trade, not Bill's. Do not re-add those claims here.
   No after-hours or emergency positioning — see the v3 repositioning. */

module.exports = [
{
  slug: 'emory-va',
  town: 'Emory',
  county: 'Washington County',
  title: 'Plumber in Emory, VA — Washington County Plumbing',
  meta: 'Plumbing repairs, water heaters, drains and remodels in Emory, Virginia. A Master Plumber-led shop with roots at Emory &amp; Henry. Call (276) 285-1392.',
  h1: 'Plumber in Emory, Virginia',
  lead: 'Our own back yard, and the town on this list we have the longest personal history with.',
  intro: [
    'Emory is a small place built around Emory &amp; Henry, and it is where this shop&rsquo;s owner went to college. His wife served as a Navy Corpsman and is going through Emory &amp; Henry&rsquo;s nursing school now. So when we say we are working in our own community here, that is not marketing language &mdash; it is a genuine reason we would rather do the job right than do it fast.',
    'The plumbing itself splits neatly in two. There is the older housing around the college, much of it built when the campus was, and there is the rural stretch heading out toward Meadowview and Glade Spring where properties sit on wells and septic.',
  ],
  local: [
    { h2: 'College-town housing and rentals', kind: 'prose', body: [
      'A meaningful share of the housing in and immediately around Emory is rented &mdash; students, faculty and staff &mdash; and rental property has a distinct plumbing profile. Fixtures take harder use and get replaced less often. Small problems go unreported until they are large ones, because a tenant who is leaving in May has little reason to mention a slow drain in February. And a landlord usually finds out about all of it at once, in the two-week window between one tenant leaving and the next arriving.',
      'We are used to that rhythm and we are happy to work in it. If you manage property here, the cheapest thing you can do is have someone look at the whole unit during a turnover rather than one fixture at a time across a year of call-outs.',
    ]},
    { h2: 'Older buildings, older systems', kind: 'prose', body: [
      'The original housing stock around the college is old enough to carry galvanized supply and cast iron drain line, with the same failure patterns we see in Abingdon: pressure that has quietly declined for a decade, hot water that runs worse than cold, and drains that have gradually become prone to clogging everywhere at once rather than at one fixture.',
      'None of that is urgent until it is. Weak pressure in an older Emory house is worth investigating rather than living with, because galvanized fails from the inside and gives very little warning before it starts leaking inside a wall.',
    ]},
    { h2: 'Out toward the county', kind: 'prose', body: [
      'Past the campus you are quickly into well water and septic, and the biggest practical consequence is what hard water does to a heater. Sediment on the tank floor, an anode rod consumed years early, and a unit that fails well short of the life it should have had. An annual flush and an anode check is genuinely the cheapest maintenance in the house.',
      'The well equipment itself &mdash; pump, pressure tank, wellhead &mdash; is a well contractor&rsquo;s trade rather than ours. Everything from the house side onward is ours, and if you are not sure which side your problem sits on, that is worth a phone call before anyone spends money.',
    ]},
  ],
  faqs: [
    ['Do you work on rental property in Emory?', 'Yes, and turnovers are a sensible time to do it. Looking at a whole unit between tenants costs far less than a year of individual call-outs, and it stops small problems being discovered by the next tenant.'],
    ['How quickly can you get to Emory?', 'Quickly &mdash; Emory sits just off the interstate between Abingdon and Glade Spring, so it is among the easiest areas we cover. Call (276) 285-1392 and we will tell you honestly where you sit in the day.'],
    ['My hot water is worse than my cold. Why?', 'In an older house that usually points at galvanized supply on the hot side, which corrodes inward and restricts flow. It is worth diagnosing, because it does not improve on its own and it eventually leaks.'],
  ],
  localProof: [],
},
{
  slug: 'damascus-va',
  town: 'Damascus',
  county: 'Washington County',
  title: 'Plumber in Damascus, VA — Cabins, Rentals &amp; Repairs',
  meta: 'Plumbing in Damascus, Virginia. Repairs, water heaters and winterizing for homes, cabins and short-term rentals along the Creeper Trail. Call (276) 285-1392.',
  h1: 'Plumber in Damascus, Virginia',
  lead: 'A trail town, which means a lot of buildings here sit empty for stretches &mdash; and empty buildings fail differently.',
  intro: [
    'Damascus is small, but it carries far more plumbing than its population suggests. The Virginia Creeper Trail and the Appalachian Trail run through it, and with them come cabins, second homes, short-term rentals and outfitter buildings that are occupied hard in season and not at all out of it.',
    'That single fact changes almost everything about how plumbing fails here. A lived-in house tells you when something is wrong, because somebody is standing in it. An empty cabin does not, and the bill arrives all at once.',
  ],
  local: [
    { h2: 'The empty-building problem', kind: 'prose', body: [
      'The worst plumbing damage we see is almost never the biggest failure. It is the ordinary failure that nobody was there to notice. A supply line splits in a cabin in January, runs for three weeks, and the first person through the door in February is standing in a very expensive room. The same split in an occupied house is a mopped floor and a phone call.',
      'If you own a property here that sits empty in the cold months, the two things that matter most are that it is properly winterized and that somebody physically checks it. Not the thermostat reading on an app &mdash; a person, in the building.',
    ]},
    { h2: 'Winterizing, and turning it back on', kind: 'prose', body: [
      'Winterizing done properly means the supply drained and the system blown out, traps protected, the water heater dealt with, and any line running through an unconditioned crawlspace or under a porch given real attention. Done casually it means a burst pipe in a building nobody visits.',
      'Spring turn-on is the other half of the job and it is where problems surface. We would far rather be there when the water goes back on than get the call about what happened after it did. If you run a rental here, building both into the season is the single cheapest thing you can do.',
    ]},
    { h2: 'Short-term rentals', kind: 'prose', body: [
      'A rental that turns over weekly takes more plumbing abuse in a season than a family home takes in a year, from guests with no reason to mention a running toilet. The failures are rarely dramatic: a flapper that wastes water for a month, a slow drain that becomes a clog on a Saturday changeover, a water heater that cannot keep up with four hikers back to back.',
      'None of that is complicated to prevent. It just needs looking at on a schedule rather than at the moment a guest is standing there.',
    ]},
  ],
  faqs: [
    ['Can you winterize a cabin or second home?', 'Yes, and it is worth doing properly rather than partially. Call ahead of the season &mdash; this is work that schedules far better than it improvises, and the whole point is to be ahead of the first hard freeze.'],
    ['I found water damage in a property that was empty. What now?', 'Shut off the main immediately if it is still running, then call. The plumbing repair is usually the straightforward half; the important thing is finding every place it reached before anyone closes it back up.'],
    ['Do you work on short-term rentals?', 'Yes. Scheduled checks between seasons cost far less than a failure during a booked week, and they are much easier for everyone to plan around.'],
  ],
  localProof: [],
},
{
  slug: 'saltville-va',
  town: 'Saltville',
  county: 'Smyth County',
  title: 'Plumber in Saltville, VA — Smyth County Plumbing',
  meta: 'Plumbing repairs, water heaters, drains and remodels in Saltville, Virginia. Master Plumber-led work on the town&rsquo;s older housing stock. Call (276) 285-1392.',
  h1: 'Plumber in Saltville, Virginia',
  lead: 'A town built around one industry, which means whole streets of houses share a plumbing vintage.',
  intro: [
    'Saltville&rsquo;s history as a salt town shaped how it was built: a lot of housing put up in concentrated periods, to similar specifications, for people working the same industry. That is genuinely useful information for a plumber, and it is the thing we would tell a homeowner here before anything else.',
    'It means your plumbing is probably the same age and the same material as your neighbour&rsquo;s. When one house on a street starts having supply problems, the others are usually not far behind.',
  ],
  local: [
    { h2: 'Why your neighbour&rsquo;s plumbing predicts yours', kind: 'prose', body: [
      'In a town with a mixed housing stock, one failing supply line tells you nothing about the house next door. In a town where whole blocks went up together, it tells you quite a lot. Galvanized steel installed in the same decade, carrying similar water, tends to fail in a similar window.',
      'The practical upshot: if people on your street have started dealing with pressure problems, pinhole leaks or repipes, that is worth taking seriously rather than waiting your turn. Planned work is dramatically cheaper than the same work done in a hurry around water damage.',
    ]},
    { h2: 'What we see here', kind: 'prose', body: [
      'Galvanized supply corroding inward, which shows up as pressure that has slowly declined and hot water that runs worse than cold. Cast iron drain line scaling and cracking at the hubs, which shows up as a house that has become prone to clogs everywhere rather than at one fixture. And water heaters that have quietly done more work than their label suggests.',
      'Outside town you are into rural Smyth County, which means wells, septic and hard water &mdash; and hard water is the main reason heaters here fail earlier than they should. The well equipment itself is a well contractor&rsquo;s trade; everything on the house side is ours.',
    ]},
    { h2: 'Getting here', kind: 'prose', body: [
      'Saltville sits off the interstate, north of the Chilhowie exit, and we cover it on the same runs as Marion and Chilhowie. For anything that can be planned &mdash; a heater on borrowed time, a drain that has been degrading, a bathroom you have been thinking about &mdash; booking ahead gets you a better slot than waiting for it to become pressing.',
    ]},
  ],
  faqs: [
    ['Several houses on my street have had plumbing work. Should I worry?', 'It is worth a look. In a town where housing went up in concentrated periods, neighbouring houses often share both the age and the material of their supply lines, so problems tend to arrive in the same window.'],
    ['Is a repipe really necessary, or can you just fix the leak?', 'Sometimes a repair is genuinely the right answer and we will say so. But when galvanized has corroded far enough to leak in one place, the rest of the same run is usually the same age. We will show you what we found and be straight about which one you are looking at.'],
    ['Do you cover Saltville regularly?', 'Yes, along with Chilhowie, Marion and Atkins. Call (276) 285-1392 and we will give you an honest answer on timing.'],
  ],
  localProof: [],
},
{
  slug: 'chilhowie-va',
  town: 'Chilhowie',
  county: 'Smyth County',
  title: 'Plumber in Chilhowie, VA — Smyth County Plumbing',
  meta: 'Plumbing repairs, water heaters, drains and remodels in Chilhowie, Virginia. Master Plumber-led, licensed and insured. Call (276) 285-1392.',
  h1: 'Plumber in Chilhowie, Virginia',
  lead: 'Right on our regular run up I-81, which makes it one of the easier places on this list for us to reach.',
  intro: [
    'Chilhowie sits between Glade Spring and Marion, directly on the corridor we drive most days. That matters more than it sounds like it should: it means work here schedules easily, and it means we are often nearby already rather than making a special trip.',
    'The town splits the way most of these do. Compact older housing on town water and sewer in Chilhowie proper, and farmland and rural property on wells and septic once you head out toward the county.',
  ],
  local: [
    { h2: 'Two different sets of problems', kind: 'prose', body: [
      'In town, the story is age. Housing built decades ago on municipal supply, now reaching the point where galvanized lines restrict and cast iron drains scale. Those failures are predictable and they are much cheaper caught early than caught leaking.',
      'Out of town, the story is water chemistry. Hard well water lays sediment in the bottom of a water heater and consumes the anode rod faster than treated municipal water does, so heaters here routinely fail years before they should. An annual flush and an anode check makes a genuine difference and costs very little.',
      'The well equipment itself &mdash; pump, pressure tank, wellhead &mdash; is a well contractor&rsquo;s trade rather than ours. Everything from the house side onward is ours.',
    ]},
    { h2: 'Farm and outbuilding work', kind: 'prose', body: [
      'A good number of properties out this way have supply running to barns, shops and outbuildings, and those lines are the ones that get forgotten until January. They run further, through colder space, with less insulation than anything inside the house, and they are usually not missed until something has already split.',
      'Routing and insulating those runs properly is straightforward work, and autumn is the sensible time for it. It is considerably easier than dealing with what happens when one of them lets go.',
    ]},
    { h2: 'Remodels and planned work', kind: 'prose', body: [
      'Because we are through Chilhowie regularly, planned work here is easy for us to do well &mdash; a bathroom, a kitchen, a laundry relocation, a repipe while the walls are already open. If you have been thinking about a project, call and describe it. We will tell you plainly what we would take on and roughly when we could start.',
    ]},
  ],
  faqs: [
    ['Do you come to Chilhowie often?', 'Regularly &mdash; it is directly on our route between Abingdon and Marion, so we are frequently nearby already. Call (276) 285-1392 and we will tell you honestly what the timing looks like.'],
    ['Can you run water to a barn or shop?', 'Yes, and we will plan the routing and insulation so it survives a Smyth County winter rather than becoming next January&rsquo;s repair.'],
    ['My water heater keeps failing early. Is that normal on a well?', 'It is common, and it is largely preventable. Hard water lays sediment in the tank and consumes the anode rod faster. An annual flush and an anode check is the cheapest maintenance in the house.'],
  ],
  localProof: [],
},
];
