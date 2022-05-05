import { env } from 'process';
import fetch from 'node-fetch';
import core from '@actions/core';
import io from '@actions/io';
import { writeFileSync } from 'fs';

import homeTemplate from './templates/index.hbs';

// Constants
const FETCH_STORIES_URL = 'https://api.app.shortcut.com/api/v3/stories/search';
const FETCH_ITERATIONS_URL = 'https://api.app.shortcut.com/api/v3/iterations';
const OUTPUT_PATH = '.sc_report/output';

async function postSC(path, body = {}) {
  const res = await fetch(path, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Shortcut-Token': env.SC_TOKEN,
      'Content-Type': 'application/json',
    },
    ...body,
  });
  return await res.json();
}

async function getSC(path) {
  const res = await fetch(path, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Shortcut-Token': env.SC_TOKEN,
      'Content-Type': 'application/json',
    },
  });
  return await res.json();
}

async function run() {
  const iterationId = core.getInput('iterationId');
  const worflowStateId = core.getInput('worflowStateId');

  try {
  const iterations = await getSC(FETCH_ITERATIONS_URL);
  const iteration = iterations.find(e => e.name.includes(iterationId));

  if (!iteration?.id) {
    core.setFailed('Iteration ID not found');
  }
    const data = await postSC(FETCH_STORIES_URL, {
      body: JSON.stringify({
        iteration_id: iteration?.id,
        workflow_state_id: worflowStateId,
      }),
    });

    const generatedHtml = homeTemplate({
      tasks: data,
    });

    io.mkdirP(OUTPUT_PATH);

    writeFileSync(OUTPUT_PATH, generatedHtml);

    core.setOutput(OUTPUT_PATH);
  } catch (error) {
    core.error(error);
    core.setFailed('💣 Ask Matteo why this is not working');
  }
}

run();