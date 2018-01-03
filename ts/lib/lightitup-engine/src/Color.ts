/**
 * HSL simple interface
 */
interface HSL {
    H: number;
    S: number;
    L: number;
}

/**
 * Represents a Color
 */
export default class Color {

    static Off: Color = new Color(0, 0, 0); // => Switched OFF LED state
    static Blue: Color = new Color(0, 0, 255);
    static Red: Color = new Color(255, 0, 0);
    static Green: Color = new Color(0, 255, 0);
    static Yellow: Color = new Color(255, 255, 0);
    static Pink: Color = new Color(255, 0, 255);
    static Purple: Color = new Color(138, 43, 226);
    static Orange: Color = new Color(255, 150, 50);

    R: number = 0;
    G: number = 0;
    B: number = 0;

    /**
     * @param {number} R Red value    (0 -> 255)
     * @param {number} G Green value  (0 -> 255)
     * @param {number} B Blue value   (0 -> 255)
     */
    constructor(R: number, G: number, B: number) {
        this.R = Color._safeLimit(R);
        this.G = Color._safeLimit(G);
        this.B = Color._safeLimit(B);
    }

    /**
     * Safely limit color part between 0 and 255, forcing it to be an integer
     * @param {number} x
     * @returns {number}
     * @private
     */
    static _safeLimit(x: number): number {
        return (isNaN(x) || null == x) ? 0 : Math.max(0, Math.min(Math.floor(x), 255));
    }

    /**
     * Clone current Color
     * @param {Color} color
     * @returns {Color}
     */
    static clone(color: Color): Color {
        return new Color(color.R, color.G, color.B);
    }


    /**
     * Converts an Color to its HSL representation
     * @param   {Color}  color       The Color value
     * @return  {HSL}                The HSL representation
     */
    static toHSL(color: Color): HSL {
        const r = (color.R / 255), g = (color.G / 255), b = (color.B / 255);
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const l: number = (max + min) / 2;
        let h: number = NaN;
        let s: number = NaN;
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return {H: h, S: s, L: l};
    }

    /**
     * Converts an HSL color to its RGB Color representation
     * @param   {HSL}  hsl        The HSL object
     * @return  {Color}           The RGB representation
     */
    static fromHSL(hsl: HSL): Color {
        const h = hsl.H, s = hsl.S, l = hsl.L;
        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p: number, q: number, t: number) => {
                if (t < 0) {
                    t += 1;
                }
                if (t > 1) {
                    t -= 1;
                }
                if (t < 1 / 6) {
                    return p + (q - p) * 6 * t;
                }
                if (t < 1 / 2) {
                    return q;
                }
                if (t < 2 / 3) {
                    return p + (q - p) * (2 / 3 - t) * 6;
                }
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return new Color(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
    }

    /**
     * Get RBG color string eg: rgb(100, 200, 100)
     * @returns {string}
     */
    toString(): string {
        return 'rgb(' + this.R + ', ' + this.G + ', ' + this.B + ')';
    }
}
