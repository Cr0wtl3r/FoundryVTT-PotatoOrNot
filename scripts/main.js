import { API } from './api.js';
import { ID, NAME } from './settings.js';

Hooks.once('init', () => {
  console.log(`${NAME} | Initializing`);
  API.registerSettings();

  game.modules.get(ID).api = API.public;
});

Hooks.once('ready', () => {
  API.promptUserIfFirstTime();
  console.log(`${NAME} | Ready`);
});