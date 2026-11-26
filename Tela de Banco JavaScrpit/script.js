const estado = {
    saldo: 3550.90,
    oculto: false,
    transacoes: [
        {nome: "Salário", valor: 3200, data: "2026-11-05"},
        {nome: "Mercado Central", valor: -312.45, data: "2026-11-07"}
    ]
};

function formatar(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function desenhar() {
    const saldo = document.getElementById("saldo");
    saldo.textContent = estado.oculto ? "******" : formatar(estado.saldo);

    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    estado.transacoes.forEach(function (t) {
        const li = document.createElement("li");

        const esquerda = document.createElement("div");
        const nome = document.createElement("div");
        nome.className = "nome";
        nome.textContent = t.nome;

        const data = document.createElement("div");
        data.className = "data";
        data.textContent = new Date(t.data + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

        esquerda.append(nome, data);

        const valor = document.createElement("div");
        valor.className = "valor " + (t.valor < 0 ? "saida" : "entrada");
        valor.textContent = estado.oculto ? "******" : formatar(t.valor);

        li.append(esquerda, valor);
        lista.append(li);
    });
}

desenhar();

const botao = document.getElementById("btn-ocultar");

botao.addEventListener("click", function () {
    estado.oculto = !estado.oculto;
    botao.textContent = estado.oculto ? "Mostrar" : "Ocultar";
    desenhar();
});

const form = document.getElementById("form");
const msg = document.getElementById("msg");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const destino = document.getElementById("dest");
    const campoValor = document.getElementById("valor");
    const valor = Math.round(parseFloat(campoValor.value.replace(",", ".")) * 100) / 100;
    const nomeDestino = destino.options[destino.selectedIndex].text;

    if (destino.value === "") {
        msg.textContent = "Escolha um destinatário.";
        msg.className = "erro";
        return;
    }
    if (isNaN(valor) || valor <= 0) {
        msg.textContent = "Digite um valor maior que zero.";
        msg.className = "erro";
        return;
    }
    if (valor > estado.saldo) {
        msg.textContent = "Saldo insuficiente.";
        msg.className = "erro";
        return;
    }

    estado.saldo = Math.round((estado.saldo - valor) * 100) / 100;
    estado.transacoes.unshift({
        nome: "Transferência para " + nomeDestino,
        valor: -valor,
        data: new Date().toISOString().slice(0, 10)
    });

    desenhar();
    campoValor.value = "";
    destino.value = "";
    msg.textContent = "Transferência enviada para " + nomeDestino + ".";
    msg.className = "sucesso";
});