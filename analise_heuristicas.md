# Análise do Protótipo Desenvolvido

### [Link do protótipo](https://www.figma.com/design/wdcp56MEy534rMfxsoHh3z/AirBNB?node-id=0-1&t=fYlrDwX1CNTUjYzw-1)

## Cumprimento das Heurísticas

<div style="text-align: justify">

1. A primeira heurística diz que o sistema deve manter o utilizador informado sobre o que está a acontecer, através de feedback adequado e em tempo razoável. No protótipo desenvolvido, o sistema comunica claramente o seu estado ao utilizador, por exemplo, através de avisos visuais que indicam quando ocorre um erro. Este feedback é apresentado de forma imediata após as ações do utilizador, permitindo perceber rapidamente o resultado das interações, (mensagens de erro, informação que o download de dados foi concluído).

2. A segunda heurística afirma que o sistema deve falar a linguagem do utilizador, utilizando conceitos e convenções familiares. Com isto em mente, a terminologia utilizada é simples e familiar ao utilizador, evitando termos técnicos desnecessários, e os controlos seguem convenções comuns do mundo real, como ícones intuitivos e botões com ações previsíveis, facilitando a sua compreensão e utilização.

3. A terceira heurística refere-se aos níveis de controlo e liberdade por parte do utilizador, sendo que este deve poder sair facilmente de estados indesejados e reverter ações. No nosso caso, as operações de desfazer e refazer passos não existem, já que as ações são bastante diretas e simples, não havendo processos complexos. Ainda assim, o utilizador consegue facilmente sair do sistema, fechando a página, ou pelo menos "reinicializar" o mesmo, voltando à página inicial.

4. Na quarta heurística temos que o design deve manter consistência visual e funcional, seguindo convenções do setor e da plataforma. O nosso estilo visual é uniforme, aplicando consistentemente cores, tipografia, e elementos gráficos em todas as páginas.

5. A quinta heurística afirma que, ao invés de apresentar mensagens de erro, é preferível preveni-los. Para tal, temos algumas restrições úteis, como controles deslizantes que impedem o utilizador de inserir números inválidos, e variantes que validam intervalos inseridos que são inválidos ou não retornariam nenhum resultado.

6. Para respeitar a sexta heurística, devemos minimizar a carga de memória do utilizador, tornando visíveis as opções e informações importantes. Assim, todas as informações essenciais, como datas, preços e filtros aplicados, permanecem visíveis no ecrã em todas as fases de pesquisa, e o sistema fornece ainda ajuda contextual através das mensagens de erro, orientando o utilizador na resolução imediata de qualquer problema.

7. Pela sétima heurística, devemos permitir que tanto utilizadores novos como outros mais experientes sejam capazes de utilizar o sistema de forma eficiente. Não implementámos nenhum atalho, pois não nos pareceu que tal se justificasse no contexto do sistema, já que as interações são simples e diretas. No entanto, é possível obter algum nível de personalização, havendo a opção de alternar entre um modo claro e um modo escuro.

8. A oitava heurística afirma que o design deve ser minimalista, sem elementos desnecessários. A interface do protótipo é limpa, com o foco nos elementos gráficos, sendo todos estes importantes para a sua função de informar o utilizador. Os elementos estéticos contribuem para a organização e o flow da interface, ao trabalhar em conjunto com os elementos para facilitar a leitura das informações.

9. A nona heurística indica que o sistema deve ajudar os utilizadores a reconhecer e recuperar de erros, algo que o protótipo faz ao indicar claramente o problema através de uma cor de destaque (rosa). Para resolver, por exemplo, datas inválidas, deve-se clicar no retângulo correspondente que está marcado com a cor destaque.

10. A décima heurística afirma que, se necessário, deve haver documentação sobre o uso do design e, caso não haja, se o sistema ajuda o utilizador quando este precisa. O protótipo é simples e intuitivo o suficiente para não necessitar de documentação e, quando aplicável, mensagens de erro são apresentadas para ajudar o utilizador.

</div>

## Satisfação das Necessidades dos Utilizadores

<div style="text-align: justify">

- A interface desenvolvida mostra ao utilizador os dados complexos provenientes da plataforma Inside Airbnb em gráficos, tabelas e outros visuais semelhantes, de modo a facilitar a sua interpretação, com o objetivo de serem compreensíveis para qualquer um interessado. É dividida em duas partes principais, a aba detalhada de um local e a comparação de duas.

- A aba detalhada mostra a informação básica do local, uma visão do mapa com vários filtros diferentes, gráficos com os dados divididos pelos vários trimestres ao longo do ano, uma tabela com casos emblemáticos, que, acompanhados pelos avisos caso anomalias sejam detetadas, facilitam a regularização de alojamentos locais. No fim da página, existe uma tabela que divide o local nas suas várias zonas, de modo a poder comparar e analisar as áreas mais afetadas dentro da própria localidade. 

- A aba de comparação coloca as informações de ambas as localidades lado a lado, que, juntamente com uma seta a indicar o valor mais alto, permite uma leitura rápida. Tem também gráficos simples de linhas e barras de modo a que as diferenças entre elas sejam óbvias e impactantes.


- Em ambos os casos, é possível filtrar os resultados obtidos, não só pelo nome da localidade, mas também por outros dados básicos, como o preço ou o tipo de propriedade. Existe ainda a opção de exportar os dados da página para imagem, csv, ou json, bem como partilhar diretamente para várias redes sociais.
 </div>