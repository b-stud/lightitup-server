import EffectBase from './EffectBase';

/**
 * Effect wrapper class
 */
export default class EffectConfig {

    enabled = true; // If false, linked effect won't be applied
    instance: null | EffectBase = null; // Linked effect object

    /**
     *
     * @param {string} name Effect unique name as defined inside the EffectController Class
     * @param options Options to configure and customize the effect
     */
    constructor(public name: string, public options: any) {
    }

    /**
     * Check if the effect is enabled regarding to its time (delay, duration, wait at end) configuration
     * @returns {boolean}
     */
    get isEnabled() {
        return this.enabled;
    }

    /**
     * User option to enable or disable the effect (it will override the 'enabled' property
     */
    get isActivated() {
        return this.options.activated;
    }
}
