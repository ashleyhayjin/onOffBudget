let db;

const request = window.indexedDB.open("budget", 1);

request.onupgradeneeded = function (e){
    db = e.target.result;

    db.createObjectStore("BudgetStore", {autoIncrement: true});

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

    const transaction = db.transaction(['BudgetStore'], 'readwrite');

    const store = transaction.objectStore('BudgetStore');

    store.add(record);
}

function checkDatabase(){

    let transaction= db.transaction(['BudgetStore'], "readwrite");

    const store = transaction.objectStore('BudgetStore');

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

                        const currentStore = transaction.objectStore('BudgetStore');

                        currentStore.clear();
                        console.log("Clearing Store");
                    }
                });
        }
    };
}


window.addEventListener('online', checkDatabase);