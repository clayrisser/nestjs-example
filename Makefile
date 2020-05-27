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
	@prisma generate
	# @__NESTJS_ONLY_GENERATE=1 nest start
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
build: node_modules/.tmp/coverage/lcov.info
	@(MAKE) -s +build
+build: dist
dist: $(shell $(GIT) ls-files)
	-@$(RM) -r dist node_modules/.tmp/dist 2>/dev/null || true
	@nest build
	@$(MKDIRP) node_modules/.tmp
	@$(MV) dist node_modules/.tmp/dist
	@$(CP) -r node_modules/.tmp/dist/src/. dist

.PHONY: start +start
start: install env +generate seed
	@$(MAKE) -s +start
+start:
	@nest start $(ARGS)

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
	@ts-node prisma/seed.ts

.PHONY: database
database:
	@docker-compose -f docker/docker-compose.yaml up postgres

.PHONY: keycloak
keycloak:
	@docker-compose -f docker/docker-compose.yaml up keycloak

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
	@docker run --rm -it --entrypoint /bin/sh $(IMAGE):latest

.PHONY: docker-up +docker-up
docker-up: docker-build
	@$(MAKE) -s +docker-up
+docker-up:
	@docker-compose -f docker/docker-compose.yaml up

.PHONY: docker-clean
docker-clean:
	-@docker rm -f $(shell docker ps -aq) 2>/dev/null
	-@docker volume rm data-$(NAME) 2>/dev/null

.PHONY: env
env: .env
.env:
	@cp example.env .env

%:
	@
