const buttons = document.querySelectorAll('.faq-toggle');

buttons.forEach(button => { button.parentNode.addEventListener('click', () => {
    button.parentNode.classList.toggle('active');
    console.log(button.classList);
  })
})