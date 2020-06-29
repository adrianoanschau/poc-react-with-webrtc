import React, {useEffect, useRef, useState} from 'react';
import cn from 'classnames';
import {MediaDevice} from "./mediaDevice";

const getButtonClass = (icon: string, enabled: boolean) => cn(`btn-action fa ${icon}`, { disable: !enabled });

type Props = {
  peerSrc?: MediaStream|null
  localSrc?: MediaStream|null
  config: {
    audio: boolean
    video: boolean
  }
  mediaDevice?: MediaDevice
  status?: string
  endCall: (isStarter: boolean) => void
}


const CallWindow: React.FC<Props> = ({ peerSrc, localSrc, config, mediaDevice, status, endCall }) => {

  console.log(config);

  const peerVideo = useRef<HTMLVideoElement>(null);
  const localVideo = useRef<HTMLVideoElement>(null);
  const [video, setVideo] = useState(config.video);
  const [audio, setAudio] = useState(config.audio);

  useEffect(() => {
    if (peerVideo.current && peerSrc) peerVideo.current.srcObject = peerSrc;
    if (localVideo.current && localSrc) localVideo.current.srcObject = localSrc;
  });

  useEffect(() => {
    if (mediaDevice) {
      mediaDevice.toggle('Video', video);
      mediaDevice.toggle('Audio', audio);
    }
  }, [audio, video]);

  /**
   * Turn on/off a media device
   * @param {String} deviceType - Type of the device eg: Video, Audio
   */
  const toggleMediaDevice = (deviceType: 'audio'|'video') => {
    if (!mediaDevice) {
      return;
    }
    if (deviceType === 'video') {
      setVideo(!video);
      mediaDevice.toggle('Video');
    }
    if (deviceType === 'audio') {
      setAudio(!audio);
      mediaDevice.toggle('Audio');
    }
  };

  return (
    <div className={cn('call-window', status)}>
      <video id="peerVideo" ref={peerVideo} autoPlay />
      <video id="localVideo" ref={localVideo} autoPlay muted />
      <div className="video-control">
        <button
          key="btnVideo"
          type="button"
          className={getButtonClass('fa-video-camera', video)}
          onClick={() => toggleMediaDevice('video')}
        />
        <button
          key="btnAudio"
          type="button"
          className={getButtonClass('fa-microphone', audio)}
          onClick={() => toggleMediaDevice('audio')}
        />
        <button
          type="button"
          className="btn-action hangup fa fa-phone"
          onClick={() => endCall(true)}
        />
      </div>
    </div>
  );
}

export default CallWindow;
