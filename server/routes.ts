import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateBusinessCard } from "./qr-generator";
import { promises as fs } from 'fs';
import path from 'path';

export async function registerRoutes(app: Express): Promise<Server> {
  // Get environment config
  const envConfig = {
    subdomens: process.env.SUBDOMENS === 'true',
    debug: process.env.DEBUG === 'true',
  };

  // Serve supported languages and countries
  app.get('/api/supported', async (_req, res) => {
    try {
      const filePath = path.join(process.cwd(), 'data', 'supported.json');
      const content = await fs.readFile(filePath, 'utf-8');
      res.json(JSON.parse(content));
    } catch (error) {
      res.status(404).json({ error: 'supported.json not found' });
    }
  });

  // Serve translation files
  app.get('/locales/:lang/:ns.json', async (req, res) => {
    try {
      const { lang, ns } = req.params;
      const filePath = path.join(process.cwd(), 'public', 'locales', lang, `${ns}.json`);
      const content = await fs.readFile(filePath, 'utf-8');
      res.json(JSON.parse(content));
    } catch (error) {
      res.status(404).json({ error: 'Translation file not found' });
    }
  });

  // Get all staff members
  app.get('/api/staff', async (req, res) => {
    try {
      const staff = await storage.getAllStaff();
      res.json(staff);
    } catch (error) {
      console.error('Error fetching staff:', error);
      res.status(500).json({ error: 'Failed to fetch staff members' });
    }
  });

  // Get single staff member
  app.get('/api/staff/:endpoint', async (req, res) => {
    try {
      const { endpoint } = req.params;
      const staff = await storage.getStaffByEndpoint(endpoint);
      
      if (!staff) {
        return res.status(404).json({ error: 'Staff member not found' });
      }
      
      res.json(staff);
    } catch (error) {
      console.error('Error fetching staff member:', error);
      res.status(500).json({ error: 'Failed to fetch staff member' });
    }
  });

  // Get staff photo
  app.get('/api/staff/:endpoint/photo/:num', async (req, res) => {
    try {
      const { endpoint, num } = req.params;
      const photoNum = parseInt(num, 10);
      
      if (isNaN(photoNum) || photoNum < 1 || photoNum > 3) {
        return res.status(400).json({ error: 'Invalid photo number' });
      }

      const photoPath = storage.getStaffPhotoPath(endpoint, photoNum);
      
      // Check if file exists
      try {
        await fs.access(photoPath);
        res.sendFile(photoPath);
      } catch {
        res.status(404).json({ error: 'Photo not found' });
      }
    } catch (error) {
      console.error('Error fetching photo:', error);
      res.status(500).json({ error: 'Failed to fetch photo' });
    }
  });

  // Generate QR business card
  app.get('/api/staff/:endpoint/qr/:lang', async (req, res) => {
    try {
      const { endpoint, lang } = req.params;
      const staff = await storage.getStaffByEndpoint(endpoint);
      
      if (!staff) {
        return res.status(404).json({ error: 'Staff member not found' });
      }

      const photoPath = storage.getStaffPhotoPath(endpoint, 1);
      
      // Get the site URL from request
      const protocol = req.protocol;
      const host = req.get('host');
      const siteUrl = `${protocol}://${host}`;

      const cardBuffer = await generateBusinessCard(staff, lang, photoPath, siteUrl);
      
      // Get localized name for filename
      const langKey = lang === 'ru' ? 'ru-RU' : 'en-EN';
      const displayName = staff.name[langKey] || staff.name['en-EN'] || Object.values(staff.name)[0];
      const sanitizedName = displayName.replace(/\s+/g, '_').replace(/[^\w\-_.]/g, '');
      const fileName = `${sanitizedName}_BusinessCard.png`;
      const encodedFileName = encodeURIComponent(fileName);

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName}_BusinessCard.png"; filename*=UTF-8''${encodedFileName}`);
      res.send(cardBuffer);
    } catch (error) {
      console.error('Error generating QR card:', error);
      res.status(500).json({ error: 'Failed to generate business card' });
    }
  });

  // Get all projects
  app.get('/api/projects', async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  // Get single project
  app.get('/api/projects/:endpoint', async (req, res) => {
    try {
      const { endpoint } = req.params;
      const project = await storage.getProjectByEndpoint(endpoint);
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      res.json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  });

  // Get project picture
  app.get('/api/projects/:endpoint/picture', async (req, res) => {
    try {
      const { endpoint } = req.params;
      const picturePath = await storage.getProjectPicturePath(endpoint);
      
      if (!picturePath) {
        return res.status(404).json({ error: 'Project picture not found' });
      }

      res.sendFile(picturePath);
    } catch (error) {
      console.error('Error fetching project picture:', error);
      res.status(500).json({ error: 'Failed to fetch project picture' });
    }
  });

  // Get environment config
  app.get('/api/config', (req, res) => {
    res.json(envConfig);
  });

  const httpServer = createServer(app);

  return httpServer;
}
