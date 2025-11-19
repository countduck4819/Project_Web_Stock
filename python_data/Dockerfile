FROM python:3.10

# Tăng tốc cho TensorFlow
ENV DEBIAN_FRONTEND=noninteractive

# Install system libs TensorFlow cần
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    libatlas-base-dev \
    gfortran \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements sớm để tối ưu cache
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ project python
COPY . .

EXPOSE 6060

CMD ["python", "server.py"]
