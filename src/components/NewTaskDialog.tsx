// "New task" for any registered project: the task form with a Project field, so a task
// can go to another project (a dependency, say) without switching to it.

import { useEffect, useState } from "react";
import { taskProjectArg } from "../lib/taskProject";
import { listTasks, newTask, updateTask } from "../lib/tasks";
import { availableTags } from "./board/tagFilter";
import { TaskFormDialog } from "./TaskFormDialog";
import { useToast } from "./Toast";

export function NewTaskDialog({
  project,
  onClose,
  projects,
  activeKey,
  activeTags,
  onCreated,
}: {
  /** Registry key of the project the form opens on; null = closed. */
  project: string | null;
  onClose: () => void;
  /** Registry keys of every registered project, in rail order. */
  projects: string[];
  activeKey: string | null;
  /** The active project's tags, already loaded with its board. */
  activeTags: string[];
  /** After a task is created in the active project. */
  onCreated: () => Promise<void>;
}) {
  const open = project !== null;
  const [target, setTarget] = useState(project ?? "");
  const [otherTags, setOtherTags] = useState<string[]>([]);
  const { showToast } = useToast();

  // Start on the project it was opened on, from the first render it shows.
  const [openedOn, setOpenedOn] = useState(project);
  if (project !== openedOn) {
    setOpenedOn(project);
    if (project !== null) setTarget(project);
  }

  // Another project's tags come from its own board, fetched when it is picked.
  const other = open ? taskProjectArg(target, activeKey) : undefined;
  useEffect(() => {
    setOtherTags([]);
    if (other === undefined) return;
    let live = true;
    listTasks(other)
      .then((b) => {
        if (live) setOtherTags(availableTags(b.tasks));
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [other]);

  return (
    <TaskFormDialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
      mode="new"
      projects={projects}
      project={target}
      onProjectChange={setTarget}
      tagOptions={other === undefined ? activeTags : otherTags}
      onSubmit={async (v) => {
        const t = await newTask(v.title, v.description, v.priority, v.tags, other);
        if (v.prUrl) await updateTask(t.id, { pr_url: v.prUrl }, other);
        if (other === undefined) await onCreated();
        else showToast(`Created #${t.id} in ${other}`);
      }}
    />
  );
}
