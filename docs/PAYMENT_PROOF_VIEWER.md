# Payment Slip Viewer Documentation

## Overview

The Admin Payments page allows administrators to review payment proofs submitted by users. These proofs can lead to a payment being marked as `approved` or `rejected`. The system supports displaying both **Image** files (JPG, PNG, etc.) and **PDF** documents directly within a modal, eliminating the need for admins to download files to view them.

## Technical Implementation

The viewer logic is embedded within the `AdminPaymentsPage` component in `src/app/admin/payments/page.tsx`.

### Logic Flow

1.  **Selection**: When an admin clicks the "Eye" icon on a payment row, the `selectedPayment` state is updated with that payment's data.
2.  **Modal Rendering**: A modal opens displaying the details of `selectedPayment`.
3.  **File Type Detection**: The system checks the file extension of the `slip_url` to determine how to render the content.
4.  **rendering**:
    *   **PDFs**: Rendered using a standard HTML `<iframe>`. This leverages the browser's built-in PDF viewing capabilities.
    *   **Images**: Rendered using the Next.js optimized `<Image />` component.

### Code Snippet

```tsx
<div className="border rounded-lg p-2 bg-gray-50 flex justify-center">
    {/* Handle PDF vs Image */}
    {selectedPayment.slip_url.toLowerCase().endsWith('.pdf') ? (
    // 1. PDF Handling
    <iframe 
        src={selectedPayment.slip_url} 
        className="w-full h-96" 
        title="Payment Slip PDF"
    />
    ) : (
    // 2. Image Handling
    <div className="relative w-full h-96">
        <Image 
            src={selectedPayment.slip_url} 
            alt="Payment Slip" 
            fill 
            className="object-contain" // Ensures image scales correctly within bounds
        />
    </div>
    )}
</div>
```

## Libraries & Dependencies

This feature operates primarily using standard web technologies and regular boilerplate dependencies. **No heavy third-party PDF libraries** (like `react-pdf`) are required for this implementation.

| Dependency | Purpose |
| :--- | :--- |
| **HTML5 `<iframe>`** | Natively displays PDF files in all modern browsers. |
| **Next.js `<Image>`** | optimized image rendering for non-PDF proofs. |
| **React** | Handles state (`selectedPayment`) and conditional rendering. |
| **Tailwind CSS** | Handles styling (`w-full`, `h-96`, positioning). |

## Advantages

*   **Lightweight**: No extra JavaScript bundles for PDF parsing.
*   **Fast**: Uses the browser's native optimized engine.
*   **Simple Maintenance**: Standard HTML/CSS implementation.

## Notes & Limitations

*   **Browser Support**: This method relies on the browser's ability to render PDFs in frames. This is supported by Chrome, Firefox, Safari, and Edge.
*   **Mobile Behavior**: On some mobile browsers, an `<iframe>` pointing to a PDF might trigger a download or open in a separate viewer instead of embedding directly. This is standard browser behavior.
