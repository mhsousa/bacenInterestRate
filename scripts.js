

const cache_dom = {};

function _cache_dom() {
  cache_dom.select_periodo = document.getElementById("dddd-mm");
  cache_dom.loader = document.getElementById("div-loader");
  cache_dom.indicador = document.getElementById("indicador")
}

function alimenta_select_periodo() {
  const dataAtual = new Date();
  const anoAtual = dataAtual.getFullYear();
  const mesAtual = dataAtual.getMonth();

  for (let ano = anoAtual; ano >= 2012; ano--) {
    const mesInicial = ano === anoAtual ? mesAtual : 12;

    for (let mes = mesInicial; mes >= 1; mes--) {
      const option = document.createElement("option");
      const mesComZero = adicionaZero(mes);
      option.value = ano + "-" + mesComZero;
      option.textContent = ano + "-" + mesComZero;
      option.classList.add("option-select-item");
      cache_dom.select_periodo.appendChild(option);
    }
  }
}

function adicionaZero(number) {
  return number < 10 ? "0" + number : number;
}

async function atualizaJurosImob() {
  _cache_dom();
  if(hasAlreadyMonth_Juros==false){
  alimenta_select_periodo();
}
hasAlreadyMonth_Juros=true;

  const periodo = document.getElementById("dddd-mm").value;
  cache_dom.indicador.textContent = `Dados referentes ao período de ${periodo}`;
  document.getElementById("tabela").innerHTML = "";
  cache_dom.loader.style.display = "block";

  await fetch(
    `https://olinda.bcb.gov.br/olinda/servico/taxaJuros/versao/v2/odata/TaxasJurosMensalPorMes?$top=100&$orderby=TaxaJurosAoMes%20asc&$filter=anoMes%20eq%20'${periodo}'&$format=json&$select=Mes,Modalidade,InstituicaoFinanceira,TaxaJurosAoMes,TaxaJurosAoAno,anoMes`
  )
    .then((response) => response.json())
    .then((data) => {
      cache_dom.loader.style.display = "none";
      const dado = data["value"] || [];
      const tabela = document.getElementById("tabela");

      if (dado.length > 0) {
        const table_head = tabela.insertRow();
        table_head.classList.add("table-head");

        const td_instituicao_financeira = table_head.insertCell();
        td_instituicao_financeira.innerHTML = "INSTITUIÇÃO FINANCEIRA";

        const td_taxa_juros_mensal = table_head.insertCell();
        td_taxa_juros_mensal.innerHTML = "TAXA DE JUROS MENSAL";

        const td_taxa_juros_anual = table_head.insertCell();
        td_taxa_juros_anual.innerHTML = "TAXA DE JUROS ANUAL";

        const td_modalidade = table_head.insertCell();
        td_modalidade.innerHTML = "MODALIDADE";

        dado.forEach((e, index) => {
          if (e["TaxaJurosAoMes"] != 0) {
            let table = document.createElement("table"),
              row,
              celula4,
              celula1,
              celula2,
              celula3;
            document.getElementById("tabela").appendChild(table);
            row = tabela.insertRow();
            row.classList.add("table-content");
            row.classList.add(index % 2 == 0 ? "par" : "impar");
            celula1 = row.insertCell();
            celula2 = row.insertCell();
            celula3 = row.insertCell();
            celula4 = row.insertCell();
            celula1.innerHTML = e["InstituicaoFinanceira"];
            celula2.innerHTML = `${e["TaxaJurosAoMes"]}%`;
            celula3.innerHTML = `${e["TaxaJurosAoAno"]}%`;
            celula4.innerHTML = e["Modalidade"];
          }
        });
      } else {
        cache_dom.indicador.textContent = `NÃO HÁ INFORMAÇÕES PARA O PERÍODO DE ${periodo}`;
      }
    })
    .catch((error) => {
      cache_dom.indicador.textContent = `HOUVE UM ERRO AO BUSCAR INFORMAÇÕES PARA O PERÍODO ${periodo}`;
      console.log(error);
    });
}



async function giro_atualiza() {
  _cache_dom();
  alimenta_select_periodo();
  const periodo = document.getElementById("dddd-mm").value;
  cache_dom.indicador.textContent = `Dados referentes ao período de ${periodo}`;
  document.getElementById("tabela").innerHTML = "";
  cache_dom.loader.style.display = "block";
  const dateInput = document.querySelector('#dddd-mm');
  var date = new Date(dateInput.value);
  yesterday=new Date()
  if(date=="Invalid Date"){
    cache_dom.indicador.textContent = `Dados referentes ao período de: Ontem`;
  }
  yesterday2=yesterday.setDate(new Date().getDate() - 1)
  date= date == "Invalid Date" ? yesterday2:date
  date=new Date(date)
  const formattedDate = date.getFullYear().toString().slice(0,3)+'0'+date.getFullYear().toString().slice(2,4) + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
  console.log(formattedDate)

  await fetch(
    `https://olinda.bcb.gov.br/olinda/servico/STR/versao/v1/odata/GiroEvolucaoDiaria?$top=100&$filter=Data%20lt%${formattedDate}&$orderby=Data%20desc&$format=json&$select=Data,Quantidade,Total,Media`
)
    .then((response) => response.json())
    .then((data) => {
      cache_dom.loader.style.display = "none";
      const dado = data["value"] || [];
      const tabela = document.getElementById("tabela");

      if (dado.length > 0) {
        const table_head = tabela.insertRow();
        table_head.classList.add("table-head");

        const td_instituicao_financeira = table_head.insertCell();
        td_instituicao_financeira.innerHTML = "DATA";

        const td_taxa_juros_mensal = table_head.insertCell();
        td_taxa_juros_mensal.innerHTML = "QUANTIDADE";

        const td_taxa_juros_anual = table_head.insertCell();
        td_taxa_juros_anual.innerHTML = "TOTAL";

        const td_modalidade = table_head.insertCell();
        td_modalidade.innerHTML = "MÉDIA";

        dado.forEach((e, index) => {
          if (e["TaxaJurosAoMes"] != 0) {
            let table = document.createElement("table"),
              row,
              celula4,
              celula1,
              celula2,
              celula3;
            document.getElementById("tabela").appendChild(table);
            row = tabela.insertRow();
            row.classList.add("table-content");
            row.classList.add(index % 2 == 0 ? "par" : "impar");
            celula1 = row.insertCell();
            celula2 = row.insertCell();
            celula3 = row.insertCell();
            celula4 = row.insertCell();
            celula1.innerHTML = e["Data"];
            celula2.innerHTML = e["Quantidade"];
            celula3.innerHTML = e["Total"];
            celula4.innerHTML = e["Media"];
          }
        });
      } else {
        cache_dom.indicador.textContent = `NÃO HÁ INFORMAÇÕES PARA O PERÍODO DE ${periodo}`;
      }
    })
    .catch((error) => {
      cache_dom.indicador.textContent = `HOUVE UM ERRO AO BUSCAR INFORMAÇÕES PARA O PERÍODO ${periodo}`;
      console.log(error);
    });
}


async function moeda_atualiza() {
  _cache_dom();
  alimenta_select_periodo();
  const periodo = document.getElementById("dddd-mm").value;
  cache_dom.indicador.textContent = `Dados referentes ao período de ${periodo}`;
  document.getElementById("tabela").innerHTML = "";
  cache_dom.loader.style.display = "block";
  const dateInput = document.querySelector('#dddd-mm');
  var date = new Date(dateInput.value);
  yesterday=new Date()
  if(date=="Invalid Date"){
    cache_dom.indicador.textContent = `Dados referentes ao período de: Ontem`;
  }
  yesterday2=yesterday.setDate(new Date().getDate() - 1)
  date= date == "Invalid Date" ? yesterday2:date
  date=new Date(date)
  const formattedDate = date.getFullYear().toString().slice(0,3)+'0'+date.getFullYear().toString().slice(2,4) + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');

  await fetch(
    `https://olinda.bcb.gov.br/olinda/servico/mecir_dinheiro_em_circulacao/versao/v1/odata/informacoes_diarias?$top=14&$filter=Data%20lt%${formattedDate}&$orderby=Data%20desc&$format=json&$select=Data,Quantidade,Valor,Denominacao,Especie`
  )
    .then((response) => response.json())
    .then((data) => {
      cache_dom.loader.style.display = "none";
      const dado = data["value"] || [];
      const tabela = document.getElementById("tabela");

      if (dado.length > 0) {
        const table_head = tabela.insertRow();
        table_head.classList.add("table-head");

        const td_instituicao_financeira = table_head.insertCell();
        td_instituicao_financeira.innerHTML = "DATA";

        const td_taxa_juros_mensal = table_head.insertCell();
        td_taxa_juros_mensal.innerHTML = "QUANTIDADE";

        const td_taxa_juros_anual = table_head.insertCell();
        td_taxa_juros_anual.innerHTML = "VALOR TOTAL";

        const td_modalidade = table_head.insertCell();
        td_modalidade.innerHTML = "VALOR DE FACE";

        dado.forEach((e, index) => {
          if (e["TaxaJurosAoMes"] != 0) {
            let table = document.createElement("table"),
              row,
              celula4,
              celula1,
              celula2,
              celula3;
            document.getElementById("tabela").appendChild(table);
            row = tabela.insertRow();
            row.classList.add("table-content");
            row.classList.add(index % 2 == 0 ? "par" : "impar");
            celula1 = row.insertCell();
            celula2 = row.insertCell();
            celula3 = row.insertCell();
            celula4 = row.insertCell();
            celula1.innerHTML = e["Data"];
            celula2.innerHTML = e["Quantidade"];
            celula3.innerHTML = e["Valor"];
            celula4.innerHTML = `R$ ${e["Denominacao"]}`;
          }
        });
      } else {
        cache_dom.indicador.textContent = `NÃO HÁ INFORMAÇÕES PARA O PERÍODO DE ${periodo}`;
      }
    })
    .catch((error) => {
      cache_dom.indicador.textContent = `HOUVE UM ERRO AO BUSCAR INFORMAÇÕES PARA O PERÍODO ${periodo}`;
      console.log(error);
    });
}


