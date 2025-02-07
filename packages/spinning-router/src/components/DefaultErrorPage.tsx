import React from "react";

export const DefaultErrorPage: React.FC<{ error: any }> = ({ error }) => {
  if (error && error.stack && error.message) {
    return (
      <div>
        <h4>{error.message}</h4>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return (
      <div>
        <h4>{"" + error}</h4>
      </div>
    );
  }
};
