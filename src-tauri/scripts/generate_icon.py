#!/usr/bin/env python3
"""Generate LaunchPro app icon - Youthful & Sunny version"""

from PIL import Image, ImageDraw
import os

def create_icon(size=1024):
    """Create a youthful, energetic app icon for LaunchPro"""
    
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    padding = size // 12
    
    # 青春阳光的配色 - 橙色到黄色的活力渐变
    # 顶部：温暖的橙色，底部：明亮的黄色
    top_color = (251, 146, 60)      # Orange-400
    bottom_color = (250, 204, 21)   # Yellow-400
    accent_color = (239, 68, 68)    # Red-500 for highlights
    
    corner_radius = size // 6
    box_size = size - 2 * padding
    
    # 绘制渐变背景
    for i in range(box_size):
        ratio = i / box_size
        r = int(top_color[0] * (1 - ratio) + bottom_color[0] * ratio)
        g = int(top_color[1] * (1 - ratio) + bottom_color[1] * ratio)
        b = int(top_color[2] * (1 - ratio) + bottom_color[2] * ratio)
        
        y = padding + i
        draw.rounded_rectangle(
            [padding, y, size - padding, y + 1],
            radius=0,
            fill=(r, g, b, 255)
        )
    
    # 重新绘制圆角矩形来裁剪边缘
    mask = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle(
        [padding, padding, size - padding, size - padding],
        radius=corner_radius,
        fill=(255, 255, 255, 255)
    )
    
    # 应用蒙版
    img = Image.alpha_composite(Image.new('RGBA', (size, size), (0, 0, 0, 0)), img)
    img.putalpha(mask.split()[3])
    
    # 重新创建绘图对象
    draw = ImageDraw.Draw(img)
    
    # 绘制白色的"P"字母（代表 LaunchPro）
    white = (255, 255, 255, 255)
    
    # 计算P字母的尺寸和位置
    p_width = box_size * 0.45
    p_height = box_size * 0.55
    p_x = (size - p_width) / 2
    p_y = (size - p_height) / 2
    
    stroke_width = max(size // 25, 4)
    
    # P的竖线
    line_x = p_x + p_width * 0.15
    draw.rounded_rectangle(
        [line_x, p_y, line_x + stroke_width, p_y + p_height],
        radius=stroke_width // 2,
        fill=white
    )
    
    # P的头部弧线（用圆角矩形模拟）
    head_height = p_height * 0.45
    head_width = p_width * 0.75
    head_x = line_x
    head_y = p_y
    
    # 外框
    draw.rounded_rectangle(
        [head_x, head_y, head_x + head_width, head_y + head_height],
        radius=head_height // 2,
        fill=white
    )
    
    # 内部镂空（使用背景色）
    inner_padding = stroke_width
    inner_color = (251, 146, 60)  # 与顶部颜色一致
    draw.rounded_rectangle(
        [head_x + inner_padding, head_y + inner_padding, 
         head_x + head_width - inner_padding, head_y + head_height - inner_padding],
        radius=(head_height - 2 * inner_padding) // 2,
        fill=inner_color
    )
    
    # 添加一些小装饰 - 右上角的小星星
    star_size = size // 20
    star_x = size - padding - size // 8
    star_y = padding + size // 8
    draw_star(draw, star_x, star_y, star_size, white)
    
    return img

def draw_star(draw, cx, cy, size, color):
    """Draw a simple 4-point star"""
    # 简化为一个菱形/十字星
    half = size // 2
    # 垂直线
    draw.rounded_rectangle(
        [cx - size//6, cy - half, cx + size//6, cy + half],
        radius=size//12,
        fill=color
    )
    # 水平线
    draw.rounded_rectangle(
        [cx - half, cy - size//6, cx + half, cy + size//6],
        radius=size//12,
        fill=color
    )

def generate_all_icons(base_img, icons_dir):
    """Generate all required icon sizes for Tauri"""
    
    # 定义所有需要的尺寸
    icon_sizes = {
        'icon.png': 1024,
        'icon.ico': 256,
        '32x32.png': 32,
        '64x64.png': 64,
        '128x128.png': 128,
        '128x128@2x.png': 256,
        'Square30x30Logo.png': 30,
        'Square44x44Logo.png': 44,
        'Square71x71Logo.png': 71,
        'Square89x89Logo.png': 89,
        'Square107x107Logo.png': 107,
        'Square142x142Logo.png': 142,
        'Square150x150Logo.png': 150,
        'Square284x284Logo.png': 284,
        'Square310x310Logo.png': 310,
        'StoreLogo.png': 50,
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
    for filename, s in icon_sizes.items():
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
            resized = base_img.resize((s, s), Image.Resampling.LANCZOS)
            resized.save(os.path.join(icons_dir, filename))
            print(f"  Generated: {filename} ({s}x{s})")
    
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
    icons_dir = os.path.join(script_dir, 'src-tauri', 'icons')
    
    print("Generating youthful LaunchPro icons...")
    print("=" * 50)
    icon = create_icon(1024)
    generate_all_icons(icon, icons_dir)
    print("=" * 50)
    print("All icons generated successfully!")