"use client";

import { useId, useMemo } from "react";
import type { DraftDayActivity } from "@/lib/scribeLocalStorage";

type Props = {
  series: DraftDayActivity[];
};

/**
 * Flächen-/Liniendiagramm im Stil von Shopify Analytics:
 * große Karte, Verlauf unter der Linie, feines Raster.
 */
export function DashboardShopifyChart({ series }: Props) {
  const gradId = useId().replace(/:/g, "");

  const { linePath, areaPath, maxCount, totalWeek } = useMemo(() => {
    const counts = series.map((d) => d.count);
    const max = Math.max(1, ...counts);
    const total = counts.reduce((a, b) => a + b, 0);
    const n = series.length;
    if (n === 0) {
      return { linePath: "", areaPath: "", maxCount: 1, totalWeek: 0 };
    }

    const padX = 4;
    const padY = 8;
    const innerW = 100 - padX * 2;
    const innerH = 56 - padY * 2;

    const pts = series.map((_, i) => {
      const x = padX + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
      const yNorm = max > 0 ? series[i].count / max : 0;
      const y = padY + innerH * (1 - yNorm);
      return { x, y };
    });

    let dLine = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      dLine += ` L ${pts[i].x} ${pts[i].y}`;
    }

    const bottomY = padY + innerH;
    const dArea = `${dLine} L ${pts[pts.length - 1].x} ${bottomY} L ${pts[0].x} ${bottomY} Z`;

    return {
      linePath: dLine,
      areaPath: dArea,
      maxCount: max,
      totalWeek: total,
    };
  }, [series]);

  return (
    <div className="w-full rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Aktivität
        </p>
        <p className="text-lg sm:text-xl font-semibold text-foreground mt-0.5 tracking-tight">
          Entwürfe über die Zeit
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Letzte 7 Tage
          {series.length > 0 ? ` · ${totalWeek} gesamt` : ""}
        </p>
      </div>

      {series.length === 0 ? (
        <p className="text-sm text-muted-foreground py-12 text-center border border-dashed border-border rounded-lg bg-secondary/20">
          Daten werden geladen …
        </p>
      ) : (
        <>
          <div className="relative w-full text-primary">
            <svg
              viewBox="0 0 100 56"
              className="w-full h-[min(220px,42vw)] sm:h-[200px] block"
              preserveAspectRatio="none"
              role="img"
              aria-label="Entwürfe pro Tag, letzte 7 Tage"
            >
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line
                x1="4"
                y1="16"
                x2="96"
                y2="16"
                className="stroke-border"
                strokeWidth="0.35"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="4"
                y1="32"
                x2="96"
                y2="32"
                className="stroke-border"
                strokeWidth="0.35"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="4"
                y1="48"
                x2="96"
                y2="48"
                className="stroke-border"
                strokeWidth="0.35"
                vectorEffect="non-scaling-stroke"
              />
              <path d={areaPath} fill={`url(#${gradId})`} />
              <path
                d={linePath}
                fill="none"
                className="stroke-primary"
                strokeWidth="0.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              {series.map((day, i) => {
                const n = series.length;
                const padX = 4;
                const innerW = 92;
                const x = padX + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
                const yNorm = maxCount > 0 ? day.count / maxCount : 0;
                const y = 8 + 40 * (1 - yNorm);
                return (
                  <circle key={day.dateKey} cx={x} cy={y} r="1.15" className="fill-primary" />
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between gap-1 mt-3 pt-3 border-t border-border text-[10px] sm:text-xs text-muted-foreground">
            {series.map((day) => (
              <span key={day.dateKey} className="flex-1 text-center truncate min-w-0">
                {day.labelShort}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
