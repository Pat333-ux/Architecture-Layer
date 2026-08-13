/**
 * Architecture Layer — Beast System 3.0 (SAIA-Class S)
 * Central orchestration hub for identity, config loading,
 * module activation, and cross-repo coordination.
 */

import { loadConfig } from "./system/config-loader";
import { activateWorkflows } from "./system/workflow-sequencer";
import { registerIdentity } from "./system/identity-anchor";
import { linkModules } from "./system/module-map";

export async function bootstrapBeastSystem() {
  console.log("🔥 Bootstrapping Beast System 3.0 — Architecture Layer");

  // 1. Load environment-agnostic configuration
  const config = await loadConfig();
  console.log("✓ Config loaded");

  // 2. Register sovereign identity anchor
  await registerIdentity(config.identity);
  console.log("✓ Identity anchor registered");

  // 3. Link all modules across 37 repositories
  const modules = await linkModules(config.modules);
  console.log(`✓ ${modules.length} modules linked`);

  // 4. Activate workflow sequences
  await activateWorkflows(modules, config.workflows);
  console.log("✓ Workflows activated");

  console.log("🚀 Beast System 3.0 Architecture Layer is online");
}

bootstrapBeastSystem().catch((err) => {
  console.error("❌ Architecture Layer failed to start:", err);
});
