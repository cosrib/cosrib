"use client";

import { useState, useEffect } from "react";
import { Card } from "../Card";
import { Button } from "../Button";
import { Input } from "../Input";
import {
  loadContacts,
  upsertContact,
  deleteContact,
  type Contact,
} from "@/lib/scribeLocalStorage";

export function KontakteSection() {
  const [list, setList] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function refresh() {
    setList(loadContacts());
  }

  useEffect(() => {
    queueMicrotask(() => setList(loadContacts()));
  }, []);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    if (!email.trim()) {
      setError("E-Mail ist Pflicht.");
      return;
    }
    try {
      const c: Contact = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim(),
        note: note.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      upsertContact(c);
      setName("");
      setEmail("");
      setNote("");
      setSaved(true);
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Speichern fehlgeschlagen.");
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kontakte</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Leads und Ansprechpartner – lokal gespeichert.
        </p>
      </div>

      <Card>
        <h3 className="font-semibold mb-4">Neuer Kontakt</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Max Mustermann"
          />
          <Input
            label="E-Mail"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="max@firma.de"
          />
          <Input
            label="Notiz (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="z. B. Branche, letzter Kontakt …"
          />
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          {saved && (
            <p className="text-sm text-accent-foreground font-medium">Gespeichert.</p>
          )}
          <Button type="submit">Kontakt speichern</Button>
        </form>
      </Card>

      {list.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Deine Kontakte ({list.length})
          </h3>
          <ul className="space-y-2">
            {list.map((c) => (
              <li key={c.id}>
                <Card className="p-4 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{c.name || "(Ohne Name)"}</p>
                    <p className="text-sm text-muted-foreground">{c.email}</p>
                    {c.note && (
                      <p className="text-sm mt-1 text-foreground/80">{c.note}</p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => {
                      deleteContact(c.id);
                      refresh();
                    }}
                  >
                    Löschen
                  </Button>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
