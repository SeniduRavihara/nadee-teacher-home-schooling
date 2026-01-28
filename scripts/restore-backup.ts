
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Try to load from .env if .env.local doesn't exist or as fallback
const envPath = fs.existsSync(path.resolve(process.cwd(), '.env.local')) 
    ? path.resolve(process.cwd(), '.env.local') 
    : path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

import { createClient } from '@supabase/supabase-js';
import JSZip from 'jszip';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Missing environment variables.');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

// Initialize Supabase Admin Client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Tables that contain seed data which MUST be cleared to allow restoring original IDs
const TABLES_TO_CLEAN = [
  "quizzes", 
  "courses"
];

// Dependency order for restoration
// IMPORTANT: Parent tables first (to satisfy Foreign Keys), Child tables last.
const RESTORE_ORDER = [
  "profiles",
  "students",       // Depends on profiles (parent_id)
  "online_classes",
  "courses",
  "videos",         // Depends on courses? (via junction or direct FK?)
  "quizzes",
  "questions",      // Depends on quizzes
  "quiz_attempts",  // Depends on quizzes and students
  "payments"        // Depends on users (profiles)
];

// Robust CSV Parser (Handles newlines inside quotes)
const parseCSV = (text: string) => {
    const rows: any[] = [];
    let currentRow: string[] = [];
    let currentVal = "";
    let inQuote = false;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (inQuote) {
            if (char === '"') {
                if (i + 1 < text.length && text[i+1] === '"') {
                    currentVal += '"'; // unescape "" to "
                    i++;
                } else {
                    inQuote = false;
                }
            } else {
                currentVal += char;
            }
        } else {
            if (char === '"') {
                inQuote = true;
            } else if (char === ',') {
                currentRow.push(currentVal);
                currentVal = "";
            } else if (char === '\n' || char === '\r') {
                 // Handle \r\n
                 if (char === '\r' && i+1 < text.length && text[i+1] === '\n') {
                     i++;
                 }
                 
                 // End of row
                 currentRow.push(currentVal);
                 // Only add if row has content (skip empty lines)
                 if (currentRow.length > 1 || currentVal !== "") {
                    rows.push(currentRow);
                 }
                 currentRow = [];
                 currentVal = "";
            } else {
                currentVal += char;
            }
        }
    }
    // Push last row if exists
    if (currentRow.length > 0 && (currentRow.length > 1 || currentVal !== "")) {
        currentRow.push(currentVal);
        rows.push(currentRow);
    }
    
    if (rows.length < 2) return [];

    const headers = rows[0].map((h: string) => h.trim());
    const result: any[] = [];

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length === headers.length) {
            const obj: any = {};
            headers.forEach((header: string, index: number) => {
                let value: any = row[index];
                
                if (value && (value.startsWith('{') || value.startsWith('['))) {
                     try {
                         value = JSON.parse(value);
                     } catch (e) {
                         // keep as string
                     }
                }
                
                if (value === "") value = null;
                obj[header] = value;
            });
            result.push(obj);
        }
    }
    return result;
};

// Main Helper: Restore a single table
const restoreTable = async (tableName: string, csvContent: string) => {
  console.log(`\n⏳ Restoring table: ${tableName}...`);
  
  try {
    const data = parseCSV(csvContent);
    if (data.length === 0) {
      console.log(`   No data found for ${tableName}. Skipping.`);
      return;
    }

    console.log(`   Found ${data.length} records. Uploading...`);

    const batchSize = 100;
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize).map((item: any) => {
            const cleanItem = { ...item };
            delete cleanItem.search_vector; 
            return cleanItem;
        });
        
        // This fails if any single constraint is violated, so we check errors
        const { error } = await supabase
            .from(tableName)
            .upsert(batch, { onConflict: 'id' });
        
        if (error) {
             // Handle soft errors or dependency issues?
             console.error(`      Error in batch: ${error.message}`);
             throw error;
        }
        
        process.stdout.write('.');
    }
    
    console.log(`\n✅ ${tableName} restored successfully.`);
  } catch (error: any) {
    console.error(`\n❌ Error restoring ${tableName}:`);
    console.error(JSON.stringify(error, null, 2));
    throw error;
  }
};

// Main Execution Function
const main = async () => {
    // Check args
    const zipPath = process.argv[2];
    if (!zipPath) {
      console.error('\nPlease provide the path to the ZIP backup file.');
      console.error('Usage: npx tsx scripts/restore-backup.ts <path-to-zip>');
      process.exit(1);
    }

    if (!fs.existsSync(zipPath)) {
      console.error(`\nFile not found: ${zipPath}`);
      process.exit(1);
    }

    console.log(`\x1b[36m%s\x1b[0m`, `\n🚀 Starting Admin Restore from: ${zipPath}`);
    console.log(`Target Database: ${SUPABASE_URL}`);
    console.log('Mode: ADMIN (Bypassing RLS policies)\n');

    try {
        const zipData = fs.readFileSync(zipPath);
        const zip = await JSZip.loadAsync(zipData);
        
        // Map files
        const fileMap = new Map<string, string>();
        
        for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
            if (!zipEntry.dir) {
                 const match = relativePath.match(/^(.+?)_backup_/);
                 if (match) {
                     const tableName = match[1];
                     const content = await zipEntry.async("string");
                     fileMap.set(tableName, content);
                 }
            }
        }

        // Helper: Clean table (delete all rows)
        const cleanTable = async (tableName: string) => {
            console.log(`🧹 Cleaning table: ${tableName}...`);
            const { error } = await supabase
                .from(tableName)
                .delete()
                .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows where ID is distinct from dummy
            
            if (error) {
                console.error(`⚠️ Failed to clean ${tableName}: ${error.message}`);
            } else {
                console.log(`   Table ${tableName} cleaned.`);
            }
        }

        // Restore in order
        for (const tableName of RESTORE_ORDER) {
            // Check if we need to clean seed data first
            if (TABLES_TO_CLEAN.includes(tableName)) {
                await cleanTable(tableName);
            }

            const csvContent = fileMap.get(tableName);
            if (csvContent) {
                await restoreTable(tableName, csvContent);
            } else {
                console.log(`⚠️  Warning: No backup file found for table '${tableName}' in archive.`);
            }
        }

        console.log(`\n\x1b[32m%s\x1b[0m`, '✨ Full Backup Restore Completed Successfully!');

    } catch (error) {
        console.error('\n\x1b[31m%s\x1b[0m', '💥 Fatal Error during restore process.');
        console.error(error);
        process.exit(1);
    }
};

main();
