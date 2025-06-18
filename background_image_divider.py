from PIL import Image
import os

# === CONFIG ===
source_image_path = 'web-app/assets/images/test_backdrop.png'  # Replace with your big backdrop image
output_folder = 'web-app/assets/grid_tiles'
grid_size = 50  # 50x50 grid

# === Load image ===
image = Image.open(source_image_path)
width, height = image.size

# === Sanity check ===
if width != height:
    raise ValueError("Image must be square")

tile_size = width // grid_size

# === Make output directory ===
os.makedirs(output_folder, exist_ok=True)

# === Slice image ===
for y in range(grid_size):
    for x in range(grid_size):
        left = x * tile_size
        upper = y * tile_size
        right = left + tile_size
        lower = upper + tile_size

        tile = image.crop((left, upper, right, lower))
        filename = f"tile_{x}_{y}.png"
        tile.save(os.path.join(output_folder, filename))

print(f"✅ Done! {grid_size * grid_size} tiles saved to '{output_folder}/'")
