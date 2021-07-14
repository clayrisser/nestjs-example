# File: /prisma/Makefile
# Project: example-graphback-nestjs
# File Created: 14-07-2021 12:41:17
# Author: Clay Risser <email@clayrisser.com>
# -----
# Last Modified: 14-07-2021 12:41:37
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

include ../blackmagic.mk

BABEL_NODE := ../node_modules/.bin/babel-node
GENERATE_PRISMA := ../node_modules/.bin/generate-prisma
PRISMA := ../node_modules/.bin/prisma
WAIT_FOR_POSTGRES := ../node_modules/.bin/wait-for-postgres

.PHONY: deploy
deploy: generate postgres migrations/*/migration.sql
	@$(PRISMA) migrate deploy --preview-feature

.PHONY: dev
dev: postgres env
	@echo | $(PRISMA) migrate dev --preview-feature $(ARGS)
	@$(MAKE) -s patch

.PHONY: env
env: .env
.env: ../.env
	@$(GENERATE_PRISMA) ..
../.env:
	@$(MAKE) -s -C .. env

.PHONY: introspect
introspect:
	@$(PRISMA) introspect

.PHONY: format
format:
	@$(PRISMA) format

.PHONY: studio
studio:
	@$(PRISMA) studio

.PHONY: generate
generate:
	@$(PRISMA) generate
	@$(MAKE) -s patch

.PHONY: generate-watch
generate-watch:
	@$(PRISMA) generate --watch

.PHONY: seed
seed: dev
	@$(BABEL_NODE) --extensions '.ts,.tsx' seed.ts

.PHONY: postgres
postgres: env
	@$(MAKE) -s -C ../docker postgres ARGS="-d"
	@$(WAIT_FOR_POSTGRES)

migrations/%/migration.sql:
	@$(MAKE) -s dev ARGS="--create-only"

.PHONY: patch
patch:
	@find ../src/generated/type-graphql -type f -print0 | xargs -0 sed -i 's|@prisma/client|@prisma/generated|g'

.PHONY: %
%: ;
