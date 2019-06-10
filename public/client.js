let forms = document.querySelectorAll('form')
let out = document.querySelector('#jsonResult')

forms.forEach(f => {
  f.addEventListener('submit', function(e){
    fetch('/api/stock-prices?' + new URLSearchParams(new FormData(this)).toString())
    .then(resp => resp.json())
    .then(function(data) {
      out.textContent = JSON.stringify(data)
    })
    e.preventDefault()
  })
})