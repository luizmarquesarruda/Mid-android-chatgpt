# MID Android ChatGPT

Nova base do projeto para a futura integração com Android Auto.

Este repositório é um clone da V1 do Meriva Smart Diagnostic. O que funcionar na V1 permanece. O que falhar será corrigido aqui.

## Origem
- Projeto-base: `luizmarquesarruda/meriva-smart-diagnostic`
- Android / React Native / Expo
- Bluetooth Classic / ELM327
- OBD-II real
- GPS
- DTC
- autosave e histórico

## Objetivo
Adicionar Android Auto sem duplicar o núcleo de diagnóstico.

`núcleo Meriva -> Phone UI`
`núcleo Meriva -> Android Auto UI`

A integração Android Auto ainda não está implementada. Primeiro serão feitos build, testes automatizados, instalação, teste Bluetooth + ELM327 na Meriva, GPS, autosave e registro das falhas.

Não usar scraping do Waze ou Google Maps. Integrações externas somente por APIs oficiais comprovadas.

O conhecimento validado será usado depois como base empírica do `Meriva-smart-mid`.

Fluxo: **Diagnostic V1 -> testes reais -> correções -> APK -> Android Auto V2 -> Smart MID**