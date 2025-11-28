import { Calendar } from "lucide-react-native";
import React, { useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Colors } from "../constants/Colors";

interface DatePickerProps {
    value: string;
    onValueChange: (date: string) => void;
    label?: string;
    placeholder?: string;
    minDate?: Date;
    maxDate?: Date;
}

export function DatePicker({
    value,
    onValueChange,
    label,
    placeholder = "Select date",
    minDate,
    maxDate,
}: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(
        value ? new Date(value) : null
    );

    const formatDate = (date: Date | null): string => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const formatDisplayDate = (date: Date | null): string => {
        if (!date) return "";
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "short",
            year: "numeric",
        };
        return date.toLocaleDateString("en-GB", options);
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        const formattedDate = formatDate(date);
        onValueChange(formattedDate);
        setIsOpen(false);
    };

    const generateCalendar = () => {
        const today = new Date();
        const currentMonth = selectedDate || today;
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (Date | null)[] = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const changeMonth = (offset: number) => {
        const current = selectedDate || new Date();
        const newDate = new Date(
            current.getFullYear(),
            current.getMonth() + offset,
            1
        );
        setSelectedDate(newDate);
    };

    const days = generateCalendar();
    const monthYear = (selectedDate || new Date()).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
    });

    const isDateDisabled = (date: Date | null): boolean => {
        if (!date) return true;
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return false;
    };

    const isToday = (date: Date | null): boolean => {
        if (!date) return false;
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const isSelected = (date: Date | null): boolean => {
        if (!date || !value) return false;
        const selected = new Date(value);
        return (
            date.getDate() === selected.getDate() &&
            date.getMonth() === selected.getMonth() &&
            date.getFullYear() === selected.getFullYear()
        );
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setIsOpen(true)}
                activeOpacity={0.7}
            >
                <Text style={[styles.dateText, !value && styles.placeholderText]}>
                    {value ? formatDisplayDate(new Date(value)) : placeholder}
                </Text>
                <Calendar size={18} color={Colors.slate[400]} />
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsOpen(false)}
                >
                    <View
                        style={styles.modalContent}
                        onStartShouldSetResponder={() => true}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{label || "Select Date"}</Text>
                            <TouchableOpacity
                                onPress={() => setIsOpen(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.calendarHeader}>
                            <TouchableOpacity
                                onPress={() => changeMonth(-1)}
                                style={styles.monthButton}
                            >
                                <Text style={styles.monthButtonText}>‹</Text>
                            </TouchableOpacity>
                            <Text style={styles.monthYear}>{monthYear}</Text>
                            <TouchableOpacity
                                onPress={() => changeMonth(1)}
                                style={styles.monthButton}
                            >
                                <Text style={styles.monthButtonText}>›</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.weekDays}>
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <Text key={day} style={styles.weekDayText}>
                                    {day}
                                </Text>
                            ))}
                        </View>

                        <View style={styles.daysGrid}>
                            {days.map((date, index) => {
                                const disabled = isDateDisabled(date);
                                const today = isToday(date);
                                const selected = isSelected(date);

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.dayCell,
                                            !date && styles.dayCellEmpty,
                                            selected && styles.dayCellSelected,
                                            today && !selected && styles.dayCellToday,
                                        ]}
                                        onPress={() => date && !disabled && handleDateSelect(date)}
                                        disabled={!date || disabled}
                                    >
                                        {date && (
                                            <Text
                                                style={[
                                                    styles.dayText,
                                                    disabled && styles.dayTextDisabled,
                                                    selected && styles.dayTextSelected,
                                                    today && !selected && styles.dayTextToday,
                                                ]}
                                            >
                                                {date.getDate()}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <TouchableOpacity
                            style={styles.todayButton}
                            onPress={() => handleDateSelect(new Date())}
                        >
                            <Text style={styles.todayButtonText}>Today</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        color: Colors.slate[400],
        fontSize: 13,
        fontWeight: "500",
        marginBottom: 8,
    },
    dateButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.neutral[900],
        borderWidth: 1,
        borderColor: Colors.neutral[700],
        borderRadius: 14,
        padding: 14,
    },
    dateText: {
        color: Colors.slate[200],
        fontSize: 14,
        flex: 1,
    },
    placeholderText: {
        color: Colors.slate[500],
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        backgroundColor: Colors.neutral[900],
        borderRadius: 20,
        width: "100%",
        maxWidth: 400,
        borderWidth: 1,
        borderColor: Colors.neutral[800],
        padding: 20,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: {
        color: Colors.slate[200],
        fontSize: 16,
        fontWeight: "600",
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.neutral[800],
        justifyContent: "center",
        alignItems: "center",
    },
    closeButtonText: {
        color: Colors.slate[300],
        fontSize: 18,
        fontWeight: "600",
    },
    calendarHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    monthButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.neutral[800],
        justifyContent: "center",
        alignItems: "center",
    },
    monthButtonText: {
        color: Colors.slate[200],
        fontSize: 24,
        fontWeight: "600",
    },
    monthYear: {
        color: Colors.slate[200],
        fontSize: 16,
        fontWeight: "600",
    },
    weekDays: {
        flexDirection: "row",
        marginBottom: 8,
    },
    weekDayText: {
        flex: 1,
        textAlign: "center",
        color: Colors.slate[400],
        fontSize: 12,
        fontWeight: "600",
    },
    daysGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    dayCell: {
        width: "14.28%",
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
    },
    dayCellEmpty: {
        opacity: 0,
    },
    dayCellSelected: {
        backgroundColor: Colors.brand.light,
        borderRadius: 12,
    },
    dayCellToday: {
        borderWidth: 2,
        borderColor: Colors.brand.light,
        borderRadius: 12,
    },
    dayText: {
        color: Colors.slate[200],
        fontSize: 14,
        fontWeight: "500",
    },
    dayTextDisabled: {
        color: Colors.slate[500],
        opacity: 0.3,
    },
    dayTextSelected: {
        color: Colors.neutral[900],
        fontWeight: "700",
    },
    dayTextToday: {
        color: Colors.brand.light,
        fontWeight: "700",
    },
    todayButton: {
        marginTop: 16,
        padding: 12,
        backgroundColor: Colors.neutral[800],
        borderRadius: 12,
        alignItems: "center",
    },
    todayButtonText: {
        color: Colors.slate[200],
        fontSize: 14,
        fontWeight: "600",
    },
});
