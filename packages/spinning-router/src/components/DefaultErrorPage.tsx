import React from "react";

export const DefaultErrorPage: React.FC<{ error: any }> = ({ error }) => <p>Unhandled error: {"" + error}</p>;
