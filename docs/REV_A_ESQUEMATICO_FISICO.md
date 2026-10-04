# Smart MID Rev A — Arquitetura elétrica física

## Objetivo

Definir a Rev A do Smart MID da Chevrolet Meriva com:

- ESP32-WROOM-32E montado diretamente na PCB;
- TID original mantido como display;
- passagem física entre chicote do veículo e TID;
- proteção automotiva integrada na PCB;
- transceptor K-Line integrado na PCB;
- nenhuma placa/adaptador externo necessário durante o uso normal.

O Android continua sendo um projeto separado.

## Arquitetura

```
CHICOTE MERIVA
      |
     J1
      |
      v
+-----------------------------+
| SMART MID PCB - REV A       |
|                             |
|  Proteção +30 / IGN         |
|          |                  |
|       regulador             |
|          |                  |
|       3V3                   |
|          |                  |
|    ESP32-WROOM-32E          |
|      |       |       |      |
|     TID    K-Line   GNSS/SD |
|      |       |              |
|      +-------+              |
+-------------|---------------+
              |
             J2
              |
        TID ORIGINAL
```

## J1/J2 e pass-through

A PCB deve preservar o caminho original entre veículo e TID sempre que o sinal não precisar ser processado pelo ESP32.

| Pino TID | Função de referência | Tratamento Rev A |
|---:|---|---|
| 1 | +15 pós-chave | entrada IGN/proteção; não ligar diretamente ao GPIO |
| 2 | rádio / informação | manter conforme circuito original; validar antes de dirigir |
| 3 | +30 permanente | alimentação protegida do TID e entrada do regulador |
| 4 | iluminação/dimmer | pass-through; validar nível elétrico |
| 5 | temperatura | pass-through; validar esquema real |
| 6 | GND | terra comum protegido |
| 7 | temperatura | pass-through; validar esquema real |
| 8 | diagnóstico | reservado conforme documentação/medição |
| 9 | velocidade | pass-through/monitoramento conforme validação |
| 10 | SCL | interface TID GPIO32 através de estágio elétrico adequado |
| 11 | SDA | interface TID GPIO33 através de estágio elétrico adequado |
| 12 | MRQ | interface TID GPIO27 através de estágio elétrico adequado |

**Nota:** esta tabela é uma referência de engenharia. A pinagem e o comportamento elétrico devem ser conferidos no TID físico antes da primeira energização.

## Alimentação automotiva

### +30 permanente

Fluxo previsto:

```
+30 veículo
   |
proteção de entrada
   |
proteção contra inversão
   |
TVS / filtragem
   |
+--------------------+
|                    |
TID original       regulador
                     |
                    3V3
                     |
                   ESP32
```

A seleção final dos componentes e valores deve ser feita a partir da tensão/corrente medidas no veículo e do transiente automotivo esperado. Não congelar valores de componentes sem validação elétrica.

### +15 pós-chave / IGN

O +15 pós-chave será usado para detectar ignição.

**GPIO35 é somente entrada no ESP32 clássico**, portanto é adequado como entrada de IGN, desde que exista um estágio de proteção/adequação de nível entre o veículo e o GPIO.

Não aplicar 12 V diretamente ao GPIO35.

## Interface TID

GPIO previsto:

- SDA = GPIO33
- SCL = GPIO32
- MRQ = GPIO27

A interface elétrica ficará na própria PCB.

### O que ainda precisa ser medido

Antes de definir pull-ups, níveis lógicos, direção das linhas, endereço e temporização:

1. tensão de repouso de SDA;
2. tensão de repouso de SCL;
3. tensão de MRQ;
4. frequência/temporização;
5. quem conduz cada linha;
6. se existe pull-up no TID;
7. tensão lógica usada pelo TID;
8. sequência de inicialização;
9. endereço e formato das mensagens;
10. comportamento no desligamento.

**Regra:** não enviar bytes inventados ao TID.

## K-Line

A K-Line será uma interface física automotiva dedicada.

```
ECU K-Line
    |
proteção
    |
transceptor K-Line automotivo
    |
UART ESP32
```

**Nunca conectar a K-Line diretamente a um GPIO do ESP32.**

O transceptor deve ficar na PCB e ser dimensionado para o ambiente automotivo.

### UART

A referência atual usa:

- RX ESP32 = GPIO16
- TX ESP32 = GPIO17
- 10400 baud
- 8N1

A implementação final deve incluir KWP Fast Init ISO 14230-4.

### Conflito GNSS

GPIO16/17 também foram usados anteriormente para UART do GNSS. Essa configuração é incompatível com o uso simultâneo dessas mesmas portas para K-Line.

**Decisão pendente:** remapear o UART do GNSS ou definir outro arranjo antes de fechar o PCB.

## Outros periféricos

| Função | GPIO de referência | Observação |
|---|---:|---|
| Buzzer | 26 | usar driver apropriado para carga |
| IGN | 35 | somente entrada; proteção obrigatória |
| SD CS | 5 | revisar comportamento de boot/strap |
| SD SCK | 18 | SPI |
| SD MISO | 19 | SPI |
| SD MOSI | 23 | SPI |
| GNSS PPS | 4 | entrada de pulso |
| I2C geral | 21/22 | reservado para periféricos como RTC |

O uso do GPIO5 para SD deve ser revisado por ser pino de strap do ESP32 clássico. A PCB não pode permitir que um periférico force um estado de boot incorreto.

## Pontos de teste obrigatórios

A Rev A deve prever test points para:

- +30;
- +15/IGN;
- 3V3;
- GND;
- TID SDA;
- TID SCL;
- TID MRQ;
- K-Line;
- K-Line TX do ESP32;
- K-Line RX do ESP32.

## Teste antes do veículo

Sequência obrigatória:

1. inspeção visual da PCB;
2. teste de continuidade;
3. teste de curto entre alimentação e GND;
4. energização em bancada com fonte limitada;
5. validar 3V3;
6. validar ESP32;
7. validar entradas IGN sem 12 V no GPIO;
8. capturar sinais do TID sem transmitir dados;
9. validar transceptor K-Line isoladamente;
10. somente depois conectar ao veículo.

## Critérios de conclusão da Rev A

A Rev A só será considerada pronta para montagem no veículo quando:

- alimentação estiver protegida;
- TID estiver eletricamente compatível;
- K-Line tiver transceptor dedicado;
- conflito de UART do GNSS estiver resolvido;
- GPIOs de boot tiverem sido revisados;
- pontos de teste estiverem disponíveis;
- protocolo TID estiver capturado no hardware real;
- KWP Fast Init estiver implementado e testado sem usar dados simulados.

## Regra de engenharia

O Smart MID deve preferir **não transmitir** a transmitir algo desconhecido.

Dados, endereços, níveis elétricos e temporizações ainda não medidos devem permanecer marcados como pendentes.
