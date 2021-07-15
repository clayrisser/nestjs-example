# File: /prisma/Makefile
# Project: example-graphback-nestjs
# File Created: 14-07-2021 12:41:17
# Author: Clay Risser <email@clayrisser.com>
# -----
# Last Modified: 14-07-2021 20:33:01
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

export MAKE_CACHE := $(shell pwd)/../node_modules/.make_prisma
include ../blackmagic.mk

NODE_MODULES_BIN := ../node_modules/.bin
BABEL_NODE := $(NODE_MODULES_BIN)/babel-node
GENERATE_PRISMA := $(NODE_MODULES_BIN)/generate-prisma
PRISMA := $(NODE_MODULES_BIN)/prisma
TS_NODE := $(NODE_MODULES_BIN)/ts-node
WAIT_FOR_POSTGRES := $(NODE_MODULES_BIN)/wait-for-postgres

.PHONY: deploy
deploy: postgres
	@export PATH="$(NODE_MODULES_BIN):$(PATH)" && \
		$(PRISMA) migrate deploy --preview-feature $(ARGS)

.PHONY: dev
dev: postgres deploy
	@export PATH="$(NODE_MODULES_BIN):$(PATH)" && \
		echo y | $(PRISMA) migrate dev --preview-feature $(ARGS)
	@$(MAKE) -s seed

.PHONY: reset
reset: postgres
	@export PATH="$(NODE_MODULES_BIN):$(PATH)" && \
		echo y | $(PRISMA) migrate reset --preview-feature $(ARGS)

.PHONY: env
env: .env
.env: ../.env
	@$(GENERATE_PRISMA) ..
../.env:
	@$(MAKE) -s -C .. env

.PHONY: pull
pull:
	@$(PRISMA) db pull

.PHONY: push
push:
	@$(PRISMA) db push

.PHONY: format
format:
	@$(PRISMA) format

.PHONY: studio
studio:
	@$(PRISMA) studio $(ARGS)

.PHONY: generate
generate:
	@$(PRISMA) generate $(ARGS)

.PHONY: seed
seed:
	@export PATH="$(NODE_MODULES_BIN):$(PATH)" && \
		$(PRISMA) db seed --preview-feature $(ARGS)

.PHONY: postgres
postgres: env
	@$(MAKE) -s -C ../docker postgres ARGS="-d"
	@$(WAIT_FOR_POSTGRES)

.PHONY: %
%: ;
