import { writeFile, readFile, mkdir } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const LOCKS_FILE = path.join(DATA_DIR, 'locks.json');

// Ensure the data directory exists
async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist, that's okay
  }
}

export async function POST(request: Request) {
  try {
    await ensureDataDir();
    const newLock = await request.json();
    
    // Read existing locks
    let locks = [];
    try {
      const fileContent = await readFile(LOCKS_FILE, 'utf-8');
      locks = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist yet, start with empty array
      locks = [];
    }
    
    // Add new lock
    locks.push(newLock);
    
    // Write updated locks back to file
    await writeFile(LOCKS_FILE, JSON.stringify(locks, null, 2));
    
    return NextResponse.json({ success: true, lock: newLock });
  } catch (error) {
    console.error('Error saving lock:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save lock' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await ensureDataDir();
    const fileContent = await readFile(LOCKS_FILE, 'utf-8');
    const locks = JSON.parse(fileContent);
    return NextResponse.json(locks);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
} 