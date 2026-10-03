# Android Auto V2

## Objetivo
Adicionar suporte Android Auto ao clone validado do Meriva Smart Diagnostic.

## Antes de implementar
A V1 precisa ser testada no telefone e na Meriva:
- Bluetooth Classic
- ELM327
- inicialização ELM327
- PIDs
- DTC
- GPS
- autosave
- histórico
- armazenamento
- APK

## Arquitetura
O núcleo de OBD/ELM327, PID, DTC, GPS, consumo, histórico e autosave continua compartilhado.

`MerivaVehicleCore -> Phone UI`
`MerivaVehicleCore -> Android Auto UI`

A camada Android Auto não deve duplicar a lógica do veículo.

## Android Auto
Usar APIs próprias para apps de carro e templates permitidos. Não projetar a tela React Native do telefone diretamente.

Não declarar categoria de navegação enquanto o aplicativo não for um navegador.

## Waze / Google Maps
Não assumir acesso à rota ativa de outro navegador. Não usar scraping de tela. Qualquer integração deve usar API oficial e ser comprovada.

## Critério de conclusão
Build limpo, testes automatizados, Bluetooth real, ELM327 real, teste Android Auto/DHU quando aplicável e confirmação de que o núcleo OBD não foi alterado indevidamente.
