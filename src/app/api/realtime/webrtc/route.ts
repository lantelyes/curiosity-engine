import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { sdp, ephemeralKey } = await request.json();
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_REALTIME_MODEL || 'gpt-4o-realtime-preview-2025-06-03';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Send offer to OpenAI and get answer
    const response = await fetch(
      `https://api.openai.com/v1/realtime?model=${model}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          'Content-Type': 'application/sdp',
        },
        body: sdp,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI WebRTC error:', error);
      return NextResponse.json(
        { error: 'Failed to establish WebRTC connection' },
        { status: response.status }
      );
    }

    const answerSdp = await response.text();

    return NextResponse.json({
      answer: {
        type: 'answer',
        sdp: answerSdp,
      },
    });
  } catch (error) {
    console.error('WebRTC endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
