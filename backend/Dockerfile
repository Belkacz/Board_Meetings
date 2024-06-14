FROM python:3.10

WORKDIR /code

COPY ./fastApi_backend/requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./fastApi_backend/ /code/app

WORKDIR /code/app/fastApi_backend

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
