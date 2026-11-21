/**
 * Minimal interactive prompts (readline-based, zero dependencies).
 */
import { createInterface } from 'node:readline';
/**
 * Reads a single line from stdin with an optional default.
 *
 * @param question - The prompt shown to the user.
 * @param defaultValue - Value returned when the answer is blank.
 * @returns The trimmed answer, or `defaultValue` when blank.
 */
export async function promptLine(question, defaultValue) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const suffix = defaultValue !== undefined && defaultValue !== '' ? ` [${defaultValue}]` : '';
    const answer = await new Promise((resolve) => {
        rl.question(`${question}${suffix}: `, (value) => resolve(value));
    });
    rl.close();
    const trimmed = answer.trim();
    return trimmed.length > 0 ? trimmed : (defaultValue ?? '');
}
/**
 * Prompts for a choice from a fixed list, returning the default on empty input.
 *
 * @param question - The prompt shown to the user.
 * @param choices - The allowed answers.
 * @param defaultValue - Value returned when the answer is blank.
 * @returns The selected choice.
 * @throws When the answer is not one of `choices`.
 */
export async function promptChoice(question, choices, defaultValue) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const hint = choices.map((choice) => (choice === defaultValue ? `${choice}*` : choice)).join(' / ');
    const answer = await new Promise((resolve) => {
        rl.question(`${question} (${hint}): `, (value) => resolve(value));
    });
    rl.close();
    const trimmed = answer.trim();
    if (trimmed.length === 0)
        return defaultValue;
    if (choices.includes(trimmed))
        return trimmed;
    throw new Error(`Invalid choice: ${trimmed} (expected one of ${choices.join(', ')})`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbXB0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm9tcHRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBQ0gsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVoRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQUMsS0FBSyxVQUFVLFVBQVUsQ0FBQyxRQUFnQixFQUFFLFlBQXFCO0lBQ3BFLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUM3RSxNQUFNLE1BQU0sR0FBRyxZQUFZLEtBQUssU0FBUyxJQUFJLFlBQVksS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUM3RixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksT0FBTyxDQUFTLENBQUMsT0FBTyxFQUFFLEVBQUU7UUFDakQsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFFBQVEsR0FBRyxNQUFNLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQyxDQUFDLENBQUM7SUFDSCxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDWCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDOUIsT0FBTyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUMsQ0FBQztBQUMvRCxDQUFDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLENBQUMsS0FBSyxVQUFVLFlBQVksQ0FDOUIsUUFBZ0IsRUFDaEIsT0FBcUIsRUFDckIsWUFBZTtJQUVmLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUM3RSxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BHLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQVMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtRQUNqRCxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsUUFBUSxLQUFLLElBQUksS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN0RSxDQUFDLENBQUMsQ0FBQztJQUNILEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNYLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM5QixJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQztRQUFFLE9BQU8sWUFBWSxDQUFDO0lBQzlDLElBQUssT0FBNkIsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQUUsT0FBTyxPQUFZLENBQUM7SUFDMUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsT0FBTyxxQkFBcUIsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDMUYsQ0FBQyJ9