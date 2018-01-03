/**
 * Abstract interface to manage effects depending on a step time
 */
import EffectBase from "../../EffectBase";

export default abstract class StepTimeAbstract extends EffectBase {

  lastStep: number = NaN;
  lastStepTime: number = NaN;
  stepTime: number = NaN;
  initTime = new Date().getTime();


  /**
   * Set the last step back to NaN
   * @param time Passed as arg for optimization purpose
   */
  public resetStep(time = null) {
    this.lastStep = NaN;
    this.initTime = time || new Date().getTime();
  }

  /**
   * Check if current time is another step
   * @param time Passed as arg for optimization purpose
   */
  public stepCheck(time = null): boolean {
    if (this.stepTime > 0) {
      const now = time || new Date().getTime();
      const currentStep = Math.floor((now - this.initTime) / this.stepTime);
      if (isNaN(this.lastStep) || this.lastStep != currentStep) {
        const delta = isNaN(this.lastStep) ? 1 : (this.lastStep - currentStep);
        this.onStepChange(currentStep, delta);
        this.lastStep = currentStep;
        this.lastStepTime = now;
        return true;
      }
      return false;
    }
    return false;
  }

  /**
   *
   * @param {number} currentStep The currentStep time
   * @param {number} deltaStep   The count of steps between now and last check
   */
  public abstract onStepChange(currentStep: number, deltaStep: number, ...other): void;

}
