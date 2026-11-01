import { spawn } from "node:child_process";
import { existsSync, copyFileSync } from "node:fs";
for (const app of ["backend", "frontend", "admin"])
  if (!existsSync(`${app}/.env`)) {
    copyFileSync(`${app}/.env.example`, `${app}/.env`);
    console.log(`Created ${app}/.env. Review before using real data.`);
  }
const children = [
  spawn("npm", ["start"], { cwd: "backend", stdio: "inherit" }),
  spawn("npm", ["run", "dev", "--", "--port", "5173", "--strictPort"], {
    cwd: "frontend",
    stdio: "inherit",
  }),
  spawn("npm", ["run", "dev", "--", "--port", "5174", "--strictPort"], {
    cwd: "admin",
    stdio: "inherit",
  }),
];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  children.forEach((p) => p.kill("SIGTERM"));
  setTimeout(() => process.exit(code), 500);
}
children.forEach((p) =>
  p.on("exit", (code) => {
    if (!stopping) stop(code || 0);
  }),
);
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
