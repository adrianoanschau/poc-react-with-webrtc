import React, {RefObject} from 'react';

const useCleanup = (val: HTMLVideoElement|null) => {
    const valRef = React.useRef<HTMLVideoElement|null>(val);
    React.useEffect(() => {
        valRef.current = val;
    }, [val]);

    React.useEffect(() => {
        return () => {
            // cleanup
        }
    });
}

const initializeCamera = async() => await
    navigator
        .mediaDevices
        .getUserMedia({ audio: true, video: true });

export const useCamera = (videoRef: RefObject<HTMLVideoElement>) => {
    const [isCameraInitialized, setIsCameraInitialized] = React.useState<boolean>(false);
    const [video, setVideo] = React.useState<HTMLVideoElement|null>(null);
    const [error, setError] = React.useState<string>('');
    const [playing, setPlaying] = React.useState<boolean>(true);

    React.useEffect(() => {
        if (video || !videoRef.current) {
            return;
        }

        const videoElement = videoRef.current;
        if (videoElement instanceof HTMLVideoElement) {
            setVideo(videoRef.current);
        }
    }, [videoRef, video]);

    useCleanup(video);

    React.useEffect(() => {
        if (!video || isCameraInitialized || !playing) {
            return;
        }
        initializeCamera()
            .then(stream => {
                video.srcObject = stream;
                setIsCameraInitialized(true);
            })
            .catch(e => {
                setError(e.message);
                setPlaying(false);
            });
    }, [video, isCameraInitialized, playing]);

    React.useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) {
            return;
        }

        if (playing) {
            videoElement.play();
        } else {
            videoElement.pause();
        }
    }, [playing, videoRef]);

    return [video, isCameraInitialized, playing, setPlaying, error] as const;
}
