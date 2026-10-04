# Arquitetura

## Visão geral

```
                    +----------------------+
                    | Android MID          |
                    | UI + GPS + Storage   |
                    +----------+-----------+
                               |
                         Bluetooth SPP
                               |
                               v
                    +----------------------+
                    | ESP32-WROOM-32E       |
                    | SPP + OBD + K-Line   |
                    +----------+-----------+
                               |
                         transceptor
                               |
                               v
                         ECU Meriva
```

## Android

### UI

`app/` contém as telas.

### GPS

`src/gps/` mantém o rastreamento em primeiro plano.

### OBD

`src/obd/` contém:

- Bluetooth Classic
- conexão persistente com ESP32
- sessão compatível com comandos ELM327
- parser
- PIDs
- DTC
- descoberta

### Dados

`src/database/` contém persistência e conhecimento local.

### Storage

`src/storage/` controla quota, limpeza, backup e ciclos.

### Autosave

`src/meriva/` controla o autosave.

## ESP32

`esp32/` é o novo núcleo embarcado.

Responsabilidades:

1. Bluetooth Classic SPP
2. fila de comandos
3. interface de comando compatível com ELM327
4. UART K-Line
5. temporização do protocolo
6. captura TX/RX
7. estado da ECU

## Estados

O aplicativo deve distinguir:

```
Bluetooth ligado
      ↓
ESP32 conectado
      ↓
ESP32 respondendo
      ↓
K-Line inicializada
      ↓
ECU respondendo
      ↓
protocolo identificado
      ↓
OBD pronto
```

Nunca usar apenas "conectado".

## K-Line

A Meriva do projeto tem histórico de comunicação ISO 14230-4 KWP Fast Init em K-Line.

O firmware começa em 10400 baud 8N1.

O handshake físico será implementado e validado separadamente.

## Regra de confiança

`REAL_OBD`, `SIMULACAO` e demais origens permanecem explícitos.

O ESP32 não deve fabricar valores.

Sem resposta real:

- timeout
- `NO DATA`
- erro

Nunca estimativa silenciosa.
