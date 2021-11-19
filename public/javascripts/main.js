function likebtn(id) {
    var likebtn = document.getElementById(id);
    var currentColor = likebtn.children[0];
    if( currentColor.className == 'far fa-heart') {
        currentColor.className = 'fas fa-heart';
    } else {
        currentColor.className = 'far fa-heart';
        
    }
}