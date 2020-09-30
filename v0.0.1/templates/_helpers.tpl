{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "nestjs-example.name" }}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this
(by the DNS naming spec).
*/}}
{{- define "nestjs-example.fullname" }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Calculate nestjs example certificate
*/}}
{{- define "nestjs-example.nestjs-example-certificate" }}
{{- if (not (empty .Values.ingress.nestjsExample.certificate)) }}
{{- printf .Values.ingress.nestjsExample.certificate }}
{{- else }}
{{- printf "%s-nestjs-example-letsencrypt" (include "nestjs-example.fullname" .) }}
{{- end }}
{{- end }}

{{/*
Calculate pgadmin certificate
*/}}
{{- define "nestjs-example.pgadmin-certificate" }}
{{- if (not (empty .Values.ingress.pgadmin.certificate)) }}
{{- printf .Values.ingress.pgadmin.certificate }}
{{- else }}
{{- printf "%s-pgadmin-letsencrypt" (include "nestjs-example.fullname" .) }}
{{- end }}
{{- end }}

{{/*
Calculate phpredisadmin certificate
*/}}
{{- define "nestjs-example.phpredisadmin-certificate" }}
{{- if (not (empty .Values.ingress.phpredisadmin.certificate)) }}
{{- printf .Values.ingress.phpredisadmin.certificate }}
{{- else }}
{{- printf "%s-phpredisadmin-letsencrypt" (include "nestjs-example.fullname" .) }}
{{- end }}
{{- end }}

{{/*
Calculate nestjs example hostname
*/}}
{{- define "nestjs-example.nestjs-example-hostname" }}
{{- if (and .Values.config.nestjsExample.hostname (not (empty .Values.config.nestjsExample.hostname))) }}
{{- printf .Values.config.nestjsExample.hostname }}
{{- else }}
{{- if .Values.ingress.nestjsExample.enabled }}
{{- printf .Values.ingress.nestjsExample.hostname }}
{{- else }}
{{- printf "%s-nestjs-example" (include "nestjs-example.fullname" .) }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Calculate nestjs example base url
*/}}
{{- define "nestjs-example.nestjs-example-base-url" }}
{{- if (and .Values.config.nestjsExample.baseUrl (not (empty .Values.config.nestjsExample.baseUrl))) }}
{{- printf .Values.config.nestjsExample.baseUrl }}
{{- else }}
{{- if .Values.ingress.nestjsExample.enabled }}
{{- $hostname := ((empty (include "nestjs-example.nestjs-example-hostname" .)) | ternary .Values.ingress.nestjsExample.hostname (include "nestjs-example.nestjs-example-hostname" .)) }}
{{- $path := (eq .Values.ingress.nestjsExample.path "/" | ternary "" .Values.ingress.nestjsExample.path) }}
{{- $protocol := (.Values.ingress.nestjsExample.tls | ternary "https" "http") }}
{{- printf "%s://%s%s" $protocol $hostname $path }}
{{- else }}
{{- printf "http://%s" (include "nestjs-example.nestjs-example-hostname" .) }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Calculate redis hostname
*/}}
{{- define "nestjs-example.redis-hostname" }}
{{- if (and .Values.config.redis.hostname (not (empty .Values.config.redis.hostname))) }}
{{- printf .Values.config.redis.hostname }}
{{- else }}
{{- printf "%s-redis" (include "nestjs-example.fullname" .) }}
{{- end }}
{{- end }}

{{/*
Calculate postgres url
*/}}
{{- define "nestjs-example.postgres-url" }}
{{- $postgres := .Values.config.postgres }}
{{- if $postgres.internal }}
{{- $credentials := (printf "%s:%s" $postgres.username $postgres.password) }}
{{- printf "postgresql://%s@%s-postgres:5432/%s" $credentials (include "nestjs-example.fullname" .) $postgres.database }}
{{- else }}
{{- if $postgres.url }}
{{- printf $postgres.url }}
{{- else }}
{{- printf "postgresql://%s@%s:%s/%s" $credentials $postgres.host $postgres.port $postgres.database }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Calculate redis url
*/}}
{{- define "nestjs-example.redis-url" }}
{{- $redis := .Values.config.redis }}
{{- if $redis.internal }}
{{- $credentials := (printf "%s:%s" $redis.username $redis.password) }}
{{- printf "redis://%s-redis:6379" (include "nestjs-example.fullname" .) }}
{{- else }}
{{- if $redis.url }}
{{- printf $redis.url }}
{{- else }}
{{- $credentials := (empty $redis.username | ternary "" (printf "%s:%s" $redis.username $redis.password)) }}
{{- printf "redis://%s@%s:%s" $credentials $redis.host $redis.port }}
{{- end }}
{{- end }}
{{- end }}
