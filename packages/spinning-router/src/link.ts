export const link = (strings: TemplateStringsArray, ...values: any[]) => {
  const s = String.raw({ raw: strings }, ...values);

  if (s.startsWith("~")) {
    const id = document.location.hash.split("/")[1];
    if (id) {
      return `#/${id}${s.substring(1)}`;
    } else {
      return `#${s.substring(1)}`;
    }
  }

  if (s.startsWith("/")) {
    return "#" + s;
  } else {
    return "#/" + s;
  }
};
