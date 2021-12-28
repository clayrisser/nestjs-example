# File: /Makefile
# Project: openldap-sync
# File Created: 13-11-2021 02:41:09
# Author: Clay Risser
# -----
# Last Modified: 28-12-2021 05:50:39
# Modified By: Clay Risser <email@clayrisser.com>
# -----
# BitSpur, Inc. (c) Copyright 2021
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

include mkpm.mk
ifneq (,$(MKPM_READY))
include $(MKPM)/gnu
include $(MKPM)/mkchain
include $(MKPM)/yarn
include config.mk
-include .env

ACTIONS += install
$(ACTION)/install: $(PROJECT_ROOT)/package.json package.json
ifneq (,$(SUBPROC))
	@$(MAKE) -C $(PROJECT_ROOT) \~install ARGS=$(ARGS)
else
	@$(YARN) workspaces focus $(ARGS)
endif
	@$(call done,install)

ACTIONS += format~install ##
$(ACTION)/format: $(call git_deps,\.((json)|(md)|([jt]sx?))$$)
	-@$(call prettier,$?,$(ARGS))
	@$(call done,format)

ACTIONS += spellcheck~format ##
$(ACTION)/spellcheck: $(call git_deps,\.(md)$$)
	-@$(call cspell,$?,$(ARGS))
	@$(call done,spellcheck)

ACTIONS += generate~spellcheck ##
$(ACTION)/generate: $(call git_deps,\.([jt]sx?)$$)
	@$(MAKE) -s prisma-generate
	@$(call done,generate)
src/generated/type-graphql/index.ts:
	@$(call reset,generate)

ACTIONS += lint~generate ##
$(ACTION)/lint: $(call git_deps,\.([jt]sx?)$$)
	-@$(call eslint,$?,$(ARGS))
	@$(call done,lint)

ACTIONS += test~lint ##
$(ACTION)/test: $(call git_deps,\.([jt]sx?)$$)
	-@$(call jest,$?,$(ARGS))
	@$(call done,test)

.PHONY: start +start
start: | ~install prisma-dev docker-dev-d +start ##
+start: ##
	@$(BABEL_NODE) -x .ts src/main.ts $(ARGS)

COLLECT_COVERAGE_FROM := ["src/**/*.{js,jsx,ts,tsx}"]
.PHONY: coverage +coverage
coverage: | ~lint +coverage
+coverage:
	@$(JEST) --coverage --collectCoverageFrom='$(COLLECT_COVERAGE_FROM)' $(ARGS)

.PHONY: prepare
prepare: ;

.PHONY: upgrade
upgrade:
ifeq ($(NPM),yarn)
	@$(NPM) upgrade-interactive
else
	@$(NPM) upgrade -L
endif

.PHONY: inc
inc:
	@npm version patch --git=false $(NOFAIL)

.PHONY: count
count:
	@$(CLOC) $(shell $(GIT) ls-files)

.PHONY: env
env: .env
.env: example.env
	$(CP) $< $@

.PHONY: docker-%
docker-%:
	@$(MAKE) -sC docker $(subst docker-,,$@) ARGS=$(ARGS)

.PHONY: prisma-%
prisma-%:
	@$(MAKE) -sC prisma $(subst prisma-,,$@) ARGS=$(ARGS)

.PHONY: clean
clean: docker-down ##
	-@$(MKCACHE_CLEAN)
	-@$(JEST) --clearCache $(NOFAIL)
	-@$(GIT) clean -fXd \
		$(MKPM_GIT_CLEAN_FLAGS) \
		$(YARN_GIT_CLEAN_FLAGS) \
		$(NOFAIL)

-include $(call actions)

endif
