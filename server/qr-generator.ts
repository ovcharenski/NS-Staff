import QRCode from 'qrcode';
import { createCanvas, loadImage, registerFont } from 'canvas';
import type { StaffMember } from '@shared/schema';
import path from 'path';

interface QRCardConfig {
  width: number;
  height: number;
  padding: number;
  qrSize: number;
}

const config: QRCardConfig = {
  width: 1080,
  height: 1920,
  padding: 80,
  qrSize: 400,
};

export async function generateBusinessCard(
  staff: StaffMember,
  language: string,
  photoPath: string,
  siteUrl: string
): Promise<Buffer> {
  const canvas = createCanvas(config.width, config.height);
  const ctx = canvas.getContext('2d');

  // Extract colors
  const { color1, color2, color_main } = staff.colors;

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, config.height);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, config.width, config.height);

  // Get localized name
  const langKey = language === 'ru' ? 'ru-RU' : 'en-EN';
  const displayName = staff.name[langKey] || staff.name['en-EN'] || Object.values(staff.name)[0];

  const countryFlagMap: Record<string, string> = {
    russia: '🇷🇺',
    usa: '🇺🇸',
    uk: '🇬🇧',
    germany: '🇩🇪',
    france: '🇫🇷',
  };
  const countryFlag = countryFlagMap[staff.country.toLowerCase()] || '🏳️';

  // Name section (top)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 72px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(displayName, config.width / 2, config.padding + 100);

  // Country flag
  ctx.font = '60px sans-serif';
  ctx.fillText(countryFlag, config.width / 2, config.padding + 180);

  // Nickname and position
  ctx.font = '48px sans-serif';
  ctx.fillStyle = '#E0E0E0';
  ctx.fillText(`@${staff.nicknames[0]}`, config.width / 2, config.padding + 280);
  
  ctx.font = '42px sans-serif';
  ctx.fillText(staff.post, config.width / 2, config.padding + 350);

  // Photo section (middle)
  try {
    const photo = await loadImage(photoPath);
    const photoSize = 500;
    const photoX = (config.width - photoSize) / 2;
    const photoY = config.padding + 450;
    
    // White frame (polaroid style)
    ctx.fillStyle = '#FFFFFF';
    const frameSize = photoSize + 40;
    ctx.fillRect(photoX - 20, photoY - 20, frameSize, frameSize + 60);
    
    // Photo
    ctx.drawImage(photo, photoX, photoY, photoSize, photoSize);
  } catch (error) {
    console.error('Failed to load photo:', error);
    // Draw placeholder
    ctx.fillStyle = color_main + '40';
    ctx.fillRect((config.width - 500) / 2, config.padding + 450, 500, 500);
  }

  // QR Code section (bottom)
  const qrUrl = `${siteUrl}/${staff.endpoint}`;
  const qrDataUrl = await QRCode.toDataURL(qrUrl, {
    width: config.qrSize,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });

  const qrImage = await loadImage(qrDataUrl);
  const qrX = (config.width - config.qrSize) / 2;
  const qrY = config.height - config.padding - config.qrSize - 100;
  
  // White background for QR
  ctx.fillStyle = '#FFFFFF';
  const qrBgSize = config.qrSize + 40;
  ctx.fillRect(qrX - 20, qrY - 20, qrBgSize, qrBgSize);
  
  // QR code
  ctx.drawImage(qrImage, qrX, qrY, config.qrSize, config.qrSize);

  // URL text below QR
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '32px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(qrUrl, config.width / 2, config.height - config.padding);

  return canvas.toBuffer('image/png');
}
