import { Alert } from "react-native";

/**
 * Download a file and show it to the user
 * @param filename - Name of the file to download
 * @param content - Content of the file (can be text or base64)
 * @param mimeType - MIME type of the file (e.g., 'application/pdf', 'text/plain')
 */
export async function downloadFile(
    filename: string,
    content: string,
    mimeType: string = "application/pdf"
): Promise<boolean> {
    // Simulate download delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    Alert.alert(
        "Download Complete",
        `${filename} has been saved to your Downloads folder.`,
        [{ text: "OK" }]
    );

    return true;
}

/**
 * Generate a dummy PDF content (simplified text representation)
 */
export function generateDummyPDF(title: string, content: string): string {
    // This is a simplified text file that represents a PDF
    // In a real app, you'd use a PDF library like react-native-pdf or expo-print
    return `
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║                    FAKIR FASHION LIMITED                   ║
║                      Employee Portal                       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

${title}
${"=".repeat(60)}

${content}

${"─".repeat(60)}
Generated on: ${new Date().toLocaleString()}
This is a demo document from FakirPay Employee App

For official documents, please contact HR department.
Email: hr@fakirfashion.com
Phone: +880 1711-XXXXXX

${"─".repeat(60)}
© ${new Date().getFullYear()} Fakir Fashion Limited. All rights reserved.
  `;
}

/**
 * Generate payslip content
 */
export function generatePayslip(month: string, amount: string): string {
    const content = `
PAYSLIP FOR: ${month}

EMPLOYEE DETAILS:
─────────────────────────────────────────────────────────
Name:           Fuad Tasrim Hossain
Employee ID:    FFL-1001
Designation:    Senior Merchandiser
Department:     Merchandising
Payment Date:   ${new Date().toLocaleDateString()}

EARNINGS:
─────────────────────────────────────────────────────────
Basic Salary:                              ৳ 30,000
House Rent Allowance:                      ৳ 15,000
Medical Allowance:                         ৳  2,000
Conveyance Allowance:                      ৳  2,000
                                          ──────────
GROSS SALARY:                              ৳ 49,000

DEDUCTIONS:
─────────────────────────────────────────────────────────
Income Tax:                                ৳  1,200
                                          ──────────
TOTAL DEDUCTIONS:                          ৳  1,200

═════════════════════════════════════════════════════════
NET SALARY:                                ${amount}
═════════════════════════════════════════════════════════

Payment Method: Bank Transfer
Bank Account:   ************4567
Bank Name:      Standard Chartered Bank

This is a computer-generated payslip and does not require a signature.
  `;

    return generateDummyPDF(`PAYSLIP - ${month}`, content);
}

/**
 * Generate knowledge base document content
 */
export function generateKBDocument(
    title: string,
    category: string,
    excerpt: string,
    chunks: Array<{ heading: string; text: string }>
): string {
    let content = `
DOCUMENT: ${title}
CATEGORY: ${category}

OVERVIEW:
─────────────────────────────────────────────────────────
${excerpt}

`;

    chunks.forEach((chunk, index) => {
        content += `
${index + 1}. ${chunk.heading}
${"─".repeat(60)}
${chunk.text}

`;
    });

    content += `
IMPORTANT NOTES:
─────────────────────────────────────────────────────────
• This document is for internal use only
• Please refer to the latest version in the Knowledge Base
• For questions, contact your department supervisor
• Last updated: ${new Date().toLocaleDateString()}
  `;

    return generateDummyPDF(title, content);
}
