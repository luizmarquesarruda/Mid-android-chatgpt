# Smart MID físico da Chevrolet Meriva

Este documento define o projeto **físico** do Smart MID.

Ele é separado do aplicativo Android.

## Núcleo

- ESP32-WROOM-32E
- TID original da Meriva
- interface K-Line automotiva
- alimentação automotiva protegida
- PCB própria, sem adaptador externo no uso normal

## Arquitetura

```
CHICOTE MERIVA
      |
      v
+-----------------------------+
| SMART MID PCB                |
|                             |
| proteção +30 / IGN          |
| regulador 3V3               |
| ESP32-WROOM-32E             |
| interface TID               |
| transceptor K-Line          |
| GNSS / SD / buzzer          |
+-------------+---------------+
              |
              v
        TID ORIGINAL
```

A PCB faz a interface física. O ESP32 não deve receber diretamente sinais automotivos fora de sua faixa elétrica.

## Pinagem de referência

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

### Conflito GNSS/K-Line

GPIO16/17 estão reservados como UART de referência para K-Line.

A pinagem histórica do GNSS também usava 16/17. Portanto, **não fechar o PCB com GNSS UART nesses pinos**.

O UART do GNSS deverá ser remapeado antes da revisão elétrica final.

## Alimentação

### +30 permanente

O +30 será tratado na própria PCB com:

1. proteção de entrada;
2. proteção contra inversão;
3. proteção contra transientes;
4. filtragem;
5. alimentação original do TID conforme validação;
6. regulador para 3V3 do ESP32.

Os valores dos componentes ainda não devem ser congelados sem validação elétrica e térmica.

### +15 pós-chave

O +15 serve para detectar ignição.

GPIO35 é entrada-only no ESP32 clássico. A entrada deverá receber proteção e adequação de nível na PCB.

**Nunca aplicar 12 V diretamente ao GPIO35.**

## TID

Referência de conexão:

- SDA → GPIO33
- SCL → GPIO32
- MRQ → GPIO27

A interface elétrica ficará integrada à PCB.

Ainda precisam ser medidos:

- níveis de SDA/SCL/MRQ;
- pull-ups;
- direção dos sinais;
- temporização;
- sequência de inicialização;
- endereço;
- formato das mensagens;
- comportamento no desligamento.

Não enviar bytes arbitrários ao TID.

## K-Line

A K-Line da ECU será ligada a um **transceptor K-Line automotivo dedicado**, instalado na PCB.

```
ECU K-Line
    |
proteção
    |
transceptor K-Line
    |
UART ESP32
```

**Nunca ligar K-Line diretamente a um GPIO do ESP32.**

Referência atual:

- RX = GPIO16
- TX = GPIO17
- 10400 baud
- 8N1
- ISO 14230-4 KWP Fast Init

## Periféricos

| Função | GPIO | Estado |
|---|---:|---|
| Buzzer | 26 | previsto |
| IGN | 35 | previsto, entrada protegida |
| SD CS | 5 | previsto, revisar strap de boot |
| SD SCK | 18 | previsto |
| SD MISO | 19 | previsto |
| SD MOSI | 23 | previsto |
| GNSS PPS | 4 | previsto |
| I2C geral | 21/22 | reservado |

GPIO5 é pino de strap do ESP32 clássico. O circuito do SD deve ser revisado para não forçar estado de boot incorreto.

## Pontos de teste

A Rev A deve ter pontos de teste para:

- +30;
- +15/IGN;
- 3V3;
- GND;
- TID SDA;
- TID SCL;
- TID MRQ;
- K-Line;
- UART TX/RX do K-Line.

## Validação de bancada

Antes do veículo:

1. inspeção visual;
2. continuidade;
3. teste de curto;
4. alimentação limitada;
5. validação de 3V3;
6. teste do ESP32;
7. teste da entrada IGN;
8. captura passiva do TID;
9. teste do transceptor K-Line;
10. somente então ligação ao veículo.

## Ordem de desenvolvimento

1. fechar arquitetura elétrica Rev A;
2. validar alimentação;
3. validar interface elétrica do TID;
4. capturar protocolo real do TID;
5. fechar transceptor K-Line;
6. implementar KWP Fast Init;
7. validar ECU real;
8. implementar primeiro PID real: RPM;
9. exibir dados reais no TID;
10. resolver GNSS;
11. integrar SD;
12. Bluetooth apenas como interface complementar.

## Regra principal

O Smart MID físico deve funcionar sem depender do Android.

Sem dado real, o MID não inventa valor.
