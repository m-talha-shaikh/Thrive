// CallComponent.js
import React, { useEffect, useRef } from 'react';
import SimplePeer from 'simple-peer';

const CallComponent = ({ isCaller }) => {
  const videoRef = useRef(null);
  let peer = null;

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;

        if (isCaller) {
          // If user is the caller
          peer = new SimplePeer({ initiator: true, stream });
        } else {
          // If user is answering the call
          peer = new SimplePeer({ initiator: false, stream });
        }

        peer.on('signal', (data) => {
          // Send signal data to the other user
        });

        peer.on('stream', (remoteStream) => {
          // Display remote stream in video element
          videoRef.current.srcObject = remoteStream;
        });
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });

    return () => {
      // Clean up resources when component unmounts
      peer.destroy();
    };
  }, [isCaller]);

  return (
    <div>
      <video ref={videoRef} autoPlay />
    </div>
  );
};

export default CallComponent;
