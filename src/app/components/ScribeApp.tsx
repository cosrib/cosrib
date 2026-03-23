"use client";

import { useState, useEffect } from "react";
import { LandingPage } from "./LandingPage";
import { Dashboard } from "./Dashboard";
import { supabase } from "@/lib/supabase";

type View = "landing" | "dashboard";

export function ScribeApp() {
  const [currentView, setCurrentView] = useState<View>("landing");
  /** Kurz warten, bis Session geladen – sonst sieht man kurz Landing obwohl man eingeloggt ist */
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session) setCurrentView("dashboard");
      setAuthChecked(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) setCurrentView("dashboard");
      if (event === "SIGNED_OUT") setCurrentView("landing");
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  if (!authChecked) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-muted-foreground text-sm">
        Lädt...
      </div>
    );
  }
    
  return (
    <div className="min-h-screen w-full">
      {currentView === "landing" ? (
        <LandingPage onNavigate={setCurrentView} />
      ) : (
        <Dashboard onNavigate={setCurrentView} />
      )}
    </div>
  );
}
