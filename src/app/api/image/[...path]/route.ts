// app/api/image/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic'; // Ensure the route is always dynamic

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> } // Adjusted type
) {
  try {
    // Await the params to resolve the promise
    const { path: resolvedPath } = await context.params;

    // Get the file path from the resolved parameters
    const filePath = path.join(process.cwd(), 'public', 'uploads', ...resolvedPath);
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }
    
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Determine the content type
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream'; // Default
    
    // Map extensions to content types
    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.bmp': 'image/bmp',
    };
    
    if (ext in contentTypes) {
      contentType = contentTypes[ext];
    }
    
    // Return the file with the appropriate content type
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Error serving image', { status: 500 });
  }
}
