/**
 * Utils class to deal with Effects
 */
export default class EffectsUtils{
	
	/**
	 * Will evaluate the duration of the effect or return NaN is the effect is to run forever (until another one overrides it)
	 */
	 static evaluateEffectDuration(effectObj){
		let max = NaN;
		effectObj.forEach((curEffectObj) => {
			let options = curEffectObj.options;
			let delay = options.delay || 0;
			let duration = options.duration || 0;
			let waitAtEnd = options.waitAtEnd || 0;
			let repeat = options.repeat || NaN;
			if(!isNaN(repeat)){
				max = Math.max(isNaN(max)?-1:max, repeat * (delay + duration + waitAtEnd));
			}
		});
		return isNaN(max)?null:max;
	};
}