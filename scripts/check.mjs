import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const read = (path) => JSON.parse(readFileSync(join(root, path), "utf8"));

const agent = read("plugin.json");
const claude = read(".claude-plugin/plugin.json");
const agentMcp = read("mcp.json");
const claudeMcp = read(".mcp.json");
const claudeMarket = read(".claude-plugin/marketplace.json");
const codexMarket = read(".agents/plugins/marketplace.json");
const listing = agent.extensions["com.openai"].interface;

const problems = [];
const same = (label, ...values) => {
  if (new Set(values.map((value) => JSON.stringify(value))).size > 1)
    problems.push(`${label} differs: ${values.map((value) => JSON.stringify(value)).join(" vs ")}`);
};
const atMost = (label, value, max) => {
  if (value.length > max) problems.push(`${label} is ${value.length} characters, limit ${max}`);
};

for (const field of ["name", "version", "description", "homepage", "repository", "license", "keywords"])
  same(field, agent[field], claude[field]);

same(
  "plugin name in marketplaces",
  agent.name,
  claudeMarket.plugins[0].name,
  codexMarket.plugins[0].name,
);
same("MCP server names", Object.keys(agentMcp.mcpServers), Object.keys(claudeMcp.mcpServers));
same(
  "MCP server URLs",
  Object.values(agentMcp.mcpServers).map((server) => server.url),
  Object.values(claudeMcp.mcpServers).map((server) => server.url),
);
same("privacy policy URL", listing.privacyPolicyURL, claude.privacyPolicyUrl);
same("terms URL", listing.termsOfServiceURL, claude.termsOfServiceUrl);

atMost("displayName", listing.displayName, 30);
atMost("shortDescription", listing.shortDescription, 30);
atMost("longDescription", listing.longDescription, 4000);
atMost("developerName", listing.developerName, 80);

for (const asset of [listing.composerIcon, listing.logo, claude.icon])
  if (!existsSync(join(root, asset))) problems.push(`missing asset ${asset}`);

for (const skill of readdirSync(join(root, "skills"))) {
  const file = join(root, "skills", skill, "SKILL.md");
  if (!existsSync(file)) continue;
  const name = /^name: (.+)$/m.exec(readFileSync(file, "utf8"))?.[1];
  if (name !== skill) problems.push(`skills/${skill}/SKILL.md is named ${JSON.stringify(name)}`);
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("manifests agree");
