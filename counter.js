let counter = 0;

function count() {
    counter++;
    document.querySelector('h1').innerHTML = counter;
    if (counter % 10 === 0) {
        alert(`Count is now ${counter}`);
    }
}

/*When whole DOM is loaded, then we want to run function 
where we set the onclick property to count function*/

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('button').onclick = count;
});