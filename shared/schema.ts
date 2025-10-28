import { z } from "zod";

// Staff member schema
export const staffMemberSchema = z.object({
  endpoint: z.string(),
  name: z.record(z.string()),
  nicknames: z.array(z.string()),
  age: z.number(),
  country: z.string(),
  languages: z.array(z.string()),
  post: z.string(),
  description: z.record(z.string()),
  contacts: z.object({
    email: z.string().optional(),
    telegram_channel: z.string().optional(),
    github: z.string().optional(),
  }),
  projects: z.array(z.string()),
  colors: z.object({
    color1: z.string(),
    color2: z.string(),
    color_main: z.string(),
  }),
});

export type StaffMember = z.infer<typeof staffMemberSchema>;

// Project schema
export const projectSchema = z.object({
  endpoint: z.string(),
  name: z.string(),
  tags: z.array(z.string()),
  description: z.record(z.string()),
  developers: z.array(z.string()),
});

export type Project = z.infer<typeof projectSchema>;

// Endpoints config schema
export const endpointsConfigSchema = z.object({
  endpoints: z.array(z.string()),
});

export type EndpointsConfig = z.infer<typeof endpointsConfigSchema>;

// Projects config schema
export const projectsConfigSchema = z.object({
  project_endpoints: z.array(z.string()),
  colors: z.object({
    color1: z.string(),
    color2: z.string(),
    color_main: z.string(),
  }),
});

export type ProjectsConfig = z.infer<typeof projectsConfigSchema>;

// Environment config
export interface AppConfig {
  subdomens: boolean;
  debug: boolean;
  companyStartDate?: string;
  companyEndDate?: string;
}
