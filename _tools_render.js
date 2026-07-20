// Local preview renderer (mimics Jekyll's Liquid environment). Not used in production.
// Usage: node _tools_render.js <siteDir> <outFile>
const { Liquid } = require("liquidjs");
const yaml = require("js-yaml");
const { marked } = require("marked");
const fs = require("fs");
const path = require("path");

const siteDir = process.argv[2];
const outFile = process.argv[3];

function loadCollection(name) {
  const dir = path.join(siteDir, "_" + name);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith(".md")).map(f => {
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    const fm = yaml.load(m[1]) || {};
    fm.content = m[2] || "";
    return fm;
  });
}

const site = {
  data: { settings: yaml.load(fs.readFileSync(path.join(siteDir, "_data/settings.yml"), "utf8")) },
  research: loadCollection("research"),
  members: loadCollection("members"),
  publications: loadCollection("publications"),
  projects: loadCollection("projects"),
  news: loadCollection("news"),
  gallery: loadCollection("gallery"),
  courses: loadCollection("courses"),
};

const engine = new Liquid({ jekyllInclude: true });
engine.registerFilter("markdownify", (s) => marked.parse(String(s || "")));
engine.registerFilter("relative_url", (s) => s);
engine.registerFilter("date", (v, fmt) => {
  const d = v === "now" ? new Date() : new Date(v);
  return fmt.replace("%Y", d.getUTCFullYear())
            .replace("%m", String(d.getUTCMonth() + 1).padStart(2, "0"))
            .replace("%d", String(d.getUTCDate()).padStart(2, "0"));
});

let tpl = fs.readFileSync(path.join(siteDir, "index.html"), "utf8");
tpl = tpl.replace(/^---\n[\s\S]*?\n---\n/, "");
engine.parseAndRender(tpl, { site }).then((html) => {
  fs.writeFileSync(outFile, html);
  console.log("rendered", html.length, "bytes");
}).catch((e) => { console.error("RENDER ERROR:", e.message); process.exit(1); });
