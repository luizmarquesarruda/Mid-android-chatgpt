# Desenvolvimento

## Primeiro setup

```bash
npm install
npm run doctor
npm run typecheck
npm test
```

## Android

```bash
npx expo prebuild --clean --platform android --non-interactive
npx expo run:android
```

O Android final usa Bluetooth Classic para falar com o ESP32.

Dispositivo esperado:

`MERIVA-MID-ESP32`

O aplicativo inicia uma tentativa persistente de conexão enquanto estiver ativo. Se o ESP32 ainda não estiver pareado, o app continua tentando sem fabricar estado de conexão.

## ESP32

Diretório:

`esp32/`

Build com PlatformIO:

```bash
pio run -d esp32
pio run -d esp32 --target upload
pio device monitor -d esp32
```

Hardware de referência:

- ESP32-WROOM-32E
- UART2 RX GPIO 16
- UART2 TX GPIO 17
- Bluetooth Classic SPP

## K-Line

A interface elétrica deve usar transceptor automotivo.

Não conectar o pino OBD-II K-Line diretamente a GPIO.

A primeira validação será feita em UART 10400 8N1. O KWP Fast Init será implementado depois da confirmação do circuito físico.

## Comunicação Android → ESP32

O Android usa o mesmo modelo de comandos do núcleo OBD:

```
ATZ
ATI
ATE0
ATL0
ATS0
ATH1
ATSP0
ATDP
```

O firmware inicial responde a esses comandos.

Comandos OBD retornam `NO DATA` até que o caminho K-Line real esteja validado.

Isso é proposital.

## Teste GPS

1. Abra o aplicativo.
2. Autorize localização em primeiro plano.
3. Confirme GPS automático.
4. Confira distância em km.
5. Confira precisão.
6. Não derive litros consumidos somente do GPS.

## Critério de hardware

Um teste é considerado real somente quando:

- Bluetooth Classic conectou ao ESP32 físico;
- ESP32 respondeu aos comandos AT;
- K-Line foi inicializada;
- ECU respondeu;
- TX/RX bruto foi registrado.

## Regra

Nunca transformar timeout, `NO DATA` ou PID desconhecido em valor estimado.
