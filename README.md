# MERIVA MID Android + ESP32

Base oficial do **Meriva MID**.

O projeto agora tem duas camadas:

- **Android**: interface, GPS, armazenamento, autosave e diagnóstico.
- **ESP32-WROOM-32E**: núcleo embarcado de comunicação com a ECU.

## Arquitetura atual

```
Android MID
    │ Bluetooth Classic / SPP
    ▼
ESP32-WROOM-32E
    │ UART2
    ▼
Transceptor K-Line
    │
    ▼
ECU Meriva
```

O Android procura automaticamente o dispositivo Bluetooth Classic:

`MERIVA-MID-ESP32`

Depois da conexão, o ESP32 apresenta uma interface de comandos compatível com o modelo ELM327 usado pelo núcleo OBD do aplicativo.

## Regra de hardware

A K-Line não pode ser ligada diretamente ao ESP32. Ela trabalha em nível automotivo e precisa de transceptor/proteção apropriados.

ESP32 de referência:

- ESP32-WROOM-32E
- Bluetooth Classic
- GPIO 16: RX K-Line
- GPIO 17: TX K-Line

## Estado do desenvolvimento

### Implementado

- estrutura de firmware ESP32
- Bluetooth Classic SPP
- nome `MERIVA-MID-ESP32`
- camada inicial de comandos AT
- conexão automática Android → ESP32
- GPS automático
- armazenamento local
- núcleo OBD existente

### Próximo marco

Implementar e validar fisicamente o KWP Fast Init da Meriva.

Só depois disso liberar PIDs reais.

Nenhum dado de ECU será inventado.

## Validação

Build de software não significa validação automotiva.

A confirmação final exige:

1. ESP32 físico
2. transceptor K-Line
3. Android físico
4. Meriva física
5. captura TX/RX
6. resposta real da ECU

## Organização

- `app/` UI Android
- `src/gps/` GPS
- `src/obd/` Bluetooth, sessão OBD e parser
- `src/storage/` armazenamento
- `src/meriva/` autosave
- `esp32/` firmware embarcado
- `docs/` arquitetura e procedimentos

O objetivo é transformar o aplicativo atual no painel Android do **Meriva MID**, enquanto o ESP32 assume o trabalho próximo à ECU.
