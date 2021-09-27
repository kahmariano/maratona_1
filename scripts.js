const Modal = {
  open() {
    //abrir modal , adicionar active ao modal
    document
      .querySelector('.modal-overlay')
      .classList
      .add('active')
  },

  close() {
    //fechar modal e remover o active do modal
    document
      .querySelector('.modal-overlay')
      .classList
      .remove('active')
  }

}

//organize suas ideias em textos e depois passe para o codigo

const Storage = {

  get() {

    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []

  },

  set(transactions) {

    localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))

  }
}

const Transaction = {

  all: Storage.get(),


  add(transaction) {

    Transaction.all.push(transaction)

    App.reload()

  },

  remove(index) {

    Transaction.all.splice(index, 1)

    App.reload()
  },

  incomes() {

    let income = 0;
    //pegar todas as Transações
    //para cada transação,
    Transaction.all.forEach(transaction => {
      //se ela for maior q 0 
      if (transaction.amount > 0) {
        //somar a uma variavel e retornar a variavel 
        income += transaction.amount;
      }

    })

    return income;
  },

  expenses() {

    let expense = 0;
    //pegar todas as Transações
    //para cada transação,
    Transaction.all.forEach(transaction => {
      //se ela for menor q 0 
      if (transaction.amount < 0) {
        //somar a uma variavel e retornar a variavel 
        expense += transaction.amount;
      }

    })

    return expense;

  },

  total() {

    return Transaction.incomes() + Transaction.expenses();
  }
}

// Eu preciso pegar as minhas transações do meu objeto aqui no js e colocar no html, ou seja, falando mais simples seria substituir os dados html com os dados js

const DOM = {

  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)

  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense"

    const amount = Utils.formatCurrency(transaction.amount)

    const html = `
              <td class="descripition">${transaction.description}</td>
              <td class="${CSSclass}">${amount}</td>
              <td class="date">${transaction.date}</td>
          
              <td>
          
                <img onclic="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação" >
              </td>
        `

    return html

  },

  updateBalance() {

    document
      .getElementById('incomeDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.incomes())

    document
      .getElementById('expenseDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.expenses())

    document
      .getElementById('totalDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.total())
  },

  clearTransactions() {

    DOM.transactionsContainer.innerHTML = ""

  }


}

const Utils = {

  formatAmount(value) {

    value = Number(value.replace(/\,\,/g, "")) * 100

    return value

  },

  formatDate(date) {

    const splittedDate = date.split('-')

    return `${splittedDate[2]} / ${splittedDate[1]} / ${splittedDate[0]}`

  },

  formatCurrency(value) {

    const signal = Number(value) < 0 ? "- " : ""

    value = String(value).replace(/\D/g, "")

    value = Number(value) / 100

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })

    return signal + value
  }
}

const Form = {

  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {

      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value

    }

  },

  validateFields() {

    const { description, amount, date } = Form.getValues()

    if (description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === "") {
      throw new Error("Por favor, preencha todos os campos")
    }

  },

  formatValues() {

    let { description, amount, date } = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    return {

      description,
      amount,
      date

    }

  },

  clearFields() {

    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""

  },

  submit(event) {

    event.preventDefault()

    //verificar se todos os campos foram preenchidos
    try {

      Form.validateFields()
      //formatar os dados para salvar
      const transaction = Form.formatValues()
      //salvar
      Transaction.add(transaction)
      //apagar os dados do furmulario
      Form.clearFields()
      //modal fechar
      Modal.close()
      //atualizar a aplicação 
      //ja esta atualizando la em cima 

    } catch (error) {
      console.log(error)

      alert(error.message)

    }

  }
}

const App = {

  init() {

    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index)
    })

    DOM.updateBalance()

    Storage.set(Transaction.all)

  },

  reload() {

    DOM.clearTransactions()
    App.init()

  },

}

App.init()

