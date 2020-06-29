import React from 'react';
import {socket} from "./app/socket";
import {MainWindow} from "./app/mainWindow";
import CallWindow from "./app/callWindow";
import {CallModal} from "./app/callModal";
import pc from "./app/peerConnection";

const App: React.FC = () => {

  const [clientId, setClientId] = React.useState<string>();
  const [callWindow, setCallWindow] = React.useState<string>('');
  const [callModal, setCallModal] = React.useState<string>('');
  const [callFrom, setCallFrom] = React.useState<string>('');
  const [localSrc, setLocalSrc] = React.useState<MediaStream|null>();
  const [peerSrc, setPeerSrc] = React.useState<MediaStream|null>();
  const [config, setConfig] = React.useState<{ audio: boolean, video: boolean }>({
    audio: false,
    video: false,
  });

  React.useEffect(() => {
    socket
      .on('init', ({ id: clientId }: { id: string }) => {
        document.title = `${clientId} - VideoCall`;
        setClientId(clientId);
      })
      .on('request', ({ from: callFrom }: { from: string }) => {
        setCallModal('active');
        setCallFrom(callFrom);
      })
      .on('call', (data: { sdp: RTCSessionDescriptionInit, candidate: RTCIceCandidateInit }) => {
        if (data.sdp) {
          pc.setRemoteDescription(data.sdp);
          if (data.sdp.type === 'offer') pc.createAnswer();
        } else pc.addIceCandidate(data.candidate);
      })
      .on('end', () => endCall(false))
      .emit('init');
  }, []);

  function startCall(isCaller: boolean, friendID: string, _config: { audio: boolean, video: boolean }) {
    setConfig(_config);
    pc.config(friendID)
      .on('localStream', (src) => {
        setCallWindow('active');
        setLocalSrc(src);
        if (!isCaller) setCallModal('');
      })
      .on('peerStream', (src) => {
        setPeerSrc(src);
      })
      .start(isCaller);
  }

  function rejectCall() {
    socket.emit('end', { to: callFrom });
    setCallModal('');
  }

  function endCall(isStarter: boolean) {
    if (typeof pc.stop === 'function') {
      pc.stop(isStarter);
    }
    pc.reset();
    setConfig({ audio: false, video: false });
    setCallWindow('');
    setCallModal('');
    setLocalSrc(null);
    setPeerSrc(null);
  }

  return (
    <div>
      <MainWindow
        clientId={clientId}
        startCall={startCall}
      />
      {config !== null && (
        <CallWindow
          status={callWindow}
          localSrc={localSrc}
          peerSrc={peerSrc}
          config={config}
          mediaDevice={pc.mediaDevice}
          endCall={endCall}
        />
      ) }
      <CallModal
        status={callModal}
        startCall={startCall}
        rejectCall={rejectCall}
        callFrom={callFrom}
      />
    </div>
  );
}

export default App;
