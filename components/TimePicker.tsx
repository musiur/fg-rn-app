import { Clock } from "lucide-react-native";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../constants/Colors";

interface TimePickerProps {
    value: string;
    onChange: (time: string) => void;
    label?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
    value,
    onChange,
    label,
}) => {
    const [showPicker, setShowPicker] = useState(false);
    const [selectedHour, setSelectedHour] = useState(
        value ? parseInt(value.split(":")[0]) : 9
    );
    const [selectedMinute, setSelectedMinute] = useState(
        value ? parseInt(value.split(":")[1]) : 0
    );

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    const handleConfirm = () => {
        const timeString = `${String(selectedHour).padStart(2, "0")}:${String(
            selectedMinute
        ).padStart(2, "0")}`;
        onChange(timeString);
        setShowPicker(false);
    };

    const displayValue = value || "Select time";

    return (
        <>
            <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowPicker(true)}
            >
                <Clock size={16} color={Colors.slate[400]} />
                <Text style={[styles.timeText, !value && styles.placeholder]}>
                    {displayValue}
                </Text>
            </TouchableOpacity>

            <Modal visible={showPicker} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.pickerModal}>
                        <Text style={styles.pickerTitle}>
                            {label || "Select Time"}
                        </Text>

                        <View style={styles.pickerContainer}>
                            {/* Hours */}
                            <View style={styles.column}>
                                <Text style={styles.columnLabel}>Hour</Text>
                                <ScrollView
                                    style={styles.scrollView}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {hours.map((hour) => (
                                        <TouchableOpacity
                                            key={hour}
                                            style={[
                                                styles.timeOption,
                                                selectedHour === hour && styles.timeOptionSelected,
                                            ]}
                                            onPress={() => setSelectedHour(hour)}
                                        >
                                            <Text
                                                style={[
                                                    styles.timeOptionText,
                                                    selectedHour === hour && styles.timeOptionTextSelected,
                                                ]}
                                            >
                                                {String(hour).padStart(2, "0")}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            <Text style={styles.separator}>:</Text>

                            {/* Minutes */}
                            <View style={styles.column}>
                                <Text style={styles.columnLabel}>Minute</Text>
                                <ScrollView
                                    style={styles.scrollView}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {minutes.map((minute) => (
                                        <TouchableOpacity
                                            key={minute}
                                            style={[
                                                styles.timeOption,
                                                selectedMinute === minute && styles.timeOptionSelected,
                                            ]}
                                            onPress={() => setSelectedMinute(minute)}
                                        >
                                            <Text
                                                style={[
                                                    styles.timeOptionText,
                                                    selectedMinute === minute &&
                                                    styles.timeOptionTextSelected,
                                                ]}
                                            >
                                                {String(minute).padStart(2, "0")}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowPicker(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={handleConfirm}
                            >
                                <Text style={styles.confirmButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    timeButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: Colors.neutral[800],
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: Colors.neutral[700],
    },
    timeText: {
        color: Colors.slate[200],
        fontSize: 14,
        flex: 1,
    },
    placeholder: {
        color: Colors.slate[500],
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    pickerModal: {
        backgroundColor: Colors.neutral[900],
        borderRadius: 24,
        padding: 24,
        width: "100%",
        maxWidth: 350,
    },
    pickerTitle: {
        color: Colors.slate[100],
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 20,
        textAlign: "center",
    },
    pickerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        marginBottom: 24,
    },
    column: {
        flex: 1,
    },
    columnLabel: {
        color: Colors.slate[400],
        fontSize: 12,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 8,
    },
    scrollView: {
        maxHeight: 200,
        backgroundColor: Colors.neutral[800],
        borderRadius: 12,
    },
    timeOption: {
        padding: 12,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral[700],
    },
    timeOptionSelected: {
        backgroundColor: Colors.brand.light + "22",
    },
    timeOptionText: {
        color: Colors.slate[300],
        fontSize: 16,
        fontWeight: "500",
    },
    timeOptionTextSelected: {
        color: Colors.brand.light,
        fontWeight: "700",
    },
    separator: {
        color: Colors.slate[200],
        fontSize: 24,
        fontWeight: "700",
        marginTop: 24,
    },
    buttonRow: {
        flexDirection: "row",
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: Colors.neutral[800],
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    cancelButtonText: {
        color: Colors.slate[200],
        fontSize: 14,
        fontWeight: "600",
    },
    confirmButton: {
        flex: 1,
        backgroundColor: Colors.brand.light,
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    confirmButtonText: {
        color: Colors.neutral[900],
        fontSize: 14,
        fontWeight: "700",
    },
});
