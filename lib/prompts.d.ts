/**
 * Reads a single line from stdin with an optional default.
 *
 * @param question - The prompt shown to the user.
 * @param defaultValue - Value returned when the answer is blank.
 * @returns The trimmed answer, or `defaultValue` when blank.
 */
export declare function promptLine(question: string, defaultValue?: string): Promise<string>;
/**
 * Prompts for a choice from a fixed list, returning the default on empty input.
 *
 * @param question - The prompt shown to the user.
 * @param choices - The allowed answers.
 * @param defaultValue - Value returned when the answer is blank.
 * @returns The selected choice.
 * @throws When the answer is not one of `choices`.
 */
export declare function promptChoice<T extends string>(question: string, choices: readonly T[], defaultValue: T): Promise<T>;
//# sourceMappingURL=prompts.d.ts.map