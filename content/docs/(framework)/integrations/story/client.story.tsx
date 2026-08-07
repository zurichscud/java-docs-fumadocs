import { ChevronDownIcon, ChevronRightIcon, InfoIcon } from 'lucide-react';

function WithControl() {
  return (
    <div className="not-prose flex flex-col gap-1 rounded-md border bg-fd-card p-1 text-fd-card-foreground shadow-sm">
      <div className="flex flex-row items-center gap-2">
        <p className="px-1.5 text-sm font-medium">Callout</p>
        <button
          type="button"
          className="ms-auto flex w-fit items-center gap-2 rounded-md px-1.5 py-1 text-start text-xs font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          <span>Default</span>
          <ChevronDownIcon className="size-3.5 shrink-0" />
        </button>
      </div>
      <div className="rounded-md border bg-fd-background p-3">
        <div
          className="my-4 flex gap-2 rounded-xl border bg-fd-card p-3 ps-1 text-sm text-fd-card-foreground shadow-md"
          style={{ '--callout-color': 'var(--color-fd-info, var(--color-fd-muted))' } as React.CSSProperties}
        >
          <div className="w-0.5 rounded-sm bg-(--callout-color)/50" />
          <InfoIcon className="-me-0.5 size-5 fill-(--callout-color) text-fd-card" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="my-0! font-medium">This is a Callout</p>
          </div>
        </div>
      </div>
      <fieldset className="col-span-full flex max-h-[600px] flex-col gap-1.5 overflow-auto">
        <label className="inline-flex w-full items-center gap-0.5">
          <button type="button" className="inline-flex items-center justify-center rounded-md p-1 text-fd-muted-foreground">
            <ChevronRightIcon className="size-4" />
          </button>
          <button type="button" className="me-auto font-mono text-xs font-medium text-fd-foreground">
            Props
          </button>
          <code className="text-xs text-fd-muted-foreground">object</code>
        </label>
      </fieldset>
    </div>
  );
}

export const story = { WithControl };
