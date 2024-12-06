import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Loading } from '../../assets/Loading';
import { LessThan } from '../../assets/LessThan';
import { GreaterThan } from '../../assets/GreaterThan';
import { ArrowLeft } from '../../assets/ArrowLeft';
import { Balance } from '../../assets/Balance';
import { Vector } from '../../assets/Vector';
import Type from '../../components/Type';
import BaseStat from '../../components/BaseStat';
import DamageRelations from '../../components/DamageRelations';
import DamageModal from '../../components/DamageModal';
import { FormattedPokemonData } from '../../types/FormattedPokemonData';
import { Ability, PokemonDetail, Sprites, Stat } from '../../types/PokemonDetail';
import { DamageRelationOfPokemonType } from '../../types/DamageRelationOfPokemonTypes';
import { FlavorTextEntry, PokemonDescription } from '../../types/PokemonDescription';
import { PokemonData } from '../../types/PokemonData';

interface NextAndPreviousPokemon {
    next: string | undefined;
    previous: string | undefined;
}


const DetailPage = () => {

    const [pokemon, setPokemon] = useState<FormattedPokemonData>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const params = useParams() as { id: string };
    const pokemonId = params.id;
    const baseUrl = `https://pokeapi.co/api/v2/pokemon/`;
    useEffect(() => {
        setIsLoading(true);
        fetchPokemonData(pokemonId);
    }, [pokemonId])

    async function fetchPokemonData(id: string) {
        const url = `${baseUrl}${id}`
        try {
            const { data: pokemonData } = await axios.get<PokemonDetail>(url);
            if (pokemonData) {
                const { name, id, types, weight, height, stats, abilities, sprites } = pokemonData;
                console.log(sprites);
                const nextAndPreviousPokemon: NextAndPreviousPokemon = await getNextAndPreviousPokemon(id);

                const DamageRelations = await Promise.all(
                    types.map(async (i) => {
                        const type = await axios.get<DamageRelationOfPokemonType>(i.type.url);

                        return type.data.damage_relations
                    })
                )

                const formattedPokemonData: FormattedPokemonData = {
                    id,
                    name,
                    weight: weight / 10,
                    height: height / 10,
                    previous: nextAndPreviousPokemon.previous,
                    next: nextAndPreviousPokemon.next,
                    abilities: formatPokemonAbilities(abilities),
                    stats: formatPokemonStats(stats),
                    DamageRelations,
                    types: types.map(type => type.type.name),
                    sprites: formatPokemonSprites(sprites),
                    description: await getPokemonDescription(id)
                }

                setPokemon(formattedPokemonData);
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    }

    const filterAndFormatDescription = (flavorText: FlavorTextEntry[]): string[] => {

        const koreanDescriptions = flavorText
            ?.filter((text: FlavorTextEntry) => text.language.name === "ko")
            .map((text: FlavorTextEntry) => text.flavor_text.replace(/\r|\n|\f/g, ' '))
        return koreanDescriptions;
    }


    const getPokemonDescription = async (id: number): Promise<string> => {
        const url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`

        const { data: pokemonSpecies } = await axios.get<PokemonDescription>(url)

        const descriptions: string[] = filterAndFormatDescription(pokemonSpecies.flavor_text_entries)
        return descriptions[Math.floor(Math.random() * descriptions.length)]
    }

    const formatPokemonSprites = (sprites: Sprites) => {

        const newSprites = { ...sprites };

        (Object.keys(newSprites) as (keyof typeof newSprites)[]).forEach(key => {
            if (typeof newSprites[key] !== 'string') {
                delete newSprites[key];
            }
        });

        return Object.values(newSprites) as string[];

    }

    // console.log(pokemon?.DamageRelations)

    const formatPokemonStats = ([
        statHP,
        statATK,
        statDEP,
        statSATK,
        statSDEP,
        statSPD
    ]: Stat[]) => [
            { name: 'Hit Points', baseStat: statHP.base_stat },
            { name: 'Attack', baseStat: statATK.base_stat },
            { name: 'Defense', baseStat: statDEP.base_stat },
            { name: 'Special Attack', baseStat: statSATK.base_stat },
            { name: 'Special Defense', baseStat: statSDEP.base_stat },
            { name: 'Speed', baseStat: statSPD.base_stat }
        ]

    const formatPokemonAbilities = (abilities: Ability[]) => {
        return abilities.filter((_, index) => index <= 1)
            .map((obj: Ability) => obj.ability.name.replaceAll('-', ' '))
    }

    async function getNextAndPreviousPokemon(id: number) {
        const urlPokemon = `${baseUrl}?limit=1&offset=${id - 1}`;

        const { data: pokemonData } = await axios.get(urlPokemon);

        const nextResponse = pokemonData.next && (await axios.get<PokemonData>(pokemonData.next))

        const previousResponse = pokemonData.previous && (await axios.get<PokemonData>(pokemonData.previous))

        return {
            next: nextResponse?.data?.results?.[0]?.name,
            previous: previousResponse?.data?.results?.[0]?.name
        }
    }

    if (isLoading) {
        return (
            <div className={
                `absolute h-auto w-auto top-1/3 -translate-x-1/2 left-1/2 z-50`
            }>
                <Loading className='w-12 h-12 z-50 animate-spin text-slate-900' />
            </div>
        )
    }

    if (!isLoading && !pokemon) {
        return (
            <div>...NOT FOUND</div>
        )
    }


    const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
    const bg = `bg-${pokemon?.types?.[0]}`;
    const text = `text-${pokemon?.types?.[0]}`;


    // console.log(pokemon.stats);

    if (!isLoading && pokemon) {
        return (
            <article className='flex items-center gap-1 flex-col w-full'>
                <div
                    className={
                        `${bg} w-auto h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`
                    }
                >
                    {pokemon.previous && (
                        <Link
                            className='absolute top-[40%] -translate-y-1/2 z-50 left-1'
                            to={`/pokemon/${pokemon.previous}`}
                        >
                            <LessThan className='w-5 h-8 p-1' />
                        </Link>
                    )}

                    {pokemon.next && (
                        <Link
                            className='absolute top-[40%] -translate-y-1/2 z-50 right-1'
                            to={`/pokemon/${pokemon.next}`}
                        >
                            <GreaterThan className='w-5 h-8 p-1' />
                        </Link>
                    )}

                    <section className='w-full flex flex-col z-20 items-center justify-end relative h-full'>
                        <div className='absolute z-30 top-6 flex items-center w-full justify-between px-2'>
                            <div className='flex items-center gap-1'>
                                <Link to="/">
                                    <ArrowLeft className='w-6 h-8 text-zinc-200' />
                                </Link>
                                <h1 className='text-zinc-200 font-bold text-xl capitalize'>
                                    {pokemon.name}
                                </h1>
                            </div>
                            <div className='text-zinc-200 font-bold text-md'>
                                #{pokemon.id.toString().padStart(3, '00')}
                            </div>
                        </div>

                        <div className='relative h-auto max-w-[15.5rem] z-20 mt-6 -mb-16'>
                            <img
                                src={img}
                                width="100%"
                                height="auto"
                                loading="lazy"
                                alt={pokemon.name}
                                className={`object-contain h-full cursor-pointer`}
                                onClick={() => setIsModalOpen(true)}
                            />
                        </div>
                    </section>

                    <section className='w-full min-h-[65%] h-full bg-gray-800 z-10 pt-14 flex flex-col items-center gap-3 px-5 pb-4'>

                        <div className='flex items-center justify-center gap-4'>
                            {/* 포켓몬 타입 */}
                            {pokemon.types.map((type) => (
                                <Type key={type} type={type} />
                            ))}
                        </div>


                        <h2 className={`text-base font-semibold ${text}`}>
                            정보
                        </h2>

                        <div className='flex w-full items-center justify-between max-w-[400px] text-center'>

                            <div className='w-full'>
                                <h4 className='text-[0.5rem] text-zinc-100'>Weight</h4>
                                <div className='text-sm flex mt-1 gap-2 justify-center  text-zinc-200'>
                                    <Balance />
                                    {pokemon.weight}kg
                                </div>

                            </div>
                            <div className='w-full'>
                                <h4 className='text-[0.5rem] text-zinc-100'>Weight</h4>
                                <div className='text-sm flex mt-1 gap-2 justify-center  text-zinc-200'>
                                    <Vector />
                                    {pokemon.height}m
                                </div>

                            </div>
                            <div className='w-full'>
                                <h4 className='text-[0.5rem] text-zinc-100'>Weight</h4>
                                {pokemon.abilities.map((ability) => (
                                    <div key={ability} className="text-[0.5rem] text-zinc-100 capitalize"> {ability}</div>
                                ))}
                            </div>
                        </div>


                        <h2 className={`text-base font-semibold ${text}`}>
                            기본 능력치
                        </h2>
                        <div className='w-full'>

                            <table>
                                <tbody>
                                    {pokemon.stats.map((stat) => (
                                        <BaseStat
                                            key={stat.name}
                                            valueStat={stat.baseStat}
                                            nameStat={stat.name}
                                            type={pokemon.types[0]}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h2 className={`text-base font-semibold ${text}`}>
                            설명
                        </h2>
                        <p className='text-md leading-4 font-sans text-zinc-200 max-w-[30rem] text-center'>
                            {pokemon.description}
                        </p>



                        <div className='flex my-8 flex-wrap justify-center'>
                            {pokemon.sprites.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt="sprite"
                                />
                            ))}
                        </div>

                    </section>

                </div>
                {isModalOpen &&
                    <DamageModal
                        setIsModalOpen={setIsModalOpen}
                        damages={pokemon.DamageRelations}
                    />
                }
            </article>
        )
    }

    return null;

}

export default DetailPage