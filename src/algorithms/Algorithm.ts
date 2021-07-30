/**
 * An Algorithm that can be executed step-by-step.
 */
export interface Algorithm<Output, StepResult> {
  /**
   * Runs a step of the algorithm.
   *
   * @returns A StepResult that summarizes the result of the current step or undefined if the algorithm has terminated.
   */
  step(): StepResult | undefined;

  /**
   * Runs the algorithm until it terminates and ignores StepResults.
   * If it has already terminated, calling this function returns the output (again).
   *
   * @returns The output of the algorithm.
   */
  run(): Output;
}