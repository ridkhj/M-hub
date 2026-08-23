# Relatório de Avaliação Heurística (E6)

Este documento registra os problemas de usabilidade do frontend original (Vanilla JS) e norteou o desenvolvimento do novo front-end (React).

## Problemas Identificados

| Heurística Violada | Problema Identificado no Front Antigo | Gravidade (1 a 4) | Solução Aplicada no Novo Front |
| :--- | :--- | :---: | :--- |
| **8. Estética e Design Minimalista** | Todas as listas (Músicas, Cantores, etc) ficavam empilhadas na mesma página inicial, gerando grande sobrecarga cognitiva. | 4 | Uso de React Router para criar navegação modular, com Dashboard, Sidebar e telas dedicadas. |
| **1. Visibilidade do Status** | A interface não informava visualmente quando requisições estavam ocorrendo, nem mostrava mensagens de sucesso claras (apenas alerts). | 3 | Criação de Skeletons (durante o loading) e de um sistema de `Toasts` globais para feedback. |
| **3. Controle e Liberdade** | A exclusão de itens e repertórios era feita de forma direta. Um miss-click causava perda de dados irreversível instantânea. | 4 | Implementação do componente genérico `ConfirmDialog` interceptando ações de exclusão. |
| **5. Prevenção de Erros** | O cadastro de itens no repertório exigia IDs ou nomes de forma desestruturada, e havia bugs no envio de tonalidade. | 3 | Modal de seleção múltipla de músicas (checkboxes) e Selects nativos limitando os tons às 12 notas. |
| **7. Flexibilidade e Eficiência** | Alterar a ordem das músicas em um repertório era inviável/complexo. | 3 | Uso da API HTML5 de Drag & Drop para permitir reordenar o setlist arrastando e soltando linhas. |

*Escala de Gravidade: 1=Cosmético, 2=Pequeno, 3=Grande, 4=Catástrofe*
