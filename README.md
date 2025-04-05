# WebRecorder
A simple web-based WAV recorder
## 介紹
- 錄音並下載 .wav 音檔
- 前端使用HTML+Javascript
- 後端使用Flask處理wav轉檔
- WSGI server使用Gunicorn
- 可透過如Nginx幫助部署 (Ex. 部署在AWS EC2上)
- 可搭配ngrok幫助測試 (JS錄音的getUserMedia需HTTPS存取麥克風權限)
## 安裝&執行
- Python package (python 3.10)
```bash
pip install -r requirements.txt
```
- 安裝ffmpeg (pydub轉檔需要, windows要自己去下載安裝)
```
sudo apt-get install ffmpeg
```
- 執行
```
gunicorn -w 4 -b 127.0.0.1:8000 recorder:app
```
- 若出現gunicorn: command not found
- 找到gunicorn安裝位置(可用which gunicorn找)
```
export PATH=$PATH:gunicorn安裝位置
```
## Docker化
- 包含flask, gunicorn, ffmpeg
- 建立image
```
docker build -t web-recorder .
```
- Or pull image from my docker hub
```
docker pull s110062516/web-recorder:v1.0
```
- 執行container
```
docker run -d -p 8000:8000 --name WebRecorder web-recorder
```
##
