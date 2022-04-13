import { hundredDevs } from "./leonClan.js";

function MakeLeaderboard(users) {
    this.users = users;
    this.jsUsers = users.filter(user => user.ranks.languages["javascript"] !== undefined);
    this.sortBy = "honor";

    this.sortByHonor = function() {
        this.users.sort( (a,b) => b.honor-a.honor)
    }.bind(this);

    this.sortByJS = function() {
        this.jsUsers.sort( (a,b) => b.ranks.languages.javascript.score - a.ranks.languages.javascript.score );
    }.bind(this);

    this.displayUser = function(index) {
        let table = document.getElementById("leaderboard");
        let rank = index+1;
        let name = this.sortBy === 'honor' ? this.users[index].username : this.jsUsers[index].username;
        let score = this.sortBy === 'honor' ? this.users[index].honor : this.jsUsers[index].ranks.languages.javascript.score;

        let tr = document.createElement('tr');
        tr.className = 'user';
        let tdRank = tr.appendChild(document.createElement('td'));
        tdRank.className = 'rank';
        tdRank.innerHTML = rank;
        let tdName = tr.appendChild(document.createElement('td'));
        tdName.className = 'name';
        tdName.innerHTML = name;
        let tdImg = tr.appendChild(document.createElement('td'));
        tdImg.className = 'td-image';
        tdImg.innerHTML = this.sortBy === 'honor' ?  `<img src="./images/swords.png" alt="points logo">`:  `<img src="./images/js.png" alt="points logo">`;
        let tdScore = tr.appendChild(document.createElement('td'));
        tdScore.className = 'score';
        tdScore.innerHTML = score;
        table.appendChild(tr);

    }.bind(this);

    this.displayUsers = function() {
        document.querySelector('#leaderboard').innerHTML = '';

        let length;
        if (this.sortBy === 'honor') {
            length = this.users.length;
        }

        if  (this.sortBy === 'js') {
            length = this.jsUsers.length;
        }

        for (let i=0; i<length; i++) {
            this.displayUser(i);
        }
    
    }.bind(this);

    this.searchName = function() {
        let name = document.querySelector('#search-value').value;
        document.querySelector('#search-value').value = "";
        let index = this.sortBy === 'honor' ? this.users.findIndex(user => user.username === name) : this.jsUsers.findIndex(user => user.username === name);

        if (index === -1) {
            document.querySelector('.searchName').innerText = 'No users found.';
            document.querySelector('.searchRank').innerText = '---';
            document.querySelector('.searchScore').innerText = '---';

        } else {
            document.querySelector('.searchName').innerText = this.sortBy === 'honor' ? this.users[index].username : this.jsUsers[index].username;
            document.querySelector('.searchRank').innerText = index+1;
            document.querySelector('.searchScore').innerText = this.sortBy === 'honor' ? this.users[index].honor : this.jsUsers[index].ranks.languages.javascript.score;
        }

    }.bind(this);

    this.sortUsers = function(e) {
        if (e.target.id === 'button-honor') {
            this.sortBy = 'honor';
            this.sortByHonor();
            this.displayUsers();
            this.resetSearchResults();
            document.querySelector('#button-honor').classList.add("active");
            document.querySelector('#button-js').classList.remove("active");
            document.querySelector('#result-image').src = './images/swords.png'
        }

        if (e.target.id === 'button-js') {
            this.sortBy = 'js';
            this.sortByJS();
            this.displayUsers();
            this.resetSearchResults();
            document.querySelector('#button-js').classList.add("active");
            document.querySelector('#button-honor').classList.remove("active");
            document.querySelector('#result-image').src = './images/js.png'


        }

    }.bind(this);

    this.resetSearchResults = function() {
        document.querySelector('.searchName').innerText = '---';
        document.querySelector('.searchRank').innerText = '---';
        document.querySelector('.searchScore').innerText = '---';
    };

    this.showLeaderBoard = function() {
        document.querySelector('.lds-container').classList.remove('loading');
        document.querySelector('.lds-container').classList.add('hidden');
        document.querySelector('#leaderboard').classList.remove('hidden');
        document.querySelector('#leaderboard-container').classList.remove('isLoading');
        document.querySelector('#leaderboard').classList.add('displayTable');
        document.querySelector('#loadingBlock').classList.remove('darken');
    }

    
}

async function createLeaderboard() {

    let users = await getUsers();
    
    let leaderboard = new MakeLeaderboard(users);
    leaderboard.showLeaderBoard();

    leaderboard.sortByHonor();
    leaderboard.displayUsers();

    document.querySelector('#button-honor').addEventListener('click', leaderboard.sortUsers);
    document.querySelector('#button-js').addEventListener('click', leaderboard.sortUsers);

    
    document.querySelector('#button-search').addEventListener('click', leaderboard.searchName);

}

async function getUsers(start=0, end=50) {
    let devs = [];

    for (let i=start; i<hundredDevs.length; i++) {
        const request = await fetch(`https://www.codewars.com/api/v1/users/${hundredDevs[i].user}`)
        if (request.status === 200) {
            const response = await request.json();
            devs.push(response);
        }
    }

    return devs;
}

createLeaderboard();
//console.log(hundredDevs);

