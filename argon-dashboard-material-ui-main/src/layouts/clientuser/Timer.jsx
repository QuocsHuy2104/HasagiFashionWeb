import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

function Timer({ flashSale }) {
    const [timeLeft, setTimeLeft] = useState(0);

    const calculateTimeLeft = (startDate, endDate) => {
        const now = new Date();
        if (now < new Date(startDate)) {
            return new Date(startDate) - now; // Trả về thời gian còn lại từ bây giờ đến startDate
        }
        if (now > new Date(endDate)) {
            return 0; // Nếu thời gian hiện tại đã qua endDate, trả về 0
        }
        return new Date(endDate) - now; // Trả về thời gian còn lại đến endDate
    };

    useEffect(() => {
        if (flashSale && flashSale.startDate && flashSale.endDate) {
            const updateTimer = () => {
                const timeLeft = calculateTimeLeft(flashSale.startDate, flashSale.endDate);
                setTimeLeft(timeLeft);
            };
            updateTimer();
            const interval = setInterval(updateTimer, 1000); // Cập nhật mỗi giây

            return () => clearInterval(interval); // Dọn dẹp khi component bị hủy
        }
    }, [flashSale]); // Chạy lại effect khi flashSale thay đổi

    const formatTime = (totalMilliseconds) => {
        const totalSeconds = Math.floor(totalMilliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return { hours, minutes, seconds };
    };

    const time = formatTime(timeLeft); // Chuyển đổi thời gian thành giờ, phút, giây

    return (
        <div>
            <div className="countdown d-flex">
                {["hours", "minutes", "seconds"].map((unit) => (
                    <div
                        className="time-box"
                        key={unit}
                        style={{
                            backgroundColor: "#000",
                            color: "#fff",
                            padding: "5px 10px",
                            borderRadius: "5px",
                            fontWeight: "bold",
                            marginLeft: "10px",
                        }}
                    >
                        <span className="time" style={{ fontSize: "1.2rem" }}>
                            {String(time[unit]).padStart(2, "0")}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

Timer.propTypes = {
    flashSale: PropTypes.shape({
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
    }).isRequired,
};

export default Timer;
