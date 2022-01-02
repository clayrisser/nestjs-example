# File: /hasura/Makefile
# Project: example-nestjs
# File Created: 02-01-2022 04:46:43
# Author: Clay Risser <email@clayrisser.com>
# -----
# Last Modified: 02-01-2022 11:35:34
# Modified By: Clay Risser <email@clayrisser.com>
# -----
# Silicon Hills LLC (c) Copyright 2021 - 2022
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

.PHONY: console
console:
	@$(HASURA) console

.PHONY: metadata-apply
metadata-apply:
	@$(HASURA) metadata apply

endif
