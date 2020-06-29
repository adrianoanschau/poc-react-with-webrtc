import {Emitter} from "./emitter";
import {socket} from "./socket";
import {MediaDevice} from "./mediaDevice";

const PC_CONFIG = { iceServers: [
    { urls: ['stun:stun.l.google.com:19302'] }
  ] };

class PeerConnection extends Emitter {

  private pc: RTCPeerConnection|null = null;
  public mediaDevice?: MediaDevice;
  private friendID: string|null = null;

  config(friendID: string) {
    this.pc = new RTCPeerConnection(PC_CONFIG);
    this.pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      socket.emit('call', {
        to: this.friendID,
        candidate: event.candidate,
      });
    };
    this.pc.ontrack = (event: RTCTrackEvent) => this.emit('peerStream', event.streams[0]);

    this.mediaDevice = new MediaDevice();
    this.friendID = friendID;
    return this;
  }

  start(isCaller: boolean) {
    if (!this.mediaDevice) {
      return;
    }
    this.mediaDevice
      .on('stream', (stream: MediaStream) => {
        stream.getTracks().forEach(track => {
          this.pc?.addTrack(track, stream);
        });
        this.emit('localStream', stream);
        if (isCaller) socket.emit('request', { to: this.friendID });
        else this.createOffer();
      })
      .start();

    return this;
  }

  stop(isStarter?: boolean) {
    if (!this.mediaDevice) {
      return;
    }
    if (isStarter) {
      socket.emit('end', { to: this.friendID });
    }
    this.mediaDevice.stop();
    this.pc?.close();
    this.pc = null;
    this.off();
    return this;
  }

  createOffer() {
    this.pc?.createOffer()
      .then(this.getDescription.bind(this))
      .catch(err => console.log({err}));
    return this;
  }

  createAnswer() {
    this.pc?.createAnswer()
      .then(this.getDescription.bind(this))
      .catch((err) => console.log(err));
    return this;
  }

  getDescription(desc: RTCSessionDescriptionInit) {
    this.pc?.setLocalDescription(desc);
    socket.emit('call', { to: this.friendID, sdp: desc });
    return this;
  }

  setRemoteDescription(sdp: RTCSessionDescriptionInit) {
    const rtcSdp = new RTCSessionDescription(sdp);
    this.pc?.setRemoteDescription(rtcSdp);
    return this;
  }

  addIceCandidate(candidate: RTCIceCandidateInit) {
    if (candidate) {
      const iceCandidate = new RTCIceCandidate(candidate);
      this.pc?.addIceCandidate(iceCandidate);
    }
    return this;
  }

  reset() {
    this.stop();
    this.friendID = null;
  }
}

export default new PeerConnection();
