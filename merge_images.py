import cv2
import numpy as np

# Load images
img1_path = r'C:\Users\chang\.gemini\antigravity-ide\brain\63f511b0-3ae1-4ed9-ba70-34c2cedb1301\.user_uploaded\media_1791305224690.png'
img2_path = r'C:\Users\chang\.gemini\antigravity-ide\brain\63f511b0-3ae1-4ed9-ba70-34c2cedb1301\.user_uploaded\media_1791305307392.jpg'
out_path = r'C:\Users\chang\OneDrive\Desktop\Projects\Samayyudh 2.0\public\merged_watch.png'

img1 = cv2.imread(img1_path)
img2 = cv2.imread(img2_path)

# --- 1. Remove the creepy figure from img1 ---
# The creepy figure is mostly black in the center of the image.
# Image size is ~ 591x575. Center is ~ 295, 287
h, w = img1.shape[:2]
center_x, center_y = w // 2, h // 2

# Create a mask for black pixels in the center area
mask1 = np.zeros((h, w), dtype=np.uint8)
# We assume the figure is within a box in the center (e.g. 200x200)
box_size = 220
x1 = max(0, center_x - box_size//2)
x2 = min(w, center_x + box_size//2)
y1 = max(0, center_y - box_size//2)
y2 = min(h, center_y + box_size//2)

# Black pixels are those with very low intensity
gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
_, black_mask = cv2.threshold(gray1, 30, 255, cv2.THRESH_BINARY_INV)

# Only apply to the center region
mask1[y1:y2, x1:x2] = black_mask[y1:y2, x1:x2]

# Inpaint to remove the creepy figure (fill with surrounding diamond color)
# Dilate the mask a bit to cover edges
kernel = np.ones((5,5), np.uint8)
mask1 = cv2.dilate(mask1, kernel, iterations=2)
img1_clean = cv2.inpaint(img1, mask1, inpaintRadius=10, flags=cv2.INPAINT_TELEA)

# --- 2. Extract the cat from img2 ---
# Img2 has a white background. Cat is mostly black/dark.
gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
# Threshold to get everything that is NOT white
_, cat_mask = cv2.threshold(gray2, 240, 255, cv2.THRESH_BINARY_INV)

# Find bounding box of the cat to crop it tightly
coords = cv2.findNonZero(cat_mask)
x, y, cw, ch = cv2.boundingRect(coords)

cat_cropped = img2[y:y+ch, x:x+cw]
cat_mask_cropped = cat_mask[y:y+ch, x:x+cw]

# --- 3. Resize cat to fit in the diamond ---
# The diamond in img1 is roughly 200x200. We'll resize the cat to fit inside.
target_h = 160
scale = target_h / ch
target_w = int(cw * scale)
cat_resized = cv2.resize(cat_cropped, (target_w, target_h), interpolation=cv2.INTER_AREA)
cat_mask_resized = cv2.resize(cat_mask_cropped, (target_w, target_h), interpolation=cv2.INTER_AREA)

# --- 4. Merge them ---
# We will place the cat centered in img1_clean
start_y = center_y - target_h // 2
start_x = center_x - target_w // 2

# Alpha blending using the mask
for i in range(target_h):
    for j in range(target_w):
        if cat_mask_resized[i, j] > 128: # If part of the cat
            # We can just overwrite with the cat pixel, 
            # but since the cat is black/dark, let's blend it for smooth edges
            alpha = cat_mask_resized[i, j] / 255.0
            # Blend
            img1_clean[start_y+i, start_x+j] = (1-alpha)*img1_clean[start_y+i, start_x+j] + alpha*cat_resized[i, j]

# Save the final image
cv2.imwrite(out_path, img1_clean)
print(f"Successfully saved to {out_path}")
