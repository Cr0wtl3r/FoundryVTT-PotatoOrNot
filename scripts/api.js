import { ID, SETTING_KEYS, PRESETS } from './settings.js';
import { PresetSelectorApp } from './PresetSelectorApp.js';

class PotatoAPI {
  #presets;

  constructor() {
    this.#presets = PRESETS;
  }

  registerSettings() {
    game.settings.register(ID, SETTING_KEYS.HAS_BEEN_PROMPTED, {
      scope: 'client',
      config: false,
      type: Boolean,
      default: false,
    });

    game.settings.register(ID, SETTING_KEYS.SAVED_PRESET_LEVEL, {
      scope: 'client',
      config: false,
      type: Number,
      default: 1,
    });

    game.settings.registerMenu(ID, 'PresetSelectorMenu', {
      name: 'Performance Preset',
      label: 'Choose Preset',
      icon: 'fas fa-rocket',
      type: PresetSelectorApp,
      restricted: false,
    });
  }

  /**
   * Expõe a API pública do módulo para outros módulos poderem interagir.
   * @returns {object} O objeto da API.
   */
  get public() {
    return {
      showDialog: this.showDialog,
      applyPreset: this.applyPreset,
      addPresetSetting: this.addPresetSetting,
      getPresets: () => foundry.utils.deepClone(this.#presets),
    };
  }

  showDialog() {
    new PresetSelectorApp().render(true);
  }

  promptUserIfFirstTime() {
    const hasBeenPrompted = game.settings.get(ID, SETTING_KEYS.HAS_BEEN_PROMPTED);
    if (!hasBeenPrompted) {
      this.showDialog();
    }
  }

  /**
   * Aplica um preset de performance.
   * @param {number} level - O nível do preset a ser aplicado (0, 1, ou 2).
   */
  async applyPreset(level) {
    if (this.#presets[level] === undefined) {
      console.error(`${ID} | Nível de preset inválido: ${level}`);
      return;
    }

    ui.notifications.info(`Applying '${this.#presets[level].name}' performance preset...`);

    const presetSettings = this.#presets[level].settings;

    for (const [module, settings] of Object.entries(presetSettings)) {
      for (const [setting, value] of Object.entries(settings)) {
        try {
          await game.settings.set(module, setting, value);
          console.log(`${ID} | Setting ${module}.${setting} applied with value: ${value}`);
        } catch (e) {
          console.error(`${ID} | Failed to apply setting ${module}.${setting}`, e);
        }
      }
    }

    await game.settings.set(ID, SETTING_KEYS.SAVED_PRESET_LEVEL, level);
    await game.settings.set(ID, SETTING_KEYS.HAS_BEEN_PROMPTED, true);

    Dialog.prompt({
      title: 'Settings Applied',
      content:
        '<p>Your performance settings have been updated. A reload is required for all changes to take effect.</p><p>Do you want to reload now?</p>',
      label: 'Reload Now',
      callback: () => window.location.reload(),
      rejectClose: false,
    });
  }

  /**
   * @param {number} level - O nível do preset (0, 1, 2).
   * @param {string} module - O ID do módulo (ex: 'core', 'fxmaster').
   * @param {string} setting - A chave da configuração.
   * @param {*} value - O valor a ser aplicado.
   */
  addPresetSetting(level, module, setting, value) {
    if (this.#presets[level] === undefined) {
      return ui.notifications.error('Invalid preset level provided.');
    }
    if (!this.#presets[level].settings[module]) {
      this.#presets[level].settings[module] = {};
    }
    this.#presets[level].settings[module][setting] = value;
    console.log(`${ID} | Setting ${module}.${setting} added to preset level ${level}.`);
  }
}

export const API = new PotatoAPI();