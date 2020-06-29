import React, {ChangeEvent, useState} from 'react';

type Props = {
  startCall: (
    isCaller: boolean, friendId: string, config: any
  ) => void
  clientId?: string
}

export const MainWindow: React.FC<Props> = ({ startCall, clientId }) => {
  const [friendID, setFriendID] = useState<string|null>(null);

  /**
   * Start the call with or without video
   * @param {Boolean} video
   */
  const callWithVideo = (video: boolean) => {
    const config = { audio: true, video };
    return () => {
      friendID && startCall(true, friendID, config);
    }
  };

  return (
    <div className="container main-window">
      <div>
        <h3>
          Hi, your ID is
          <input
            type="text"
            className="txt-clientId"
            defaultValue={clientId}
            readOnly
            />
        </h3>
        <h4>Get started by calling a friend below</h4>
      </div>
      <div>
        <input
          type="text"
          className="txt-clientId"
          spellCheck={false}
          placeholder="Your friend ID"
          onChange={(event: ChangeEvent<HTMLInputElement>) => setFriendID(event.target.value)}
        />
        <div>
          <button
            type="button"
            className="btn-action fa fa-video-camera"
            onClick={callWithVideo(true)}
          />
          <button
            type="button"
            className="btn-action fa fa-phone"
            onClick={callWithVideo(false)}
          />
        </div>
      </div>
    </div>
  );
};
