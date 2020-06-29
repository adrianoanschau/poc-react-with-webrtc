import {Emitter} from "./emitter";

export class MediaDevice extends Emitter {

  private stream: MediaStream | undefined;

  start() {
    const constraints = {
      video: {
        facingMode: 'user',
        height: { min: 360, ideal: 720, max: 1080 }
      },
      audio: true,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream: MediaStream) => {
        this.stream = stream;
        this.emit('stream', stream);
      })
      .catch((err) => {
        if (err instanceof DOMException) {
          alert('Cannot open webcam and/or microphone');
        } else {
          console.log({ err });
        }
      });

    return this;
  }

  toggle(type: 'Audio'|'Video', on?: any) {
    const len = arguments.length;
    if (this.stream) {
      const getTracks = type === 'Audio' ? this.stream.getAudioTracks() : this.stream.getVideoTracks();
      getTracks.forEach((track) => {
        track.enabled = len === 2 ? on : !track.enabled;
      });
    }
    return this;
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    return this;
  }
}
