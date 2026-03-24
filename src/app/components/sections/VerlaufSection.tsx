"use client";

import { useState, useEffect } from "react";
import { Card } from "../Card";
import { Button } from "../Button";
import {
  loadDrafts,
  deleteDraft,
  type Draft,
} from "@/lib/scribeLocalStorage";

const typeLabel: Record<Draft["type"], string> = {
  "kalt-email": "Kalt-Email",
  "follow-up": "Follow-up",
  antwort: "Antwort",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("de-DE", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function VerlaufSection() {
  const [drafts, setDrafts] = useState<Draft[]>([]);

  function refresh() {
    const sorted = [...loadDrafts()].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    setDrafts(sorted);
  }

  useEffect(() => {
    queueMicrotask(() => {
      const sorted = [...loadDrafts()].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setDrafts(sorted);
    });
  }, []);

  function handleDelete(id: string) {
    try {
      deleteDraft(id);
      refresh();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Verlauf</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gespeicherte Entwürfe (lokal im Browser). Später in der Cloud.
        </p>
      </div>

      {drafts.length === 0 ? (
        <Card className="border-dashed bg-secondary/30">
          <p className="text-muted-foreground text-sm text-center py-8">
            Noch keine Entwürfe. Lege unter Kalt-Email, Follow-up oder Antwort welche an.
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {drafts.map((d) => (
            <li key={d.id}>
              <Card className="p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-accent-foreground bg-accent px-2 py-0.5 rounded">
                    {typeLabel[d.type]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(d.updatedAt)}
                  </span>
                </div>
                <p className="font-medium text-foreground">{d.subject}</p>
                {d.toEmail && (
                  <p className="text-sm text-muted-foreground mt-1">An: {d.toEmail}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3 whitespace-pre-wrap">
                  {d.body}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-3 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(d.id)}
                >
                  Löschen
                </Button>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
