import fitz
import cv2
import numpy as np

def pdf_to_images(pdf_path, zoom=3):
    """Converts each page of a PDF into a cv2 image. zoom=3 gives ~216 DPI, good for handwriting."""
    doc = fitz.open(pdf_path)
    images = []

    for page_num in range(len(doc)):
        page = doc[page_num]
        pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom))

        img_array = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)

        if pix.n == 4:
            image = cv2.cvtColor(img_array, cv2.COLOR_RGBA2BGR)
        else:
            image = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)

        images.append(image)

    doc.close()
    return images