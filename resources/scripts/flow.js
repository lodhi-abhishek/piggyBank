document.getElementById("btnMenu").addEventListener("click", function() {
    var sidebar = document.querySelector('.sidebar');
    var menuOverlay = document.querySelector('.sidebar-overlay');

    sidebar.style.transform = 'translateX(0)';
    menuOverlay.style.opacity = '1';
    menuOverlay.style.visibility = 'visible'; 
})


document.querySelector('.sidebar-overlay').addEventListener('click', closeMenu);

window.addEventListener('keydown', function(e) {
    if(e.key === 'Escape') {
        closeMenu();
    }
})

function closeMenu() {
    var sidebar = document.querySelector('.sidebar');
    var menuOverlay = document.querySelector('.sidebar-overlay');

    sidebar.style.transform = 'translateX(-100%)';
    menuOverlay.style.opacity = '0';
    menuOverlay.style.visibility = 'hidden';
}
