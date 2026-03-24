"use client";

import { useState } from "react";
import { Card } from "../Card";
import { Button } from "../Button";
import { Input } from "../Input";
import { upsertDraft, type Draft } from "@/lib/scribeLocalStorage";

const textareaClass =
  "w-full min-h-[140px] px-4 py-2.5 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y";

export function AntwortSection() {
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [original, setOriginal] = useState("");
  const [reply, setReply] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function handleSave() {
    setError("");
    try {
      const now = new Date().toISOString();
      const draft: Draft = {
        id: crypto.randomUUID(),
        type: "antwort",
        subject: subject.trim() || "(Antwort)",
        body: reply.trim(),
        toEmail: toEmail.trim() || undefined,
        context: original.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      };
      upsertDraft(draft);
      setSaved(true);
      setOriginal("");
      setReply("");
      setSubject("");
      setToEmail("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Speichern fehlgeschlagen.");
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Antwort</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Auf eine erhaltene E-Mail antworten – Kontext und Antwort getrennt.
        </p>
      </div>

      <Card>
        <div className="space-y-4">
          <Input
            label="An (optional)"
            type="email"
            placeholder="kunde@firma.de"
            value={toEmail}
            onChange={(e) => {
              setToEmail(e.target.value);
              setSaved(false);
            }}
          />
          <Input
            label="Betreff"
            placeholder="Re: …"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setSaved(false);
            }}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Ursprüngliche E-Mail (optional)
            </label>
            <textarea
              className={textareaClass}
              placeholder="Zitat oder Zusammenfassung …"
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Deine Antwort</label>
            <textarea
              className={`${textareaClass} min-h-[200px]`}
              placeholder="Hallo …"
              value={reply}
              onChange={(e) => {
                setReply(e.target.value);
                setSaved(false);
              }}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          {saved && (
            <p className="text-sm text-accent-foreground font-medium">
              Entwurf gespeichert.
            </p>
          )}
          <Button type="button" onClick={handleSave}>
            Entwurf speichern
          </Button>
        </div>
      </Card>
    </div>
  );
}
