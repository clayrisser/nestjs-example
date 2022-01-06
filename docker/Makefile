# File: /docker/Makefile
# Project: example-nestjs
# File Created: 06-12-2021 08:30:36
# Author: Clay Risser <email@clayrisser.com>
# -----
# Last Modified: 06-01-2022 03:03:45
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
include ../env.mk

export DOCKER_COMPOSE ?= docker-compose
export CONTEXT := ..
export NAME := $(shell $(NODE) -e "console.log(require('../package.json').name)")
export REGISTRY := $(shell $(NODE) -e "console.log(require('../package.json').docker.registry)")
export VERSION := $(shell $(NODE) -e "console.log(require('../package.json').version)")

-include $(MKPM)/docker

endif
