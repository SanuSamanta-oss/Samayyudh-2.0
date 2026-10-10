import cv2
import numpy as np

img_path = r'C:\Users\chang\OneDrive\Desktop\Projects\Samayyudh 2.0\public\ticket.png'
out_path = r'C:\Users\chang\OneDrive\Desktop\Projects\Samayyudh 2.0\public\ticket_transparent.png'

img = cv2.imread(img_path)

# Convert to grayscale to find the ticket
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
# Threshold: anything brighter than 10 (almost black) is the ticket
_, mask = cv2.threshold(gray, 10, 255, cv2.THRESH_BINARY)

# Find bounding box
coords = cv2.findNonZero(mask)
x, y, w, h = cv2.boundingRect(coords)

# Crop
ticket_cropped = img[y:y+h, x:x+w]
mask_cropped = mask[y:y+h, x:x+w]

# Make black pixels in the cropped area transparent if they are strictly background.
# But wait, the ticket has black text/barcode!
# So we can't just make black transparent. We need to use the `mask_cropped` to define transparency!
# Everything outside the ticket mask should be transparent. But the ticket itself is a solid shape.
# Actually, the ticket is a solid light-colored shape.
# We can find the largest contour and use it as the mask to keep the ticket and barcode intact.

contours, _ = cv2.findContours(mask_cropped, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
# find the largest contour
c = max(contours, key=cv2.contourArea)
solid_mask = np.zeros_like(mask_cropped)
cv2.drawContours(solid_mask, [c], -1, 255, thickness=cv2.FILLED)

# Create RGBA
rgba = cv2.cvtColor(ticket_cropped, cv2.COLOR_BGR2BGRA)
rgba[:, :, 3] = solid_mask

cv2.imwrite(out_path, rgba)
print(f"Successfully processed and saved to {out_path}")
