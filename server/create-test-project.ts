import path from "path";
import { apiPost, apiUploadFile, API_BASE } from "./api-helper";

const TEST_PNG = path.join(process.cwd(), "data", "TEST.png");

async function main() {
  const endpoint = "test-project";

  const body = {
    endpoint,
    name: "Test Project",
    description: {
      ru: "Тестовый проект для проверки API.",
      en: "Test project for API verification.",
    },
    tags: ["test", "demo"],
    developers: ["test-developer"],
  };

  const result = await apiPost<{ endpoint: string }>("/api/projects", body);

  if (result.error) {
    if (result.status === 409) {
      console.log(`Project "${endpoint}" already exists.`);
      console.log(`  GET ${API_BASE}/api/projects/${endpoint}`);
      // Still try to upload picture in case it was missing
    } else {
      console.error("Failed to create test project:", result.error);
      process.exit(1);
    }
  }

  // Upload picture via API
  const pictureResult = await apiUploadFile(`/api/projects/${endpoint}/picture`, TEST_PNG);
  if (pictureResult.error) {
    console.warn("Warning: could not upload project picture:", pictureResult.error);
  }

  if (result.error && result.status === 409) return;

  console.log("Created test project:");
  console.log(`  endpoint: ${endpoint}`);
  console.log(`  GET ${API_BASE}/api/projects/${endpoint}`);
  console.log("");
  console.log("Открой в браузере:");
  console.log(`  ${API_BASE}/projects/${endpoint}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
