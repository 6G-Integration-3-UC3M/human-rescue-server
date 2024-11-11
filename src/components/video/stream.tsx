import React, { useEffect, useRef, useState } from 'react';

export default function Stream() {
    const videoRef = useRef(null);
    const [connectionError, setConnectionError] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('ws://192.168.195.40:9999'); // Use wss:// if necessary
        socket.binaryType = 'arraybuffer';

        socket.onopen = () => {
            console.log('Connected to WebSocket server');
            setConnectionError(null); // Reset error state on successful connection
        };

        socket.onmessage = (event) => {
            const data = new Uint8Array(event.data);

            // Extract the 64-bit frame size
            const len = new DataView(data.buffer).getBigUint64(0, true); // true for little-endian
            const frameData = data.slice(8, 8 + Number(len));

            // Convert the frame data into an image blob and update the image element
            const blob = new Blob([frameData], { type: 'image/jpeg' });
            const url = URL.createObjectURL(blob);

            if (videoRef.current) {
                videoRef.current.src = url;
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setConnectionError('WebSocket connection error'); // Set error state
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div>
            <img ref={videoRef} alt="" />
        </div>
    );
}
