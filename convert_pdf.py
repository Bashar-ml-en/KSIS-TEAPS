import fitz  # PyMuPDF
import os

# Paths
pdf_path = r"c:\Backend(KSIS)\UI Design For KSIS TEAPS.pdf"
output_folder = r"C:\Users\Bashar\.gemini\antigravity\brain\06d62ec5-3e6f-4b45-a574-51778701f21f\ui_pages"

# Create output folder
os.makedirs(output_folder, exist_ok=True)

print(f"Converting PDF: {pdf_path}")
print(f"Output folder: {output_folder}\n")

try:
    # Open PDF
    pdf_document = fitz.open(pdf_path)
    total_pages = len(pdf_document)
    
    print(f"Found {total_pages} pages in PDF\n")
    
    # Convert each page to image
    for page_num in range(total_pages):
        page = pdf_document[page_num]
        
        # Render page to image (zoom factor for better quality)
        mat = fitz.Matrix(2, 2)  # 2x zoom for better quality
        pix = page.get_pixmap(matrix=mat)
        
        # Save as PNG
        output_path = os.path.join(output_folder, f"page_{page_num + 1}.png")
        pix.save(output_path)
        
        print(f"Saved: page_{page_num + 1}.png ({pix.width}x{pix.height}px)")
    
    pdf_document.close()
    
    print(f"\nSuccessfully converted all {total_pages} pages!")
    print(f"Images saved to: {output_folder}")
    
except Exception as e:
    print(f"Error: {e}")
