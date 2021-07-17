# File: /Makefile
# Project: example-graphback-nestjs
# File Created: 24-06-2021 04:03:49
# Author: Clay Risser <email@clayrisser.com>
# -----
# Last Modified: 16-07-2021 18:05:14
# Modified By: Clay Risser <email@clayrisser.com>
# -----
# Silicon Hills LLC (c) Copyright 2021
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

export MAKE_CACHE := $(shell pwd)/node_modules/.make
export PARENT := true
include blackmagic.mk

BABEL ?= node_modules/.bin/babel
BABEL_NODE ?= node_modules/.bin/babel-node
CLOC ?= cloc
CSPELL ?= node_modules/.bin/cspell
ESLINT ?= node_modules/.bin/eslint
JEST ?= node_modules/.bin/jest
LOCKFILE_LINT ?= node_modules/.bin/lockfile-lint
MAJESTIC ?= node_modules/.bin/majestic
NODEMON := node_modules/.bin/nodemon
PRETTIER ?= node_modules/.bin/prettier
PRISMA ?= node_modules/.bin/prisma
TMP_DIR ?= node_modules/.tmp
TSC ?= node_modules/.bin/tsc
WAIT_FOR_POSTGRES ?= node_modules/.bin/wait-for-postgres
COLLECT_COVERAGE_FROM := ["src/**/*.{js,jsx,ts,tsx}"]

.PHONY: all
all: build

ACTIONS += install
INSTALL_DEPS := $(patsubst %,$(DONE)/_install/%,package.json)
$(ACTION)/install:
	@$(NPM) install $(ARGS)
	@$(call done,install)

ACTIONS += format~install
FORMAT_DEPS := $(call deps,format,$(shell $(GIT) ls-files 2>$(NULL) | \
	grep -E "\.((json)|(ya?ml)|(md)|([jt]sx?))$$"))
$(ACTION)/format:
#	@for i in $$($(call get_deps,format)); do echo $$i | \
#		grep -E "\.[jt]sx?$$"; done | xargs $(ESLINT) --fix >/dev/null ||true
	@$(PRETTIER) --write $(shell $(call get_deps,format))
	@$(call done,format)

ACTIONS += spellcheck~format
SPELLCHECK_DEPS := $(call deps,spellcheck,$(shell $(GIT) ls-files 2>$(NULL) | \
	$(GIT) ls-files | grep -E "\.(md)$$"))
$(ACTION)/spellcheck:
	@mkdir -p $(TMP_DIR)
	@echo '{"language":"en","version":"0.1","words":$(shell cat .vscode/settings.json | $(SED) 's|^\s*//.*||g' | jq ".[\"cSpell.words\"]")}' > \
		$(TMP_DIR)/cspellrc.json
	-@$(CSPELL) --config $(TMP_DIR)/cspellrc.json $(shell $(call get_deps,spellcheck))
	@$(call done,spellcheck)

ACTIONS += generate~spellcheck
GENERATE_DEPS := $(call deps,generate,$(shell $(GIT) ls-files 2>$(NULL) | \
	grep -E "\.([jt]sx?)$$"))
GENERATE_TARGET := src/generated/type-graphql/index.ts
src/generated/type-graphql/index.ts:
	@$(MAKE) -s _generate
	@rm -rf $(ACTION)/generate $(NOFAIL)
$(ACTION)/generate:
	@$(MAKE) -s prisma-generate
	@$(call done,generate)

ACTIONS += lint~generate
LINT_DEPS := $(call deps,lint,$(shell $(GIT) ls-files 2>$(NULL) | \
	grep -E "\.([jt]sx?)$$"))
$(ACTION)/lint:
#	-@$(LOCKFILE_LINT) --type npm --path package-lock.json --validate-https
	-@$(ESLINT) -f json -o node_modules/.tmp/eslintReport.json $(shell $(call get_deps,lint)) $(NOFAIL)
	-@$(ESLINT) $(shell $(call get_deps,lint))
	@$(call done,lint)

ACTIONS += test~lint
TEST_DEPS := $(call deps,test,$(shell $(GIT) ls-files 2>$(NULL) | \
	grep -E "\.([jt]sx?)$$"))
$(ACTION)/test:
	-@$(JEST) --pass-with-no-tests --json --outputFile=node_modules/.tmp/jestTestResults.json --coverage \
		--coverageDirectory=node_modules/.tmp/coverage --testResultsProcessor=jest-sonar-reporter \
		--collectCoverageFrom='$(COLLECT_COVERAGE_FROM)' --findRelatedTests $(shell $(call get_deps,test))
	@$(call done,test)

ACTIONS += build~test
BUILD_DEPS := $(call deps,build,$(shell $(GIT) ls-files 2>$(NULL) | \
	grep -E "\.([jt]sx?)$$"))
BUILD_TARGET := dist/main.js
dist/main.js:
	@$(MAKE) -s _build
	@rm -rf $(ACTION)/build $(NOFAIL)
$(ACTION)/build:
	@$(BABEL) --env-name umd src -d dist --extensions '.js,.jsx,.ts,.tsx' --source-maps
	@$(BABEL) --env-name esm src -d es --extensions '.js,.jsx,.ts,.tsx' --source-maps
	-@$(TSC) -p tsconfig.build.json -d --emitDeclarationOnly
	@$(call done,build)

.PHONY: prepare
prepare: ;

.PHONY: upgrade
upgrade:
	@$(NPM) upgrade --latest

.PHONY: inc
inc:
	@npm version patch --git=false $(NOFAIL)

.PHONY: count
count:
	@LC_ALL=C $(CLOC) $(shell $(GIT) ls-files)

.PHONY: publish +publish
publish: build
	@$(MAKE) -s +publish
+publish:
	@$(NPM) publish

.PHONY: pack +pack
pack: build
	@$(MAKE) -s +pack
+pack:
	@$(NPM) pack

.PHONY: coverage
coverage: ~lint
	@$(MAKE) -s +coverage
+coverage:
	@$(JEST) --coverage --collectCoverageFrom='$(COLLECT_COVERAGE_FROM)' $(ARGS)

.PHONY: test-ui
test-ui: ~lint
	@$(MAKE) -s +test-ui
+test-ui:
	@$(MAJESTIC) $(ARGS)

.PHONY: test-watch
test-watch: ~lint
	@$(MAKE) -s +test-watch
+test-watch:
	@$(JEST) --watch $(ARGS)

.PHONY: start +start
start: env ~generate prisma-dev ~deps
	@$(MAKE) -s +start
+start:
	@$(NODEMON) --exec $(BABEL_NODE) --extensions '.ts,.tsx' src/main.ts

.PHONY: clean
clean:
	-@$(call clean)
	-@$(JEST) --clearCache $(NOFAIL)
	-@$(GIT) clean -fXd \
		-e $(BANG)/node_modules \
		-e $(BANG)/node_modules/**/* \
		-e $(BANG)/package-lock.json \
		-e $(BANG)/pnpm-lock.yaml \
		-e $(BANG)/yarn.lock $(NOFAIL)
	-@rm -rf node_modules/.cache $(NOFAIL)
	-@rm -rf node_modules/.tmp $(NOFAIL)

.PHONY: purge
purge: clean
	-@$(GIT) clean -fXd

-include $(patsubst %,$(_ACTIONS)/%,$(ACTIONS))

.PHONY: +%
+%:
	@$(MAKE) -s $(shell echo $@ | $(SED) 's/^\+//g')

.PHONY: docker-%
docker-%:
	@$(MAKE) -s -C docker $(shell echo $@ | sed "s/docker-//")

.PHONY: prisma-%
prisma-%:
	@$(MAKE) -s -C prisma $(shell echo $@ | sed "s/prisma-//")

.PHONY: env
env: .env
.env: example.env
	@cp $< $@

.PHONY: ~deps keycloak logs postgres redis stop up studio seed
~deps: docker-~deps
keycloak: docker-keycloak
logs: docker-logs
postgres: prisma-postgres
redis: docker-redis
seed: prisma-seed
stop: docker-stop
stop: docker-stop
studio: env prisma-studio
up: docker-up

.PHONY: %
%: ;

CACHE_ENVS += \
	BABEL \
	BABEL_NODE \
	CLOC \
	CSPELL \
	ESLINT \
	JEST \
	LOCKFILE_LINT \
	MAJESTIC \
	PRETTIER \
	TMP_DIR \
	TSC
