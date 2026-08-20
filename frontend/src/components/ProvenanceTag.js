import React from "react";
import { PROVENANCE_STYLES } from "@/data/content";

/**
 * Renders a small chip showing the provenance/attribution of a work item.
 * Colours and border style come from the PROVENANCE_STYLES map in content.js.
 */
export const ProvenanceTag = ({ label, className = "" }) => {
  const style = PROVENANCE_STYLES[label] || { cls: "bg-[#F7F5EE] text-[#232A2A] border border-[#232A2A]/30", bar: false };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.14em] ${style.cls} ${className}`}>
      {style.bar && (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" aria-hidden="true" />
      )}
      {label}
    </span>
  );
};
