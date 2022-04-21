import fs from 'fs';
import {argv, exit, env} from 'process';
import fetch from 'node-fetch';
import 'dotenv/config'

import homeTemplate from './templates/index.hbs';

const projectVersion = argv?.[2];

const FETCH_STORIES_URL = 'https://api.app.shortcut.com/api/v3/stories/search'
const FETCH_ITERATIONS_URL = 'https://api.app.shortcut.com/api/v3/iterations'

if (!projectVersion) {
	console.log('You need to pass the version of the current release');
	exit(1)
	//TODO: handle the correct format of the version passed too
};

async function postSC(path, body={}){
	const res = await fetch(path, {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Shortcut-Token': env.SC_TOKEN,
			'Content-Type': 'application/json'
		},
		...body
	})
	return await res.json();
}

async function getSC(path){
	const res = await fetch(path, {
		method: 'GET',
		mode: 'cors',
		headers: {
			'Shortcut-Token': env.SC_TOKEN,
			'Content-Type': 'application/json'
		},
	})
	return await res.json();
} 


const iterations = await getSC(FETCH_ITERATIONS_URL);
const iterationId = iterations.find(e => e.name.includes(projectVersion))?.id

if (!iterationId) {
	console.log('Iteration ID not found');
	exit(1);
}

try {
	const data = await postSC(FETCH_STORIES_URL, {
		body: JSON.stringify({
			iteration_id: iterationId,
			workflow_state_id: 500000866
		})
	})

	fs.writeFileSync(
		'./dist/output/test.html',
		homeTemplate({
			tasks: data
		})
	);

	console.log('🚀 Report sucessfully generated!');
	
} catch (error) {
	console.log('💣 Ask Matteo why this is not working');
}
