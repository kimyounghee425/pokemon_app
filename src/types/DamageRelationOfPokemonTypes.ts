export interface DamageRelationOfPokemonType {
    damage_relations:      DamageRelations;
    game_indices:          GameIndex[];
    generation:            Generation;
    id:                    number;
    move_damage_class:     Generation;
    moves:                 Generation[];
    name:                  string;
    names:                 Name[];
    past_damage_relations: PastDamageRelation[];
    pokemon:               Pokemon[];
}

export interface DamageRelations {
    double_damage_from: Generation[];
    double_damage_to:   Generation[];
    half_damage_from:   Generation[];
    half_damage_to:     Generation[];
    no_damage_from:     Generation[];
    no_damage_to:       Generation[];
}

export interface Generation {
    name: string;
    url:  string;
}

export interface GameIndex {
    game_index: number;
    generation: Generation;
}

export interface Name {
    language: Generation;
    name:     string;
}

export interface PastDamageRelation {
    damage_relations: DamageRelations;
    generation:       Generation;
}

export interface Pokemon {
    pokemon: Generation;
    slot:    number;
}
