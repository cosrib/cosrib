"use client";

import { useState, useEffect } from "react";
import { Card } from "../Card";
import { Button } from "../Button";
import { loadStyleNotes, saveStyleNotes } from "@/lib/scribeLocalStorage";

const textareaClass =
  "w-full min-h-[280px] px-4 py-2.5 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y";

export function SchreibstilSection() {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    queueMicrotask(() => setText(loadStyleNotes()));
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    try {
      saveStyleNotes(text);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Speichern fehlgeschlagen.");
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Schreibstil</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Beschreibe Ton, typische Formulierungen, Tabus – hilft später der KI, wie du schreibst.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Dein Schreibstil</label>
            <textarea
              className={textareaClass}
              placeholder="z. B. Du-Form, kurze Sätze, kein Buzzword …"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          {saved && (
            <p className="text-sm text-accent-foreground font-medium">Gespeichert.</p>
          )}
          <Button type="submit">Speichern</Button>
        </form>
      </Card>
    </div>
  );
}
