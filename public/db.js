let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (e){

    if(db.objectStoreNames.length === 0){
        db.createObjectStore("BudgetStore", {autoIncrement: true});
    }
}

function checkDatabase(){

    let transaction= transaction.objecStore(['BudgetStore'], "readwrite");

    const store = transaction.objecStore('BudgetStore');

    const getAll = store.getAll();

    getAll.onsuccess = function (){
        if(getAll.result.length > 0){
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
                .then ((response) => response.json())
                .then((res) => {
                    if (res.length !== 0){
                        transaction =  db.transaction(['BudgetStore'], "readwrite");

                        const currentStore = transaction.objecStore('BudgetStore');

                        currentStore.clear();
                        console.log("Clearning Store");
                    }
                });
        }
    };
}

request.onsuccess = function (e){
    console.log('okay, it worked');

    db=e.target.result;

    if(navigator.onLine){
        console.log('Backend Online');
        checkDatabase();
    }
};

const saveRecord = (record) => {

}
