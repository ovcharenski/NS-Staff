import { promises as fs } from 'fs';
import path from 'path';
import type { StaffMember, Project, EndpointsConfig, ProjectsConfig } from '@shared/schema';

export interface IStorage {
  getAllStaff(): Promise<StaffMember[]>;
  getStaffByEndpoint(endpoint: string): Promise<StaffMember | undefined>;
  getAllProjects(): Promise<Project[]>;
  getProjectByEndpoint(endpoint: string): Promise<Project | undefined>;
  getStaffPhotoPath(endpoint: string, photoNum: number): string;
  getProjectPicturePath(endpoint: string): Promise<string | undefined>;
}

class FileStorage implements IStorage {
  private staffCache: Map<string, StaffMember> = new Map();
  private projectsCache: Map<string, Project> = new Map();
  private initialized = false;

  private async initialize() {
    if (this.initialized) return;

    try {
      // Load endpoints config
      const endpointsPath = path.join(process.cwd(), 'data', 'endpoints.json');
      const endpointsData = await fs.readFile(endpointsPath, 'utf-8');
      const endpointsConfig: EndpointsConfig = JSON.parse(endpointsData);

      // Load all staff members
      for (const endpoint of endpointsConfig.endpoints) {
        try {
          const staffPath = path.join(process.cwd(), 'data', 'staff', endpoint, 'values.json');
          const staffData = await fs.readFile(staffPath, 'utf-8');
          const staff: StaffMember = JSON.parse(staffData);
          this.staffCache.set(endpoint, staff);
        } catch (error) {
          console.error(`Failed to load staff member ${endpoint}:`, error);
        }
      }

      // Load projects config
      const projectsConfigPath = path.join(process.cwd(), 'data', 'projects.json');
      const projectsConfigData = await fs.readFile(projectsConfigPath, 'utf-8');
      const projectsConfig: ProjectsConfig = JSON.parse(projectsConfigData);

      // Load all projects
      for (const projectEndpoint of projectsConfig.project_endpoints) {
        try {
          const projectPath = path.join(process.cwd(), 'data', 'projects', 'values', `${projectEndpoint}.json`);
          const projectData = await fs.readFile(projectPath, 'utf-8');
          const project: Project = JSON.parse(projectData);
          this.projectsCache.set(projectEndpoint, project);
        } catch (error) {
          console.error(`Failed to load project ${projectEndpoint}:`, error);
        }
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      throw error;
    }
  }

  async getAllStaff(): Promise<StaffMember[]> {
    await this.initialize();
    return Array.from(this.staffCache.values());
  }

  async getStaffByEndpoint(endpoint: string): Promise<StaffMember | undefined> {
    await this.initialize();
    return this.staffCache.get(endpoint);
  }

  async getAllProjects(): Promise<Project[]> {
    await this.initialize();
    return Array.from(this.projectsCache.values());
  }

  async getProjectByEndpoint(endpoint: string): Promise<Project | undefined> {
    await this.initialize();
    return this.projectsCache.get(endpoint);
  }

  getStaffPhotoPath(endpoint: string, photoNum: number): string {
    return path.join(process.cwd(), 'data', 'staff', endpoint, `${photoNum}.png`);
  }

  async getProjectPicturePath(endpoint: string): Promise<string | undefined> {
    const basePath = path.join(process.cwd(), 'data', 'projects', 'pictures', endpoint);
    
    // Try different extensions
    const extensions = ['.jpg', '.png', '.jpeg', '.webp'];
    for (const ext of extensions) {
      const fullPath = basePath + ext;
      try {
        await fs.access(fullPath);
        return fullPath;
      } catch {
        continue;
      }
    }
    
    return undefined;
  }
}

export const storage = new FileStorage();
