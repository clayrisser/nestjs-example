# File: /docker/Makefile
# Project: app
# File Created: 17-09-2023 14:52:17
# Author: Clay Risser
# -----
# BitSpur (c) Copyright 2021 - 2023
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

include $(MKPM)/mkpm
include $(MKPM)/gnu
include $(MKPM)/dotenv

export NAME := $(shell $(NODE) -e "console.log(require('../package.json').name)")
export VERSION := $(shell $(NODE) -e "console.log(require('../package.json').version)")
export DOCKER_COMPOSE ?= docker-compose
export CONTEXT := ..
export REGISTRY := registry.gitlab.com/risserlabs/community

-include $(MKPM)/docker
