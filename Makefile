DOCKER_FOLDER=./.docker

copy-env:
	copy .env.example .env

install:
	npm ci

docker-up:
	cd ${DOCKER_FOLDER} && docker-compose up -d

docker-down:
	cd ${DOCKER_FOLDER} && docker-compose down

pre-install: copy-env install