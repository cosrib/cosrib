"use client";

import { useState } from "react";
import { Card } from "../Card";
import { Button } from "../Button";
import { Input } from "../Input";
import { upsertDraft, type Draft } from "@/lib/scribeLocalStorage";

const textareaClass =
  "w-full min-h-[220px] px-4 py-2.5 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background resize-y";

export function FollowUpSection() {
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function handleSave() {
    setError("");
    try {
      const now = new Date().toISOString();
      const draft: Draft = {
        id: crypto.randomUUID(),
        type: "follow-up",
        subject: subject.trim() || "(Follow-up)",
        body: body.trim(),
        toEmail: toEmail.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      };
      upsertDraft(draft);
      setSaved(true);
      setSubject("");
      setBody("");
      setToEmail("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Speichern fehlgeschlagen."
      );
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Follow-up</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Nachfass-E-Mail nach vorherigem Kontakt.
        </p>
      </div>

      <Card>
        <div className="space-y-4">
          <Input
            label="Empfänger (optional)"
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
            <label className="text-sm font-medium text-foreground">Text</label>
            <textarea
              className={textareaClass}
              placeholder="Hallo …"
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
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
