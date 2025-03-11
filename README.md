# Gama Pergunta  

**Aplicativo mobile para coleta offline de respostas** desenvolvido em 2019 com Ionic Native 4 e Angular 7, integrando armazenamento local e sincronização com API REST para análise estatística.

## Funcionalidades Principais  
- **Operação offline** com armazenamento em banco de dados local  
- **Sincronização inteligente** via API REST usando JSON  
- Geração de **gráficos estatísticos** a partir dos dados coletados  
- Interface adaptada para **coleta em campo** sem necessidade de conexão  

## Tecnologias Utilizadas  
- `Ionic Native 4` (Framework mobile)  
- `Angular 7` (Front-end)  
- `SQLite` (Armazenamento local com Ionic Storage)  
- `Node.js` (Ambiente de execução)  

## Pré-requisitos  
- Node.js (última versão estável)  
- Ionic CLI (`npm install -g @ionic/cli`)  
- Git (para clonar o repositório)  

## Como Executar  
```bash
# Clonar repositório
git clone https://github.com/laerciomonteiro/gamapergunta.git

# Instalar dependências
npm install

# Iniciar aplicação
ionic serve
```

## Fluxo de Operação  
1. Coleta offline de dados no dispositivo  
2. Armazenamento local seguro  
3. Sincronização manual/automática com API  
4. Conversão para JSON e envio  
5. Geração de relatórios estatísticos  

> *Projeto desenvolvido para operação em ambientes com conectividade intermitente, priorizando a integridade dos dados coletados.*
