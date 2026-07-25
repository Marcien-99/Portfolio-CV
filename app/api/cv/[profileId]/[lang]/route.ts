import { NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { getCvPdfData } from '@/lib/pdf/generate';
import { StandardTemplate } from '@/lib/pdf/templates/standard';
import React from 'react';

export async function GET(
  request: Request,
  props: { params: Promise<{ profileId: string; lang: string }> }
) {
  const params = await props.params;
  const lang = params.lang === 'en' ? 'en' : 'fr';
  const profileId = params.profileId || 'standard';
  const origin = new URL(request.url).origin;

  try {
    const data = await getCvPdfData(lang, profileId, origin);
    
    // We render the React PDF component to a Node.js Stream
    const stream = await renderToStream(React.createElement(StandardTemplate, { data }) as any);
    
    // Convert the stream to a Web ReadableStream
    const readableStream = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => controller.enqueue(chunk));
        stream.on('end', () => controller.close());
        stream.on('error', (err) => controller.error(err));
      }
    });

    const filename = `CV_Marcien_BALOUBOULA_${lang.toUpperCase()}.pdf`;

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
