import React from "react";

export const DefaultLoadingIndicator: React.FC = () => (
  <div
    style={{
      position: "fixed",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      opacity: 1
    }}
  >
    <svg width="200" height="200" viewBox="0 0 50 50">
      <path fill="#000000" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
        <animate attributeName="opacity" values="0; 0.1; 0.5" dur="2s" />
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="1s"
          repeatCount="indefinite"
        ></animateTransform>
      </path>
    </svg>
  </div>
);
