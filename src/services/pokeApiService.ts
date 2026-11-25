import { POPULAR_POKEMON, CatalogPokemon } from '../data/pokemonCatalog';

// Cache fetched Pokémon
const memoryCache: Record<string, CatalogPokemon> = {};

// Initialize cache with popular ones
POPULAR_POKEMON.forEach((p) => {
  memoryCache[p.name.toLowerCase()] = p;
  memoryCache[String(p.id)] = p;
});

// Translation dictionary for types from english to spanish
const TYPE_TRANSLATIONS: Record<string, string> = {
  fire: 'Fuego',
  water: 'Agua',
  grass: 'Planta',
  electric: 'Eléctrico',
  ice: 'Hielo',
  dragon: 'Dragón',
  dark: 'Siniestro',
  ghost: 'Fantasma',
  psychic: 'Psíquico',
  fairy: 'Hada',
  fighting: 'Lucha',
  steel: 'Acero',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  bug: 'Bicho',
  rock: 'Roca',
  normal: 'Normal',
  stellar: 'Estelar',
};

export async function searchPokemonOnline(query: string): Promise<CatalogPokemon | null> {
  let clean = query.trim().toLowerCase().replace(/^#+/, '');
  if (!clean) return null;

  // Normalize numbers (e.g. #006 -> 6)
  if (/^\d+$/.test(clean)) {
    clean = String(parseInt(clean, 10));
  }

  if (memoryCache[clean]) {
    return memoryCache[clean];
  }

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${clean}`);
    if (!res.ok) return null;
    const data = await res.json();

    // Map stats
    const statsObj: Record<string, number> = {};
    data.stats.forEach((s: { stat: { name: string }; base_stat: number }) => {
      statsObj[s.stat.name] = s.base_stat;
    });

    const types = data.types.map((t: { type: { name: string } }) => {
      return TYPE_TRANSLATIONS[t.type.name] || t.type.name;
    });

    const moves = (data.moves || [])
      .slice(0, 4)
      .map((m: { move: { name: string } }) => {
        return m.move.name.replace('-', ' ').toUpperCase();
      });

    const ability = data.abilities?.[0]?.ability?.name
      ? data.abilities[0].ability.name.replace('-', ' ')
      : 'Habilidad Especial';

    const artworkUrl =
      data.sprites?.other?.['official-artwork']?.front_default ||
      data.sprites?.front_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;

    const result: CatalogPokemon = {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      nameEs: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      types: types.length ? types : ['Normal'],
      hp: statsObj['hp'] || 70,
      atk: statsObj['attack'] || 70,
      def: statsObj['defense'] || 70,
      spa: statsObj['special-attack'] || 70,
      spd: statsObj['special-defense'] || 70,
      spe: statsObj['speed'] || 70,
      ability: ability.charAt(0).toUpperCase() + ability.slice(1),
      moves: moves.length ? moves : ['Placaje', 'Ataque Rápido'],
      artworkUrl,
      spriteUrl: data.sprites?.front_default || artworkUrl,
    };

    memoryCache[clean] = result;
    memoryCache[String(data.id)] = result;
    return result;
  } catch (err) {
    console.warn('PokéAPI search error:', err);
    return null;
  }
}
