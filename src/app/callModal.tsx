import React from 'react';
import cn from 'classnames';

type Props = {
  status: string,
  callFrom: string,
  startCall: (isCaller: boolean, friendId: string, config: any) => void,
  rejectCall: () => void
}

export const CallModal: React.FC<Props> = ({ status, callFrom, startCall, rejectCall }) => {
  const acceptWithVideo = (video: boolean) => {
    const config = { audio: true, video };
    return () => startCall(false, callFrom, config);
  };

  return (
    <div className={cn('call-modal', status)}>
      <p>
        <span className="caller">{`${callFrom} is calling`}</span>
      </p>
      <button
        type="button"
        className="btn-action fa fa-video-camera"
        onClick={acceptWithVideo(true)}
      />
      <button
        type="button"
        className="btn-action fa fa-phone"
        onClick={acceptWithVideo(false)}
      />
      <button
        type="button"
        className="btn-action hangup fa fa-phone"
        onClick={rejectCall}
      />
    </div>
  );
}
