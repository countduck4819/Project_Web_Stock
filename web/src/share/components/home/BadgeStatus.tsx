"use client";
type ImportantStatus = "TARGET_HIT" | "STOP_LOSS";

const statusLabelMap: Record<ImportantStatus, string> = {
    TARGET_HIT: "Chốt lời",
    STOP_LOSS: "Cắt lỗ",
};

const statusColorMap: Record<ImportantStatus, string> = {
    TARGET_HIT: "bg-green-100 text-green-700",
    STOP_LOSS: "bg-red-100 text-red-700",
};

interface StatusBadgeProps {
    status?: ImportantStatus; // optional, tránh lỗi undefined
}

export const BadgeStatus: React.FC<StatusBadgeProps> = ({ status }) => {
    if (!status) return null; // nếu undefined thì không hiển thị
    const label = statusLabelMap[status];
    const color = statusColorMap[status];

    return (
        <span className={`px-3 py-1 rounded-xl text-xs font-semibold ${color}`}>
            {label}
        </span>
    );
};
