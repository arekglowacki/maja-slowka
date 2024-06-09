import { useEffect, useState } from 'react';
import ProgressBar from "react-bootstrap/ProgressBar";

interface Props {
    onTimeout: () => void;
}

const Timeout = ({ onTimeout }: Props) => {
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        const interval = 50; // Update every half second
        const totalDuration = 6000; // 6 seconds total
        const totalUpdates = totalDuration / interval;

        let currentUpdate = 0;

        const intervalId = setInterval(() => {
            currentUpdate += 1;
            console.log("ID: ", intervalId , " - ", (currentUpdate * interval) / 1000)
            setPercentage((currentUpdate / totalUpdates) * 100);

            if (currentUpdate >= totalUpdates) {
                console.log("Clearing interval with ID: ", intervalId);
                clearInterval(intervalId);
                onTimeout();
            }
        }, interval);

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <ProgressBar now={percentage} />
        </div>
    );
};

export default Timeout;