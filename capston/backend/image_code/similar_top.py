import os
import glob
from PIL import Image
import torch
import torchvision.transforms as transforms
from torchvision.models import resnet50
import numpy as np
import pickle
from sklearn.metrics.pairwise import cosine_similarity


def find_most_similar_images(target_image_path, feature_file, image_dirs):
    # GPU 사용 가능 여부 확인
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # ResNet50 모델 로드 및 GPU로 이동
    model = resnet50(pretrained=True)
    model = torch.nn.Sequential(*list(model.children())[:-2]).to(device)
    model = model.eval()

    # 이미지 전처리
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    # 타겟 이미지 특징 추출
    img = Image.open(target_image_path).convert('RGB')
    img_tensor = preprocess(img).unsqueeze(0).to(device)
    with torch.no_grad():
        target_feature = model(img_tensor).view(-1).cpu().numpy()

    # 특징 벡터를 2차원 배열로 변환
    target_feature = target_feature.reshape(1, -1)

    # 피클 파일에서 모든 이미지 특징 불러오기
    with open(feature_file, 'rb') as f:
        all_features = pickle.load(f)

    similarities = []
    image_paths = []

    # 색상별로 구분된 경우
    if isinstance(image_dirs, dict):
        # 색상별 폴더가 있을 때
        for color, features in all_features.items():
            img_paths = glob.glob(os.path.join(image_dirs[color], '*.*'))

            for img_path, feature in zip(img_paths, features):
                if isinstance(feature, (list, np.ndarray)):
                    feature = np.array(feature).reshape(1, -1)

                    # 유사도 계산
                    similarity = cosine_similarity(target_feature, feature)[0][0]
                    similarities.append(similarity)
                    image_paths.append(img_path)
                else:
                    print(f"Skipping non-numeric feature for image: {img_path}, feature: {feature}")
    else:
        # 색상 구분 없이 단일 폴더에서 이미지를 가져오는 경우
        img_paths = glob.glob(os.path.join(image_dirs, '*.*'))

        for img_path, feature in zip(img_paths, all_features):
            if isinstance(feature, (list, np.ndarray)):
                feature = np.array(feature).reshape(1, -1)

                # 유사도 계산
                similarity = cosine_similarity(target_feature, feature)[0][0]
                similarities.append(similarity)
                image_paths.append(img_path)
            else:
                print(f"Skipping non-numeric feature for image: {img_path}, feature: {feature}")

    # 유사도 순으로 정렬
    sorted_indices = np.argsort(similarities)[::-1]
    top_5_indices = sorted_indices[:15]

    # 유사한 이미지 경로만 반환
    top_5_images = [image_paths[idx] for idx in top_5_indices]

    return top_5_images


if __name__ == "__main__":
    # 이미지 디렉토리 설정 (색상별로 구분된 예시)
    image_dirs = {
        "black": "img2/top_img/black_images",
        "white": "img2/top_img/white_images",
        "grey": "img2/top_img/grey_images",
        "red": "img2/top_img/red_images",
        "yellow": "img2/top_img/yellow_images",
        "green": "img2/top_img/green_images",
        "blue": "img2/top_img/blue_images",
        "pink": "img2/top_img/pink_images",
    }

    # 타겟 이미지 경로
    target_image_path = "test_img.jpg"

    # 특징 파일 경로 (피클 파일 경로)
    feature_file = "top_image_features.pkl"

    # 유사한 이미지 찾기
    similar_images = find_most_similar_images(target_image_path, feature_file, image_dirs)
    print(similar_images)
