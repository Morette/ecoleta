import Knex from 'knex';

export async function seed(knex: Knex) {
	return await knex('items').insert([
		{ title: 'Lamp', image: 'lamps.svg' },
		{ title: 'Batteries', image: 'batteries.svg' },
		{ title: 'Papers', image: 'papers.svg' },
		{ title: 'Electronic Waste', image: 'electronic.svg' },
		{ title: 'Organic Waste', image: 'organic.svg' },
		{ title: 'Kitchen Oil', image: 'oil.svg' },
	]);
}
