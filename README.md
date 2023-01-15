# Pokédex Benchmark

This website provides a drag-drop system to build any pokémon team & inspect the team stats.

- Based on PokéAPI v2
- Front-End only
- Vanilla JS only

You can search for any referenced Pokémon, filter your sort by pokémon type, drag&drop them into your deck and inspect Team 1 specs such as Average Team Stats & Rank.

The team will automatically generate a Pokémon Card with all infos, savable as image.

It is possible to share a deck with a code `XX:XX:XX:XX:XX:XX` that you can put into the url like so : `https://your-site.test?code=XX:XX:XX:XX:XX:XX`. The deck 1 will be filled with new imported team.

Available for free on this repository or at : https://pokedex.felix-lavieville.com/

## Known issue

- Moving a Pokémon from a deck cell to another deck cell messes up the card generation & stat calculations. You can overpass this issue by refreshing your page.

> It is likely to be caused by 2 calculations launched at the same time (cell cleared & cell added). Feel free to send your feedbacks & PR. The stat calculations and card generation is located at `benchmark.js` at `refreshStats(index,value)`

