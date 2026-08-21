import React from "react";
import { PROVENANCE_STYLES } from "@/data/content";

export const ProvenanceTag = ({ value, dark = false, testId }) => {
  const s = PROVENANCE_STYLES[value] || PROVENANCE_STYLES.NETWORK;
  return (
    <span
      data-testid={testId || "provenance-tag"}
      className={`prov-tag sys-chip inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${dark && (value === "HI ANZY" || value === "HI ANZY DIRECT") ? "bg-[#F7F5EE] text-[#232A2A]" : s.cls}`}
    >
      {s.bar && <span className="red-bar" style={{ width: 8 }} />}
      {value}
    </span>
  );
};
