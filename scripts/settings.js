export const ID = 'potato-or-not';
export const NAME = 'Auto-Potato (Performance Presets)';

export const SETTING_KEYS = {
  HAS_BEEN_PROMPTED: 'hasBeenPrompted',
  SAVED_PRESET_LEVEL: 'savedPresetLevel',
};


export const PRESETS = [
  {
    name: 'Batata Velha',
    description: 'Máxima performance. Para computadores que estão respirando por aparelhos.',
    settings: {
      core: {
        performanceMode: CONST.CANVAS_PERFORMANCE_MODES.LOW,
        maxFPS: 20,
        mipmap: false,
        visionAnimation: false,
        lightAnimation: false,
      },
    },
  },

  {
    name: 'Batata balanceada',
    description: 'Um balanço razoável entre visual e performance. Uma máquina velha, mas não tanto.',
    settings: {
      core: {
        performanceMode: CONST.CANVAS_PERFORMANCE_MODES.MED,
        maxFPS: 30,
        mipmap: true,
        visionAnimation: true,
        lightAnimation: true,
      },
    },
  },

  {
    name: 'Bata Premium',
    description: 'Melhor qualidade visual. Pra computadores de burgueses safados.',
    settings: {
      core: {
        performanceMode: CONST.CANVAS_PERFORMANCE_MODES.HIGH,
        maxFPS: 60,
        mipmap: true,
        visionAnimation: true,
        lightAnimation: true,
      },
    },
  },
];