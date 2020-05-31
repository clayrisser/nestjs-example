include node_modules/gnumake/gnumake.mk

COLLECT_COVERAGE_FROM := ["src/**/*.{js,jsx,ts,tsx}"]
NAME := $(shell node -e "console.log(require('./package.json').name)")
USERNAME := $(shell node -e "console.log(require('./package.json').docker.username)")
VERSION := $(shell node -e "console.log(require('./package.json').version)")
IMAGE := $(USERNAME)/$(NAME)
MAJOR := $(shell echo $(VERSION) | cut -d. -f1)
MINOR := $(shell echo $(VERSION) | cut -d. -f2)
PATCH := $(shell echo $(VERSION) | cut -d. -f3)

.PHONY: all
all: build

.PHONY: install
install: node_modules
node_modules: package.json
	@$(NPM) install

.PHONY: prepare
prepare:
	@

.PHONY: format +format
format: install
	@$(MAKE) -s +format
+format:
	-@eslint --fix --ext .js,.jsx,.ts,.tsx . >$(NULL)
	@prettier --write ./**/*.{json,md,scss,yaml,yml,js,jsx,ts,tsx}
	@$(MKDIRP) node_modules/.make && $(TOUCH) -m node_modules/.make/format
node_modules/.make/format: $(shell $(GIT) ls-files | $(GREP) "\.(j|t)sx?$$")
	@$(MAKE) -s format

.PHONY: spellcheck +spellcheck
spellcheck: node_modules/.make/format
	@$(MAKE) -s +spellcheck
+spellcheck:
	-@cspell --config .cspellrc src/**/*.ts
	@$(MKDIRP) node_modules/.make && $(TOUCH) -m node_modules/.make/spellcheck
node_modules/.make/spellcheck: $(shell $(GIT) ls-files | $(GREP) "\.(j|t)sx?$$")
	-@$(MAKE) -s spellcheck

.PHONY: generate +generate
generate: node_modules/.make/spellcheck .env
	@$(MAKE) -s +generate
+generate:
	@sh prisma/scripts/generate.sh
	@$(MKDIRP) node_modules/.make && $(TOUCH) -m node_modules/.make/generate
node_modules/.make/generate: $(shell $(GIT) ls-files prisma | $(GREP) "\.(j|t)sx?$$")
	-@$(MAKE) -s generate

.PHONY: lint +lint
lint: node_modules/.make/generate
	@$(MAKE) -s +lint
+lint:
	# @lockfile-lint --type npm --path package-lock.json --validate-https
	-@eslint -f json -o node_modules/.tmp/eslintReport.json --ext .js,.jsx,.ts,.tsx . 2>$(NULL)
	-@eslint --ext .js,.jsx,.ts,.tsx .
	-@tsc --allowJs --noEmit
node_modules/.tmp/eslintReport.json: $(shell $(GIT) ls-files | $(GREP) "\.(j|t)sx?$$")
	-@$(MAKE) -s lint

.PHONY: test +test
test: node_modules/.tmp/eslintReport.json
	@$(MAKE) -s +test
+test:
	@jest --json --outputFile=node_modules/.tmp/jestTestResults.json --coverage --coverageDirectory=node_modules/.tmp/coverage --testResultsProcessor=jest-sonar-reporter --collectCoverageFrom='$(COLLECT_COVERAGE_FROM)' $(ARGS)
node_modules/.tmp/coverage/lcov.info: $(shell $(GIT) ls-files | $(GREP) "\.(j|t)sx?$$")
	-@$(MAKE) -s test

.PHONY: coverage +coverage
coverage: node_modules/.tmp/eslintReport.json
	@$(MAKE) -s +coverage
+coverage:
	@jest --coverage --collectCoverageFrom='$(COLLECT_COVERAGE_FROM)' $(ARGS)

.PHONY: test-ui
test-ui: node_modules/.tmp/eslintReport.json node_modules
	@$(MAKE) -s +test-ui
+test-ui:
	@majestic $(ARGS)

.PHONY: test-watch
test-watch: node_modules/.tmp/eslintReport.json node_modules
	@$(MAKE) -s +test-watch
+test-watch:
	@jest --watch $(ARGS)

.PHONY: clean
clean: docker-clean
	-@jest --clearCache
ifeq ($(PLATFORM), win32)
	@$(GIT) clean -fXd -e !/node_modules -e !/node_modules/**/* -e !/yarn.lock -e !/pnpm-lock.yaml -e !/package-lock.json -e !/.env
else
	@$(GIT) clean -fXd -e \!/node_modules -e \!/node_modules/**/* -e \!/yarn.lock -e \!/pnpm-lock.yaml -e \!/package-lock.json -e !/.env
endif
	-@$(RM) -rf node_modules/.cache
	-@$(RM) -rf node_modules/.make
	-@$(RM) -rf node_modules/.tmp
	-@watchman watch-del-all

.PHONY: build +build
build: .env node_modules/.tmp/coverage/lcov.info
	@$(MAKE) -s +build
+build: dist
dist: $(shell $(GIT) ls-files)
	@nest build

.PHONY: start +start
start: install env +generate
	@$(MAKE) -s +start
+start:
	@docker-compose -f docker/docker-compose.yaml up -d deps
	@$(MAKE) -s seed
	@nest build --webpack --webpackPath webpack-hmr.config.js

.PHONY: purge
purge: clean
	@$(GIT) clean -fXd

.PHONY: report
report: spellcheck lint test
	@

.PHONY: prisma-up
prisma-up:
	@prisma migrate up --experimental

.PHONY: prisma-save
prisma-save:
	@prisma migrate save --experimental

.PHONY: prisma-studio
prisma-studio:
	@prisma studio --experimental

.PHONY: prisma-generate-watch
prisma-generate-watch:
	@prisma generate --watch

.PHONY: seed +seed
seed: prisma-up
	@$(MAKE) -s +seed
+seed:
	@sh prisma/scripts/wait-for-postgres.sh
	@ts-node prisma/seed.ts

.PHONY: postgres
postgres:
	@docker-compose -f docker/docker-compose.yaml up postgres

.PHONY: keycloak
keycloak:
	@docker-compose -f docker/docker-compose.yaml up keycloak

.PHONY: deps
deps:
	@docker-compose -f docker/docker-compose.yaml up deps

.PHONY: docker-build
docker-build:
	@docker-compose -f docker/docker-build.yaml build

.PHONY: docker-pull
docker-pull:
	@docker-compose -f docker/docker-build.yaml pull

.PHONY: docker-push
docker-push: docker-build
	@docker-compose -f docker/docker-build.yaml push

.PHONY: docker-ssh
docker-ssh: docker-build
	@docker ps | grep appsaas-core$ >$(NULL) 2>&1 && \
		docker exec -it appsaas-core /bin/sh|| \
		docker run --rm -it --entrypoint /bin/sh $(IMAGE):latest

.PHONY: docker-up +docker-up
docker-up: docker-build
	@$(MAKE) -s +docker-up
+docker-up:
	@docker-compose -f docker/docker-compose.yaml up

.PHONY: stop
stop:
	@docker-compose -f docker/docker-compose.yaml stop

.PHONY: docker-clean
docker-clean:
	-@docker-compose -f docker/docker-compose.yaml kill
	-@docker-compose -f docker/docker-compose.yaml down
	-@docker volume rm \
		postgres-$(NAME) \
		redis-$(NAME) \
		2>$(NULL)

.PHONY: env
env: .env
.env:
	@cp example.env .env

%:
	@
