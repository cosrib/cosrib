"use client";

import { useState, useEffect } from "react";
import { Card } from "../Card";
import { Button } from "../Button";
import { Input } from "../Input";
import { loadProfile, saveProfile, type Profile } from "@/lib/scribeLocalStorage";

export function ProfilSection() {
  const [displayName, setDisplayName] = useState("");
  const [company, setCompany] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      const p = loadProfile();
      setDisplayName(p.displayName);
      setCompany(p.company);
    });
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    try {
      const p: Profile = {
        displayName: displayName.trim(),
        company: company.trim(),
      };
      saveProfile(p);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Speichern fehlgeschlagen.");
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profil</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Wird in Entwürfen und später in der KI genutzt – jetzt lokal.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Anzeigename"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Dein Name"
            autoComplete="name"
          />
          <Input
            label="Firma / Brand (optional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="z. B. Coscribe Freelancing"
          />
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          {saved && (
            <p className="text-sm text-accent-foreground font-medium">Profil gespeichert.</p>
          )}
          <Button type="submit">Speichern</Button>
        </form>
      </Card>
    </div>
  );
}
