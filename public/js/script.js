var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if(this.readyState == 4 && this.status == 200){
    console.log(this);
  }  
};
xhttp.open('GEt', 'http://localhost:3000/accounts');
xhttp.send();