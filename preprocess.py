import cv2
import numpy as np
import os

def preprocess_images(images, save_output=True, output_dir="output"):
    """Light preprocessing tuned for handwriting - no threshold/dilate."""
    if save_output:
        os.makedirs(output_dir, exist_ok=True)

    processed = []

    for idx, img in enumerate(images):
        resized = cv2.resize(img, None, fx=2, fy=2)
        gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)

        clahe = cv2.createCLAHE(clipLimit=1.5, tileGridSize=(8, 8))
        contrast = clahe.apply(gray)

        if save_output:
            cv2.imwrite(f"{output_dir}/page_{idx + 1}.jpg", contrast)

        processed.append(contrast)

    return processed