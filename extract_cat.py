import cv2
import numpy as np

img2_path = r'C:\Users\chang\.gemini\antigravity-ide\brain\63f511b0-3ae1-4ed9-ba70-34c2cedb1301\.user_uploaded\media_1791305307392.jpg'
out_path = r'C:\Users\chang\OneDrive\Desktop\Projects\Samayyudh 2.0\public\cat_cropped.png'

img2 = cv2.imread(img2_path)
gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
_, cat_mask = cv2.threshold(gray2, 240, 255, cv2.THRESH_BINARY_INV)

coords = cv2.findNonZero(cat_mask)
x, y, cw, ch = cv2.boundingRect(coords)

cat_cropped = img2[y:y+ch, x:x+cw]
cat_mask_cropped = cat_mask[y:y+ch, x:x+cw]

# Create RGBA image
cat_rgba = cv2.cvtColor(cat_cropped, cv2.COLOR_BGR2BGRA)
cat_rgba[:, :, 3] = cat_mask_cropped

cv2.imwrite(out_path, cat_rgba)
print(f"Successfully saved to {out_path}")
