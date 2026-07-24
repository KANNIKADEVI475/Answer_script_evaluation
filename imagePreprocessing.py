import cv2
import numpy as np

image=cv2.imread("images/DL_S1_1_page1.jpg")
imageResized = cv2.resize(image, None, fx=1.5, fy=1.5)

# cv2.imshow("Original", imageResized)
# cv2.waitKey(0)
# cv2.destroyAllWindows()

gray=cv2.cvtColor(imageResized,cv2.COLOR_BGR2GRAY)

# cv2.imshow("grayscale", gray)
# cv2.waitKey(0)
# cv2.destroyAllWindows()

cv2.imwrite("output/gray.jpg",gray)

denoise=cv2.medianBlur(gray,3)

cv2.imwrite("output/denoise.jpg",denoise)

clahe=cv2.createCLAHE(clipLimit=2.0,tileGridSize=(8,8))

contrast=clahe.apply(denoise)

cv2.imwrite("output/contrast.jpg",contrast)

thresh=cv2.adaptiveThreshold(contrast,
    255,
    cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
    cv2.THRESH_BINARY,
    11,
    2)

cv2.imwrite("output/threshold.jpg", thresh)

kernel = np.ones((2,2),np.uint8)

result = cv2.dilate(thresh,kernel,iterations=1)
cv2.imwrite("output/result.jpg", result)
