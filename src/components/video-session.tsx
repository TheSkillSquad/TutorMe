'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Users,
  Clock,
  ScreenShare,
  MonitorX,         // ✅ Replacement for StopScreenShare
  Circle,           // ✅ Replacement for Recording
  StopCircle,       // ✅ Replacement for StopRecording
  AlertCircle
} from 'lucide-react';

interface VideoSessionProps {
  roomName?: string;
  userToken?: string;
  onSessionEnd?: () => void;
}

interface Participant {
  sid: string;
  identity: string;
  videoTrack?: MediaStreamTrack;
  audioTrack?: MediaStreamTrack;
  isLocal: boolean;
}

// Type definitions for Twilio Video tracks
interface TwilioVideoTrack {
  trackName: string;
  track: {
    stop: () => void;
  };
  unpublish: () => void;
}

export default function VideoSession({ roomName: initialRoomName, userToken, onSessionEnd }: VideoSessionProps) {
  const [roomName, setRoomName] = useState(initialRoomName || '');
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localParticipant, setLocalParticipant] = useState<Participant | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isConnected) {
      timerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setSessionTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isConnected]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const createRoom = async () => {
    if (!roomName.trim() || !userToken) {
      setError('Room name and user token are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create room via API
      const response = await fetch('/api/twilio/room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          roomName: roomName.trim(),
          options: {
            maxParticipants: 4,
            recordParticipantsOnConnect: false
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        await joinRoom(roomName.trim());
      } else {
        setError(data.error || 'Failed to create room');
      }
    } catch (error) {
      console.error('Room creation error:', error);
      setError('Failed to create room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async (roomToJoin: string) => {
    if (!userToken) {
      setError('User token is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get video token
      const tokenResponse = await fetch('/api/twilio/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          identity: `user_${Date.now()}`,
          roomName: roomToJoin
        })
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        throw new Error(tokenData.error || 'Failed to get video token');
      }

      // Connect to Twilio room
      const { connect, createLocalVideoTrack, createLocalAudioTrack } = await import('twilio-video');
      
      const localVideoTrack = await createLocalVideoTrack();
      const localAudioTrack = await createLocalAudioTrack();

      const room = await connect(tokenData.token, {
        name: roomToJoin,
        tracks: [localVideoTrack, localAudioTrack],
        audio: true,
        video: true
      });

      roomRef.current = room;

      // Set up local participant
      const localParticipant: Participant = {
        sid: room.localParticipant.sid,
        identity: room.localParticipant.identity,
        videoTrack: localVideoTrack.mediaStreamTrack,
        audioTrack: localAudioTrack.mediaStreamTrack,
        isLocal: true
      };

      setLocalParticipant(localParticipant);
      setParticipants([localParticipant]);

      // Attach local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = new MediaStream([localVideoTrack.mediaStreamTrack]);
      }

      // Handle remote participants
      room.on('participantConnected', (participant) => {
        const remoteParticipant: Participant = {
          sid: participant.sid,
          identity: participant.identity,
          isLocal: false
        };

        setParticipants(prev => [...prev, remoteParticipant]);

        participant.on('trackSubscribed', (track) => {
          if (track.kind === 'video') {
            remoteParticipant.videoTrack = track.mediaStreamTrack;
            attachRemoteVideo(track);
          } else if (track.kind === 'audio') {
            remoteParticipant.audioTrack = track.mediaStreamTrack;
          }
          setParticipants(prev => [...prev]);
        });
      });

      room.on('participantDisconnected', (participant) => {
        setParticipants(prev => prev.filter(p => p.sid !== participant.sid));
      });

      setIsConnected(true);
      setRoomName(roomToJoin);
    } catch (error) {
      console.error('Room join error:', error);
      setError('Failed to join room. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const attachRemoteVideo = (track: any) => {
    const videoElement = document.createElement('video');
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    videoElement.srcObject = new MediaStream([track.mediaStreamTrack]);
    videoElement.className = 'w-full h-full object-cover rounded-lg';

    if (remoteVideosRef.current) {
      remoteVideosRef.current.appendChild(videoElement);
    }
  };

  const leaveRoom = async () => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }

    setIsConnected(false);
    setParticipants([]);
    setLocalParticipant(null);

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideosRef.current) {
      remoteVideosRef.current.innerHTML = '';
    }

    if (onSessionEnd) {
      onSessionEnd();
    }
  };

  const toggleRecording = async () => {
    if (!roomRef.current || !userToken) return;

    try {
      const roomSid = roomRef.current.sid;
      const endpoint = isRecording ? 'stop' : 'start';
      
      const response = await fetch(`/api/twilio/room/${roomSid}/recording/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      if (response.ok) {
        setIsRecording(!isRecording);
      } else {
        setError(`Failed to ${isRecording ? 'stop' : 'start'} recording`);
      }
    } catch (error) {
      console.error('Recording toggle error:', error);
      setError(`Failed to ${isRecording ? 'stop' : 'start'} recording`);
    }
  };

  const toggleScreenShare = async () => {
    if (!roomRef.current) return;

    try {
      if (isScreenSharing) {
        // Stop screen sharing
        const tracks = Array.from(roomRef.current.localParticipant.videoTracks.values()) as TwilioVideoTrack[];
        tracks.forEach(track => {
          if (track.trackName === 'screen') {
            track.track.stop();
            track.unpublish();
          }
        });
        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        const stream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true });
        const screenTrack = stream.getVideoTracks()[0];
        
        if (roomRef.current) {
          await roomRef.current.localParticipant.publishTrack(screenTrack, {
            name: 'screen'
          });
          setIsScreenSharing(true);
        }
      }
    } catch (error) {
      console.error('Screen share toggle error:', error);
      setError('Failed to toggle screen sharing');
    }
  };

  const toggleAudio = () => {
    if (localParticipant?.audioTrack) {
      localParticipant.audioTrack.enabled = !localParticipant.audioTrack.enabled;
      setLocalParticipant({ ...localParticipant });
    }
  };

  const toggleVideo = () => {
    if (localParticipant?.videoTrack) {
      localParticipant.videoTrack.enabled = !localParticipant.videoTrack.enabled;
      setLocalParticipant({ ...localParticipant });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Video className="h-5 w-5 text-blue-500" />
            <span>Skill Exchange Session</span>
          </div>
          {isConnected && (
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(sessionTime)}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Connect with your skill trading partner via video
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isConnected ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room-name">Room Name</Label>
              <Input
                id="room-name"
                placeholder="Enter room name or create new"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={createRoom} 
                disabled={loading || !roomName.trim() || !userToken}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Room...
                  </>
                ) : (
                  <>
                    <Video className="h-4 w-4 mr-2" />
                    Create Room
                  </>
                )}
              </Button>

              {roomName && (
                <Button 
                  variant="outline" 
                  onClick={() => joinRoom(roomName)}
                  disabled={loading || !userToken}
                >
                  Join Room
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Local Video */}
              <div className="relative">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-48 bg-gray-900 rounded-lg object-cover"
                />
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary">You</Badge>
                </div>
              </div>

              {/* Remote Videos */}
              <div ref={remoteVideosRef} className="space-y-2">
                {participants
                  .filter(p => !p.isLocal)
                  .map((participant) => (
                    <div key={participant.sid} className="relative">
                      <div className="w-full h-48 bg-gray-900 rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                          <Users className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">{participant.identity}</p>
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="outline">{participant.identity}</Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-2 p-4 bg-muted rounded-lg">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAudio}
                disabled={!localParticipant?.audioTrack}
              >
                {localParticipant?.audioTrack?.enabled ? (
                  <Mic className="h-4 w-4" />
                ) : (
                  <MicOff className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleVideo}
                disabled={!localParticipant?.videoTrack}
              >
                {localParticipant?.videoTrack?.enabled ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <VideoOff className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleScreenShare}
              >
                {isScreenSharing ? (
                  <MonitorX className="h-4 w-4" />
                ) : (
                  <ScreenShare className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleRecording}
              >
                {isRecording ? (
                  <StopCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={leaveRoom}
              >
                <PhoneOff className="h-4 w-4" />
              </Button>
            </div>

            {/* Session Info */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span>Room: {roomName}</span>
                <span>Participants: {participants.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                {isRecording && (
                  <Badge variant="destructive">
                    <Circle className="h-3 w-3 mr-1" />
                    Recording
                  </Badge>
                )}
                {isScreenSharing && (
                  <Badge variant="secondary">
                    <ScreenShare className="h-3 w-3 mr-1" />
                    Sharing Screen
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}