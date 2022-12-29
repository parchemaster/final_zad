function changeBackground(element) {
    // // document.body.style.backgroundImage = "url('" + element.src + "')";
    // // console.log(element.src)
    var body = document.getElementsByTagName('body')[0];
    body.style.backgroundImage = "url('" + element.src + "')";

    change_user = JSON.parse(window.localStorage.getItem('user'));
    const newUser = {
        name: change_user['name'],
        score: change_user['score'],
        dies: change_user['dies'],
        background: element.src,
        difficulty: change_user['difficulty'],
        quest1: change_user['quest1'],
        quest2: change_user['quest2'],
        total: change_user['total']
        
    }
    window.localStorage.setItem('user', JSON.stringify(newUser));


}