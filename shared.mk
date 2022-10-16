# File: /shared.mk
# Project: example-nestjs
# File Created: 04-02-2022 05:26:47
# Author: Clay Risser <email@clayrisser.com>
# -----
# Last Modified: 16-10-2022 06:13:36
# Modified By: Clay Risser
# -----
# Risser Labs LLC (c) Copyright 2021 - 2022
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

export BABEL ?= $(call yarn_binary,babel)
export BABEL_NODE ?= $(call yarn_binary,babel-node)
export CLOC ?= cloc
export CSPELL ?= $(call yarn_binary,cspell)
export ESLINT ?= $(call yarn_binary,eslint)
export JEST ?= $(call yarn_binary,jest)
export NODEMON ?= $(call yarn_binary,nodemon)
export TSC ?= $(call yarn_binary,tsc)
export PRETTIER := $(call yarn_binary,prettier)

export POSTGRES_URL ?= \
	postgresql://$(POSTGRES_PASSWORD):$(POSTGRES_USER)@$(POSTGRES_HOST):$(POSTGRES_PORT)/$(POSTGRES_DATABASE)?sslmode=prefer

CACHE_ENVS += \
	BABEL \
	BABEL_NODE \
	CLOC \
	CSPELL \
	ESLINT \
	JEST \
	PRETTIER \
	TSC
