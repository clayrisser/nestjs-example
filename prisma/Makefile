# File: /prisma/Makefile
# Project: example-nestjs
# File Created: 06-12-2021 08:30:36
# Author: Clay Risser <email@clayrisser.com>
# -----
# Last Modified: 02-01-2022 06:48:13
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

include ../mkpm.mk
ifneq (,$(MKPM_READY))
include $(MKPM)/gnu
-include ../.env

NODE_MODULES_BIN := ../node_modules/.bin
BABEL_NODE := $(NODE_MODULES_BIN)/babel-node
GENERATE_PRISMA := $(NODE_MODULES_BIN)/generate-prisma
PRISMA := $(NODE_MODULES_BIN)/prisma
TS_NODE := $(NODE_MODULES_BIN)/ts-node
WAIT_FOR_POSTGRES := $(NODE_MODULES_BIN)/wait-for-postgres

.PHONY: deploy
deploy: $(DATABASE_ENGINE) ##
ifneq ($(DATABASE_ENGINE),none)
	@$(EXPORT) PATH="$(NODE_MODULES_BIN):$(PATH)" && \
		$(PRISMA) migrate deploy $(ARGS)
	@$(MAKE) -s seed
endif

.PHONY: dev
dev: $(DATABASE_ENGINE) deploy ##
ifneq ($(DATABASE_ENGINE),none)
	@$(EXPORT) PATH="$(NODE_MODULES_BIN):$(PATH)" && \
		$(ECHO) y | $(PRISMA) migrate dev --skip-generate $(ARGS)
endif

.PHONY: reset
reset: $(DATABASE_ENGINE) ##
	@$(EXPORT) PATH="$(NODE_MODULES_BIN):$(PATH)" && \
		$(ECHO) y | $(PRISMA) migrate reset $(ARGS)

.PHONY: squash
squash: ##
	@$(RM) -rf migrations $(NOFAIL)
	@$(MAKE) -s reset
	@$(MAKE) -s dev

.PHONY: env
env: .env ## generate .env
.env: ../.env
	@$(GENERATE_PRISMA) ..
../.env:
	@$(MAKE) -s -C .. env

.PHONY: pull
pull: $(DATABASE_ENGINE) ##
	@$(PRISMA) db pull

.PHONY: push
push: $(DATABASE_ENGINE) ##
	@$(PRISMA) db push

.PHONY: format
format: ##
	@$(PRISMA) format

.PHONY: studio
studio: $(DATABASE_ENGINE) ##
	@$(PRISMA) studio $(ARGS)

.PHONY: generate
generate: postgres ##
	@$(PRISMA) generate $(ARGS)

.PHONY: seed
seed: $(DATABASE_ENGINE) ##
	@export PATH="$(NODE_MODULES_BIN):$(PATH)" && \
		$(PRISMA) db seed $(ARGS)

.PHONY: postgres
postgres: .env ##
	@$(MAKE) -s -C ../docker postgres-d
	@$(WAIT_FOR_POSTGRES)

.PHONY: none
none:
	@$(ECHO) NO DATABASE ENGINE

endif
