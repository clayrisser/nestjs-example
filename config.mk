# File: /config.mk
# Project: openldap-sync
# File Created: 03-12-2021 09:59:42
# Author: Clay Risser
# -----
# Last Modified: 29-12-2021 02:46:53
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

export BABEL ?= $(call yarn_binary,babel)
export BABEL_NODE ?= $(call yarn_binary,babel-node)
export CLOC ?= cloc
export CSPELL ?= $(call yarn_binary,cspell)
export ESLINT ?= $(call yarn_binary,eslint)
export JEST ?= $(call yarn_binary,jest)
export PRETTIER ?= $(call yarn_binary,prettier)
export TSC ?= $(call yarn_binary,tsc)

CACHE_ENVS += \
	BABEL \
	BABEL_NODE \
	CLOC \
	CSPELL \
	ESLINT \
	JEST \
	PRETTIER \
	TSC
