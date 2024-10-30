import os
import glob
from PIL import Image
import torch
import torchvision.transforms as transforms
from torchvision.models import resnet50
import numpy as np
import pickle

def extract_features(image_dirs):
    current_dir = os.getcwd()
    print(f"Current directory: {current_dir}")

    # GPU 사용 가능 여부 확인
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # 색상별 이미지 디렉토리 탐색
    all_features = {}

    for color, dir_path in image_dirs.items():
        print(f"Processing directory: {dir_path}")
        img_paths = glob.glob(os.path.join(current_dir, dir_path, '*.png'))
        if not img_paths:
            print(f"No images found in {dir_path}")
            continue
        
        # ResNet50 모델 로드 및 GPU로 이동
        model = resnet50(pretrained=True).to(device)
        model = model.eval()

        # 이미지 전처리
        preprocess = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

        # 이미지 특징 추출 및 저장
        features = []
        for img_path in img_paths:
            img = Image.open(img_path).convert('RGB')
            img_tensor = preprocess(img).unsqueeze(0).to(device)
            with torch.no_grad():
                feature = model(img_tensor).squeeze().cpu().numpy()
            features.append(feature)

            # 특징 추출 성공 여부 확인
            if np.any(np.isnan(feature)):
                print(f"Error extracting features from {img_path}: NaN values encountered.")
            elif np.any(np.isinf(feature)):
                print(f"Error extracting features from {img_path}: Infinite values encountered.")

        all_features[color] = np.array(features)

    # 특징 벡터 저장
    with open('pants_image_features.pkl', 'wb') as f:
        pickle.dump(all_features, f)

    print("Feature vectors have been saved.")

if __name__ == "__main__":
    # 이미지 디렉토리 설정
    image_dirs = {
        "black": "img2/pants_img/black_images",
        "white": "img2/pants_img/white_images",
        "grey": "img2/pants_img/grey_images",
        "red": "img2/pants_img/red_images",
        "yellow": "img2/pants_img/yellow_images",
        "green": "img2/pants_img/green_images",
        "blue": "img2/pants_img/blue_images",
        "pink": "img2/pants_img/pink_images",
    }

    # 이미지 특징 추출
    extract_features(image_dirs)
