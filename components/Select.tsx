import { ChevronDown } from "lucide-react-native";
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

interface SelectOption {
    label: string;
    value: string;
}

interface SelectProps {
    options: SelectOption[];
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    label?: string;
}

export function Select({
    options,
    value,
    onValueChange,
    placeholder = "Select an option",
    label,
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find((opt) => opt.value === value);

    const handleSelect = (optionValue: string) => {
        onValueChange(optionValue);
        setIsOpen(false);
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setIsOpen(true)}
                activeOpacity={0.7}
            >
                <Text
                    style={[
                        styles.selectText,
                        !selectedOption && styles.placeholderText,
                    ]}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <ChevronDown size={18} color={Colors.slate[400]} />
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
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {label || "Select an option"}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setIsOpen(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.optionsList}>
                            {options.map((option) => {
                                const isSelected = option.value === value;
                                return (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={[
                                            styles.optionItem,
                                            isSelected && styles.optionItemSelected,
                                        ]}
                                        onPress={() => handleSelect(option.value)}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                isSelected && styles.optionTextSelected,
                                            ]}
                                        >
                                            {option.label}
                                        </Text>
                                        {isSelected && (
                                            <Text style={styles.checkmark}>✓</Text>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
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
    selectButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.neutral[900],
        borderWidth: 1,
        borderColor: Colors.neutral[700],
        borderRadius: 14,
        padding: 14,
    },
    selectText: {
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
        maxHeight: "70%",
        borderWidth: 1,
        borderColor: Colors.neutral[800],
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral[800],
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
    optionsList: {
        maxHeight: 400,
    },
    optionItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral[800],
    },
    optionItemSelected: {
        backgroundColor: Colors.brand.light + "1A",
    },
    optionText: {
        color: Colors.slate[200],
        fontSize: 15,
        flex: 1,
    },
    optionTextSelected: {
        color: Colors.brand.light,
        fontWeight: "600",
    },
    checkmark: {
        color: Colors.brand.light,
        fontSize: 18,
        fontWeight: "700",
        marginLeft: 12,
    },
});
