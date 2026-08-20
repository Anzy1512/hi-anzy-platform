import React from "react";

/** Wraps children in a div with the `.reveal` class so useRevealObserver picks it up. */
export const Reveal = ({ children, className = "", as: Tag = "div", ...props }) => (
  <Tag className={`reveal ${className}`.trim()} {...props}>
    {children}
  </Tag>
);
