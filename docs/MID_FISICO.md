# Smart MID físico da Chevrolet Meriva

Este documento define o projeto **físico** do Smart MID.

Ele é separado do aplicativo Android.

## Núcleo

- ESP32-WROOM-32E
- TID original da Meriva
- interface K-Line automotiva
- alimentação automotiva protegida

## Arquitetura

```
                    SMART MID FÍSICO
┌───────────────────────────────────────────────┐
│                                               │
│  Alimentação ──► ESP32-WROOM-32E              │
│                       │                       │
│              ┌────────┴────────┐              │
│              ▼                 ▼              │
│         K-Line ECU          TID original      │
│              │                 │              │
│              ▼                 ▼              │
│             ECU            Display MID        │
│                                               │
└───────────────────────────────────────────────┘
```

## Pinagem de referência

### ESP32

| Função | GPIO |
|---|---:|
| K-Line RX | 16 |
| K-Line TX | 17 |
| TID SDA | 33 |
| TID SCL | 32 |
| TID MRQ | 27 |
| GNSS RX | 16* |
| GNSS TX | 17* |
| GNSS PPS | 4 |
| Buzzer | 26 |
| IGN | 35 |
| SD CS | 5 |
| SD SCK | 18 |
| SD MISO | 19 |
| SD MOSI | 23 |

* A pinagem GNSS acima não pode coexistir com K-Line na mesma UART sem remapeamento. Ela é uma referência histórica do projeto e deve ser resolvida antes do esquemático final.

## TID

O TID continua sendo o display original do carro.

A interface elétrica planejada é:

- SDA: GPIO 33
- SCL: GPIO 32
- MRQ: GPIO 27

**Importante:** a pinagem acima não significa que o protocolo de mensagens já esteja validado.

O próximo trabalho do TID é descobrir/confirmar:

1. níveis elétricos;
2. direção dos sinais;
3. temporização;
4. sequência de inicialização;
5. comandos de texto;
6. atualização parcial;
7. comportamento de desligamento.

Não devemos enviar comandos arbitrários ao TID.

## K-Line

A K-Line da ECU não pode ser ligada diretamente ao ESP32.

Usar transceptor automotivo apropriado e proteção de alimentação.

A comunicação da Meriva será tratada como ISO 14230-4 KWP Fast Init, até validação do veículo.

## Ordem de desenvolvimento

1. alimentação protegida;
2. ESP32 isolado;
3. interface TID;
4. captura/validação do protocolo TID;
5. K-Line física;
6. KWP Fast Init;
7. primeiro PID real;
8. integração de dados no TID;
9. GNSS;
10. SD;
11. Bluetooth opcional para diagnóstico/configuração.

## Regra principal

O Smart MID físico deve funcionar sem depender do Android.

O Android é uma ferramenta complementar de configuração, diagnóstico e registro.

Nenhum valor de veículo será fabricado quando a fonte real não estiver disponível.
