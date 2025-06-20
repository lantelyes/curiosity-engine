interface RealtimeEvent {
  type: string;
  error?: { message: string };
  [key: string]: unknown;
}

export interface WebRTCClientConfig {
  onOpen?: () => void;
  onMessage?: (event: RealtimeEvent) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
}

export class WebRTCClient {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private config: WebRTCClientConfig;

  constructor(config: WebRTCClientConfig = {}) {
    this.config = config;
  }

  async connect(ephemeralKey: string): Promise<void> {
    try {
      // Create peer connection
      this.pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        bundlePolicy: 'max-bundle',
      });

      // Set up audio transceivers
      this.pc.addTransceiver('audio', { direction: 'sendrecv' });

      // Create data channel for messages
      this.dc = this.pc.createDataChannel('oai-events', {
        ordered: true,
        protocol: 'json',
      });

      this.dc.onopen = () => {
        console.log('Data channel opened');
        if (this.config.onOpen) {
          this.config.onOpen();
        }
      };

      this.dc.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (this.config.onMessage) {
            this.config.onMessage(message);
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      this.dc.onerror = (error) => {
        console.error('Data channel error:', error);
        if (this.config.onError) {
          this.config.onError('Data channel error');
        }
      };

      this.dc.onclose = () => {
        console.log('Data channel closed');
        if (this.config.onClose) {
          this.config.onClose();
        }
      };

      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 24000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Add local stream to peer connection
      stream.getTracks().forEach((track) => {
        this.pc!.addTrack(track, stream);
      });

      // Handle remote stream
      this.pc.ontrack = (event) => {
        console.log('Received remote track:', event.track.kind);

        // Create audio element for playback
        const audio = new Audio();
        audio.autoplay = true;
        audio.srcObject = event.streams[0];

        // Start playing
        audio.play().catch((e) => console.error('Error playing audio:', e));
      };

      // Create offer
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      // Exchange offer/answer with server
      const response = await fetch('/api/realtime/webrtc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sdp: offer.sdp,
          ephemeralKey,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange SDP');
      }

      const { answer } = await response.json();
      await this.pc.setRemoteDescription(new RTCSessionDescription(answer));

      // Handle ICE candidates
      this.pc.onicecandidate = (event) => {
        if (event.candidate) {
          // In production, you'd send this to the server
          console.log('ICE candidate:', event.candidate);
        }
      };

      // Wait for connection to be established
      return new Promise((resolve, reject) => {
        const checkState = setInterval(() => {
          if (this.pc?.connectionState === 'connected') {
            clearInterval(checkState);
            resolve();
          } else if (this.pc?.connectionState === 'failed') {
            clearInterval(checkState);
            reject(new Error('Connection failed'));
          }
        }, 100);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkState);
          reject(new Error('Connection timeout'));
        }, 10000);
      });
    } catch (error) {
      console.error('WebRTC connection error:', error);
      throw error;
    }
  }

  send(message: Record<string, unknown>): void {
    if (this.dc && this.dc.readyState === 'open') {
      this.dc.send(JSON.stringify(message));
    } else {
      console.error('Data channel not open');
    }
  }

  updateSession(session: Record<string, unknown>): void {
    this.send({
      type: 'session.update',
      session,
    });
  }

  close(): void {
    if (this.dc) {
      this.dc.close();
      this.dc = null;
    }
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
  }

  isConnected(): boolean {
    return this.pc !== null && this.pc.connectionState === 'connected';
  }
}
