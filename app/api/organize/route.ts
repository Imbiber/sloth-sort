import { NextResponse } from 'next/server';
import { SortPlan } from '@/types';

export const maxDuration = 60; // 60 seconds max

export async function POST(req: Request) {
  try {
    const { files } = await req.json();

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const fileListFormatted = files.map((f, i) => 
      `${i + 1}. Filename: "${f.name}", Size: ${f.size || 'unknown'} bytes${f.previewSnippet ? `, Excerpt/Context: "${f.previewSnippet.slice(0, 150)}"` : ''}`
    ).join('\n');

    const prompt = `You are "SlothSort", a remarkably lazy but hyper-intelligent local file organizer powered by Google Gemma 2.
Your goal is to save the user maximum effort by analyzing messy files, messy downloads, or cluttered folder contents, and creating a clean, structured organization plan.

Here are the messy files:
${fileListFormatted}

Analyze each file and classify it into logical categories (e.g., Invoices & Receipts, Code & Configs, Creative & Media, Screenshots & Temp, Documents & Contracts, Archives).
Suggest clean, human-readable renamed filenames (e.g., "Screen Shot 2026-10-22 at 9.21.34 AM.png" -> "receipt-apple-store-oct2026.png").
Also create an ultra-comforting, witty sloth debrief audio script (under 60 words) celebrating how lazy the user gets to be today because you did all the heavy lifting.

You MUST respond strictly with VALID JSON without markdown formatting or codeblocks. The schema is:
{
  "totalFiles": ${files.length},
  "estimatedLazyMinutesSaved": 45,
  "slothAudioScript": "Hey there sloth friend. Kick back and sip your drink. I just categorized all your messy files, scrubbed the duplicate names, and drafted your folders. You didn't have to lift a single finger.",
  "categories": [
    {
      "name": "Financial & Receipts",
      "description": "Invoices, payment receipts, and tax records",
      "files": [
        {
          "originalName": "Invoice_9921_final.pdf",
          "suggestedName": "2026-10_Invoice_AcmeCorp.pdf",
          "category": "Financial & Receipts",
          "subFolder": "Invoices/2026",
          "summary": "Monthly vendor invoice from Acme Corp",
          "action": "keep",
          "confidence": 0.98,
          "reasoning": "Standard PDF invoice format"
        }
      ]
    }
  ]
}
`;

    const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    
    // Call Gemma 2 via Ollama
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemma2:latest',
        prompt: prompt,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.2,
          top_p: 0.9,
        }
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Ollama Error:', errText);
      return NextResponse.json({ error: 'Failed to communicate with local Gemma 2 via Ollama.' }, { status: 500 });
    }

    const data = await response.json();
    let parsed: any;
    try {
      parsed = JSON.parse(data.response);
    } catch (e) {
      // Fallback clean if wrapped
      const cleanJson = data.response.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanJson);
    }

    // Build bash script to let user execute locally with 1 click
    let bashCommands: string[] = ['#!/bin/bash', '# SlothSort Auto-Generated Lazy Cleanup Script', 'mkdir -p Organized'];
    if (parsed.categories && Array.isArray(parsed.categories)) {
      for (const cat of parsed.categories) {
        const catDir = `Organized/"${cat.name.replace(/[^a-zA-Z0-9_\-]/g, '_')}"`;
        bashCommands.push(`mkdir -p ${catDir}`);
        for (const file of cat.files || []) {
          bashCommands.push(`mv "${file.originalName}" ${catDir}/"${file.suggestedName || file.originalName}" 2>/dev/null || true`);
        }
      }
    }

    const sortPlan: SortPlan = {
      totalFiles: files.length,
      categories: parsed.categories || [],
      slothAudioScript: parsed.slothAudioScript || "All sorted! Sit back, relax, and let the sloth lifestyle take over.",
      bashOrganizeScript: bashCommands.join('\n'),
      estimatedLazyMinutesSaved: parsed.estimatedLazyMinutesSaved || (files.length * 4),
    };

    return NextResponse.json({ success: true, plan: sortPlan });
  } catch (error: any) {
    console.error('Sloth Sort API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
