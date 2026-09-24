// ============================================================
// CAMINHOS DOS ARQUIVOS
// ============================================================

const caminhoMunicipios = "data/Municipios.csv";
const caminhoMensal = "data/RepasseMensal.csv";
const caminhoSemanal = "data/RepasseSemanal.csv";


// ============================================================
// VARIÁVEIS GLOBAIS
// ============================================================

let municipios = [];
let repasseMensal = [];
let repasseSemanal = [];

let grafico1 = null;
let grafico2 = null;
let grafico3 = null;
let grafico4 = null;


// ============================================================
// ORDEM DOS MESES
// ============================================================

const ordemMeses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];


// ============================================================
// CONVERSÃO CSV → OBJETOS
// ============================================================

function csvParaObjetos(texto) {

    const linhas = texto
        .trim()
        .split(/\r?\n/);

    const cabecalho = linhas[0]
        .split(",")
        .map(coluna => coluna.trim());

    return linhas
        .slice(1)
        .map(linha => {

            const valores = linha.split(",");

            const objeto = {};

            cabecalho.forEach((coluna, indice) => {

                objeto[coluna] =
                    valores[indice]
                        ? valores[indice].trim()
                        : "";

            });

            return objeto;

        });
}


// ============================================================
// CARREGAR CSV
// ============================================================

async function carregarCSV(caminho) {

    const resposta = await fetch(caminho);

    if (!resposta.ok) {
        throw new Error(
            `Erro ao carregar ${caminho}`
        );
    }

    const texto = await resposta.text();

    return csvParaObjetos(texto);
}


// ============================================================
// CARREGAR TODOS OS DADOS
// ============================================================

async function carregarDados() {

    try {

        municipios =
            await carregarCSV(caminhoMunicipios);

        repasseMensal =
            await carregarCSV(caminhoMensal);

        repasseSemanal =
            await carregarCSV(caminhoSemanal);


        console.log(
            "Municípios:",
            municipios.length
        );

        console.log(
            "Repasse mensal:",
            repasseMensal.length
        );

        console.log(
            "Repasse semanal:",
            repasseSemanal.length
        );


        // Preparar filtros
        prepararFiltros();


        // Criar gráficos inicialmente
        atualizarGrafico1();

        atualizarGrafico2();

        atualizarGrafico3();

        atualizarGrafico4();


        // Inicializar painel automático
        escolherMunicipiosAleatorios();


        // Trocar municípios a cada 8 segundos
        setInterval(
            escolherMunicipiosAleatorios,
            8000
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar dados:",
            erro
        );

        alert(
            "Não foi possível carregar os dados."
        );
    }
}


// ============================================================
// ORDENAR MUNICÍPIOS
// ============================================================

function ordenarMunicipios(lista) {

    return [...lista].sort(
        (a, b) =>
            a.Nome.localeCompare(
                b.Nome,
                "pt-BR"
            )
    );
}


// ============================================================
// PREENCHER SELECT DE MUNICÍPIOS
// ============================================================

function preencherSelectMunicipios(
    selectId,
    incluirTodos = false
) {

    const select =
        document.getElementById(selectId);

    select.innerHTML = "";


    if (incluirTodos) {

        const opcao =
            document.createElement("option");

        opcao.value = "";

        opcao.textContent =
            "Todos os municípios";

        select.appendChild(opcao);
    }


    ordenarMunicipios(municipios)
        .forEach(municipio => {

            const opcao =
                document.createElement("option");

            opcao.value =
                municipio.Codigo;

            opcao.textContent =
                `${municipio.Nome} - ${municipio.UF}`;

            select.appendChild(opcao);

        });
}


// ============================================================
// PREENCHER SELECT DE ANOS
// ============================================================

function preencherAnos(selectId) {

    const select =
        document.getElementById(selectId);

    select.innerHTML = "";


    const anos = [
        ...new Set(
            repasseMensal.map(
                item => Number(item.Ano)
            )
        )
    ].sort(
        (a, b) => a - b
    );


    anos.forEach(ano => {

        const opcao =
            document.createElement("option");

        opcao.value = ano;

        opcao.textContent = ano;

        select.appendChild(opcao);

    });
}


// ============================================================
// PREENCHER MESES
// ============================================================

function preencherMeses() {

    const select =
        document.getElementById(
            "grafico3-mes"
        );

    select.innerHTML = "";


    ordemMeses.forEach(mes => {

        const opcao =
            document.createElement("option");

        opcao.value = mes;

        opcao.textContent = mes;

        select.appendChild(opcao);

    });
}


// ============================================================
// PREPARAR TODOS OS FILTROS
// ============================================================

function prepararFiltros() {


    // --------------------------------------------------------
    // GRÁFICO 1
    // --------------------------------------------------------

    preencherSelectMunicipios(
        "grafico1-municipio1"
    );

    preencherSelectMunicipios(
        "grafico1-municipio2"
    );

    preencherSelectMunicipios(
        "grafico1-municipio3"
    );

    preencherAnos(
        "grafico1-ano"
    );


    // --------------------------------------------------------
    // GRÁFICO 2
    // --------------------------------------------------------

    preencherAnos(
        "grafico2-ano"
    );


    // --------------------------------------------------------
    // GRÁFICO 3
    // --------------------------------------------------------

    preencherSelectMunicipios(
        "grafico3-municipio1"
    );

    preencherSelectMunicipios(
        "grafico3-municipio2"
    );

    preencherAnos(
        "grafico3-ano"
    );

    preencherMeses();


    // --------------------------------------------------------
    // GRÁFICO 4
    // --------------------------------------------------------

    preencherSelectMunicipios(
        "grafico4-municipio1"
    );

    preencherSelectMunicipios(
        "grafico4-municipio2"
    );


    // ========================================================
    // VALORES INICIAIS
    // ========================================================

    if (municipios.length >= 3) {

        // Gráfico 1
        document.getElementById(
            "grafico1-municipio1"
        ).value =
            municipios[0].Codigo;

        document.getElementById(
            "grafico1-municipio2"
        ).value =
            municipios[1].Codigo;

        document.getElementById(
            "grafico1-municipio3"
        ).value =
            municipios[2].Codigo;


        // Gráfico 3
        document.getElementById(
            "grafico3-municipio1"
        ).value =
            municipios[0].Codigo;

        document.getElementById(
            "grafico3-municipio2"
        ).value =
            municipios[1].Codigo;


        // Gráfico 4
        document.getElementById(
            "grafico4-municipio1"
        ).value =
            municipios[0].Codigo;

        document.getElementById(
            "grafico4-municipio2"
        ).value =
            municipios[1].Codigo;

    }


    // ========================================================
    // EVENTOS — GRÁFICO 1
    // ========================================================

    document.getElementById(
        "grafico1-municipio1"
    ).addEventListener(
        "change",
        atualizarGrafico1
    );

    document.getElementById(
        "grafico1-municipio2"
    ).addEventListener(
        "change",
        atualizarGrafico1
    );

    document.getElementById(
        "grafico1-municipio3"
    ).addEventListener(
        "change",
        atualizarGrafico1
    );

    document.getElementById(
        "grafico1-ano"
    ).addEventListener(
        "change",
        atualizarGrafico1
    );


    // ========================================================
    // EVENTOS — GRÁFICO 2
    // ========================================================

    document.getElementById(
        "grafico2-ano"
    ).addEventListener(
        "change",
        atualizarGrafico2
    );


    // ========================================================
    // EVENTOS — GRÁFICO 3
    // ========================================================

    document.getElementById(
        "grafico3-municipio1"
    ).addEventListener(
        "change",
        atualizarGrafico3
    );

    document.getElementById(
        "grafico3-municipio2"
    ).addEventListener(
        "change",
        atualizarGrafico3
    );

    document.getElementById(
        "grafico3-ano"
    ).addEventListener(
        "change",
        atualizarGrafico3
    );

    document.getElementById(
        "grafico3-mes"
    ).addEventListener(
        "change",
        atualizarGrafico3
    );


    // ========================================================
    // EVENTOS — GRÁFICO 4
    // ========================================================

    document.getElementById(
        "grafico4-municipio1"
    ).addEventListener(
        "change",
        atualizarGrafico4
    );

    document.getElementById(
        "grafico4-municipio2"
    ).addEventListener(
        "change",
        atualizarGrafico4
    );

}


// ============================================================
// OBTER NOME DO MUNICÍPIO
// ============================================================

function obterNomeMunicipio(codigo) {

    const municipio =
        municipios.find(
            item =>
                String(item.Codigo) ===
                String(codigo)
        );

    return municipio
        ? municipio.Nome
        : "Município";
}


// ============================================================
// CONVERTER NÚMERO
// ============================================================

function converterNumero(valor) {

    if (!valor) {
        return 0;
    }

    return (
        Number(
            String(valor)
                .replace(",", ".")
        ) || 0
    );
}


// ============================================================
// FORMATAR MOEDA
// ============================================================

function formatarMoeda(valor) {

    return new Intl.NumberFormat(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2
        }
    ).format(valor);
}


// ============================================================
// FORMATAR MOEDA ABREVIADA
// ============================================================

function formatarMoedaAbreviada(valor) {

    if (Math.abs(valor) >= 1000000000) {

        return (
            "R$ " +
            (valor / 1000000000)
                .toFixed(1) +
            " bi"
        );

    }

    if (Math.abs(valor) >= 1000000) {

        return (
            "R$ " +
            (valor / 1000000)
                .toFixed(1) +
            " mi"
        );

    }

    if (Math.abs(valor) >= 1000) {

        return (
            "R$ " +
            (valor / 1000)
                .toFixed(1) +
            " mil"
        );

    }

    return formatarMoeda(valor);
}


// ============================================================
// SOMAR SOMENTE ICMS
// ============================================================

function somarICMS(dados) {

    return dados.reduce(
        (total, item) =>
            total +
            converterNumero(item.ICMS),
        0
    );
}


// ============================================================
// CALCULAR CRESCIMENTO
// ============================================================

function calcularCrescimento(
    valor2024,
    valor2025
) {

    if (valor2024 === 0) {
        return 0;
    }

    return (
        (
            (valor2025 - valor2024) /
            valor2024
        ) * 100
    );
}


// ============================================================
// ============================================================
// GRÁFICO 1
// EVOLUÇÃO MENSAL
// ============================================================
// ============================================================

function atualizarGrafico1() {

    const codigo1 =
        document.getElementById(
            "grafico1-municipio1"
        ).value;

    const codigo2 =
        document.getElementById(
            "grafico1-municipio2"
        ).value;

    const codigo3 =
        document.getElementById(
            "grafico1-municipio3"
        ).value;

    const ano =
        Number(
            document.getElementById(
                "grafico1-ano"
            ).value
        );


    const codigos = [
        codigo1,
        codigo2,
        codigo3
    ];


    const datasets =
        codigos.map(
            (codigo, indice) => {

                const valores =
                    ordemMeses.map(
                        mes => {

                            const dados =
                                repasseMensal.filter(
                                    item =>
                                        String(
                                            item.CodigoMunicipio
                                        ) ===
                                        String(codigo)
                                        &&
                                        Number(item.Ano) ===
                                        ano
                                        &&
                                        item.Mes ===
                                        mes
                                );

                            return somarICMS(
                                dados
                            );

                        }
                    );


                return {

                    label:
                        obterNomeMunicipio(
                            codigo
                        ),

                    data: valores,

                    borderWidth: 2,

                    fill: false,

                    tension: 0.3,

                    pointRadius: 3

                };

            }
        );


    if (grafico1) {

        grafico1.destroy();

    }


    const contexto =
        document.getElementById(
            "grafico1"
        );


    grafico1 =
        new Chart(
            contexto,
            {

                type: "line",

                data: {

                    labels: ordemMeses,

                    datasets: datasets

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    interaction: {

                        mode: "index",

                        intersect: false

                    },

                    plugins: {

                        legend: {

                            position: "top"

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        return (
                                            context.dataset.label +
                                            ": " +
                                            formatarMoeda(
                                                context.parsed.y
                                            )
                                        );

                                    }

                            }

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                callback:
                                    function(valor) {

                                        return formatarMoedaAbreviada(
                                            valor
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );
}


// ============================================================
// ============================================================
// GRÁFICO 2
// TOP 8 MUNICÍPIOS
// ============================================================
// ============================================================

function atualizarGrafico2() {

    const ano =
        Number(
            document.getElementById(
                "grafico2-ano"
            ).value
        );


    const acumulado = {};


    // --------------------------------------------------------
    // SOMAR ICMS POR MUNICÍPIO
    // --------------------------------------------------------

    repasseMensal
        .filter(
            item =>
                Number(item.Ano) === ano
        )
        .forEach(item => {

            const codigo =
                String(
                    item.CodigoMunicipio
                );

            if (!acumulado[codigo]) {

                acumulado[codigo] = 0;

            }

            acumulado[codigo] +=
                converterNumero(
                    item.ICMS
                );

        });


    // --------------------------------------------------------
    // TRANSFORMAR EM ARRAY
    // --------------------------------------------------------

    const ranking =
        Object.entries(acumulado)
            .map(
                ([codigo, valor]) => ({

                    codigo: codigo,

                    nome:
                        obterNomeMunicipio(
                            codigo
                        ),

                    valor: valor

                })
            )
            .sort(
                (a, b) =>
                    b.valor - a.valor
            )
            .slice(0, 8);


    const labels =
        ranking.map(
            item => item.nome
        );

    const valores =
        ranking.map(
            item => item.valor
        );


    // --------------------------------------------------------
    // DESTRUIR GRÁFICO ANTERIOR
    // --------------------------------------------------------

    if (grafico2) {

        grafico2.destroy();

    }


    // --------------------------------------------------------
    // CRIAR GRÁFICO
    // --------------------------------------------------------

    const contexto =
        document.getElementById(
            "grafico2"
        );


    grafico2 =
        new Chart(
            contexto,
            {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Repasse ICMS",

                            data: valores,

                            borderWidth: 1

                        }

                    ]

                },

                options: {

                    indexAxis: "y",

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            display: false

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        return formatarMoeda(
                                            context.parsed.x
                                        );

                                    }

                            }

                        }

                    },

                    scales: {

                        x: {

                            beginAtZero: true,

                            ticks: {

                                callback:
                                    function(valor) {

                                        return formatarMoedaAbreviada(
                                            valor
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );
}


// ============================================================
// ============================================================
// GRÁFICO 3
// EVOLUÇÃO SEMANAL
// ============================================================
// ============================================================

function atualizarGrafico3() {

    const codigo1 =
        document.getElementById(
            "grafico3-municipio1"
        ).value;

    const codigo2 =
        document.getElementById(
            "grafico3-municipio2"
        ).value;

    const ano =
        Number(
            document.getElementById(
                "grafico3-ano"
            ).value
        );

    const mes =
        document.getElementById(
            "grafico3-mes"
        ).value;


    // --------------------------------------------------------
    // DADOS MUNICÍPIO 1
    // --------------------------------------------------------

    const dados1 =
        repasseSemanal.filter(
            item =>
                String(
                    item.CodigoMunicipio
                ) ===
                String(codigo1)
                &&
                Number(item.Ano) ===
                ano
                &&
                item.Mes ===
                mes
        );


    // --------------------------------------------------------
    // DADOS MUNICÍPIO 2
    // --------------------------------------------------------

    const dados2 =
        repasseSemanal.filter(
            item =>
                String(
                    item.CodigoMunicipio
                ) ===
                String(codigo2)
                &&
                Number(item.Ano) ===
                ano
                &&
                item.Mes ===
                mes
        );


    // --------------------------------------------------------
    // CRIAR UNIÃO DOS PERÍODOS
    // --------------------------------------------------------

    const periodos = [
        ...new Set(
            [
                ...dados1.map(
                    item => item.Periodo
                ),

                ...dados2.map(
                    item => item.Periodo
                )
            ]
        )
    ];


    // --------------------------------------------------------
    // VALORES MUNICÍPIO 1
    // --------------------------------------------------------

    const valores1 =
        periodos.map(
            periodo => {

                const dados =
                    dados1.filter(
                        item =>
                            item.Periodo ===
                            periodo
                    );

                return somarICMS(
                    dados
                );

            }
        );


    // --------------------------------------------------------
    // VALORES MUNICÍPIO 2
    // --------------------------------------------------------

    const valores2 =
        periodos.map(
            periodo => {

                const dados =
                    dados2.filter(
                        item =>
                            item.Periodo ===
                            periodo
                    );

                return somarICMS(
                    dados
                );

            }
        );


    // --------------------------------------------------------
    // DESTRUIR GRÁFICO ANTERIOR
    // --------------------------------------------------------

    if (grafico3) {

        grafico3.destroy();

    }


    // --------------------------------------------------------
    // CRIAR GRÁFICO
    // --------------------------------------------------------

    const contexto =
        document.getElementById(
            "grafico3"
        );


    grafico3 =
        new Chart(
            contexto,
            {

                type: "line",

                data: {

                    labels: periodos,

                    datasets: [

                        {

                            label:
                                obterNomeMunicipio(
                                    codigo1
                                ),

                            data: valores1,

                            borderWidth: 2,

                            fill: false,

                            tension: 0.3,

                            pointRadius: 3

                        },

                        {

                            label:
                                obterNomeMunicipio(
                                    codigo2
                                ),

                            data: valores2,

                            borderWidth: 2,

                            fill: false,

                            tension: 0.3,

                            pointRadius: 3

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    interaction: {

                        mode: "index",

                        intersect: false

                    },

                    plugins: {

                        legend: {

                            position: "top"

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        return (
                                            context.dataset.label +
                                            ": " +
                                            formatarMoeda(
                                                context.parsed.y
                                            )
                                        );

                                    }

                            }

                        }

                    },

                    scales: {

                        x: {

                            ticks: {

                                autoSkip: false

                            }

                        },

                        y: {

                            beginAtZero: true,

                            ticks: {

                                callback:
                                    function(valor) {

                                        return formatarMoedaAbreviada(
                                            valor
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );
}


// ============================================================
// ============================================================
// GRÁFICO 4
// EVOLUÇÃO ANUAL
// ============================================================
// ============================================================

function atualizarGrafico4() {

    const codigo1 =
        document.getElementById(
            "grafico4-municipio1"
        ).value;

    const codigo2 =
        document.getElementById(
            "grafico4-municipio2"
        ).value;


    // --------------------------------------------------------
    // ANOS DISPONÍVEIS
    // --------------------------------------------------------

    const anos = [
        ...new Set(
            repasseMensal.map(
                item =>
                    Number(item.Ano)
            )
        )
    ].sort(
        (a, b) => a - b
    );


    // --------------------------------------------------------
    // CALCULAR MUNICÍPIO 1
    // --------------------------------------------------------

    const valores1 =
        anos.map(
            ano => {

                const dados =
                    repasseMensal.filter(
                        item =>
                            String(
                                item.CodigoMunicipio
                            ) ===
                            String(codigo1)
                            &&
                            Number(item.Ano) ===
                            ano
                    );

                return somarICMS(
                    dados
                );

            }
        );


    // --------------------------------------------------------
    // CALCULAR MUNICÍPIO 2
    // --------------------------------------------------------

    const valores2 =
        anos.map(
            ano => {

                const dados =
                    repasseMensal.filter(
                        item =>
                            String(
                                item.CodigoMunicipio
                            ) ===
                            String(codigo2)
                            &&
                            Number(item.Ano) ===
                            ano
                    );

                return somarICMS(
                    dados
                );

            }
        );


    // --------------------------------------------------------
    // DESTRUIR GRÁFICO ANTERIOR
    // --------------------------------------------------------

    if (grafico4) {

        grafico4.destroy();

    }


    // --------------------------------------------------------
    // CRIAR GRÁFICO
    // --------------------------------------------------------

    const contexto =
        document.getElementById(
            "grafico4"
        );


    grafico4 =
        new Chart(
            contexto,
            {

                type: "line",

                data: {

                    labels: anos,

                    datasets: [

                        {

                            label:
                                obterNomeMunicipio(
                                    codigo1
                                ),

                            data: valores1,

                            borderWidth: 2,

                            fill: false,

                            tension: 0.3,

                            pointRadius: 4

                        },

                        {

                            label:
                                obterNomeMunicipio(
                                    codigo2
                                ),

                            data: valores2,

                            borderWidth: 2,

                            fill: false,

                            tension: 0.3,

                            pointRadius: 4

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    interaction: {

                        mode: "index",

                        intersect: false

                    },

                    plugins: {

                        legend: {

                            position: "top"

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        return (
                                            context.dataset.label +
                                            ": " +
                                            formatarMoeda(
                                                context.parsed.y
                                            )
                                        );

                                    }

                            }

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                callback:
                                    function(valor) {

                                        return formatarMoedaAbreviada(
                                            valor
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );
}


// ============================================================
// ============================================================
// PAINEL AUTOMÁTICO
// ============================================================
// ============================================================


// ------------------------------------------------------------
// ESCOLHER 2 MUNICÍPIOS ALEATORIAMENTE
// ------------------------------------------------------------

function escolherMunicipiosAleatorios() {

    if (municipios.length < 2) {

        return;

    }


    const indices = [];


    while (indices.length < 2) {

        const indice =
            Math.floor(
                Math.random() *
                municipios.length
            );


        if (!indices.includes(indice)) {

            indices.push(indice);

        }

    }


    atualizarPainelMunicipio(
        municipios[indices[0]].Codigo,
        "1"
    );


    atualizarPainelMunicipio(
        municipios[indices[1]].Codigo,
        "2"
    );
}


// ------------------------------------------------------------
// ATUALIZAR MUNICÍPIO DO PAINEL
// ------------------------------------------------------------

function atualizarPainelMunicipio(
    codigo,
    numero
) {

    const nome =
        obterNomeMunicipio(codigo);


    // --------------------------------------------------------
    // DADOS DE 2024
    // --------------------------------------------------------

    const dados2024 =
        repasseMensal.filter(
            item =>
                String(
                    item.CodigoMunicipio
                ) ===
                String(codigo)
                &&
                Number(item.Ano) ===
                2024
        );


    // --------------------------------------------------------
    // DADOS DE 2025
    // --------------------------------------------------------

    const dados2025 =
        repasseMensal.filter(
            item =>
                String(
                    item.CodigoMunicipio
                ) ===
                String(codigo)
                &&
                Number(item.Ano) ===
                2025
        );


    // --------------------------------------------------------
    // SOMAR ICMS
    // --------------------------------------------------------

    const valor2024 =
        somarICMS(
            dados2024
        );


    const valor2025 =
        somarICMS(
            dados2025
        );


    // --------------------------------------------------------
    // CALCULAR CRESCIMENTO
    // --------------------------------------------------------

    const crescimento =
        calcularCrescimento(
            valor2024,
            valor2025
        );


    // --------------------------------------------------------
    // ATUALIZAR HTML
    // --------------------------------------------------------

    document.getElementById(
        `painel-municipio${numero}`
    ).textContent =
        nome;


    document.getElementById(
        `painel-2024-municipio${numero}`
    ).textContent =
        formatarMoeda(
            valor2024
        );


    document.getElementById(
        `painel-2025-municipio${numero}`
    ).textContent =
        formatarMoeda(
            valor2025
        );


    document.getElementById(
        `painel-crescimento-municipio${numero}`
    ).textContent =
        crescimento.toFixed(2) +
        "%";
}


// ============================================================
// INICIAR DASHBOARD
// ============================================================

carregarDados();