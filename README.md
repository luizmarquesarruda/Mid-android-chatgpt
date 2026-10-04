# Smart MID Chevrolet Meriva

Este é o repositório do **Smart MID físico da Chevrolet Meriva**, usando o **ESP32-WROOM-32E** e o **TID original do veículo**.

O aplicativo Android é um projeto separado. Ele não define o funcionamento básico do MID físico.

## Arquitetura do produto

```
                  SMART MID FÍSICO

              ┌───────────────────┐
              │ ESP32-WROOM-32E   │
              │ núcleo do MID     │
              └───────┬─────┬─────┘
                      │     │
                    K-Line  TID
                      │     │
                      ▼     ▼
                     ECU  Display
```

### ESP32

Responsável pelo núcleo embarcado:

- comunicação com a ECU;
- K-Line / ISO 14230-4;
- controle do TID;
- estado do sistema;
- GNSS, quando integrado;
- SD, quando integrado;
- buzzer;
- alimentação/ignição e desligamento controlado;
- Bluetooth apenas como interface complementar.

### TID original

O TID da Meriva continua sendo o display principal do projeto.

Não será substituído por OLED ou LCD externo.

O protocolo do TID será implementado somente depois de ser medido e validado no hardware real.

## Separação do Android

O Android fica fora do núcleo físico.

```
MID físico ─────► funciona sozinho
     ▲
     │ Bluetooth opcional
     ▼
Android ────────► configuração / diagnóstico / registro
```

Não há dependência do Android para o MID funcionar.

## Hardware inicial

- ESP32-WROOM-32E / ESP32 clássico
- TID original da Meriva
- transceptor K-Line automotivo
- proteção e regulador automotivo
- conector original/pass-through
- SD e GNSS conforme a revisão do hardware

### Pinagem de referência

| Função | GPIO |
|---|---:|
| K-Line RX | 16 |
| K-Line TX | 17 |
| TID SDA | 33 |
| TID SCL | 32 |
| TID MRQ | 27 |
| GNSS PPS | 4 |
| Buzzer | 26 |
| IGN | 35 |
| SD CS | 5 |
| SD SCK | 18 |
| SD MISO | 19 |
| SD MOSI | 23 |

A pinagem GNSS UART antiga não deve ser usada junto com K-Line nos GPIO 16/17 sem uma decisão de remapeamento.

## Segurança elétrica

**Nunca ligue a K-Line diretamente ao ESP32.**

Use transceptor automotivo apropriado e proteção de alimentação.

## Estado atual

Já existe:

- base PlatformIO;
- firmware ESP32;
- Bluetooth Classic SPP;
- interface inicial de comandos;
- camada inicial do TID;
- UART K-Line em 10400 baud;
- documentação da arquitetura física.

Ainda **não** está validado:

- protocolo de escrita do TID;
- circuito elétrico final;
- KWP Fast Init no veículo;
- resposta real da ECU;
- leitura de PIDs;
- integração final do TID com os dados da ECU.

## Ordem de trabalho

1. validar hardware e alimentação;
2. validar interface do TID original;
3. capturar e documentar o protocolo do TID;
4. implementar escrita segura no TID;
5. validar transceptor K-Line;
6. implementar KWP Fast Init;
7. validar comunicação real com a ECU;
8. implementar primeiro PID real, começando por RPM;
9. levar dados reais ao TID;
10. adicionar GNSS, SD e Bluetooth complementar.

**Regra:** sem dado real, o MID não inventa valor.
