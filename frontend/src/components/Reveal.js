import React from "react";

/** Wraps children in a div with the `.reveal` class so useRevealObserver picks it up. */
export const Reveal = ({ children, className = "", as: Tag = "div", testId, ...props }) => (
  <Tag className={`reveal ${className}`.trim()} data-testid={testId} {...props}>
    {children}
  </Tag>
);
