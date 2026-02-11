import type { ReactNode } from "react";

type AppShellProps = {
  toolbar?: ReactNode;
  sidebar?: ReactNode;
  main?: ReactNode;
  detail?: ReactNode;
};

export default function AppShell({ toolbar, sidebar, main, detail }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="toolbar">{toolbar}</header>
      <div className="workspace">
        <aside aria-label="Sources" className="panel panel--sidebar">
          {sidebar}
        </aside>
        <section aria-label="Feed" className="panel panel--main">
          {main}
        </section>
        <section aria-label="Detail" className="panel panel--detail">
          {detail}</section>
      </div>
    </div>
  );
}
