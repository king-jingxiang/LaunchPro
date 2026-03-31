#!/usr/bin/env python3
"""Generate app icons from icon_master.png and icon_master_logo.png source files."""

from PIL import Image
import os

SOURCE = "icon_master.png"
LOGO_SOURCE = "icon_master_logo.png"

def make_square(img):
    """Make the image square by padding with transparent pixels."""
    w, h = img.size
    if w == h:
        return img
    size = max(w, h)
    new_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    offset = ((size - w) // 2, (size - h) // 2)
    new_img.paste(img, offset)
    return new_img

def load_source_image():
    """Load and prepare the source image from icon_master.png."""
    print("Loading source image...")
    if not os.path.exists(SOURCE):
        raise FileNotFoundError(f"Source file not found: {SOURCE}")
    
    img = Image.open(SOURCE).convert("RGBA")
    print(f"  Original size: {img.size[0]}x{img.size[1]}")
    
    print("\nMaking image square...")
    img = make_square(img)
    print(f"  Square size: {img.size[0]}x{img.size[1]}")
    
    return img

def load_logo_image():
    """Load and prepare the logo image from icon_master_logo.png."""
    print("Loading logo image for icon.png...")
    if not os.path.exists(LOGO_SOURCE):
        raise FileNotFoundError(f"Logo source file not found: {LOGO_SOURCE}")
    
    img = Image.open(LOGO_SOURCE).convert("RGBA")
    print(f"  Original size: {img.size[0]}x{img.size[1]}")
    
    print("\nMaking logo image square...")
    img = make_square(img)
    print(f"  Square size: {img.size[0]}x{img.size[1]}")
    
    return img

def generate_all_icons(base_img, logo_img, icons_dir):
    """Generate all required icon sizes for Tauri"""
    
    # 定义所有需要的尺寸 (icon.png 使用 logo_img，其他使用 base_img)
    icon_sizes = {
        'icon.png': (1024, 'logo'),  # 使用 logo
        'icon.ico': (256, 'base'),
        '32x32.png': (32, 'base'),
        '64x64.png': (64, 'base'),
        '128x128.png': (128, 'base'),
        '128x128@2x.png': (256, 'base'),
        'Square30x30Logo.png': (30, 'base'),
        'Square44x44Logo.png': (44, 'base'),
        'Square71x71Logo.png': (71, 'base'),
        'Square89x89Logo.png': (89, 'base'),
        'Square107x107Logo.png': (107, 'base'),
        'Square142x142Logo.png': (142, 'base'),
        'Square150x150Logo.png': (150, 'base'),
        'Square284x284Logo.png': (284, 'base'),
        'Square310x310Logo.png': (310, 'base'),
        'StoreLogo.png': (50, 'base'),
    }
    
    # Android 图标尺寸
    android_sizes = {
        'mipmap-mdpi/ic_launcher.png': 48,
        'mipmap-mdpi/ic_launcher_foreground.png': 108,
        'mipmap-mdpi/ic_launcher_round.png': 48,
        'mipmap-hdpi/ic_launcher.png': 72,
        'mipmap-hdpi/ic_launcher_foreground.png': 162,
        'mipmap-hdpi/ic_launcher_round.png': 72,
        'mipmap-xhdpi/ic_launcher.png': 96,
        'mipmap-xhdpi/ic_launcher_foreground.png': 216,
        'mipmap-xhdpi/ic_launcher_round.png': 96,
        'mipmap-xxhdpi/ic_launcher.png': 144,
        'mipmap-xxhdpi/ic_launcher_foreground.png': 324,
        'mipmap-xxhdpi/ic_launcher_round.png': 144,
        'mipmap-xxxhdpi/ic_launcher.png': 192,
        'mipmap-xxxhdpi/ic_launcher_foreground.png': 432,
        'mipmap-xxxhdpi/ic_launcher_round.png': 192,
    }
    
    # iOS 图标尺寸
    ios_sizes = [
        (20, [1, 2, 3]),
        (29, [1, 2, 3]),
        (40, [1, 2, 3]),
        (60, [2, 3]),
        (76, [1, 2]),
        (83.5, [2]),
        (512, [2]),  # 1024@2x
    ]
    
    os.makedirs(icons_dir, exist_ok=True)
    
    # 生成主图标
    for filename, (s, source_type) in icon_sizes.items():
        # 根据类型选择图片源
        img = logo_img if source_type == 'logo' else base_img
        
        if filename == 'icon.ico':
            # ICO 文件需要特殊处理
            ico_sizes = [256, 128, 64, 48, 32, 16]
            ico_images = []
            for ico_s in ico_sizes:
                resized = base_img.resize((ico_s, ico_s), Image.Resampling.LANCZOS)
                ico_images.append(resized.convert('RGBA'))
            
            ico_path = os.path.join(icons_dir, filename)
            ico_images[0].save(
                ico_path,
                format='ICO',
                sizes=[(img.width, img.height) for img in ico_images],
                append_images=ico_images[1:]
            )
            print(f"  Generated: {filename} (multi-size)")
        else:
            resized = img.resize((s, s), Image.Resampling.LANCZOS)
            resized.save(os.path.join(icons_dir, filename))
            source_name = "logo" if source_type == 'logo' else "base"
            print(f"  Generated: {filename} ({s}x{s}) from {source_name}")
    
    # 生成 Android 图标
    android_dir = os.path.join(icons_dir, 'android')
    for path, s in android_sizes.items():
        full_path = os.path.join(android_dir, path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        resized = base_img.resize((s, s), Image.Resampling.LANCZOS)
        resized.save(full_path)
        print(f"  Generated: android/{path} ({s}x{s})")
    
    # 生成 iOS 图标
    ios_dir = os.path.join(icons_dir, 'ios')
    os.makedirs(ios_dir, exist_ok=True)
    for base_size, scales in ios_sizes:
        for scale in scales:
            if base_size == 512 and scale == 2:
                filename = f"AppIcon-512@2x.png"
                s = 1024
            elif base_size == 83.5:
                filename = f"AppIcon-{int(base_size)}x{int(base_size)}@2x.png"
                s = int(base_size * scale)
            else:
                filename = f"AppIcon-{int(base_size)}x{int(base_size)}@{scale}x.png"
                s = int(base_size * scale)
            
            resized = base_img.resize((s, s), Image.Resampling.LANCZOS)
            resized.save(os.path.join(ios_dir, filename))
            print(f"  Generated: ios/{filename} ({s}x{s})")
    
    # 生成 ICNS (macOS)
    generate_icns(base_img, os.path.join(icons_dir, 'icon.icns'))
    print(f"  Generated: icon.icns (multi-size)")


def generate_icns(base_img, output_path):
    """Generate macOS ICNS file"""
    import struct
    import io
    
    # ICNS 格式需要的尺寸
    icns_sizes = [
        (16, b'icp4'),
        (32, b'icp5'),
        (64, b'icp6'),
        (128, b'ic07'),
        (256, b'ic08'),
        (512, b'ic09'),
        (1024, b'ic10'),
    ]
    
    icns_data = io.BytesIO()
    
    # 写入文件头
    icns_data.write(struct.pack('>4sI', b'icns', 0))  # 占位长度
    
    total_size = 8  # 文件头大小
    
    for size, icon_type in icns_sizes:
        resized = base_img.resize((size, size), Image.Resampling.LANCZOS)
        
        # 转换为 PNG 数据
        png_buffer = io.BytesIO()
        resized.save(png_buffer, format='PNG')
        png_data = png_buffer.getvalue()
        
        # 写入图标条目
        entry_size = 8 + len(png_data)
        icns_data.write(struct.pack('>4sI', icon_type, entry_size))
        icns_data.write(png_data)
        total_size += entry_size
    
    # 更新文件长度
    icns_data.seek(4)
    icns_data.write(struct.pack('>I', total_size))
    
    # 保存文件
    with open(output_path, 'wb') as f:
        f.write(icns_data.getvalue())

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    icons_dir = os.path.join(os.path.dirname(script_dir), 'icons')
    
    print("Generating app icons from icon_master.png and icon_master_logo.png...")
    print("=" * 50)
    icon = load_source_image()
    logo = load_logo_image()
    generate_all_icons(icon, logo, icons_dir)
    print("=" * 50)
    print("All icons generated successfully!")