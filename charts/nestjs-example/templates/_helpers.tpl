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
{{- $protocol := (.Values.ingress.nestjsExample.tls | ternary "https" "http") }}
{{- printf "%s://%s" $protocol $hostname }}
{{- else }}
{{- printf "http://%s" (include "nestjs-example.nestjs-example-hostname" .) }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Calculate postgres url
*/}}
{{- define "nestjs-example.postgres-url" }}
{{- $postgres := .Values.config.postgres }}
{{- if $postgres.url }}
{{- printf $postgres.url }}
{{- else }}
{{- $credentials := ((or (empty $postgres.username) (empty $postgres.password)) | ternary "" (printf "%s:%s@" $postgres.username $postgres.password)) }}
{{- printf "postgresql://%s%s:%s/%s" $credentials $postgres.host $postgres.port $postgres.database }}
{{- end }}
{{- end }}
