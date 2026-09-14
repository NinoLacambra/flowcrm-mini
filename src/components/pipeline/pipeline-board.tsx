"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

type Deal = {
  id: number;
  title: string;
  value: string;
  stage: string;
  contactName: string;
  company: string | null;
};

const stages = [
  { id: "new", label: "New" },
  { id: "qualified", label: "Qualified" },
  { id: "proposal", label: "Proposal" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
];

function DealCard({
  deal,
  overlay = false,
}: {
  deal: Deal;
  overlay?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `deal-${deal.id}`,
    data: {
      deal,
    },
    disabled: overlay,
  });

  const style =
    transform && !overlay
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
      : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab rounded-lg border border-zinc-800 bg-zinc-900 p-4 active:cursor-grabbing ${
        isDragging ? "opacity-30" : ""
      } ${overlay ? "w-56 shadow-2xl" : ""}`}
    >
      <p className="font-medium text-zinc-100">
        {deal.title}
      </p>

      <p className="mt-2 text-sm text-zinc-400">
        {deal.contactName}
      </p>

      {deal.company && (
        <p className="text-xs text-zinc-500">
          {deal.company}
        </p>
      )}

      <p className="mt-4 text-sm font-medium">
        ₱{Number(deal.value).toLocaleString()}
      </p>
    </div>
  );
}

function PipelineColumn({
  stage,
  deals,
}: {
  stage: (typeof stages)[number];
  deals: Deal[];
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  const totalValue = deals.reduce(
    (total, deal) => total + Number(deal.value),
    0
  );

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950">
      <div className="border-b border-zinc-800 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">
            {stage.label}
          </h3>

          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
            {deals.length}
          </span>
        </div>

        <p className="mt-1 text-xs text-zinc-500">
          ₱{totalValue.toLocaleString()}
        </p>
      </div>

      <div
        ref={setNodeRef}
        className={`min-h-[400px] space-y-3 p-3 transition ${
          isOver ? "bg-zinc-900/70" : ""
        }`}
      >
        {deals.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-800 p-4 text-center text-xs text-zinc-600">
            Drop deals here
          </div>
        ) : (
          deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function PipelineBoard({
  deals: initialDeals,
}: {
  deals: Deal[];
}) {
  const router = useRouter();

  const [deals, setDeals] = useState(initialDeals);
  const [activeDeal, setActiveDeal] =
    useState<Deal | null>(null);

  function handleDragStart(event: DragStartEvent) {
    const deal = event.active.data.current?.deal as
      | Deal
      | undefined;

    setActiveDeal(deal ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveDeal(null);

    if (!over) return;

    const deal = active.data.current?.deal as
      | Deal
      | undefined;

    if (!deal) return;

    const newStage = String(over.id);

    if (deal.stage === newStage) return;

    const oldDeals = deals;

    // Update the UI immediately.
    setDeals((current) =>
      current.map((item) =>
        item.id === deal.id
          ? { ...item, stage: newStage }
          : item
      )
    );

    try {
      const response = await fetch(
        `/api/deals/${deal.id}/stage`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stage: newStage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Stage update failed");
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      // Roll back the optimistic update.
      setDeals(oldDeals);

      alert("Failed to move deal.");
    }
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="mt-8 overflow-x-auto pb-4">
        <div className="grid min-w-[1200px] grid-cols-5 gap-4">
          {stages.map((stage) => (
            <PipelineColumn
              key={stage.id}
              stage={stage}
              deals={deals.filter(
                (deal) => deal.stage === stage.id
              )}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeDeal ? (
          <DealCard
            deal={activeDeal}
            overlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}