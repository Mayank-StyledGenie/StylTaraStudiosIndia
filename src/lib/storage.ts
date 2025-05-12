import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; 


export async function uploadToStorage(file: File, userEmail: string): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileExtension = file.name.split('.').pop() || '';
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const userDir = path.join(uploadsDir, userEmail.replace(/[^a-zA-Z0-9]/g, '_'));
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    
    const filePath = path.join(userDir, fileName);
    
    fs.writeFileSync(filePath, buffer);
    
    const sanitizedEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = Date.now();
    return `/api/image/${sanitizedEmail}/${fileName}?t=${timestamp}`;
  } catch (error) {
    console.error('Error in uploadToStorage:', error);
    throw new Error('Failed to upload file');
  }
}

