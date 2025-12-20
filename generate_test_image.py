from PIL import Image, ImageDraw

img = Image.new('RGB', (1920, 1080), color = 'black')
d = ImageDraw.Draw(img)
d.rectangle([(20, 20), (320, 320)], outline="white", width=2)
d.ellipse([(150, 150), (160, 160)], fill=(255, 0, 0), outline=(255, 0, 0))

img.save('public/test_frame.jpg', quality=95)
print(f"Saved image size: {img.size}")
