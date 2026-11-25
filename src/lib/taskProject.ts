// Which project a task command acts on, when the New task form can target any
// registered project.

/** The `project` argument for a task command: omitted for the active project, so it
 *  resolves exactly as the board does; the registry key for any other project. */
export function taskProjectArg(key: string, activeKey: string | null): string | undefined {
  return key === activeKey ? undefined : key;
}
