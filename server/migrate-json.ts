import { promises as fs } from "fs";
import path from "path";
import { db, DATA_DIR } from "./db";
import type { StaffMember, Project, ProjectsConfig } from "@shared/schema";

async function migrateStaff() {
  const staffRoot = path.join(DATA_DIR, "staff");
  let entries: fs.Dirent[] = [];
  try {
    entries = await fs.readdir(staffRoot, { withFileTypes: true });
  } catch {
    console.warn("[migrate-json] staff directory not found, skipping staff migration");
    return;
  }

  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  for (const dirName of dirs) {
    try {
      const valuesPath = path.join(staffRoot, dirName, "values.json");
      const raw = await fs.readFile(valuesPath, "utf-8");
      const staff: StaffMember = JSON.parse(raw);
      const endpoint = staff.endpoint || dirName;
      const nowIso = new Date().toISOString();

      db.prepare(
        `INSERT OR REPLACE INTO developers (
          id, endpoint, name_json, nicknames_json, age, country,
          languages_json, post, description_json, contacts_json,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(
             (SELECT created_at FROM developers WHERE endpoint = ?),
             ?
           ), ?)`,
      ).run(
        endpoint,
        endpoint,
        JSON.stringify(staff.name),
        JSON.stringify(staff.nicknames ?? []),
        staff.age ?? null,
        staff.country ?? null,
        JSON.stringify(staff.languages ?? []),
        staff.post ?? null,
        JSON.stringify(staff.description ?? {}),
        JSON.stringify(staff.contacts ?? {}),
        endpoint,
        nowIso,
        nowIso,
      );

      console.log(`[migrate-json] imported staff ${endpoint}`);
    } catch (error) {
      console.error(`[migrate-json] failed to import staff from ${dirName}:`, error);
    }
  }
}

async function migrateProjects() {
  try {
    const projectsConfigPath = path.join(DATA_DIR, "projects.json");
    const cfgRaw = await fs.readFile(projectsConfigPath, "utf-8");
    const cfg: ProjectsConfig = JSON.parse(cfgRaw);

    for (const endpoint of cfg.project_endpoints) {
      try {
        const projectPath = path.join(DATA_DIR, "projects", "values", `${endpoint}.json`);
        const raw = await fs.readFile(projectPath, "utf-8");
        const project: Project = JSON.parse(raw);
        const nowIso = new Date().toISOString();

        db.prepare(
          `INSERT OR REPLACE INTO projects (
            id, endpoint, name, description_json, tags_json, developers_json,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, COALESCE(
               (SELECT created_at FROM projects WHERE endpoint = ?),
               ?
             ), ?)`,
        ).run(
          endpoint,
          endpoint,
          project.name,
          JSON.stringify(project.description ?? {}),
          JSON.stringify(project.tags ?? []),
          JSON.stringify(project.developers ?? []),
          endpoint,
          nowIso,
          nowIso,
        );

        console.log(`[migrate-json] imported project ${endpoint}`);
      } catch (error) {
        console.error(`[migrate-json] failed to import project ${endpoint}:`, error);
      }
    }
  } catch (error) {
    console.warn("[migrate-json] projects.json not found, skipping projects migration", error);
  }
}

async function main() {
  console.log("[migrate-json] starting migration from data/ JSON files into SQLite");
  await migrateStaff();
  await migrateProjects();
  console.log("[migrate-json] done");
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();

