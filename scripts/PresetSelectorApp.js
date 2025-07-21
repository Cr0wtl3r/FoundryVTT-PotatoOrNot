import { ID, PRESETS, SETTING_KEYS } from './settings.js';
import { API } from './api.js';

export class PresetSelectorApp extends FormApplication {
  constructor(options = {}) {
    super({}, options);
    game.settings.sheet?.close();
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: `${ID}-preset-selector`,
      title: 'Performance Preset Selector',
      template: `modules/${ID}/templates/preset-selector.hbs`,
      width: 700,
      height: 'auto',
      classes: ['dialog', `${ID}-app`],
    });
  }

  /** @override */
  getData(options = {}) {
    const savedLevel = game.settings.get(ID, SETTING_KEYS.SAVED_PRESET_LEVEL);
    const presetsWithIndex = PRESETS.map((preset, index) => ({
      ...preset,
      index: index,
      isActive: index === savedLevel,
    }));

    return {
      presets: presetsWithIndex,
    };
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html[0].querySelectorAll('.potato-level-container').forEach((button) => {
      button.addEventListener('click', (event) => this._onPresetClick(event));
    });

  }

  /**
   * Manipula o clique em um dos cartões de preset.
   * @param {MouseEvent} event - O evento de clique.
   */
  _onPresetClick(event) {
    const target = event.currentTarget;
    const level = target.dataset.level;

    this.element.querySelectorAll('.potato-level-container').forEach((el) => el.classList.remove('active'));
    target.classList.add('active');

    this.element.querySelector('input[name="selectedLevel"]').value = level;
  }

  /**
   * Executado quando o formulário é enviado.
   * @override
   */
  async _updateObject(event, formData) {
    const selectedLevel = parseInt(formData.selectedLevel, 10);
    if (isNaN(selectedLevel)) return;

    await API.applyPreset(selectedLevel);
  }
}