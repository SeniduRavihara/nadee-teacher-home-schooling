
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

//  Configuration
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

// Tables to backup - CUSTOMIZED FOR THIS PROJECT
const TABLES = [
  "profiles",
  "students",
  "online_classes",
  "courses",
  "videos",
  "quizzes",
  "questions",
  "quiz_attempts",
  "payments"
];

// Helper to convert array of objects to CSV
const toCSV = (data: any[]) => {
    if (!data.length) return "";
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
        const values = headers.map(header => {
            let val = row[header];
            
            // Handle Arrays and Objects (JSON)
            if (val !== null && typeof val === 'object') {
                val = JSON.stringify(val);
            }
            
            // Escape quotes
            const escaped = ('' + (val ?? '')).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
};

const main = async () => {
    console.log(`\x1b[36m%s\x1b[0m`, `\n🚀 Starting Admin Backup...`);
    console.log(`Source Database: ${SUPABASE_URL}`);
    
    // Create backups directory if it doesn't exist
    const backupDir = path.resolve(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    // Create output filename with timestamp
    const date = new Date().toISOString().split('T')[0];
    const outputPath = path.resolve(backupDir, `full_backup_${date}.zip`);
    
    const zip = new JSZip();
    let totalRecords = 0;

    try {
        const fetchAllRecords = async (tableName: string) => {
            let allData: any[] = [];
            let from = 0;
            const step = 1000;
            let hasMore = true;

            while (hasMore) {
                const { data, error } = await supabase
                    .from(tableName)
                    .select('*')
                    .range(from, from + step - 1)
                    .order('created_at', { ascending: true }); // Ordering helps ensure stable pagination

                if (error) {
                    // Specific handling for tables without created_at
                    if (error.message.includes('column "created_at" does not exist')) {
                        const { data: retryData, error: retryError } = await supabase
                            .from(tableName)
                            .select('*')
                            .range(from, from + step - 1);
                        
                        if (retryError) throw retryError;
                        
                        if (retryData && retryData.length > 0) {
                            allData = [...allData, ...retryData];
                            if (retryData.length < step) hasMore = false;
                            else from += step;
                        } else {
                            hasMore = false;
                        }
                    } else {
                        throw error;
                    }
                } else if (data && data.length > 0) {
                    allData = [...allData, ...data];
                    if (data.length < step) {
                        hasMore = false;
                    } else {
                        from += step;
                    }
                } else {
                    hasMore = false;
                }
            }
            return allData;
        };

        for (const tableName of TABLES) {
            process.stdout.write(`⏳ Backing up table: ${tableName}... `);
            
            try {
                const data = await fetchAllRecords(tableName);
                
                if (data.length > 0) {
                    const csv = toCSV(data);
                    zip.file(`${tableName}_backup_${Date.now()}.csv`, csv);
                    console.log(`✅ Done (${data.length} records).`);
                    totalRecords += data.length;
                } else {
                    console.log(`✅ Done (0 records).`);
                }
            } catch (error: any) {
                // If table doesn't exist, just warn and continue
                if (error.code === '42P01') { // relation does not exist
                    console.log(`⚠️ Table not found (skipping).`);
                } else {
                    console.log(`❌ Failed: ${error.message}`);
                    throw error;
                }
            }
        }

        console.log(`\n📦 Compressing archive...`);
        const content = await zip.generateAsync({ type: "nodebuffer" });
        
        fs.writeFileSync(outputPath, content);
        
        console.log(`\n\x1b[32m%s\x1b[0m`, `✨ Backup completed successfully!`);
        console.log(`📁 Saved to: ${outputPath}`);
        console.log(`📊 Total Records: ${totalRecords}`);

    } catch (error) {
        console.error('\n\x1b[31m%s\x1b[0m', '💥 Fatal Error during backup process.');
        console.error(error);
        process.exit(1);
    }
};

main();
