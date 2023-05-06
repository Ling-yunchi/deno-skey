const fd = await Deno.open("actions.log", { append: true });

export function log(msg: string) {
  const text = `${Date.now()}: ${msg}\n`;
  console.log(text.trim());
  const buffer = new TextEncoder().encode(text);
  fd.write(buffer);
}

addEventListener("unload", () => {
  fd.close();
});
