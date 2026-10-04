# Arquitetura do Meriva MID com ESP32

## Decisão

O ESP32 passa a ser o núcleo de comunicação embarcado.

O Android não fala diretamente com a ECU como arquitetura final. Ele fala com o ESP32 por Bluetooth Classic.

## Fluxo

```
┌──────────────────────────┐
│ Android / MID            │
│ UI + GPS + armazenamento │
└────────────┬─────────────┘
             │ Bluetooth Classic SPP
             ▼
┌──────────────────────────┐
│ ESP32-WROOM-32E          │
│ núcleo embarcado         │
│                          │
│ SPP / comando            │
│ fila OBD                 │
│ K-Line                   │
│ watchdog / estado        │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Transceptor K-Line       │
│ proteção automotiva      │
└────────────┬─────────────┘
             │ OBD-II pin 7
             ▼
┌──────────────────────────┐
│ ECU Meriva               │
│ ISO 14230-4 KWP Fast Init│
└──────────────────────────┘
```

## Por que esta arquitetura

1. O ESP32 fica perto da ECU.
2. O Android não precisa conhecer a camada elétrica K-Line.
3. O mesmo aplicativo pode continuar usando comandos no estilo ELM327.
4. Logs brutos podem ser capturados no ESP32 e no Android.
5. O projeto pode evoluir para o Smart MID físico sem depender do telefone.
6. O ESP32-WROOM-32E possui Bluetooth Classic, necessário para SPP.

## Compatibilidade

O ESP32 clássico é obrigatório para Bluetooth Classic neste desenho. A documentação da Espressif confirma suporte a Bluetooth Classic no ESP32 original.

## Estado de conexão

O estado deve permanecer separado:

- Bluetooth conectado
- ESP32 respondendo
- K-Line inicializada
- ECU respondendo
- protocolo identificado
- OBD pronto

Não usar apenas o estado `connected`.

## Segurança

A K-Line é uma interface automotiva de nível de tensão incompatível com GPIO de 3,3 V. O ESP32 deve usar transceptor apropriado e proteção de alimentação.

## Dados

Nunca inventar:

- RPM
- velocidade
- temperatura
- combustível
- DTC
- consumo

Quando a ECU não responder, registrar explicitamente `NO DATA`, timeout ou erro.
